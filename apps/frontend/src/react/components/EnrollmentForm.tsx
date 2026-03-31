import { useState } from "react";

import Button from "./Button";
import CheckboxTab from "./CheckboxTab";
import Dropdown from "./Dropdown";

export default function EnrollmentForm() {
  const [licenseType, setLicenseType] = useState("");
  const [creditCardSelected, setCreditCardSelected] = useState(true);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
      <CheckboxTab
        name="paymentMethod"
        checked={creditCardSelected}
        onChange={() => setCreditCardSelected((currentValue) => !currentValue)}
      />

      <Dropdown
        name="licenseType"
        value={licenseType}
        onChange={(event) => setLicenseType(event.target.value)}
        options={[
          { label: "Learner", value: "learner" },
          { label: "Class 5 GDL", value: "class-5-gdl" },
          { label: "Full Licence", value: "full-licence" },
        ]}
      />

      <Button variant="unfilled">Continue to User Info</Button>
    </section>
  );
}
