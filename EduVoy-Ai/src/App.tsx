import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import Home from "./Components/home";
import Hero from "./Components/hero";
import Sign from "./Components/sign";
import ProtectedRoutes from "./Utils/protectedroutes";

function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/sign" element={<Sign />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/eduvoytools" element={<Hero />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
