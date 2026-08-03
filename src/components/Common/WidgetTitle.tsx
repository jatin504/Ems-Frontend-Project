import React from "react";
import { Text, useColorModeValue, type TextProps } from "@chakra-ui/react";

interface WidgetTitleProps extends TextProps {
  children: React.ReactNode;
  color?: string;
}

const WidgetTitle: React.FC<WidgetTitleProps> = ({ children, color, ...rest }) => {
  const defaultColor = useColorModeValue("#111827", "#E6EEF6");

  return (
    <Text
      fontSize="16px"
      fontWeight={700}
      color={color || defaultColor}
      lineHeight="20px"
      {...rest}
    >
      {children}
    </Text>
  );
};

export default WidgetTitle;