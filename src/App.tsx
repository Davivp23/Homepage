import { Suspense, lazy, /*useState */ } from 'react';
import { Header } from './components/Header';
import { cn } from './lib/utils';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDynamicTheme } from './components/dynTheme';

const NavidromeWidget = lazy(() => import('./components/NavidromeWidget').then(module => ({ default: module.NavidromeWidget })));
const SystemHealth = lazy(() => import('./components/SystemHealth').then(module => ({ default: module.SystemHealth })));
const ServiceLaunchpad = lazy(() => import('./components/ServiceLaunchpad').then(module => ({ default: module.ServiceLaunchpad })));
const CaddyLogs = lazy(() => import('./components/CaddyLogs').then(module => ({ default: module.CaddyLogs })));
const ContributionGraph = lazy(() => import('./components/ContributionGraph').then(module => ({ default: module.ContributionGraph })));
const EloGraph = lazy(() => import('./components/EloGraph').then(module => ({ default: module.EloGraph })));
const TrophyShelf = lazy(() => import('./components/TrophyShelf').then(module => ({ default: module.TrophyShelf })));
//const EasterEggs = lazy(() => import('./components/EasterEggs').then(module => ({ default: module.EasterEggs })));
const Input = lazy(() => import('./components/Input').then(module => ({ default: module.Input })));
const ToDoList = lazy(() => import('./components/toDoList').then(module => ({ default: module.ToDoList })));

export function useDeviceOrientation() {
    const landscapeQuery = "(orientation: landscape) and (pointer: coarse)";
    const portraitQuery = "(orientation: portrait) and (pointer: coarse)";

    const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'desktop'>(() => {
        if (window.matchMedia(landscapeQuery).matches) return 'landscape';
        if (window.matchMedia(portraitQuery).matches) return 'portrait';
        return 'desktop';
    });

    useEffect(() => {
        const lQuery = window.matchMedia(landscapeQuery);
        const pQuery = window.matchMedia(portraitQuery);

        const handler = () => {
            if (lQuery.matches) setOrientation('landscape');
            else if (pQuery.matches) setOrientation('portrait');
            else setOrientation('desktop');
        };

        lQuery.addEventListener('change', handler);
        pQuery.addEventListener('change', handler);
        return () => {
            lQuery.removeEventListener('change', handler);
            pQuery.removeEventListener('change', handler);
        };
    }, []);

    return orientation;
}

function App() {
    //const [isTempleOS, setIsTempleOS] = useState(false);

    const orientation = useDeviceOrientation();

    const { period, isRaining } = useDynamicTheme();

    const gradients = {
        loading: "linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%)",
        day: "linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #e0f2fe 100%)",
        dawn: "linear-gradient(135deg, #ffb914 0%, #fe713e 60%, #ef4444 85%, #4f46e5 100%)",
        night: "linear-gradient(135deg, #a6b1fa 0%, #c4b5fd 50%, #bae6fd 100%)"
    };

    const BackgroundLayers = () => (
        <>
            {Object.entries(gradients).map(([key, value]) => (
                <div
                    key={key}
                    className={cn(
                        "fixed inset-0 transition-opacity duration-[5000ms] ease-in-out -z-10",
                        period === key ? "opacity-100" : "opacity-0"
                    )}
                    style={{ background: value }}
                />
            ))}
        </>
    );

    // 1. MOBILE LANDSCAPE
    if (orientation === 'landscape') return (
        <div className={cn("relative h-screen p-3 md:p-3 lg:p-3 transition-colors duration-500 noselect", isRaining && "saturate-[0.4]")}>
            <BackgroundLayers />
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-auto relative z-0">

                {/* Header occupies full width */}
                <Header portrait={false} />

                <Suspense fallback={
                    <div className="col-span-full flex items-center justify-center p-12 text-white/50">
                        <Loader2 className="animate-spin w-8 h-8" />
                        <span className="ml-2">Cargando sistema...</span>
                    </div>
                }>
                    {/* First Row of Modules */}
                    <NavidromeWidget className="col-span-2" />
                    <SystemHealth />

                </Suspense>

            </div>
        </div>
    )

    // 2. MOBILE PORTRAIT
    if (orientation === 'portrait') return (
        <div className={cn("relative min-h-screen p-4 transition-all duration-500 overflow-x-hidden noselect", isRaining && "saturate-[0.4]")}>
            <BackgroundLayers />
            <div className="w-full flex flex-col gap-4 relative z-0 pb-20"> {/* pb-20 for bottom safe area */}

                {/* Compact Header */}
                <Header portrait={false} />

                <Suspense fallback={
                    <div className="flex items-center justify-center p-8 text-white/50">
                        <Loader2 className="animate-spin w-6 h-6" />
                    </div>
                }>
                    {/* Stacked Vertical Layout */}
                    <NavidromeWidget />
                    <Input />
                    <ServiceLaunchpad isPhone={true} />
                    <ToDoList />

                    {/* Quick Stats Row */}
                    <ContributionGraph />
                    <SystemHealth />
                    <TrophyShelf />

                    {/* Utilities */}
                    <CaddyLogs />

                </Suspense>
            </div>
        </div>
    )

    // 3. DESKTOP (Default)
    return (
        <div className={cn("relative min-h-screen p-4 md:p-8 lg:p-12 transition-all duration-500 noselect", isRaining && "saturate-[0.4]" /*, isTempleOS && "temple-os-mode"*/)}>
            <BackgroundLayers />
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-auto relative z-0">

                {/* Header occupies full width */}
                <Header portrait={true} />

                <Suspense fallback={
                    <div className="col-span-full flex items-center justify-center p-12 text-white/50">
                        <Loader2 className="animate-spin w-8 h-8" />
                        <span className="ml-2">Cargando sistema...</span>
                    </div>
                }>
                    {/* First Row of Modules */}
                    <NavidromeWidget className="col-span-1" />
                    <SystemHealth />

                    <ServiceLaunchpad />
                    <Input />

                    <ToDoList />
                    <TrophyShelf />
                    <EloGraph />

                    {/* Second Row - Full Width */}
                    <ContributionGraph />

                    <CaddyLogs />

                    {/* Footer / Utilities */}
                    {/* <EasterEggs isTempleOS={isTempleOS} toggleTempleOS={() => setIsTempleOS(!isTempleOS)} />*/}
                </Suspense>

            </div>
        </div>
    )
}

export default App
