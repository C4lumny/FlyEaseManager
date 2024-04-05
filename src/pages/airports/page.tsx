import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// 👇UI imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AirportsCrudPage } from "./crudPage";
import { CountriesPage } from "../countries/page";
import { RegionsPage } from "../regions/page";
import { CitiesPage } from "../cities/page";

export const AirportsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("view");
  }, []);

  return (
    <>
      {/* <div className="space-y-2 mb-5">
        <h2 className="text-2xl font-semibold tracking-tight">Aeropuertos</h2>
        <p className="text-muted-foreground">CRUD de aeropuertos</p>
      </div> */}
      <Tabs defaultValue="airports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="airports">Aeropuertos</TabsTrigger>
          <TabsTrigger value="countries">Paises</TabsTrigger>
          <TabsTrigger value="regions">Regiones</TabsTrigger>
          <TabsTrigger value="cities">Ciudades</TabsTrigger>
        </TabsList>
        {/* 👇Contenido de aeropuertos */}
        <TabsContent value="airports" className="space-y-4">
          <AirportsCrudPage />
        </TabsContent>
        {/* 👇Contenido de paises */}
        <TabsContent value="countries" className="space-y-4">
          <CountriesPage />
        </TabsContent>
        {/* 👇Contenido de regiones */}
        <TabsContent value="regions" className="space-y-4">
          <RegionsPage />
        </TabsContent>
        {
          /* 👇Contenido de ciudades */
          <TabsContent value="cities" className="space-y-4">
            <CitiesPage />
          </TabsContent>
        }
      </Tabs>
    </>
  );
};
