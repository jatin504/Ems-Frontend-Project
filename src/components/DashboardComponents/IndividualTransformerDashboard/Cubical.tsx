import { Section, Led } from "./SharedComponents";

export default function Cubical() {
  return (
    <Section title="CUBICAL">
      <Led label="87T IED FAULTY" />
      <Led label="LV SIDE BCPU FAULTY" />
      <Led label="86LV FAULTY" />
      <Led label="86A FAULTY" />
      <Led label="86B FAULTY" />
      <Led label="96 FAULTY" />
      <Led label="SPARE" />
      <Led label="DC-1 FAIL" />
      <Led label="DC-2 FAIL" />
      <Led label="AC FAIL" />
    </Section>
  );
}