
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen w-full" style={{ position: "relative" }}>
      <div style={{
        position: "fixed", bottom: "20px", right: "20px", zIndex: 99998,
        background: "#ff0080", color: "white", padding: "8px 16px",
        borderRadius: "8px", fontFamily: "monospace", fontSize: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
      }}>
        AI ToolBox v{new Date().getFullYear()}.{new Date().getMonth() + 1}.05
      </div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
