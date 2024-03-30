import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";

export const ViewFlights = () => {
  const { data, loading } = useGet("/FlyEaseApi/Vuelos/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    console.log(data.response);
    dataTable = data.response.map(
      (item: any) =>
        ({
          idvuelo: item.idvuelo,
          precio: item.preciovuelo,
          tarifa: item.tarifatemporada,
          descuento: item.descuento,
          distanciarecorrida: item.distanciarecorrida,
          fechadespegue: new Date(item.fechayhoradesalida).toLocaleDateString(),
          fechallegada: new Date(item.fechayhoradellegada).toLocaleDateString(),
          despegue: item.aeropuerto_Despegue.nombre,
          destino: item.aeropuerto_Destino.nombre,
          cupo: item.cupo ? "Disponible" : "No disponible",
          estado: item.estado.nombre,
          avion: item.avion.nombre,
          fecharegistro: new Date(item.fecharegistro).toLocaleDateString(),
        } || [])
    );

    console.log(dataTable);
    filteredData = dataTable.filter((item: any) => item.idvuelo.toString().includes(filter));
  }

  const columnTitles = [
    "Id",
    "Precio",
    "Tarifa",
    "Descuento",
    "Distancia recorrida",
    "Fecha de despegue",
    "Fecha de llegada",
    "Despegue",
    "Destino",
    "Cupo",
    "Estado",
    "Avión",
    "Fecha registro",
  ];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Visualizar paises</h1>
            <p className="text-muted-foreground">Aqui puedes ver los paises activos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input placeholder="Filtrar por id..." className="max-w-sm" value={filter} onChange={handleFilterChange} />
          </div>
          <div className="rounded-md border">
            <DataTable data={filteredData} columnTitles={columnTitles} />
          </div>
        </div>
      )}
    </div>
  );
};
