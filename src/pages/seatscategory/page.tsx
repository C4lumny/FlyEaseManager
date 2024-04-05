import { Routes, Route, useLocation } from "react-router-dom";

import { View } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { ViewSeatsCategory } from "./components/view";
// import { ViewCountries } from "./components/view";
// import { CreateCountries } from "./components/create";

export const SeatsCategoryPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Categoria de asientos</h2>
        <p className="text-muted-foreground">CRUD de categoria de asientos</p>
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
                variant: currentPath === "/home/planes/view" ? "default" : "ghost",
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
              <Route path="view" element={<ViewSeatsCategory />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
