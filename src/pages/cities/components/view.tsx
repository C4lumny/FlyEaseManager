import { ChangeEvent, useState } from "react";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/viewTable";
import { Image } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ViewCities = () => {
  const { data, loading } = useGet("/FlyEaseApi/Ciudades/GetAll");
  const [filter, setFilter] = useState<string>("");
  let dataTable: string[] = [];
  let filteredData: string[] = [];
  console.log(Image);

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
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
    filteredData = dataTable.filter((item: any) => item.idciudad.toString().includes(filter));
  }

  const columnTitles = ["Id de la ciudad", "Nombre de la ciudad", "Nombre de la region", "Fecha de registro"];

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
            <h1 className="text-xl font-semibold tracking-tight">Visualizar ciudades</h1>
            <p className="text-muted-foreground">Aqui puedes ver las ciudades activos.</p>
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
