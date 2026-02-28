import { GlassCard } from './GlassCard';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { APILinks } from '../utilities/apiLinks';
import { getServices } from '../utilities/serviceLaunchpadServices';

export function ServiceLaunchpad({ isPhone }: { isPhone?: boolean }) {
    const [immichPhotos, setImmichPhotos] = useState<number | null>(null);

    useEffect(() => {
        const fetchImmichStats = async () => {
            try {
                const res = await axios.get(APILinks.immichStats);
                setImmichPhotos(res.data.count);
            } catch (e) {
                console.error("Error when fetching immich stats", e);
            }
        };
        fetchImmichStats();
    }, []);

    const services = getServices(immichPhotos);

    return (
        <div className="col-span-full md:col-span-2 lg:col-span-1 flex flex-col gap-4">
            {/* Service Cards */}
            {services.filter((s) => (isPhone ? s.onPhone : true)) // Only those with onPhone: true will be shown on mobile
                .map((s) => (
                    <GlassCard key={s.name}
                        onClick={() => {
                            if (s.actionHandler) {
                                s.actionHandler();
                            }
                        }}
                        className="flex-1 !p-4 flex-row items-center gap-4 cursor-pointer hover:bg-white/30 transition-colors group">
                        <div className={cn("p-3 rounded-xl", s.color)}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-primary group-hover:underline flex items-center gap-2">
                                {s.name} <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-xs text-primary/70 font-medium">{s.stats}</p>
                        </div>
                    </GlassCard>
                ))}
        </div>
    );
}
