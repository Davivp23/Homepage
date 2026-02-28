
import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import {
    Trophy,
    Medal,
    Flag,
    Skull,
    Award
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { APILinks } from '../utilities/apiLinks';

interface UserStats {
    wins: number;
    podium: number;
    top5: number;
    top10: number;
    poles: number;
    starts: number;
    dnf: number;
    podiumrate: number;
    ranked: number;
}

export function TrophyShelf() {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(APILinks.userStats);
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStats(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <GlassCard className="col-span-full md:col-span-2 lg:col-span-1 min-h-[250px] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary/50" />
            </GlassCard>
        );
    }

    if (error || !stats) {
        return (
            <GlassCard className="col-span-full md:col-span-2 lg:col-span-1 min-h-[250px] flex items-center justify-center">
                <span className="text-red-500 font-bold">Error cargando trofeos</span>
            </GlassCard>
        );
    }

    // Everything is in spanish, translate it to whatever you speak. The API also returns more data which I don't care about, you can use it if you want.

    return (
        <GlassCard className="col-span-full md:col-span-2 lg:col-span-1 flex flex-col gap-4">
            <h3 className="font-semibold text-primary flex items-center gap-2 mb-2">
                <Trophy size={18} className="text-primary" /> Sala de trofeos
            </h3>

            {/* Top Tier: Wins, Podiums, Poles */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-yellow-300/20 to-yellow-500/10 rounded-xl p-3 flex flex-col items-center justify-center border border-yellow-400/30 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors" />
                    <Trophy className="text-yellow-600 mb-1 drop-shadow-sm" size={24} />
                    <span className="text-2xl font-bold text-yellow-700">{stats.wins}</span>
                    <span className="text-[10px] text-yellow-800/70 font-bold uppercase tracking-wide">Victorias</span>
                </div>

                <div className="bg-gradient-to-br from-gray-300/20 to-gray-400/10 rounded-xl p-3 flex flex-col items-center justify-center border border-gray-400/30 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute inset-0 bg-gray-400/5 group-hover:bg-gray-400/10 transition-colors" />
                    <Medal className="text-gray-600 mb-1 drop-shadow-sm" size={24} />
                    <span className="text-2xl font-bold text-gray-700">{stats.podium}</span>
                    <span className="text-[10px] text-gray-800/70 font-bold uppercase tracking-wide">Podios</span>
                </div>

                <div className="bg-gradient-to-br from-purple-300/20 to-purple-500/10 rounded-xl p-3 flex flex-col items-center justify-center border border-purple-400/30 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute inset-0 bg-purple-400/5 group-hover:bg-purple-400/10 transition-colors" />
                    <Flag className="text-purple-600 mb-1 drop-shadow-sm" size={24} />
                    <span className="text-2xl font-bold text-purple-700">{stats.poles}</span>
                    <span className="text-[10px] text-purple-800/70 font-bold uppercase tracking-wide">Poles</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-1">
                {/* Left Column: Consistency */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-primary/5 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Award size={14} className="text-amber-800" />
                            <span className="text-xs text-primary/70">Top 5</span>
                        </div>
                        <span className="font-bold text-primary">{stats.top5}</span>
                    </div>
                </div>

                {/* Right Column: Key Metrics */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between bg-primary/5 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Award size={14} className="text-primary" />
                            <span className="text-xs text-primary/70">Top 10</span>
                        </div>
                        <span className="font-bold text-primary">{stats.top10}</span>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex justify-between items-center text-xs px-1 pt-2 border-t border-primary/10 mt-auto">
                <span className="text-primary/60 flex items-center gap-1">
                    <Flag size={12} className="text-green-600" /> {stats.starts} carreras iniciadas
                </span>
                <span className="text-primary/60 flex items-center gap-1">
                    <Skull size={12} className="text-red-500" /> {stats.dnf} DNF
                </span>
            </div>

        </GlassCard>
    );
}
