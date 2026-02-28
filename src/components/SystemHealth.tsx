import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, MemoryStick, Laptop } from 'lucide-react';
import { useState, useEffect } from 'react';
import { APILinks } from '../utilities/apiLinks';

export function SystemHealth() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [cpuLoad, setCpuHistory] = useState<number[]>(new Array(15).fill(0));

    interface SystemStats {
        cpu: number;
        ram: number;
        temp: number;
        uptime: number;
        diskUse: number;
        diskTemp: number;
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(APILinks.stats);
                if (!response.ok) throw new Error('Server error');
                const data: SystemStats = await response.json();
                setStats(data);
                setCpuHistory(prev => [...prev.slice(1), data.cpu]);
                setError(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError(true);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 3000); // Fetch every 3 seconds
        console.log(stats, error);

        return () => clearInterval(interval);
    }, []);

    const cpuLoadInt = stats?.cpu ?? 0;
    const temp = Number(stats?.temp) ?? 0;
    const ramUsed = stats?.ram ?? 0;
    const uptime = stats?.uptime ?? 0;
    const diskUse = stats?.diskUse ?? 0;
    const diskTemp = stats?.diskTemp ?? 0;

    const formatUptime = (seconds: number) => {
        const m = Math.floor(seconds / (3600 * 24 * 30));
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);

        if (m > 1) return `${m}m`;
        if (d > 0) return `${d}d ${h}h`;
        return `${h}h`;
    };

    const getUptimeColor = (seconds: number) => {
        const ONE_MONTH = 2629746;
        const THREE_MONTHS = ONE_MONTH * 3;
        const SIX_MONTHS = ONE_MONTH * 6;

        if (seconds > SIX_MONTHS) return 'text-red-500';
        if (seconds > THREE_MONTHS) return 'text-orange-500';
        if (seconds > ONE_MONTH) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <GlassCard className="col-span-full md:col-span-2 lg:col-span-1 row-span-1 flex flex-col justify-between">

            <h3 className="font-semibold text-primary flex items-center gap-2">
                <Laptop size={18} /> Vaznet 2.2 - Uptime: {/* Customize everything to your liking */}
            </h3>
            <div className='p-0 self-center flex flex-col gap-1'>
                <span>
                    <span className={`font-bold ${getUptimeColor(uptime)}`}>{uptime}</span>s
                </span>
                <span className='text-xs self-center'>
                    (<span className={`font-bold ${getUptimeColor(uptime)}`}>{formatUptime(uptime)}</span>)
                </span>
            </div>
            <div className="flex justify-between text-xs text-primary/70 mb-1 mt-1">
                <span className="flex items-center gap-1"><Cpu size={12} /> CPU</span>
                <span className="flex">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${temp > 80 ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-700'}`}>
                        {temp}°C
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${cpuLoadInt > 80 ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-700'}`}>
                        {cpuLoadInt}%
                    </span>
                </span>
            </div>
            {/* Mini SVG Graph for CPU */}
            <div className="flex-1 flex items-end h-24 mb-4 gap-1 px-1" style={{ minHeight: '10vh' }}>
                {cpuLoad.map((load, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: `${load}%` }}
                        transition={{ duration: 0.5 }}
                        className={`flex-1 ${load > 80 ? 'bg-red-500/70' : 'bg-[#1E3A8A]/80'} rounded-t-sm hover:bg-primary/60 transition-colors`}
                        title={`Load: ${load}%`}
                    />
                ))}
            </div>

            <div className='flex flex-col gap-2 w-full'>
                {/* Ram usage bar */}
                <div className="mt-auto">
                    <div className="flex justify-between text-xs text-primary/70 mb-1">
                        <span className="flex items-center gap-1"><MemoryStick size={12} /> RAM</span>
                        <span>{ramUsed}%</span>
                    </div>
                    <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${ramUsed}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${ramUsed > 90 ? 'bg-red-500/70' : 'bg-[#1E3A8A]/80'}`}
                        />
                    </div>
                </div>

                {/* Storage bar */}
                <div className='flex flex-row gap-2 mt-1'>
                    <div className="mt-auto w-full">
                        <div className="flex justify-between text-xs text-primary/70 mb-1">
                            <span className="flex items-center gap-1"><HardDrive size={12} /> HDD</span>
                            <span>{diskUse}%</span>
                        </div>
                        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${diskUse}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${diskUse > 90 ? 'bg-red-500/70' : 'bg-[#1E3A8A]/80'}`}
                            />
                        </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${temp > 80 ? 'bg-red-500/20 text-red-600' : 'bg-green-500/20 text-green-700'}`}>
                        {diskTemp}°C
                    </span>
                </div>
            </div>
        </GlassCard >
    );
}
