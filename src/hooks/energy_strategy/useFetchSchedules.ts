import { useToast } from "@chakra-ui/react";
import axios from "axios";

export function useFetchSchedules() {
  const toast = useToast();

  const fetchSchedules = async (filter: "all" | "today" = "all") => {
    try {
      const res = await axios.get("http://75.119.146.115:5179/strategy/list", {
        params: { filter },
      });
      return res.data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch schedules",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
      return [];
    }
  };

  return fetchSchedules;
}
