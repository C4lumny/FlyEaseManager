import { Routes, Route, useNavigate } from "react-router-dom";
// 👇UI imports
import { Separator } from "@/components/ui/separator";
import { Nav } from "@/components/nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, RefreshCcw, View } from "lucide-react";
import { MouseEvent } from "react";

export const AirportsPage = () => {
  const navigate = useNavigate();

  const handleTabChange = (e: MouseEvent<HTMLButtonElement>, value: string) => {
    console.log(value);
    // Aquí puedes agregar el código para manejar las rutas
  };

  return (
    <>
      <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Aeropuertos</h2>
        <p className="text-muted-foreground">CRUD de aeropuertos</p>
      </div>
      <Tabs defaultValue="airports" className="space-y-4">
        <TabsList>
          <TabsTrigger onClick={(e) => handleTabChange(e, "airports")} value="airports">
            Aeropuertos
          </TabsTrigger>
          <TabsTrigger value="countries">Paises</TabsTrigger>
          <TabsTrigger value="regions">Regiones</TabsTrigger>
          <TabsTrigger value="cities">Ciudades</TabsTrigger>
        </TabsList>
        {/* 👇Contenido de aeropuertos */}
        <TabsContent value="airports" className="space-y-4">
          <Separator className="mb-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-96">
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
                  <Route path="view" element={<div>Hola mundo visualizar</div>} />
                  <Route path="create" element={<div>Hola mundo crear</div>} />
                  <Route path="update" element={<div>Hola mundo actualizar</div>} />
                  <Route path="delete" element={<div>Hola mundo eliminar</div>} />
                </Routes>
              </div>
            </div>
          </div>
        </TabsContent>
        {/* 👇Contenido de paises */}
        <TabsContent value="countries" className="space-y-4">
          <Separator className="mb-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 h-96">
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
                  <Route path="view" element={<div>Hola mundo visualizar</div>} />
                  <Route path="create" element={<div>Hola mundo crear</div>} />
                  <Route path="update" element={<div>Hola mundo actualizar</div>} />
                  <Route path="delete" element={<div>Hola mundo eliminar</div>} />
                </Routes>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
