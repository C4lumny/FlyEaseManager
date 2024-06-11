import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";

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
          distanciarecorrida: `${parseFloat(item.distanciarecorrida).toFixed(2)} km`,
          fechadespegue: new Date(item.fechayhoradesalida).toLocaleDateString(),
          fechallegada: new Date(item.fechayhorallegada).toLocaleDateString(),
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
        <TableSkeleton />
      ) : (
        <div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Visualizar vuelos</h1>
            <p className="text-muted-foreground">Aqui puedes ver los vuelos activos.</p>
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
