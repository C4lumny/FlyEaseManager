import { Login } from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* 👇 Ruta principal que redirige al login */}
        <Route index element={<Navigate to="/Login" />} />

        <Route path="/Login" element={<Login />} />
      </Routes>
    </ThemeProvider>
  );
};
