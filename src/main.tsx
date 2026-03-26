import { createRoot } from "react-dom/client";
import SimpleApp from "./app/SimpleApp.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<SimpleApp />);