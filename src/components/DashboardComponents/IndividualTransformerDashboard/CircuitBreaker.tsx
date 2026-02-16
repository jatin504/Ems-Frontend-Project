import { Section, Led } from "./SharedComponents";

export default function CircuitBreaker() {
  return (
    <Section title="CIRCUIT BREAKER">
      <Led label="CB DC FAIL" />
      <Led label="SPARE" />
      <Led label="SPARE" />
      <Led label="CB AC FAIL" />
      <Led label="SPARE" />
      <Led label="CB SF6 LOCKOUT" />
      <Led label="CB SF6 ALARM" />
      <Led label="CB SPRING DISCHARGED" />
      <Led label="CB TC-1 FAULTY" />
      <Led label="CB TC-2 FAULTY" />
    </Section>
  );
}
