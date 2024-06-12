import { ChangeEvent, useState } from "react";
import { Boletos } from "@/interfaces/tickets.interfaces";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";

export const ViewTickets = () => {
  const { data, loading } = useGet("/FlyEaseApi/Boletos/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: Boletos) =>
        ({
          idboleto: item.idboleto,
          precio: item.precio,
          descuento: item.descuento,
          precioTotal: item.preciototal,
          documento: item.cliente.numerodocumento,
          asiento: item.asiento.idasiento,
          categoria: item.asiento.categoria.nombre,
          vuelo: item.vuelo.idvuelo,
          fechasalida: new Date(item.vuelo.fechayhoradesalida).toLocaleTimeString(),
          avion: item.asiento.avion.nombre,
          fecharegistro: new Date(item.fecharegistro).toLocaleTimeString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.documento.toString().includes(filter));
  }

  const columnTitles = [
    "Id",
    "Precio",
    "Descuento",
    "Precio total",
    "Documento",
    "Asiento",
    "Categoria",
    "Vuelo",
    "Fecha de salida",
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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar boletos</h1>
            <p className="text-muted-foreground">Aqui puedes ver los boletos activos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por numero de documento del cliente..."
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
