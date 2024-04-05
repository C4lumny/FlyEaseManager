import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";

export const ViewSeatsCategory = () => {
  const { data, loading } = useGet("/FlyEaseApi/Categorias/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    console.log(data.response);
    dataTable = data.response.map(
      (item: any) =>
        ({
          idcategoria: item.idcategoria,
          nombre: item.nombre,
          descripcion: item.descripcion,
          estado: item.estadocategoria ? "Activo" : "Inactivo",
          tarifa: item.tarifa,
          comercial: item.comercial ? "Si" : "No",
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idcategoria.toString().includes(filter));
  }

  const columnTitles = ["Id", "Nombre", "Descripcion", "Estado", "Tarifa", "Comercial", "Fecha de registro"];

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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar categoria de los asientos</h1>
            <p className="text-muted-foreground">Aqui puedes ver las categorias de los asientos.</p>
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
