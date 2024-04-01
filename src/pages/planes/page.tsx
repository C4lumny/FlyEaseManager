import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// 👇UI imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanesCrudPage } from "./crudPage";
import { RegionsPage } from "../regions/page";
import { CitiesPage } from "../cities/page";
import { AirlinesPage } from "../airlines/page";

export const PlanesPage = () => {
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
      <Tabs defaultValue="planes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="planes">Aviones</TabsTrigger>
          <TabsTrigger value="airlines">Aerolineas</TabsTrigger>
          <TabsTrigger value="seats">Asientos</TabsTrigger>
          <TabsTrigger value="seatingCategory">Categoria asientos</TabsTrigger>
        </TabsList>
        {/* 👇Contenido de aviones */}
        <TabsContent value="planes" className="space-y-4">
          <PlanesCrudPage />
        </TabsContent>
        {/* 👇Contenido de aerolineas */}
        <TabsContent value="airlines" className="space-y-4">
          <AirlinesPage />
        </TabsContent>
        {/* 👇Contenido de asientos */}
        <TabsContent value="seats" className="space-y-4">
          <RegionsPage />
        </TabsContent>
        {/* 👇Contenido de Categoria asientos */}
        <TabsContent value="seatingCategory" className="space-y-4">
          <CitiesPage />
        </TabsContent>
      </Tabs>
    </>
  );
};
