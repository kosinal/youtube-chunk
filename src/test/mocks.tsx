import { vi } from "vitest";

// Mock for react-youtube
export const createMockYouTubePlayer = () => ({
  playVideo: vi.fn(),
  pauseVideo: vi.fn(),
  stopVideo: vi.fn(),
  seekTo: vi.fn(),
  getDuration: vi.fn(() => 600), // 10 minutes default
  getCurrentTime: vi.fn(() => 0),
  getPlayerState: vi.fn(() => -1),
  mute: vi.fn(),
  unMute: vi.fn(),
  isMuted: vi.fn(() => false),
  setVolume: vi.fn(),
  getVolume: vi.fn(() => 100),
});

// Mock YouTube component
vi.mock("react-youtube", () => ({
  default: ({
    onReady,
    videoId,
    className,
  }: {
    onReady?: (event: {
      target: ReturnType<typeof createMockYouTubePlayer>;
    }) => void;
    videoId?: string;
    className?: string;
  }) => {
    // Simulate onReady callback after mount
    if (onReady) {
      setTimeout(() => {
        onReady({ target: createMockYouTubePlayer() });
      }, 0);
    }
    return (
      <div
        data-testid="youtube-player"
        data-video-id={videoId}
        className={className}
      />
    );
  },
}));

// Mock virtual:pwa-register/react
export const mockUseRegisterSW = vi.fn(() => ({
  needRefresh: [false, vi.fn()],
  offlineReady: [false, vi.fn()],
  updateServiceWorker: vi.fn(),
}));

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: mockUseRegisterSW,
}));

// Mock image imports
vi.mock("../img/bg.jpg", () => ({
  default: "mocked-background.jpg",
}));
