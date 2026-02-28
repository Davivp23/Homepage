import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    gridArea?: string; // e.g., 'col-span-2 row-span-1'
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function GlassCard({ children, className, gridArea, onClick }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "glass-panel p-6 flex flex-col relative overflow-hidden",
                "md:backdrop-blur-xl bg-white/70 md:bg-white/40",
                gridArea,
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
