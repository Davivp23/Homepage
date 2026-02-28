const BASE_URL = `https://${import.meta.env.VITE_DOMAIN}/api`;

export const APILinks = {
    // Every link or api used on the dashboard, ordered alphabetically by component name

    caddyLogs: `${BASE_URL}/caddy-logs`, // Caddy-logs.tsx      Sim id= 3 is for AC1, not sure about others though
    activity: `${BASE_URL}/activity`, // ContributionGraph.tsx                ↓↓↓↓↓↓↓↓
    lfm: 'https://api3.lowfuelmotorsport.com/api/users/getEloGraphData/139707?sim_id=3', // EloGraph.tsx
    //                                                                 ↑↑↑↑↑↑
    //                                                   This number is your lfm account id
    socket: `https://${import.meta.env.VITE_DOMAIN}`, // Input.tsx
    nowPlaying: `${BASE_URL}/now-playing`, // ↓ NavidromeWidget.tsx ↓
    playlists: `${BASE_URL}/playlists`,
    playlistTracks: `${BASE_URL}/playlist-tracks?id=`,
    trackInfo: `${BASE_URL}/track-info/`,
    proxyStream: `${BASE_URL}/proxy-stream/`,
    immichStats: `${BASE_URL}/immich-stats`, // ↓ ServiceLaunchpad.tsx ↓
    createLog: `${BASE_URL}/create-log`,
    notes: `https://notas.${import.meta.env.VITE_DOMAIN}`,
    immich: `https://immich.${import.meta.env.VITE_DOMAIN}`,
    stats: `${BASE_URL}/stats`, // SystemHealth.tsx
    upcomingTasks: `${BASE_URL}/upcomingTasks`, // ↓ UpcomingTasks.tsx ↓
    completeTask: `${BASE_URL}/completeTask`,
    userStats: 'https://api3.lowfuelmotorsport.com/api/users/getUserStats/139707', // TrophyShelf.tsx
} as const;