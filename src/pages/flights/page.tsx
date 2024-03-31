import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { ViewAirports } from "./components/view";
import { Plus, Minus, RefreshCcw, View } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { ViewFlights } from "./components/view";
import { DeleteFlight } from "./components/delete";
import { CreateFlights } from "./components/create";
// import { CreateAirports } from "./components/create";
// import { DeleteAirport } from "./components/delete";
// import { UpdateAirports } from "./components/update";

export const FlightsPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    navigate("view");
  }, []);

  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Vuelos</h2>
        <p className="text-muted-foreground">CRUD de vuelos</p>
      </div>
      <Separator className="mb-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-auto">
        <aside className="-mx-4 lg:w-1/5">
          <Nav
            links={[
              {
                icon: View,
                title: "Visualizar",
                link: "view",
                variant: currentPath === "/home/flights/view" ? "default" : "ghost",
              },
              {
                icon: Plus,
                title: "Crear",
                link: "create",
                variant: currentPath === "/home/flights/create" ? "default" : "ghost",
              },
              {
                icon: RefreshCcw,
                title: "Actualizar",
                link: "update",
                variant: currentPath === "/home/flights/update" ? "default" : "ghost",
              },
              {
                icon: Minus,
                title: "Eliminar",
                link: "delete",
                variant: currentPath === "/home/flights/delete" ? "default" : "ghost",
              },
            ]}
          />
        </aside>
        <div>
          <Separator orientation="vertical" />
        </div>

        <div className="flex-1 lg:max-w-4xl my-10">
          <div className="space-y-6">
            <Routes>
              <Route path="view" element={<ViewFlights />} />
              <Route path="create" element={<CreateFlights />} />
              <Route path="update" element={<div>Hola mundo actualizar</div>} />
              <Route path="delete" element={<DeleteFlight />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
