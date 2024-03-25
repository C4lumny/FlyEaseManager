import { Routes, Route, useLocation } from "react-router-dom";

import { Plus, Minus, RefreshCcw, View } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { ViewRegions } from "./components/view";
// import { ViewCountries } from "./components/view";
// import { CreateCountries } from "./components/create";

export const RegionsPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Regiones</h2>
        <p className="text-muted-foreground">CRUD de regiones</p>
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
                variant: currentPath === "/home/airports/view" ? "default" : "ghost",
              },
              {
                icon: Plus,
                title: "Crear",
                link: "create",
                variant: currentPath === "/home/airports/create" ? "default" : "ghost",
              },
              {
                icon: RefreshCcw,
                title: "Actualizar",
                link: "update",
                variant: currentPath === "/home/airports/update" ? "default" : "ghost",
              },
              {
                icon: Minus,
                title: "Eliminar",
                link: "delete",
                variant: currentPath === "/home/airports/delete" ? "default" : "ghost",
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
              <Route path="view" element= {<ViewRegions />}/>
              <Route path="create" element={<div>Hola mundo actualizar</div>} />
              <Route path="update" element={<div>Hola mundo actualizar</div>} />
              <Route path="delete" element={<div>Hola mundo eliminar</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
