import { Routes, Route } from "react-router-dom";

import { ViewAirports } from "./components/view";
import { Plus, Minus, RefreshCcw, View } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";

export const AirportsCrudPage = () => {
  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Aeropuertos</h2>
        <p className="text-muted-foreground">CRUD de aeropuertos</p>
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
                variant: "default",
              },
              {
                icon: Plus,
                title: "Crear",
                link: "create",
                variant: "ghost",
              },
              {
                icon: RefreshCcw,
                title: "Actualizar",
                link: "update",
                variant: "ghost",
              },
              {
                icon: Minus,
                title: "Eliminar",
                link: "delete",
                variant: "ghost",
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
              <Route path="view" element={<ViewAirports />} />
              <Route path="create" element={<div>Hola mundo crear</div>} />
              <Route path="update" element={<div>Hola mundo actualizar</div>} />
              <Route path="delete" element={<div>Hola mundo eliminar</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
