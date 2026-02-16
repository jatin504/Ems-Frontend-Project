import { useToast } from "@chakra-ui/react";
import axios from "axios";

export function useInsertStrategy() {
  const toast = useToast();

  const insertStrategy = async (form: any, priority: string) => {
    try {
      const response = await axios.post("http://75.119.146.115:5179/strategy/add", {
        start_ts: form.from,
        end_ts: form.to,
        type: form.command,
        tariff: form.tariff || null,
        power: form.power || null,
        duration: form.duration,
        min_soc: form.socMin || null,
        max_soc: form.socMax || null,
        priority,
        remark: form.remarks || "",
      });

      toast({
        title: "Success",
        description: "Schedule inserted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      });

      return response.data.id;
    } catch (error: any) {
      const message =
        error.response?.data?.error || error.message || "Insertion failed";

      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });

      return null;
    }
  };

  return insertStrategy;
}
