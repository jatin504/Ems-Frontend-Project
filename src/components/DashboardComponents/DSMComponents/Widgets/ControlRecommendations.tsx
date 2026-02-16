import React from "react";
import { Box,  Text, useColorModeValue } from "@chakra-ui/react";


const ControlRecommendations: React.FC = () => {
	const bg = useColorModeValue("#FFFFFF", "#161B1B");
	const borderColor = useColorModeValue("#fff", "#1F2733");
	const textColor = useColorModeValue("secondaryText.light", "secondaryText.dark");
	const PrimaryColor = useColorModeValue("primaryText.light", "primaryText.dark");
	return (
		<Box
			bg={bg}
			p={"20px"}
			w={"524px"}
			h="100%"
		>
			<Text color={PrimaryColor} fontWeight="semibold">Control Recommendations</Text>
			<Box
				height={"95%"}
				w={"100%"}
				alignContent={"end"}
			>
				<Text
					textAlign={"end"}
					fontSize={"12px"}
					color={textColor}
				>
					Decrease discharge by 3.5 MW to stay within schedule
				</Text>
			</Box>
		</Box>
	);
};
export default ControlRecommendations;