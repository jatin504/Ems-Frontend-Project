import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  Box,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";

import { useDevices } from "../hooks/useDevices";

import InverterNavbar from "../components/DashboardComponents/Stringnewcomponent/InverterNavbar";
import InverterHeader from "../components/DashboardComponents/Stringnewcomponent/InverterHeader";
import InverterDashboard from "../components/DashboardComponents/Stringnewcomponent/InverterDashboard";

import SummaryPieChart from "../components/DashboardComponents/Stringnewcomponent/SummaryPieChart";
import VICurveChart from "../components/DashboardComponents/Stringnewcomponent/VICurveChart";
import StringAlarmTable from "../components/DashboardComponents/Stringnewcomponent/StringAlarmTable";
import StringLayoutTable from "../components/DashboardComponents/Stringnewcomponent/StringLayoutTable";
import StringTrendChart from "../components/DashboardComponents/Stringnewcomponent/StringTrendChart";

const StringNewDashboard = () => {

  const { devices, loading } = useDevices();

  const [selectedInverter, setSelectedInverter] =
    useState<any>(null);

  const [viewMode, setViewMode] =
    useState<"string" | "overview">
    ("string");

  // =====================================================
  // FILTER INVERTERS
  // =====================================================

  const inverterOptions = useMemo(() => {

    if (!devices) return [];

    return devices
      .filter(
        (d: any) =>
          d.device_id
            ?.toLowerCase()
            .includes("_inverter_inverter_")
      )
      .map((d: any, index: number) => ({

        value: d.device_id,

        label: `Inverter-${index + 1}`,

        make: d.make,
        model: d.model,
        sn: d.sn,

        ac_capacity: d.ac_capacity,
        dc_capacity: d.dc_capacity,

        fullData: d,
      }));

  }, [devices]);

  // =====================================================
  // AUTO SELECT FIRST INVERTER
  // =====================================================

  useEffect(() => {

    if (
      !selectedInverter &&
      inverterOptions.length > 0
    ) {
      setSelectedInverter(inverterOptions[0]);
    }

  }, [inverterOptions, selectedInverter]);

  return (
    <Box
      bg={useColorModeValue("#F4F6F6", "#131512")}
      minH="100vh"
      color={useColorModeValue("gray.900", "white")}
      p={3}
    >

      <Grid templateRows="auto auto 1fr auto" gap={3}>

        {/* TOP NAVBAR */}
        <Box>
          <InverterNavbar
            inverterOptions={inverterOptions}
            selectedDevice={selectedInverter}
            setSelectedDevice={setSelectedInverter}
            loading={loading}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </Box>

        {/* HEADER */}
        {
  viewMode === "string" && (

    <Box>
      <InverterHeader
        selectedDevice={
          selectedInverter
        }
      />
    </Box>

  )
}

        {
          viewMode === "overview" ? (

            <InverterDashboard />

          ) : (

            <>

              {/* BODY */}

              <Grid
                templateColumns="500px 580px 770px"
                gap={3}
                mt="-18px"
              >

                <SummaryPieChart
                  selectedDevice={
                    selectedInverter?.value
                  }
                />

                <StringLayoutTable
                  selectedDevice={
                    selectedInverter?.value
                  }
                />

                <Box mt="-17px">

                  <VICurveChart
                    selectedDevice={
                      selectedInverter?.value
                    }
                  />

                </Box>

              </Grid>

              {/* BOTTOM */}

              <Grid
                templateColumns="65% 35%"
                gap={3}
                mt="-24px"
              >

                <StringTrendChart
                  selectedDevice={
                    selectedInverter?.value
                  }
                />

                <StringAlarmTable
                  selectedInverter={
                    selectedInverter
                  }
                />

              </Grid>

            </>

          )
        }

      </Grid>

    </Box>
  );
};

export default StringNewDashboard;