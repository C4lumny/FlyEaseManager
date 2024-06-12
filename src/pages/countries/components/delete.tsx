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

export const DeleteCountry = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Paises/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<number>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idpais: item.idpais,
          nombre: item.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          deleteCheckbox: (
            <Checkbox
              checked={item.idpais === selectedCountry}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(item.idpais)}
            />
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idpais.toString().includes(filter));
  }

  const columnTitles = ["Id del pais", "Nombre del pais", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (idpais: number) => {
    setSelectedCountry(idpais);
  };

  const handleDeleteClick = async () => {
    const idregion = selectedCountry;
    const response = await apiRequest(null, `/FlyEaseApi/Paises/Delete/${idregion}`, "delete");
    mutate();
    if (!response.error) {
      toast.success("País eliminado con éxito");
    } else {
      toast.error("Error al eliminar el país");
    }
  };

  return (
    <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eliminar pais</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar paises.</p>
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
              Borrar pais
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};