import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("🚀 AI ToolBox V2 loaded", new Date().toISOString());

const root = document.getElementById("root");
if (root) {
  const marker = document.createElement("div");
  marker.id = "version-marker";
  marker.style.cssText = "display:none";
  marker.setAttribute("data-version", "2");
  root.appendChild(marker);
}

createRoot(document.getElementById("root")!).render(<App />);
