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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image } from "lucide-react";

export const DeleteCity = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Ciudades/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedCity, setSelectedCity] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          deleteCheckbox: (
            <Checkbox
              checked={item.idciudad === selectedCity}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idciudad)}
            />
            // <Checkbox className="w-4 h-4" />
          ),
          idciudad: item.idciudad,
          nombre: item.nombre,
          nombreRegion: item.region.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          imagen: (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Image className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>
                  <img className="w-96 h-72" src={`data:image/jpeg;base64,${item.imagen}`} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        } || [])
    );

    console.log(dataTable);
    filteredData = dataTable.filter((item: any) => item.nombre.toString().includes(filter));
  }

  const columnTitles = ["","Id de la ciudad", "Nombre de la ciudad", "Nombre de la region", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idciudad: number) => {
    setSelectedCity(idciudad);
  };

  const handleDeleteClick = async () => {
    const idciudad = selectedCity;
    await apiRequest(null, `/FlyEaseApi/Ciudades/Delete/${idciudad}`, "delete");
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
            <h1 className="text-xl font-semibold tracking-tight">Eliminar ciudades</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar las ciudades.</p>
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
              Borrar ciudad
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
