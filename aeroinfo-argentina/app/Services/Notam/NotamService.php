<?php

namespace App\Services\Notam;

use Carbon\CarbonImmutable;
use DOMDocument;
use DOMXPath;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class NotamService
{
    private const BASE_URL =
        'https://ais.anac.gob.ar';

    public function current(
        string $indicator
    ): array {
        $indicator = strtoupper(
            trim($indicator)
        );

        if ($indicator === '') {
            return [
                'status' => 'invalid_indicator',
                'data' => [],
                'error' => null,
            ];
        }

        if (! config('notam.enabled', true)) {
            return [
                'status' => 'disabled',
                'data' => [],
                'error' => null,
            ];
        }

        $cacheMinutes = (int) config(
            'notam.cache_minutes',
            5
        );

        $cacheKey =
            'notam:anac:' . $indicator;

        try {
            $data = Cache::remember(
                $cacheKey,
                now()->addMinutes($cacheMinutes),
                fn () => $this->fetch($indicator)
            );

            return [
                'status' => 'ok',
                'indicator' => $indicator,
                'count' => count($data),
                'data' => $data,
                'error' => null,
                'source' => [
                    'name' => 'AIS ANAC',
                    'url' =>
                        'https://ais.anac.gob.ar/notam',
                    'operational_use' =>
                        'reference_only',
                ],
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'status' => 'error',
                'indicator' => $indicator,
                'count' => 0,
                'data' => [],
                'error' => $e->getMessage(),
            ];
        }
    }

    private function fetch(
        string $indicator
    ): array {
        /*
         * AIS ANAC requiere primero cargar /notam
         * y reutilizar la misma sesión para /notam/pib.
         */
        $cookies = new CookieJar();

        $client = Http::timeout(20)
            ->retry(2, 500)
            ->withOptions([
                'cookies' => $cookies,
            ]);

        $initial = $client->get(
            self::BASE_URL . '/notam'
        );

        $initial->throw();

        $response = $client
            ->withHeaders([
                'X-Requested-With' =>
                    'XMLHttpRequest',

                'Referer' =>
                    self::BASE_URL . '/notam',

                'Origin' =>
                    self::BASE_URL,
            ])
            ->asForm()
            ->post(
                self::BASE_URL . '/notam/pib',
                [
                    'indicador' =>
                        $indicator,
                ]
            );

        $response->throw();

        $html = $response->body();

        if (
            stripos(
                $html,
                'Error 404'
            ) !== false
        ) {
            throw new RuntimeException(
                'AIS ANAC devolvió una página 404.'
            );
        }

        return $this->parseHtml(
            $html
        );
    }

    private function parseHtml(
        string $html
    ): array {
        if (trim($html) === '') {
            return [];
        }

        $dom = new DOMDocument();

        libxml_use_internal_errors(true);

        $loaded = $dom->loadHTML(
            '<?xml encoding="utf-8" ?>'
            . $html,
            LIBXML_NOWARNING
            | LIBXML_NOERROR
        );

        libxml_clear_errors();

        if (! $loaded) {
            throw new RuntimeException(
                'No fue posible interpretar la respuesta de AIS ANAC.'
            );
        }

        $xpath = new DOMXPath(
            $dom
        );

        $rows = $xpath->query(
            '//tbody[@id="pibdata"]/tr'
        );

        if (! $rows) {
            return [];
        }

        $results = [];

        foreach ($rows as $row) {
            $cells = $xpath->query(
                './td',
                $row
            );

            if (
                ! $cells
                || $cells->length < 2
            ) {
                continue;
            }

            $placeParagraphs =
                $xpath->query(
                    './p',
                    $cells->item(0)
                );

            $infoParagraphs =
                $xpath->query(
                    './p',
                    $cells->item(1)
                );

            $notamNumber =
                $this->nodeText(
                    $placeParagraphs?->item(0)
                );

            $locationName =
                $this->nodeText(
                    $placeParagraphs?->item(1)
                );

            $indicator =
                trim(
                    $this->nodeText(
                        $placeParagraphs?->item(2)
                    ),
                    " ()\t\n\r\0\x0B"
                );

            $fromText =
                $this->removePrefix(
                    $this->nodeText(
                        $infoParagraphs?->item(0)
                    ),
                    'Desde:'
                );

            $untilText =
                $this->removePrefix(
                    $this->nodeText(
                        $infoParagraphs?->item(1)
                    ),
                    'Hasta:'
                );

            $message =
                $this->nodeText(
                    $infoParagraphs?->item(2)
                );

            [
                $english,
                $spanish,
            ] = $this->splitMessage(
                $message
            );

            $permanent =
                strcasecmp(
                    trim($untilText),
                    'Perm'
                ) === 0
                || strcasecmp(
                    trim($untilText),
                    'PERM'
                ) === 0;

            $results[] = [
                'number' =>
                    $notamNumber,

                'location_name' =>
                    $locationName,

                'indicator' =>
                    $indicator,

                'starts_at' =>
                    $this->parseUtcDate(
                        $fromText
                    ),

                'ends_at' =>
                    $permanent
                        ? null
                        : $this->parseUtcDate(
                            $untilText
                        ),

                'permanent' =>
                    $permanent,

                'starts_at_raw' =>
                    $fromText,

                'ends_at_raw' =>
                    $untilText,

                'text' => [
                    'original' =>
                        $english,

                    'spanish' =>
                        $spanish,
                ],

                'category' =>
                    $this->classify(
                        $english
                        . ' '
                        . $spanish
                    ),
            ];
        }

        return $results;
    }

    private function splitMessage(
        string $message
    ): array {
        $parts = preg_split(
            '/Versión\s+en\s+Español\s*:/iu',
            $message,
            2
        );

        return [
            trim(
                $parts[0] ?? ''
            ),

            trim(
                $parts[1] ?? ''
            ),
        ];
    }

    private function classify(
        string $text
    ): string {
        $text = strtoupper(
            $text
        );

        if (
            str_contains($text, 'RWY')
            || str_contains(
                $text,
                'RUNWAY'
            )
        ) {
            return 'runway';
        }

        if (
            str_contains($text, 'TWY')
            || str_contains(
                $text,
                'TAXIWAY'
            )
        ) {
            return 'taxiway';
        }

        if (
            str_contains($text, 'ILS')
            || str_contains($text, 'LOC')
            || str_contains($text, 'GLIDE')
        ) {
            return 'approach_aid';
        }

        if (
            str_contains($text, 'DME')
            || str_contains($text, 'VOR')
            || str_contains($text, 'NDB')
        ) {
            return 'navigation_aid';
        }

        if (
            str_contains($text, 'APN')
            || str_contains(
                $text,
                'APRON'
            )
        ) {
            return 'apron';
        }

        if (
            str_contains($text, 'OBST')
        ) {
            return 'obstacle';
        }

        if (
            str_contains($text, 'SUP ')
            || str_contains(
                $text,
                'PROCEDURE'
            )
            || str_contains(
                $text,
                'PROCEDIMIENTO'
            )
        ) {
            return 'procedure';
        }

        return 'other';
    }

    private function parseUtcDate(
        string $value
    ): ?string {
        $value = trim(
            $value
        );

        if ($value === '') {
            return null;
        }

        try {
            return CarbonImmutable::
                createFromFormat(
                    'Y-m-d H:i:s',
                    $value,
                    'UTC'
                )
                ->toIso8601String();
        } catch (Throwable) {
            return null;
        }
    }

    private function removePrefix(
        string $value,
        string $prefix
    ): string {
        return trim(
            preg_replace(
                '/^'
                . preg_quote(
                    $prefix,
                    '/'
                )
                . '\s*/iu',
                '',
                $value
            )
            ?? $value
        );
    }

    private function nodeText(
        mixed $node
    ): string {
        if (! $node) {
            return '';
        }

        return $this->cleanText(
            $node->textContent
            ?? ''
        );
    }

    private function cleanText(
        string $value
    ): string {
        return trim(
            preg_replace(
                '/\s+/u',
                ' ',
                html_entity_decode(
                    $value,
                    ENT_QUOTES
                    | ENT_HTML5,
                    'UTF-8'
                )
            )
            ?? ''
        );
    }
}
