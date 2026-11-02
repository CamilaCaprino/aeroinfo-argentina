import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { supportedLanguages } from '../i18n';

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();

    const [open, setOpen] = useState(false);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const currentLanguage =
        supportedLanguages.find(
            (language) =>
                i18n.resolvedLanguage?.startsWith(
                    language.code
                )
        ) || supportedLanguages[1];

    useEffect(() => {
        document.documentElement.lang =
            currentLanguage.code;
    }, [currentLanguage.code]);

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );
        };
    }, []);

    async function changeLanguage(
        code: string
    ) {
        await i18n.changeLanguage(code);

        localStorage.setItem(
            'aeroinfo_locale',
            code
        );

        document.documentElement.lang =
            code;

        setOpen(false);
    }

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (value) => !value
                    )
                }
                className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background/45 px-3 text-xs font-semibold tracking-[0.06em] text-foreground transition hover:bg-background"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={t('language.selector')}
            >
                <span>
                    {
                        currentLanguage.shortLabel
                    }
                </span>

                <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className={[
                        'h-3.5 w-3.5 transition-transform',
                        open
                            ? 'rotate-180'
                            : '',
                    ].join(' ')}
                    aria-hidden="true"
                >
                    <path
                        d="M5 7.5 10 12.5 15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.55rem)] z-[100] min-w-[180px] overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
                >
                    <div className="p-1.5">
                        {supportedLanguages.map(
                            (language) => {
                                const active =
                                    currentLanguage.code ===
                                    language.code;

                                return (
                                    <button
                                        key={
                                            language.code
                                        }
                                        type="button"
                                        role="menuitem"
                                        onClick={() =>
                                            changeLanguage(
                                                language.code
                                            )
                                        }
                                        className={[
                                            'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition',
                                            active
                                                ? 'bg-primary/10 font-medium text-primary'
                                                : 'text-foreground hover:bg-background',
                                        ].join(
                                            ' '
                                        )}
                                    >
                                        <span>
                                            {
                                                language.label
                                            }
                                        </span>

                                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                                            {
                                                language.shortLabel
                                            }
                                        </span>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
