import { useState, ChangeEvent } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/viewTable";
import { TableSkeleton } from "@/components/table-skeleton";
import { toast } from "sonner";

export const DeletePlane = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Aviones/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          deleteCheckbox: (
            <Checkbox
              checked={item.idavion === selectedAirport}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idavion)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
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
    "",
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

  const handleCheckboxChange = (idavion: number) => {
    setSelectedAirport(idavion);
  };

  const handleDeleteClick = async () => {
    const idavion = selectedAirport;
    const response = await apiRequest(null, `/FlyEaseApi/Aviones/Delete/${idavion}`, "delete");
    mutate();

    if (!response.error) {
      toast.success("Avión eliminado con exito");
    } else {
      toast.error("Error al eliminar el avión");
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
            <h1 className="text-xl font-semibold tracking-tight">Eliminar aviones</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar los aviones.</p>
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
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
          <div className="flex w-full justify-end">
            <Button onClick={handleDeleteClick} variant="destructive">
              Borrar avion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
