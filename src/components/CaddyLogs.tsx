import { GlassCard } from './GlassCard';
import { Server } from 'lucide-react';
import { useState, useEffect } from 'react';
import { APILinks } from '../utilities/apiLinks.ts';

export function CaddyLogs() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch(APILinks.caddyLogs);
                const data = await res.json();
                setLogs(data);
            } catch (e) {
                console.error("Caddy logs error: ", e);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 3000); // Logs are updated each 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Caddy Logs */}
            < GlassCard className="col-span-full md:col-span-4 lg:col-span-2 row-span-1">
                <div className="flex items-center gap-2 mb-3 text-primary/80">
                    <Server size={18} />
                    <h3 className="font-semibold text-sm">Caddy Access Logs</h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 font-mono text-xs space-y-2 max-h-[150px]">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded bg-black/5 hover:bg-black/10 transition-colors">
                            <span className="text-primary/50">{log.time}</span>
                            <span className={`font-bold ${log.status >= 400 ? 'text-red-500' : 'text-green-600'}`}>
                                {log.status}
                            </span>
                            <span className="flex-1 truncate text-primary/80">{log.path}</span>
                            <span className="text-primary/40 truncate w-20 text-right">{log.ip}</span>
                        </div>
                    ))}
                </div>
            </GlassCard >
        </>
    );
}