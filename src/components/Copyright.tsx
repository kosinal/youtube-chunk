import { Box, Link, Typography } from "@mui/material";

export default function Copyright() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      sx={{
        // Desktop: fixed bottom-left corner
        position: { xs: "static", md: "fixed" },
        bottom: { md: "0.5rem" },
        left: { md: "0.5rem" },
        // Mobile: centered below form
        textAlign: { xs: "center", md: "left" },
        padding: { xs: "1rem", md: 0 },
        marginTop: { xs: 2, md: 0 },
        width: { xs: "100%", md: "auto" },
        zIndex: 1000,
        opacity: 0.7,
        transition: "opacity 0.2s",
        "&:hover": {
          opacity: 1,
        },
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{ fontSize: "0.75rem" }}
      >
        © {currentYear} Lukas Kosina · v{__APP_VERSION__} ·{" "}
        <Link
          href="https://github.com/kosinal/vite-youtube-chunker/blob/master/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "inherit",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          License
        </Link>
      </Typography>
    </Box>
  );
}
