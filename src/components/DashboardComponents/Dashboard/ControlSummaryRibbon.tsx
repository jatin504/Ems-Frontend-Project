import { SimpleGrid } from "@chakra-ui/react";
import {
  MdBolt,
  MdTrendingUp,
  MdOutlineElectricBolt,
  MdCalendarMonth,
  MdSavings,
  MdEco,
} from "react-icons/md";

import SummaryCard from "./SummaryCard.tsx";

const cards = [
  {
    title: "Current Load",
    value: "6.42",
    unit: "MW",
    subtitle: "71.3% Plant Capacity",
    icon: MdBolt,
    color: "#2E90FA",
  },
  {
    title: "Today's Peak (Actual)",
    value: "8.71",
    unit: "MW",
    subtitle: "11:15 AM",
    icon: MdTrendingUp,
    color: "#B26DFF",
  },
  {
    title: "Today's Forecasted Peak",
    value: "9.25",
    unit: "MW",
    subtitle: "",
    icon: MdOutlineElectricBolt,
    color: "#F5B400",
  },
  {
    title: "Tomorrow's Forecasted Peak",
    value: "8.96",
    unit: "MW",
    subtitle: "",
    icon: MdCalendarMonth,
    color: "#22D3EE",
  },
  {
    title: "Energy Cost Today",
    value: "₹1,24,570",
    unit: "",
    subtitle: "",
    icon: MdSavings,
    color: "#22C55E",
  },
  {
    title: "CO₂ Avoided Today",
    value: "2.35",
    unit: "tCO₂",
    subtitle: "",
    icon: MdEco,
    color: "#2DD36F",
  },
];

const ControlSummaryRibbon = () => {
  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
        lg: 3,
        xl: 6,
      }}
      spacing={3}
    >
      {cards.map((item) => (
        <SummaryCard
          key={item.title}
          {...item}
        />
      ))}
    </SimpleGrid>
  );
};

export default ControlSummaryRibbon;