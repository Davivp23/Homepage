import { useState, useEffect, useRef } from 'react';
import { GlassCard } from './GlassCard';
import { Play, Pause, SkipForward, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { APILinks } from '../utilities/apiLinks.ts';

export function NavidromeWidget({ className }: { className?: string }) {
    // temp
    const playlistRef = useRef('all');

    const [track, setTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlists, setPlaylists] = useState<{ id: string, name: string }[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('all');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [queue, setQueue] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const audioRef = useRef<HTMLAudioElement>(new Audio());
    const isManualChange = useRef(false);
    const isPlayingRef = useRef(false);
    const trackRef = useRef<any>(null);

    const fetchMusic = async () => {
        if (isManualChange.current) return false;
        try {
            const res = await fetch(APILinks.nowPlaying);
            const data = await res.json();

            if (data && data.id) {
                if (!trackRef.current || data.id !== trackRef.current.id) {
                    updateLocalTrack(data, false);
                }
                return true;
            }
            return false;
        } catch (e) {
            console.error("Polling error:", e);
            return false;
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch(APILinks.playlists);
                const data = await res.json();
                setPlaylists(data);
            } catch (e) { console.error("Playlists error", e); }

            const isAnythingPlaying = await fetchMusic();
            if (!isAnythingPlaying) {
                handleNext(false);
            }
        };

        audioRef.current.preload = "metadata";
        init();
    }, []);

    const togglePlay = () => {
        const currentlyPlaying = isPlayingRef.current;

        if (currentlyPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
        } else {
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
            if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
        }
    };

    const handleNext = async (shouldPlay = true) => {
        if (queue.length === 0) return;

        isManualChange.current = true;
        let nextIdx = currentIndex + 1;

        // Shuffle if we reach the end of the queue
        if (nextIdx >= queue.length) {
            const reshuffled = shuffleArray(queue);
            setQueue(reshuffled);
            nextIdx = 0;
        }

        setCurrentIndex(nextIdx);
        await loadTrackById(queue[nextIdx], shouldPlay);
        setTimeout(() => { isManualChange.current = false; }, 1000);
    };

    const handlePrevious = async () => {
        if (audioRef.current.currentTime > 3) {
            audioRef.current.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            isManualChange.current = true;
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            await loadTrackById(queue[prevIdx], isPlaying);
            setTimeout(() => { isManualChange.current = false; }, 1000);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => handleNext(true);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [track?.id, selectedPlaylist]);

    useEffect(() => {
        if ('mediaSession' in navigator && track) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                album: 'Navidrome',
                artwork: [
                    { src: "", sizes: '512x512', type: 'image/png' }
                ]
            });
        }
    }, [track?.id]);

    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                togglePlay();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                togglePlay();
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                handlePrevious();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                handleNext(true);
            });
        }
    }, [track?.id]);

    useEffect(() => {
        playlistRef.current = selectedPlaylist;
    }, [selectedPlaylist]);

    useEffect(() => {
        trackRef.current = track;
    }, [track]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [isPlaying]);

    useEffect(() => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        setImageLoaded(false);
    }, [track?.id]);

    const shuffleArray = (array: string[]) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    const initQueue = async (playlistId: string) => {
        try {
            const res = await fetch(`${APILinks.playlistTracks}${playlistId}`);
            const ids = await res.json();
            if (ids.length > 0) {
                const shuffled = shuffleArray(ids);
                setQueue(shuffled);
                setCurrentIndex(0);
                loadTrackById(shuffled[0], false);
            }
        } catch (e) { console.error("Error init queue", e); }
    };

    const loadTrackById = async (id: string, shouldPlay: boolean) => {
        try {
            const res = await fetch(`${APILinks.trackInfo}${id}`);
            const data = await res.json();
            if (data.id) {
                updateLocalTrack(data, shouldPlay);
            }
        } catch (e) { console.error("Error cargando track", e); }
    };

    const updateLocalTrack = (data: any, forcePlay = false) => {
        const proxyUrl = `${APILinks.proxyStream}${data.id}`;
        setTrack(data);
        trackRef.current = data;
        audioRef.current.src = proxyUrl;
        audioRef.current.load();
        if (forcePlay || isPlayingRef.current) {
            audioRef.current.play().catch(() => { });
            if (forcePlay) setIsPlaying(true);
        }
    };

    useEffect(() => {
        initQueue(selectedPlaylist);
    }, [selectedPlaylist]);

    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => handleNext(true);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [currentIndex, queue]);

    if (!track) { // Probably not the best way to handle this, but it does the trick, feel free to improve it
        return ( //              ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ It works perfectly, do NOT try to fix it
            // well i already fixed it so now it works and there is no need to try to fix it again :)
            <GlassCard className={cn("col-span-1 row-span-1 relative overflow-hidden flex flex-col justify-end", className)} >
                <div className="absolute top-4 right-4 z-30">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                        <ListMusic size={16} className="text-white/60" />
                        <select
                            value={selectedPlaylist}
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                            className="bg-transparent text-white text-xs outline-none cursor-pointer"
                        >
                            <option value="all" className="bg-slate-800">All library</option> {/* Translate all of this*/}
                            {playlists.map(pl => (
                                <option key={pl.id} value={pl.id} className="bg-slate-800">
                                    {pl.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            animate={{ rotate: isPlaying && imageLoaded ? 360000000000 : 0 }} // Yeah a shitton of 0s, it works
                            style={{ willChange: "transform" }}
                            transition={{ repeat: Infinity, duration: 10000000000, ease: "linear" }}
                            className="w-44 h-44 rounded-full border-8 border-black/40 shadow-2xl relative overflow-hidden"
                        >
                            <AnimatePresence>
                                {!imageLoaded && (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-800"
                                    >
                                        <div className="w-full h-full animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-700" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#111] rounded-full border-4 border-white/10" />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="relative z-20 bg-black/20 backdrop-blur-xl p-6 border-t border-white/10 rounded-lg">
                    <div className="mb-4 text-center">
                        <h3 className="text-xl font-bold text-white truncate">{"Cargando"}</h3>
                        <p className="text-white/60 text-sm">{"Vaznet"}</p>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button onClick={handlePrevious} className="text-white/70 hover:text-white transition-colors rotate-180">
                            <SkipForward size={28} />
                        </button>
                        <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={() => handleNext(true)} className="text-white/70 hover:text-white transition-colors">
                            <SkipForward size={28} />
                        </button>
                    </div>
                </div>
            </GlassCard >
        );
    }

    return ( //              ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ It works perfectly, do NOT try to fix it
        // well i already fixed it so now it works and there is no need to try tofix it again :)
        <GlassCard className={cn("col-span-1 row-span-1 relative overflow-hidden flex flex-col justify-end", className)} >
            <AnimatePresence mode='wait'>
                <motion.img
                    key={track.cover}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    exit={{ opacity: 0 }}
                    src={track.cover}
                    className="absolute inset-0 z-0 w-full h-full object-cover blur-2xl scale-110"
                />
            </AnimatePresence>

            <div className="absolute top-4 right-4 z-30">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                    <ListMusic size={16} className="text-white/60" />
                    <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className="bg-transparent text-white text-xs outline-none cursor-pointer"
                    >
                        <option value="all" className="bg-slate-800">Toda la biblioteca</option>
                        {playlists.map(pl => (
                            <option key={pl.id} value={pl.id} className="bg-slate-800">
                                {pl.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        animate={{ rotate: isPlaying && imageLoaded ? 360000000000 : 0 }}
                        style={{ willChange: "transform" }}
                        transition={{ repeat: Infinity, duration: 10000000000, ease: "linear" }}
                        className="w-44 h-44 rounded-full border-8 border-black/40 shadow-2xl relative overflow-hidden"
                    >
                        <AnimatePresence>
                            {!imageLoaded && (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-800"
                                >
                                    <div className="w-full h-full animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-700" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.img
                            key={track.cover}
                            src={track.cover}
                            alt="Cover"
                            onLoad={() => setImageLoaded(true)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: imageLoaded ? 1 : 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#111] rounded-full border-4 border-white/10" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-20 bg-black/20 backdrop-blur-xl p-6 border-t border-white/10 rounded-lg">
                <div className="mb-4 text-center">
                    <h3 className="text-xl font-bold text-white truncate">{track.title || "Sin título"}</h3>
                    <p className="text-white/60 text-sm">{track.artist || "Artista desconocido"}</p>
                </div>

                <div className="flex items-center justify-center gap-6">
                    <button onClick={handlePrevious} className="text-white/70 hover:text-white transition-colors rotate-180">
                        <SkipForward size={28} />
                    </button>
                    <button onClick={togglePlay} className="p-4 bg-white text-black rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl">
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button onClick={() => handleNext(true)} className="text-white/70 hover:text-white transition-colors">
                        <SkipForward size={28} />
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}