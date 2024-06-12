import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";

export interface Clientes {
  numerodocumento: string;
  tipodocumento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;
  fecharegistro: Date;
}

export const ViewCostumers = () => {
  const { data, loading } = useGet("/FlyEaseApi/Clientes/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (client: Clientes) =>
        ({
          document: client.numerodocumento,
          tipodocumento: client.tipodocumento,
          nombre: client.nombres,
          apellidos: client.apellidos,
          celular: client.celular,
          correo: client.correo,
          fechaRegistro: new Date(client.fecharegistro).toLocaleString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.nombre.toLowerCase().includes(filter.toLowerCase()));
  }

  const columnTitles = [
    "Documento",
    "Tipo de documento",
    "Nombres",
    "Apellidos",
    "Celular",
    "Correo",
    "Fecha de registro",
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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar clientes</h1>
            <p className="text-muted-foreground">Aqui puedes ver los clientes activos.</p>
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
