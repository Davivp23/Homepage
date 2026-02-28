import { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { io } from 'socket.io-client';
import { MessageSquare } from 'lucide-react';
import { APILinks } from '../utilities/apiLinks.ts';

const socket = io(APILinks.socket);

export function Input() {
    const [query, setQuery] = useState("");

    useEffect(() => {
        socket.on('update_input', (val) => setQuery(val));
        return () => {
            socket.off('update_input');
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setQuery(val);
        socket.emit('sync_input', val);
    };

    return (
        <GlassCard className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 overflow-hidden min-h-[160px] md:min-h-[200px]">
            <h3 className="font-semibold text-primary flex items-center gap-2">
                <MessageSquare size={18} /> Input:
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="h-full w-full relative">
                <textarea
                    value={query}
                    onChange={handleChange}
                    maxLength={350} // 350 characters, is a lot, you'll never end up using it all, but feel free to change it if you want
                    placeholder="Escribe algo aquí..."
                    className="w-full h-full bg-white/10 hover:bg-white/20 focus:bg-white/30 text-primary placeholder-primary/60 rounded-xl p-4 outline-none transition-all border border-transparent focus:border-white/40 shadow-inner resize-none overflow-y-auto whitespace-pre-wrap break-words font-mono text-sm tracking-tighter custom-scrollbar"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.preventDefault();
                    }}
                />
                <span className="absolute right-3 bottom-2 text-[10px] text-primary/40 pointer-events-none font-mono bg-black/20 px-1 rounded">
                    {query.length}/350 {/* If you change the above, also change this, is a character counter*/}
                </span>
            </form>
        </GlassCard>
    );
}