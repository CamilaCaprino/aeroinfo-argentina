import {useEffect,useState} from 'react';
import {Moon,Sun,Monitor} from 'lucide-react';

type Theme='light'|'dark'|'system';

export default function ThemeSelector(){
    const [theme,setTheme]=useState<Theme>(()=>
        (localStorage.getItem('theme') as Theme)||'dark'
    );

    useEffect(()=>{
        const mq=matchMedia('(prefers-color-scheme: dark)');

        const apply=()=>{
            document.documentElement.classList.toggle(
                'dark',
                theme==='dark'||(theme==='system'&&mq.matches)
            );
        };

        apply();

        localStorage.setItem('theme',theme);

        mq.addEventListener('change',apply);

        return()=>mq.removeEventListener('change',apply);
    },[theme]);

    return (
        <div
            className="flex rounded-lg border border-border p-1"
            aria-label="Tema visual"
        >
            {([
                ['light',Sun],
                ['dark',Moon],
                ['system',Monitor],
            ] as const).map(([v,I])=>(
                <button
                    key={v}
                    className={`rounded-md p-2 ${
                        theme===v
                            ? 'bg-primary text-primary-foreground'
                            : ''
                    }`}
                    onClick={()=>setTheme(v)}
                    aria-label={`Tema ${v}`}
                    aria-pressed={theme===v}
                >
                    <I size={16}/>
                </button>
            ))}
        </div>
    );
}