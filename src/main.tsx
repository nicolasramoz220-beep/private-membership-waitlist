import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MembershipExperience } from "../app/MembershipExperience";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MembershipExperience />
  </StrictMode>,
);
