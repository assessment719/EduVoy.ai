import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import Home from "./Components/home";
import Hero from "./Components/hero";
import SignIn from "./Components/signin";
import ProtectedRoutes from "./utils/protectedroutes";

function App() {

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/admin/home" />} />
          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/signin" element={<SignIn />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin/eduvoytools" element={<Hero />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
