
import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, TrendingUp } from 'lucide-react';
import { APILinks } from '../utilities/apiLinks.ts';

interface EloDataPoint {
    date: string;
    rating: number;
    timestamp?: number;
}

export function EloGraph() {
    const [data, setData] = useState<EloDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(APILinks.lfm);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();

                // Add timestamp for X-axis scaling
                const processedData = jsonData.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.date).getTime()
                }));

                setData(processedData);
            } catch (err) {
                console.error("Failed to fetch ELO data:", err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const CurrentElo = data.length > 0 ? data[data.length - 1].rating : 0;
    const previousElo = data.length > 1 ? data[data.length - 2].rating : 0;
    const diff = CurrentElo - previousElo;

    if (error) {
        return (
            <GlassCard className="col-span-full md:col-span-2 lg:col-span-2 min-h-[300px] flex items-center justify-center">
                <div className="text-red-500 font-bold">Error loading ELO data</div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="col-span-full md:col-span-1 lg:col-span-1 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-primary flex items-center gap-2">
                        <TrendingUp size={18} /> LFM ELO
                    </h3>
                    <div className="text-sm text-primary/70">
                        Assetto Corsa
                    </div>
                </div>
                {!loading && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{CurrentElo}</div>
                        <div className={`text-xs font-bold ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {diff > 0 ? '+' : ''}{diff} en la última carrera {/* You can translate this to your language */}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary/50" size={32} />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <defs>
                                <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="timestamp"
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickFormatter={(time) => format(new Date(time), 'MMM d, yy', { locale: es })}
                                stroke="#1e3a8a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke="#1e3a8a"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    borderRadius: '8px',
                                    color: '#1e3a8a'
                                }}
                                labelFormatter={(label) => format(new Date(label), 'PPP', { locale: es })}
                                itemStyle={{ color: '#1e3a8a' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rating"
                                stroke="#1e3a8a"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 1, stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </GlassCard>
    );
}
