import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  sizes: {
    container: {
      "8xl": "90rem", // 1440px
      "9xl": "120rem", // 1920px
    },
  },
  colors: {
    primary: {
      light: "#FFFFFF",
      dark: "#161B1B",
    },
    primaryText: {
      dark: "#FFFFFF",
      light: "#000000",
    },
    secondaryText: {
      dark: "rgba(255, 255, 255, 0.5)",
      light: "rgba(0, 0, 0, 0.5)",
    },
    primaryBorder: {
      dark: "rgba(255, 255, 255, 0.1)",
      light: "rgba(0, 0, 0, 0.1)",
    },
  },
  styles: {
    global: {
      // Inject Fonts
      "@font-face": [
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 400,
          src: `url("../assets/fonts/Poppins/static/Poppins-Regular.ttf") format("truetype")`,
        },
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          src: `url("../assets/fonts/Poppins/static/Poppins-Medium.ttf") format("truetype")`,
        },
        {
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 700,
          src: `url("../assets/fonts/Poppins/static/Poppins-Bold.ttf") format("truetype")`,
        },
      ],

      // Apply globally
      "html, body": {
        fontFamily: "Poppins, sans-serif",
      },

      "::-webkit-scrollbar": {
        width: "5px",
        height: "5px", // also works for horizontal scrollbar
      },
      "::-webkit-scrollbar-thumb": {
        background: "gray.500",
        borderRadius: "9999px", // same as "full"
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "gray.400",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
    },
  },
  fonts: {
    heading: "Poppins, sans-serif",
    body: "Poppins, sans-serif",
  },
});

export default theme;
