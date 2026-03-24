import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import { FaExpand } from "react-icons/fa";
import { useRef } from "react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const LocationMapChart = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue("#f7f7f7", "#000");
  const buttonBg = useColorModeValue(
    "rgba(255,255,255,0.8)",
    "rgba(0,0,0,0.5)"
  );
  const buttonHoverBg = useColorModeValue(
    "rgba(255,255,255,0.9)",
    "rgba(0,0,0,0.7)"
  );
  const buttonColor = useColorModeValue("#000", "#fff");

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      boxRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const plants = [
    {
      lat: 4.2695,
      lng: 73.4909,
      name: "Maldives Plant"
    }
  ];

  const redPointer = new L.DivIcon({
    className: "",
    html: `
      <div style="
        width:22px;
        height:22px;
        background:#ff2d2d;
        border-radius:50% 50% 50% 0;
        transform: rotate(-45deg);
        border:3px solid white;
        box-shadow:0 0 10px rgba(0,0,0,0.6);
      "></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });

  return (
    <Box
      ref={boxRef}
      width="626px"
      height="354px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="xl"
      bg={bgColor}
      position="relative"
    >
      <Button
        position="absolute"
        top="10px"
        right="10px"
        zIndex="1000"
        size="sm"
        onClick={toggleFullscreen}
        bg={buttonBg}
        color={buttonColor}
        _hover={{ bg: buttonHoverBg }}
      >
        <FaExpand />
      </Button>

      <MapContainer
        center={[4.269418992537764, 73.49133629664938]}
        zoom={16}
        minZoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {plants.map((plant, i) => (
          <Marker
            key={i}
            position={[plant.lat, plant.lng]}
            icon={redPointer}
          >
            <Popup>{plant.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default LocationMapChart;