import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/* Los tokens y el CSS base van PRIMERO: así el CSS de cada componente
   puede sobrescribirlos (si no, .btn le gana a las reglas responsive). */
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
