import React from "react"
import { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import type { YouTubePlayer } from "react-youtube"
import YouTube from "react-youtube"
import styles from "./Player.module.css"
import {
  setVideoUrl,
  setDuration,
  setPlaying,
  selectVideoUrl,
  selectDuration,
  selectIsPlaying,
  setStart,
  selectStart,
  setStartTime,
  selectStartTime
} from "./playerSlice"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import StopIcon from "@mui/icons-material/Stop"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid2"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import type { Theme } from "@mui/material/styles"
import Box from "@mui/material/Box"
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused"

import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a7c3ff",
    },
  },
})

const Player: React.FC = () => {
  const dispatch = useAppDispatch()
  const videoUrl = useAppSelector(selectVideoUrl)
  const start = useAppSelector(selectStart)
  const startTime = useAppSelector(selectStartTime)

  const duration = useAppSelector(selectDuration)
  const isPlaying = useAppSelector(selectIsPlaying)
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const [videoLenMinutes, setVideoLenMinutes] = useState<number>(999999)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isError = start > videoLenMinutes

  const minute = 60 * 1000

  if (isError){
    dispatch(setPlaying(false))
  }
  const handlePlayPause = () => {
    if (isPlaying) {
      player?.pauseVideo()
      dispatch(setPlaying(false))
      changeMinutesPlayed(start, startTime)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else {
      if (player) {
        player.playVideo()
        dispatch(setPlaying(true))
        const newStartTime = new Date().toISOString()
        dispatch(setStartTime(newStartTime))
        timeoutRef.current = setTimeout(
          () => {
            player.pauseVideo()
            dispatch(setPlaying(false))
            changeMinutesPlayed(start, newStartTime)
          },
          duration * minute,
        )
      }
    }
  }

  const changeMinutesPlayed = (startMinutes: number, startTime: string) => {
    const currentTime = new Date()
    const videoStartTime = new Date(startTime)
    const delta = 1000
    const diffRaw = Math.abs(currentTime.getTime() - videoStartTime.getTime()) + delta
    const minutesPlayed = Math.floor(diffRaw / 60000)
    dispatch(setStart(startMinutes + minutesPlayed))
  }

  const handleVideoReady = (event: { target: YouTubePlayer }) => {
    const player = event.target
    const durationInSeconds = player.getDuration()
    setVideoLenMinutes(Math.floor(durationInSeconds / 60))
    setPlayer(player)
  }

  const playerOpts = {
    playerVars: {
      start: start * 60,
    },
  }

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
            <Grid size={12}>
              <TextField
                name="video_url"
                required
                fullWidth
                id="video_url"
                label="YouTube Video URL"
                value={videoUrl}
                disabled={isPlaying}
                onChange={(e) => dispatch(setVideoUrl(e.target.value))}
              />
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
                {...(isError ? { error: true, helperText: `Maximum value is ${videoLenMinutes}` } : {})}
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
                disabled={isError}
              >
                {isPlaying ? <StopIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {videoUrl && (
        <YouTube
          videoId={extractVideoId(videoUrl)}
          onReady={handleVideoReady}
          className={styles.video_player}
          opts={playerOpts}
        />
      )}
    </ThemeProvider>
  )
}

// Helper function to extract YouTube video ID from URL
const extractVideoId = (url: string): string => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/|shorts\/)?([\w-]{11})/,
  )
  return match ? match[1] : ""
}

export default Player
