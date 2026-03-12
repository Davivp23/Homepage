import { GlassCard } from './GlassCard';
import { ListTodo, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { APILinks } from '../utilities/apiLinks';

export function ToDoList() {
    const [logs, setLogs] = useState<any[]>([]);

    interface Task {
        title: string;
        due: string;
        subject: string;
    }

    const fetchLogs = async () => {
        try {
            const res = await fetch(APILinks.upcomingTasks);
            const data = await res.json();
            setLogs(data);
            console.log(data);
        } catch (e) {
            console.error("Error logs", e);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const completeTask = async (task: Task) => {
        try {
            const response = await fetch(APILinks.completeTask, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: task.title,
                    due: task.due,
                    subject: task.subject
                })
            });

            if (response.ok) {
                setLogs(prev => prev.filter(t => t.title !== task.title));
                fetchLogs();
            }
        } catch (error) {
            console.error("Error connecting to the backend", error);
        }
    };

    return (
        <>
            {/* ToDoList */}
            < GlassCard className="col-span-full md:col-span-2 lg:col-span-2 row-span-1 h-full" >
                <div className="flex items-center gap-2 mb-3 text-primary/80">
                    <ListTodo size={18} />
                    <h3 className="font-semibold text-sm">ToDoList</h3>
                    <div onClick={fetchLogs} className="ml-auto cursor-pointer self-end">
                        <RefreshCw size={18} />
                    </div>
                </div>
                <div className="flex-1 height-max font-mono text-[0.65rem] md:text-xs space-y-2">
                    {logs.map((log, i) => (
                        <div
                            key={i}
                            className="cursor-pointer grid md:grid-cols-[100px_1fr_80px] grid-cols-[60px_1fr_70px] items-center gap-3 p-2 rounded bg-black/5 hover:bg-black/10 transition-colors"
                            onClick={() => completeTask(log)}
                        >
                            <span className="text-primary/50 truncate">{log.subject}</span>
                            <span className="truncate text-primary/80 truncate">{log.title}</span>
                            <span className="text-primary/40 truncate text-right tabular-nums">{log.due}</span>
                        </div>
                    ))}
                </div>
            </GlassCard >
        </>
    );
}