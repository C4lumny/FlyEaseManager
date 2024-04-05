import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { ViewAirports } from "./components/view";
import { View } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { ViewTickets } from "./components/view";

export const TicketsPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    navigate("view");
  }, []);

  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Boletos</h2>
        <p className="text-muted-foreground">CRUD de boletos</p>
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
                variant: currentPath === "/home/tickets/view" ? "default" : "ghost",
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
              <Route path="view" element={<ViewTickets />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};
