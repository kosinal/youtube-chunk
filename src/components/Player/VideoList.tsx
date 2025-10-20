import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Video } from "./playerSlice";
import ScrollingText from "./ScrollingText";
import styles from "./VideoList.module.css";

interface VideoListProps {
  videos: Video[];
  currentIndex: number;
  onVideoSelect: (index: number) => void;
  isPlaying: boolean;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  currentIndex,
  onVideoSelect,
  isPlaying,
}) => {
  if (videos.length === 0) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}>
      <Typography variant="subtitle2" sx={{ p: 1, pb: 0 }}>
        Playlist ({videos.length} video{videos.length !== 1 ? "s" : ""})
      </Typography>
      <List dense>
        {videos.map((video, index) => (
          <ListItem key={`${video.id}-${index}`} disablePadding>
            <ListItemButton
              selected={index === currentIndex}
              onClick={() => onVideoSelect(index)}
              disabled={isPlaying}
              className={styles.listItemButton}
            >
              <ListItemText
                primary={
                  <ScrollingText
                    text={`${index + 1}. ${video.title || video.url}`}
                    isSelected={index === currentIndex}
                  />
                }
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  component: "div",
                  className: styles.primaryText,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default VideoList;
