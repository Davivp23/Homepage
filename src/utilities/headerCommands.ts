const WEBSITE_COMMANDS: Record<string, string> = {
    '!yt': 'https://www.youtube.com/results?search_query=',
    '!r': 'https://www.google.com/search?q=site:reddit.com+',
    '!gem': 'https://gemini.google.com/',
    '!gm': 'https://mail.google.com/',
    '!g': 'https://www.google.com/search?q=',
    '!c': 'https://servidor.ssh.cx:5353',
    '!router': 'http://192.168.1.1',
    '!nd': 'https://musica.vaznet.ssh.cx',
    '!w': 'https://web.whatsapp.com/',
    '!uoc': 'https://uoc.edu',
    '!git': 'https://github.com',
    '!ig': 'https://www.instagram.com',
    '!lfm': 'https://www.lowfuelmotorsport.com',
    '!se': 'https://vaznet.ssh.cx/solid.apk'
};

const APP_COMMANDS: Record<string, (arg: string) => void> = {
    '!help': () => alert("Comandos web: " + Object.keys(WEBSITE_COMMANDS).join(", ") + "\nComandos app: " + Object.keys(APP_COMMANDS).join(", ")),
    '!chill': () => {
        window.open('https://web.whatsapp.com', '_blank');
        window.open('https://www.youtube.com', '_blank');
        window.open('https://www.instagram.com', '_blank');
    },
    '!work': () => {
        window.open('https://uoc.edu', '_blank');
        window.open('https://gemini.google.com', '_blank');
    }
};

export { WEBSITE_COMMANDS, APP_COMMANDS };
