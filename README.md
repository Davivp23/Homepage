# Glass Cockpit (Homepage)

A personal homepage and modular dashboard built with React, TypeScript, Vite, and Tailwind CSS. This project serves as a central hub ("glass cockpit") for monitoring services and accessing personal tools. I personally use it as my homepage on my computers and as a PWA on my phone.

In the future, I plan to create a react-native app for my phone that uses the same backend.

## Features

- Header: A searchbar with commands, needed to use it as a homepage.
- Service Launchpad: Quick access and status monitoring for various integrated services.
- Navidrome Integration: Widget for playing music from your own Navidrome server.
- Caddy Logs Viewer: Interface for monitoring Caddy logs (as the name implies).
- Contribution Graph: GitHub-style activity and contribution visualizations for personal logs.
- Input box: A simple input box that can be used to write fast notes, links, or whatever. With Socket.IO, whatever is written will be visible across devices.
- System Health: A simple interface for monitoring the health of the system.
- Simracing Stats: A simple interface for monitoring simracing stats from Low Fuel Motorsport.
- Upcoming Tasks: A simple interface for monitoring personal upcoming tasks.
- Responsive Design: Built with Tailwind CSS and Framer Motion for smooth animations across all screen sizes.

## Tech Stack

- Frontend Framework: React 18, TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Animations: Framer Motion
- Icons: Lucide React
- Charts & Visualization: Recharts
- Date Handling: date-fns
- WebSocket Client: Socket.IO
- PWA Support: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (or yarn/pnpm)

### Installation

1. Navigate to the project directory.

2. Install the dependencies:
```bash
npm install
```

3. Configure environment variables. You may need to edit or create a `.env` file containing required backend URLs or API configurations (e.g., Navidrome, Caddy).

### Development

To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173/` by default.

### Production Build

To build the project for production:
```bash
npm run build
```
This will compile the TypeScript code and generate static production files in the `dist` directory.

To preview the production build locally:
```bash
npm run preview
```

### Server

Set up the dashboard on your server with a docker-compose file and caddy if you want to access it from the internet. The docker-compose file will create a container for the dashboard. You will also need to set up the backend, which is a separate project, on your server. I may include my backend server.js file and docker-compose for both frontend and backend in the future.


## Future Plans

Although I am happy with the current state of the project for personal use, here are some things I would like to add in the future:

- Create a react-native app that uses the same backend.
- Automatic english translation of the website.
- Publish backend and docker-compose files.