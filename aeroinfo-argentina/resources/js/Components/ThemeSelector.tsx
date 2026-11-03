import {
    useEffect,
    useState,
} from 'react';

import { useTranslation } from 'react-i18next';
import {
    Moon,
    Sun,
} from 'lucide-react';

type Theme =
    | 'light'
    | 'dark';

export default function ThemeSelector() {
    const { t } =
        useTranslation();

    const [theme, setTheme] =
        useState<Theme>(() => {
            const savedTheme =
                localStorage.getItem(
                    'theme'
                );

            return savedTheme ===
                'light'
                ? 'light'
                : 'dark';
        });

    useEffect(() => {
        document.documentElement.classList.toggle(
            'dark',
            theme === 'dark'
        );

        localStorage.setItem(
            'theme',
            theme
        );
    }, [theme]);

    const options = [
        {
            value: 'light' as const,
            icon: Sun,
            label: t(
                'theme.light'
            ),
        },
        {
            value: 'dark' as const,
            icon: Moon,
            label: t(
                'theme.dark'
            ),
        },
    ];

    return (
        <div
            className="inline-flex rounded-lg border border-border bg-background/45 p-1"
            aria-label={t(
                'theme.selector'
            )}
        >
            {options.map(
                ({
                    value,
                    icon: Icon,
                    label,
                }) => (
                    <button
                        key={
                            value
                        }
                        type="button"
                        className={[
                            'flex h-8 w-8 items-center justify-center rounded-md transition',
                            theme ===
                            value
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted hover:bg-background hover:text-foreground',
                        ].join(
                            ' '
                        )}
                        onClick={() =>
                            setTheme(
                                value
                            )
                        }
                        aria-label={
                            label
                        }
                        aria-pressed={
                            theme ===
                            value
                        }
                        title={
                            label
                        }
                    >
                        <Icon
                            size={
                                16
                            }
                            aria-hidden="true"
                        />
                    </button>
                )
            )}
        </div>
    );
}