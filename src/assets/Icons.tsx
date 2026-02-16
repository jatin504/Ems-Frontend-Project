import { useColorModeValue } from "@chakra-ui/react";
import { EnlargeHeight } from "../Services/EnlargeWidget";



export const ExpandIcon = () => {
    const currentColor = useColorModeValue("#062D59", "#fff");
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.50004 7.49992L3.33337 3.33325M3.33337 3.33325V6.66659M3.33337 3.33325H6.66671M12.5 7.49992L16.6667 3.33325M16.6667 3.33325V6.66659M16.6667 3.33325H13.3334M7.50004 12.4999L3.33337 16.6666M3.33337 16.6666V13.3333M3.33337 16.6666H6.66671M12.5 12.4999L16.6667 16.6666M16.6667 16.6666V13.3333M16.6667 16.6666H13.3334" stroke={currentColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};

export const SqeezIcon = () => {
    const currentColor = useColorModeValue("#062D59", "#fff");
    return (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 17L12 12M12 12V16M12 12H16M1 17L6 12M6 12V16M6 12H2M17 1L12 6M12 6V2M12 6H16M1 1L6 6M6 6V2M6 6H2" stroke={currentColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
};