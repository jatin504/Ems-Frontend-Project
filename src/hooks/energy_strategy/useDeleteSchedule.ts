import { useToast } from "@chakra-ui/react";
import axios from "axios";

const BASE_URL = "http://75.119.146.115:5179";

export function useDeleteSchedule() {
  const toast = useToast();

  /**
   * Delete a schedule by id
   * - Backend returns 204 No Content on success
   */
  const deleteSchedule = async (id: number | string): Promise<boolean> => {
    try {
      const res = await axios.delete(`${BASE_URL}/strategy/delete/${id}`);

      // Some proxies may coerce 204 to 200; accept both as success.
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

      // If server returns JSON with message on success:
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

      // Fallback unexpected
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
