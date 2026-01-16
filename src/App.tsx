import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import Support from "./routes/Support";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/support" element={<Support />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
