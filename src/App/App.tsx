import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalysisPage from "@/pages/AnalysisPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnalysisPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
