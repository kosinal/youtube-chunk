import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Video } from "./playerSlice";
import ScrollingText from "./ScrollingText";
import styles from "./VideoList.module.css";

interface VideoListProps {
  videos: Video[];
  currentIndex: number;
  onVideoSelect: (index: number) => void;
  onDeleteVideo: (index: number) => void;
  isPlaying: boolean;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  currentIndex,
  onVideoSelect,
  onDeleteVideo,
  isPlaying,
}) => {
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  if (videos.length === 0) {
    return null;
  }

  const handleDeleteClick = (event: React.MouseEvent, index: number): void => {
    event.stopPropagation();

    if (pendingDeleteIndex === index) {
      onDeleteVideo(index);
      setPendingDeleteIndex(null);
    } else {
      setPendingDeleteIndex(index);
    }
  };

  const handleBlur = (event: React.FocusEvent): void => {
    // Check if focus is leaving the playlist container
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget as Node | null;

    // If relatedTarget is null or not a child of currentTarget, focus left the container
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setPendingDeleteIndex(null);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}
      onBlur={handleBlur}
    >
      <Typography variant="subtitle2" sx={{ p: 1, pb: 0 }}>
        Playlist ({videos.length} video{videos.length !== 1 ? "s" : ""})
      </Typography>
      <List dense>
        {videos.map((video, index) => {
          const isPendingDelete = pendingDeleteIndex === index;
          return (
            <ListItem
              key={`${video.id}-${index}`}
              disablePadding
              sx={{
                bgcolor: isPendingDelete
                  ? "rgba(255, 100, 100, 0.2)"
                  : "transparent",
                transition: "background-color 0.2s ease",
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => handleDeleteClick(e, index)}
                  disabled={isPlaying}
                  sx={{
                    color: isPendingDelete ? "error.main" : "common.white",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: isPendingDelete ? "error.dark" : "grey.300",
                    },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              }
            >
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
          );
        })}
      </List>
    </Paper>
  );
};

export default VideoList;
