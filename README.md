# YouTube Chunker

A Progressive Web App (PWA) for playing specific segments of YouTube videos with custom start times and durations. Built with React, TypeScript, and Material-UI.

## ✨ Features

- **📹 Video Segment Playback**: Play YouTube videos starting at any point with a defined duration
- **⏱️ Timer-Based Control**: Automatically stops playback after the specified duration
- **💾 State Persistence**: Tracks playback position across sessions using localStorage
- **🎯 Progress Tracking**: Calculates and updates elapsed time and start position automatically
- **📱 PWA Support**: Install as a standalone app on any device
- **🎨 Modern UI**: Clean, responsive interface built with Material-UI
- **🌙 Dark Theme**: Easy-on-the-eyes dark mode design

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7 with SWC for Fast Refresh
- **State Management**: Redux Toolkit with redux-persist (localStorage)
- **UI Library**: Material-UI (MUI) v7 with Emotion styling
- **YouTube Integration**: react-youtube library
- **Testing**: Vitest with React Testing Library
- **PWA**: vite-plugin-pwa with service worker support

## Demo

You can see running application on [Github Pages](https://kosinal.github.io/youtube-chunk/).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kosinal/youtube-chunk
cd youtube-chunk
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📝 Available Scripts

```bash
# Start development server with Hot Module Replacement
npm run dev

# Build for production (includes TypeScript type checking)
npm run build

# Preview production build locally
npm run preview

# Run all tests with Vitest
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting without making changes
npm run format:check

# Run complete quality check (format, lint, test, build)
npm run check
```

## 💡 Usage

1. **Enter YouTube URL**: Paste any YouTube video URL (supports multiple formats: watch, embed, shorts, youtu.be)
2. **Set Start Time**: Specify when the video should begin (in minutes)
3. **Set Duration**: Define how long the segment should play (in minutes)
4. **Play**: Click play to start the video segment
5. **Automatic Tracking**: The app automatically:
   - Validates start time doesn't exceed video length
   - Stops playback after the specified duration
   - Updates start position based on elapsed time
   - Saves state to localStorage for persistence

## 🔧 Key Architecture Details

### State Management

The app uses Redux Toolkit with redux-persist for localStorage persistence:

- **playerSlice**: Manages video URL, start time, duration, playback state, timestamp tracking, and video list
- **redux-persist**: Automatically saves entire Redux state to localStorage with whitelist configuration
- **State Rehydration**: On app load, state is restored from localStorage using persistStore

### Video Playback Logic

- **Timer-Based Control**: Uses `setTimeout` to automatically pause after duration expires
- **Progress Calculation**: Tracks elapsed time and updates start position accordingly
- **URL Parsing**: Supports multiple YouTube URL formats via `extractVideoId()` helper
- **Validation**: Prevents start time from exceeding video length

### PWA Configuration

- **Manifest**: Configured in `vite.config.ts` with theme colors and app metadata
- **Service Worker**: Auto-generated with `registerType: "autoUpdate"` for automatic updates
- **Update Notification**: Shows notification when new version is available with option to update
- **Cache Versioning**: Cache ID includes package.json version for automatic cache invalidation
- **Runtime Caching**: Network-first for YouTube API, cache-first for images, network-first for HTML
- **Offline Support**: Assets cached for offline functionality
- **Install Prompt**: Users can install app on any device
- **Auto Update Check**: Service worker checks for updates every hour

## 🌐 Deployment

The app is configured for GitHub Pages deployment:

1. Build the project:

```bash
npm run build
```

2. The `dist/` folder contains the production build

3. Base path is set to `/youtube-chunk/` in `vite.config.ts`

4. Deploy the `dist/` folder to your hosting service (GitHub Pages, Netlify, Vercel, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [GNU GENERAL PUBLIC LICENSE](LICENSE).

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Material-UI](https://mui.com/)
- YouTube integration via [react-youtube](https://github.com/tjallingt/react-youtube)
