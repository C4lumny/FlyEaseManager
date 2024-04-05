import { useState, ChangeEvent } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/viewTable";

export const DeleteAirport = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Aeropuertos/GetAll");
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
              checked={item.idaereopuerto === selectedAirport}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idaereopuerto)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
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

  const columnTitles = ["", "Id", "Nombre", "Latitud", "Longitud", "Ciudad", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idciudad: number) => {
    setSelectedAirport(idciudad);
  };

  const handleDeleteClick = async () => {
    const idciudad = selectedAirport;
    await apiRequest(null, `/FlyEaseApi/Aeropuertos/Delete/${idciudad}`, "delete");
    mutate();
  };

  //TODO: implementar un toaster (se encuentra en shadcn-ui) para mostrar un mensaje de exito o error al eliminar una region, y actualizar la tabla de regiones despues de eliminar una region

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
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eliminar aeropuertos</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar los aeropuertos.</p>
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
              Borrar aeropuerto
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
