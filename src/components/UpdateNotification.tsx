import { Alert, Button, Snackbar } from "@mui/material";

interface UpdateNotificationProps {
  open: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

export default function UpdateNotification({
  open,
  onUpdate,
  onClose,
}: UpdateNotificationProps) {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={onClose}
    >
      <Alert
        severity="info"
        action={
          <Button color="inherit" size="small" onClick={onUpdate}>
            Update Now
          </Button>
        }
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        A new version is available! Click to update.
      </Alert>
    </Snackbar>
  );
}
