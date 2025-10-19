import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { YouTubePlayer } from "react-youtube";
import YouTube from "react-youtube";
import styles from "./Player.module.css";
import {
  setVideos,
  setCurrentVideoIndex,
  setDuration,
  setPlaying,
  selectVideos,
  selectCurrentVideoIndex,
  selectCurrentVideo,
  selectDuration,
  selectIsPlaying,
  setStart,
  selectStart,
  setStartTime,
  selectStartTime,
} from "./playerSlice";
import VideoList from "./VideoList";
import type { Video } from "./playerSlice";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a7c3ff",
    },
  },
});

const Player: React.FC = () => {
  const dispatch = useAppDispatch();
  const videos = useAppSelector(selectVideos);
  const currentVideoIndex = useAppSelector(selectCurrentVideoIndex);
  const currentVideo = useAppSelector(selectCurrentVideo);
  const start = useAppSelector(selectStart);
  const startTime = useAppSelector(selectStartTime);
  const duration = useAppSelector(selectDuration);
  const isPlaying = useAppSelector(selectIsPlaying);

  const [urlsInput, setUrlsInput] = useState<string>("");
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [videoLenMinutes, setVideoLenMinutes] = useState<number>(999999);
  const [isLoadingVideos, setIsLoadingVideos] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isError = start > videoLenMinutes;

  const minute = 60 * 1000;

  const changeMinutesPlayed = useCallback(
    (startMinutes: number, startTime: string) => {
      const currentTime = new Date();
      const videoStartTime = new Date(startTime);
      const delta = 1000;
      const diffRaw =
        Math.abs(currentTime.getTime() - videoStartTime.getTime()) + delta;
      const minutesPlayed = Math.floor(diffRaw / 60000);
      dispatch(setStart(startMinutes + minutesPlayed));
    },
    [dispatch],
  );

  // Stop playing if there's an error (start time exceeds video length)
  useEffect(() => {
    if (isError && isPlaying) {
      dispatch(setPlaying(false));
    }
  }, [isError, isPlaying, dispatch]);

  // Auto-play next video when currentVideoIndex changes while playing
  useEffect(() => {
    if (isPlaying && player && currentVideo) {
      const newStartTime = new Date().toISOString();
      dispatch(setStartTime(newStartTime));
      player.seekTo(start * 60, true);
      player.playVideo();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        player.pauseVideo();
        changeMinutesPlayed(start, newStartTime);

        if (currentVideoIndex < videos.length - 1) {
          dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
        } else {
          dispatch(setPlaying(false));
        }
      }, duration * minute);
    }
  }, [
    currentVideoIndex,
    currentVideo,
    isPlaying,
    player,
    start,
    duration,
    minute,
    dispatch,
    videos.length,
    changeMinutesPlayed,
  ]);

  const fetchVideoTitle = async (url: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video title");
      }
      const data = await response.json();
      return data.title || "";
    } catch (error) {
      console.error("Error fetching video title:", error);
      return "";
    }
  };

  const handleLoadVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const parsedVideos = await parseUrls(urlsInput);
      dispatch(setVideos(parsedVideos));
    } catch (error) {
      console.error("Error loading videos:", error);
      const parsedVideos = parseUrlsWithoutTitles(urlsInput);
      dispatch(setVideos(parsedVideos));
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleClearVideos = () => {
    // Convert current videos back to URL string
    const urlString = videos.map((video) => video.url).join(", ");
    setUrlsInput(urlString);
    dispatch(setVideos([]));
  };

  const parseUrlsWithoutTitles = (input: string): Video[] => {
    return input
      .split(/[,;]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .map((url) => ({
        url: url,
        id: extractVideoId(url),
      }))
      .filter((video) => video.id !== "");
  };

  const parseUrls = async (input: string): Promise<Video[]> => {
    const videos = parseUrlsWithoutTitles(input);

    const videosWithTitles = await Promise.all(
      videos.map(async (video) => {
        try {
          const title = await fetchVideoTitle(video.url);
          return { ...video, title };
        } catch (error) {
          console.error(`Error fetching title for ${video.url}:`, error);
          return video;
        }
      }),
    );

    return videosWithTitles;
  };

  const handleVideoSelect = (index: number) => {
    if (!isPlaying) {
      dispatch(setCurrentVideoIndex(index));
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      player?.pauseVideo();
      dispatch(setPlaying(false));
      changeMinutesPlayed(start, startTime);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      if (player) {
        player.playVideo();
        dispatch(setPlaying(true));
        const newStartTime = new Date().toISOString();
        dispatch(setStartTime(newStartTime));
        timeoutRef.current = setTimeout(() => {
          player.pauseVideo();
          changeMinutesPlayed(start, newStartTime);

          if (currentVideoIndex < videos.length - 1) {
            dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
            dispatch(setPlaying(true));
          } else {
            dispatch(setPlaying(false));
          }
        }, duration * minute);
      }
    }
  };

  const handleVideoReady = (event: { target: YouTubePlayer }) => {
    const player = event.target;
    const durationInSeconds = player.getDuration();
    setVideoLenMinutes(Math.floor(durationInSeconds / 60));
    setPlayer(player);
  };

  const handleVideoEnd = () => {
    // Clear timeout to prevent double-advancement
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Pause video (defensive)
    player?.pauseVideo();

    // Reset start to 0 for next video
    dispatch(setStart(0));

    // Advance to next video or stop
    if (currentVideoIndex < videos.length - 1) {
      dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
      // isPlaying remains true, useEffect will auto-play next video from start=0
    } else {
      dispatch(setPlaying(false));
    }
  };

  const playerOpts = {
    playerVars: {
      start: start * 60,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" className={styles.container}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              color: (theme: Theme) => theme.palette.text.primary,
              backgroundColor: (theme: Theme) => theme.palette.primary.main,
            }}
          >
            <NotificationsPausedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            YouTube Timer
          </Typography>
        </Box>
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {videos.length === 0 && (
              <Grid size={12}>
                <TextField
                  name="video_urls"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="video_urls"
                  label="YouTube Video URLs (separated by , or ;)"
                  value={urlsInput}
                  disabled={isPlaying}
                  onChange={(e) => setUrlsInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..., https://youtu.be/..."
                />
              </Grid>
            )}
            {videos.length > 0 && (
              <Grid size={12}>
                <VideoList
                  videos={videos}
                  currentIndex={currentVideoIndex}
                  onVideoSelect={handleVideoSelect}
                  isPlaying={isPlaying}
                />
              </Grid>
            )}
            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={
                  videos.length === 0 ? handleLoadVideos : handleClearVideos
                }
                disabled={
                  isPlaying ||
                  isLoadingVideos ||
                  (videos.length === 0 && !urlsInput.trim())
                }
              >
                {isLoadingVideos
                  ? "Loading..."
                  : videos.length === 0
                    ? "Load Videos"
                    : "Clear Videos"}
              </Button>
            </Grid>
            <Grid size={6}>
              <TextField
                name="start"
                required
                fullWidth
                type="number"
                id="start"
                label="Start"
                value={start}
                disabled={isPlaying}
                onChange={(e) => dispatch(setStart(Number(e.target.value)))}
                {...(isError
                  ? {
                      error: true,
                      helperText: `Maximum value is ${videoLenMinutes}`,
                    }
                  : {})}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                name="duration"
                required
                fullWidth
                type="number"
                id="duration"
                label="Duration"
                value={duration}
                disabled={isPlaying}
                onChange={(e) => dispatch(setDuration(Number(e.target.value)))}
              />
            </Grid>
            <Grid size={12}>
              <IconButton
                type="button"
                aria-label="delete"
                sx={{ mt: 3, mb: 2 }}
                onClick={handlePlayPause}
                disabled={isError || videos.length === 0}
              >
                {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {currentVideo && (
        <YouTube
          key={currentVideo.id}
          videoId={currentVideo.id}
          onReady={handleVideoReady}
          onEnd={handleVideoEnd}
          className={styles.video_player}
          opts={playerOpts}
        />
      )}
    </ThemeProvider>
  );
};

// Helper function to extract YouTube video ID from URL
const extractVideoId = (url: string): string => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/|shorts\/)?([\w-]{11})/,
  );
  return match ? match[1] : "";
};

export default Player;
