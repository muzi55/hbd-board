import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import AuthMain from "../pages/AuthMain";
import Main from "../pages/Main";
import AuthLayout from "./AuthLayout";
import NonAuthLayout from "./NonAuthLayout";
import LoginForm from "../components/auth/LoginForm";

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<NonAuthLayout />}>
          <Route path="/auth" element={<AuthMain />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default Router;
