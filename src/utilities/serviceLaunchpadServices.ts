import { Camera, FileText, BookOpen, NotebookPen } from 'lucide-react';
import { APILinks } from './apiLinks';
import axios from 'axios';

const createDailyLog = async () => {
    try {
        const response = await axios.post(APILinks.createLog);
        const { urlPath } = response.data;
        const sbBaseUrl = APILinks.notes;
        const sbUrl = `${sbBaseUrl}/${urlPath}`;
        window.open(sbUrl, '_blank');
    } catch (error) {
        console.error("Error when creating the log", error);
    }
};

export const getServices = (immichPhotos: number | null) => [
    {
        name: "Immich",
        icon: Camera,
        color: "bg-purple-100 text-purple-600", stats: immichPhotos !== null ? `${immichPhotos.toLocaleString()} archivos en total` : "Cargando biblioteca...",
        actionHandler: () => window.open(APILinks.immich, '_blank'),
        onPhone: false
    },
    {
        name: "SilverBullet Logs",
        icon: FileText,
        color: "bg-purple-100 text-purple-600",
        stats: "Nuevo log",
        actionHandler: createDailyLog,
        onPhone: true
    },
    {
        name: "Biblia",
        icon: BookOpen,
        color: "bg-amber-100 text-amber-600",
        stats: "Ir al índice",
        actionHandler: () => window.open("https://notas.vaznet.ssh.cx/Biblia/00_%C3%8Dndice_B%C3%ADblico", '_blank'),
        onPhone: true
    },
    {
        name: "Agenda",
        icon: NotebookPen,
        color: "bg-purple-100 text-purple-600",
        stats: "Ir a la agenda",
        actionHandler: () => window.open("https://notas.vaznet.ssh.cx/Personal/Clase/Agenda", '_blank'),
        onPhone: true
    },
];