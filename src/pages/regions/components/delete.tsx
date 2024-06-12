import { useState, ChangeEvent } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/viewTable";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton";

export const DeleteRegion = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Regiones/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idregion: item.idregion,
          nombre: item.nombre,
          nombrePais: item.pais.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          deleteCheckbox: (
            <Checkbox
              checked={item.idregion === selectedRegion}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idregion)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idregion.toString().includes(filter));
  }

  const columnTitles = ["Id de la region", "Nombre de la region", "Nombre del pais", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idregion: number) => {
    setSelectedRegion(idregion);
  };

  const handleDeleteClick = async () => {
    const idregion = selectedRegion;
    const response = await apiRequest(null, `/FlyEaseApi/Regiones/Delete/${idregion}`, "delete");
    mutate();

    if (!response.error) {
      toast.success("Región eliminada con exito");
    } else {
      toast.error("Error al eliminar la región");
    }
  };

//TODO: implementar un toaster (se encuentra en shadcn-ui) para mostrar un mensaje de exito o error al eliminar una region, y actualizar la tabla de regiones despues de eliminar una region

  return (
    <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eliminar regiones</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar las regiones.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por numero de identificacion..."
              className="max-w-sm"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="rounded-md border">
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
          <div className="flex w-full justify-end">
            <Button onClick={handleDeleteClick} variant="destructive">
              Borrar region
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};