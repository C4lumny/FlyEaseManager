import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useUserContext } from "@/contexts/userProvider";
import { useEffect } from "react";
// 👇UI Imports and icons
import FlyEaseIcon from "../assets/Logo-removebg-preview.png";
import { PlaneTakeoff, TowerControl, Plane, Ticket, LayoutDashboard, UserRoundPlus, LogOutIcon } from "lucide-react";
import { DashboardPage } from "@/pages/dashboard/page";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/nav";
import { ModeToggle } from "@/components/mode-toggle";
import { AirportsPage } from "./airports/page";

export const Home = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleChange = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (user.username === "" && user.password === "") {
      navigate('/login');
    }
  }, [user, history]);

  return (
    <div className="container relative hidden h-screen flex-col md:grid lg:max-w-none lg:grid-cols-6 lg:px-0">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      <div className="col-span-1 flex flex-col">
        {/* 👇 Logo del aplicativo */}
        <div className="mt-10">
          <img src={FlyEaseIcon} alt="" />
          <div className="flex justify-center items-center">
            <span className="text-lg font-bold tracking-tight">Bienvenido, {user.username}</span>
          </div>
        </div>
        {/* 👇 Separador */}
        <Separator className="my-5" />
        {/* 👇 Nav y opciones del aplicativo */}
        <div>
          <Nav
            links={[
              {
                title: "Dashboard",
                icon: LayoutDashboard,
                variant: currentPath === "/home/dashboard" ? "default" : "ghost",
                link: "dashboard",
              },
              {
                title: "Vuelos",
                icon: PlaneTakeoff,
                variant: currentPath === "/home/flights" ? "default" : "ghost",
                link: "flights",
              },
              {
                title: "Aeropuertos",
                icon: TowerControl,
                variant: currentPath === "/home/airports" ? "default" : "ghost",
                link: "airports",
              },
              {
                title: "Aviones",
                icon: Plane,
                variant: currentPath === "/home/planes" ? "default" : "ghost",
                link: "planes",
              },
              {
                title: "Boletos",
                icon: Ticket,
                variant: currentPath === "/home/tickets" ? "default" : "ghost",
                link: "tickets",
              },
              {
                title: "Clientes",
                icon: UserRoundPlus,
                variant: currentPath === "/home/clients" ? "default" : "ghost",
                link: "clients",
              },
            ]}
          />
        </div>
        {/* 👇 Logout */}
        <div className="mt-auto ml-2 mb-5 flex">
          <Button variant={"outline"} className="font-bold" onClick={handleChange}>
          <LogOutIcon className="mr-2 size-4" />
            Cerrar sesión
          </Button>
        </div>
        <div className="absolute left-[16.5rem] top-0 bottom-0">
          <Separator orientation="vertical" />
        </div>
      </div>
      <div className="ml-10 col-span-4 p-10">
        <Routes>
          <Route path="dashboard/*" element={<DashboardPage />} />
          <Route path="flights/*" element={<DashboardPage />} />
          <Route path="airports/*" element={<AirportsPage />} />
        </Routes>
      </div>
    </div>
  );
};
