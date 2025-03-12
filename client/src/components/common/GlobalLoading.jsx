import { useSelector } from "react-redux";
import { Paper, Box, CircularProgress, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 300); // Reduced delay
    }
  }, [globalLoading]);

  return (
    <Paper sx={{
      background: "rgba(0, 0, 0, 0.7)", // Semi-transparent dark overlay
      backdropFilter: "blur(8px)", // Blur effect
      opacity: isLoading ? 1 : 0,
      pointerEvents: "none",
      transition: "all .3s ease",
      position: "fixed",
      width: "100vw",
      height: "100vh",
      zIndex: 999
    }}>
      <Toolbar />
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}>
        <CircularProgress size={70} thickness={5} color="primary" />
      </Box>
    </Paper>
  );
};

export default GlobalLoading;
