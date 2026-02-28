import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { Search, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { WEBSITE_COMMANDS, APP_COMMANDS } from '../utilities/headerCommands';

interface HeaderProps {
    portrait: boolean;
}

export function Header({ portrait }: HeaderProps) {
    const [time, setTime] = useState(new Date());
    const [query, setQuery] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        const focusTimeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);

        return () => {
            clearInterval(timer);
            clearTimeout(focusTimeout);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '!' && document.activeElement !== inputRef.current) { // If the user press "!" and the input is not focused, focus the input
                e.preventDefault();                                             // Change it to whatever key you prefer, I personally like it because it's the same as the terminal
                inputRef.current?.focus();                                      // Ctrl+1 to go to the dashboard, then shift+1 to focus
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        const parts = trimmedQuery.split(' ');
        const prefix = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (APP_COMMANDS[prefix]) {
            APP_COMMANDS[prefix](args);
            setQuery('');
            return;
        }
        if (WEBSITE_COMMANDS[prefix]) {
            const baseUrl = WEBSITE_COMMANDS[prefix];

            if (args.length === 0) {
                const homeUrl = baseUrl.split('?')[0];
                const ytUrl = homeUrl.split('results')[0];
                window.open(ytUrl, '_blank');
            } else {
                window.open(`${baseUrl}${encodeURIComponent(args)}`, '_blank');
            }
            setQuery('');
            return;
        }
        const isUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(trimmedQuery);
        if (isUrl) {
            const url = trimmedQuery.startsWith('http') ? trimmedQuery : `https://${trimmedQuery}`;
            window.open(url, '_blank');
        }
        else {
            window.open(`https://www.startpage.com/do/search?q=${encodeURIComponent(trimmedQuery)}`, '_blank');
            // If you want to default to google instead, use: 
            // window.open(`https://www.google.com/search?q=${encodeURIComponent(trimmedQuery)}`, '_blank');
        }

        setQuery('');
        inputRef.current?.focus();
    };

    return (
        <GlassCard className="flex flex-col row-span-1 md:flex-row h-fit items-center justify-between col-span-full md:col-span-4 lg:col-span-4">
            {/* Command Line Search */}
            <form onSubmit={handleSearch} className={cn("flex-1 max-w-2xl relative group", portrait ? "" : "hidden")}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                    {query.startsWith('!') ? (
                        <ChevronRight className="text-primary opacity-60 animate-pulse" size={20} />
                    ) : (
                        <Search className="text-primary opacity-60" size={20} />
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="URL, !help o busca algo" // Translate this to your language or write whatever you want as placeholder
                    className="w-full bg-white/20 hover:bg-white/30 focus:bg-white/40 text-primary placeholder-primary/60 rounded-full py-3 pl-12 pr-6 outline-none transition-all border border-transparent focus:border-white/50 shadow-inner"
                />
            </form>

            {/* Digital Clock */}
            <div className="flex flex-col items-end md:pl-6 text-primary select-none">
                <div className="text-4xl font-light tracking-wider" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {format(time, 'HH:mm:ss')}
                </div>
                <div className="text-sm font-medium opacity-80 uppercase tracking-widest">
                    {format(time, 'EEEE, MMM do')}
                </div>
            </div>
        </GlassCard>
    );
}
