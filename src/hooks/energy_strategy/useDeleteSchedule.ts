import { useToast } from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE;

export function useDeleteSchedule() {
  const toast = useToast();

  /**
   * Delete a schedule by id
   * - Backend returns 204 No Content on success
   */
  const deleteSchedule = async (id: number | string): Promise<boolean> => {
    try {
      const res = await axios.delete(`${BASE_URL}/strategy/delete/${id}`);

      if (res.status === 204 || res.status === 200) {
        toast({
          title: "Deleted",
          description: `Schedule #${id} removed`,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top-left",
        });
        return true;
      }

      if (res.data?.message === "Deleted") {
        toast({
          title: "Deleted",
          description: `Schedule #${id} removed`,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top-left",
        });
        return true;
      }

      toast({
        title: "Unexpected response",
        description: `HTTP ${res.status}`,
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return false;
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.message || "Delete failed";

      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return false;
    }
  };

  return deleteSchedule;
}