import { Section, Led } from "./SharedComponents";

export default function Cooler() {
  return (
    <Section title="COOLER">
      <Led label="ANY FANS GROUP-1 FAIL" />
      <Led label="SPARE" />
      <Led label="SPARE" />
      <Led label="FAN GROUP-2 FAIL" />
      <Led label="86 UF1 FAULTY" />
      <Led label="86 UF2 FAULTY" />
      <Led label="SPARE" />
      <Led label="SPARE" />
      <Led label="SPARE" />
      <Led label="SPARE" />
    </Section>
  );
}
