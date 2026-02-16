import { Box, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import PlantConfigFullScreenForm from "./PlantConfigFullScreenForm";
import type { PlantConfig } from "./PlantConfigFullScreenForm";

export default function PlantConfigDashboard() {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (plant: PlantConfig) => {
    console.log("Saved Plant Config:", plant);

    toast({
      title: "Plant config saved",
      status: "success",
      position: "top-left",
    });

    navigate("/config/list");
  };

  return (
    <Box p={3}>
      <PlantConfigFullScreenForm
        mode="inline"
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
