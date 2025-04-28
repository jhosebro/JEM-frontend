import { Box, Card, Typography } from "@mui/material";
import { MapaDashboard } from "../components/MapaDashboard";

function Home() {
  return (
    <>
      <Box p={3} display={"grid"} gap={3}>
        <Typography variant="h4" fontWeight={"bold"}>
          Dashboard
        </Typography>
        <Card sx={{ borderRadius: "16px", boxShadow: 3 }}>
          <MapaDashboard />
        </Card>
      </Box>
    </>
  );
}

export default Home;
