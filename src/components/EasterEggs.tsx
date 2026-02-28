import { GlassCard } from './GlassCard';
import { ToggleLeft, ToggleRight, Terminal, Cat, Coffee, Gamepad } from 'lucide-react';

interface EasterEggsProps {
    isTempleOS: boolean;
    toggleTempleOS: () => void;
}

// Not sure what was i thinking with this one, but hey, templeOS is cool

export function EasterEggs({ isTempleOS, toggleTempleOS }: EasterEggsProps) {
    const quickLinks = [
        { icon: Terminal, label: 'SSH' },
        { icon: Cat, label: 'Gitea' },
        { icon: Coffee, label: 'Buy Me Coffee' },
        { icon: Gamepad, label: 'Emulator' },
    ];

    return (
        <GlassCard className="col-span-full row-span-1 flex flex-row items-center justify-between">
            {/* Quick Links Streamdeck */}
            <div className="flex gap-4">
                {quickLinks.map((Link, i) => (
                    <button
                        key={i}
                        className="p-3 bg-white/10 hover:bg-white/30 text-primary rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                        title={Link.label}
                    >
                        <Link.icon size={20} />
                    </button>
                ))}
            </div>

            {/* TempleOS Toggle */}
            <button
                onClick={toggleTempleOS}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-bold transition-colors"
            >
                <span className="text-xs uppercase tracking-widest hidden md:block">
                    {isTempleOS ? 'Divine Intellect' : 'TempleOS Mode'}
                </span>
                {isTempleOS ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
        </GlassCard>
    );
}
