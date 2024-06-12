import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";

export const ViewAirports = () => {
  const { data, loading } = useGet("/FlyEaseApi/Aeropuertos/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idaereopuerto: item.idaereopuerto,
          nombre: item.nombre,
          latitud: item.coordenadas.latitud,
          longitud: item.coordenadas.longitud,
          nombreCiudad: item.ciudad.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idaereopuerto.toString().includes(filter));
  }

  const columnTitles = ["Id", "Nombre", "Latitud", "Longitud", "Ciudad", "Fecha de registro"];

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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar aeropuertos</h1>
            <p className="text-muted-foreground">Aqui puedes ver a los aeropuertos activos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por id..."
              className="max-w-sm"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="rounded-md border">
            <DataTable data={filteredData} columnTitles={columnTitles} />
          </div>
        </div>
      )}
    </div>
  );
};
