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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Clientes {
  numerodocumento: string;
  tipodocumento: string;
  nombres: string;
  apellidos: string;
  celular: string;
  correo: string;
  fecharegistro: Date;
}

export const DeleteCostumers = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Clientes/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedCostumer, setSelectedCostumer] = useState<Clientes>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (costumer: Clientes) =>
        ({
          deleteCheckbox: (
            <Checkbox
              checked={costumer.numerodocumento === selectedCostumer?.numerodocumento}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(costumer)}
            />
          ),
          document: costumer.numerodocumento,
          tipodocumento: costumer.tipodocumento,
          nombre: costumer.nombres,
          apellidos: costumer.apellidos,
          celular: costumer.celular,
          correo: costumer.correo,
          fechaRegistro: new Date(costumer.fecharegistro).toLocaleString(),
        } || [])
    );

    console.log(dataTable);
    filteredData = dataTable.filter((costumer: any) => costumer.nombre.toLowerCase().includes(filter.toLowerCase()));
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

  const handleCheckboxChange = (costumer: Clientes) => {
    setSelectedCostumer(costumer);
  };

  const handleDeleteClick = async () => {
    await apiRequest(null, `/FlyEaseApi/Clientes/Delete/${selectedCostumer?.numerodocumento}`, "delete");
    mutate();
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
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eliminar clientes</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar los clientes.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por nombre del avion..."
              className="max-w-sm"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="rounded-md border">
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
          <div className="flex w-full justify-end">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Borrar asiento</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Seguro que quieres borrar el asiento?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ten en cuenta que se eliminará el ultimo asiento del avión seleccionado!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClick}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};
