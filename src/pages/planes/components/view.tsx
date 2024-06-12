import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";

export const ViewPlanes = () => {
  const { data, loading } = useGet("/FlyEaseApi/Aviones/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idavion: item.idavion,
          nombre: item.nombre,
          modelo: item.modelo,
          fabricante: item.fabricante,
          velocidadpromedio: item.velocidadpromedio,
          cantidadpasajeros: item.cantidadpasajeros,
          cantidadcarga: item.cantidadcarga,
          aerolinea: item.aereolinea.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.nombre.toString().includes(filter));
  }

  const columnTitles = [
    "Id",
    "Nombre",
    "Modelo",
    "Fabricante",
    "Valocidad (Km/h)",
    "Cantidad pasajeros",
    "Cantidad carga (Kg)",
    "Aerolinea",
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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar aviones</h1>
            <p className="text-muted-foreground">Aqui puedes ver a los aviones activos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por nombre..."
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
