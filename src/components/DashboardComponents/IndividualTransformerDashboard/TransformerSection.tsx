import { Section, Led } from "./SharedComponents";

export default function TransformerSection() {
  return (
    <Section title="TRANSFORMER">
      <Led label="BUCHHOLZ ALARM" />
      <Led label="OIL TEMP ALARM (OLTC)" />
      <Led label="OIL TEMP ALARM" />
      <Led label="WTI - HV ALARM" />
      <Led label="WTI - LV ALARM" />
      <Led label="MAIN SUPPLY FAIL" />
      <Led label="STANDBY SUPPLY FAIL" />
      <Led label="SPARE" />
      <Led label="SPARE" />
    </Section>
  );
}
