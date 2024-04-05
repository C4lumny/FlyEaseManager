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

export interface Asientos {
  idasiento: number;
  posicion: number;
  disponibilidad: boolean;
  fecharegistro: Date;
  avion: Avion;
  categoria: Categoria;
}

interface Avion {
  idavion: string;
  nombre: string;
  modelo: string;
  fabricante: string;
  velocidadpromedio: number;
  cantidadpasajeros: number;
  cantidadcarga: number;
  fecharegistro: Date;
  aereolinea: Aereolinea;
}

interface Aereolinea {
  idaereolinea: number;
  nombre: string;
  codigoiata: string;
  codigoicao: string;
  fecharegistro: Date;
}

interface Categoria {
  idcategoria: number;
  nombre: string;
  descripcion: string;
  estadocategoria: boolean;
  tarifa: number;
  fecharegistro: Date;
  comercial: boolean;
}

export const DeleteSeat = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Asientos/GetAll");
  const { apiRequest } = useRequest();
  const [filter, setFilter] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<Asientos>();
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  if (!loading) {
    dataTable = data.response.map(
      (seat: Asientos) =>
        ({
          deleteCheckbox: (
            <Checkbox
              checked={seat.idasiento === selectedSeat?.idasiento}
              className="w-4 h-4"
              onCheckedChange={() => handleCheckboxChange(seat)}
            />
          ),
          idasiento: seat.idasiento,
          posicion: seat.posicion,
          disponibilidad: seat.disponibilidad ? "Activo" : "Inactivo",
          categoria: seat.categoria.nombre,
          avion: seat.avion.nombre,
          fechaRegistro: new Date(seat.fecharegistro).toLocaleString(),
        } || [])
    );

    filteredData = dataTable.filter((seat: any) => seat.avion.toLowerCase().includes(filter.toLowerCase()));
  }

  const columnTitles = ["", "Id", "Posicion", "Disponibilidad", "Categoria", "Avion", "Fecha de registro"];

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.currentTarget.value);
  };

  const handleCheckboxChange = (seat: Asientos) => {
    setSelectedSeat(seat);
  };

  const handleDeleteClick = async () => {
    const selectedPlane = selectedSeat?.avion.nombre;
    const filteredSeats = data.response.filter((seat: Asientos) => seat.avion.nombre === selectedPlane);
    const sortedSeats = filteredSeats.sort((a: Asientos, b: Asientos) => a.idasiento - b.idasiento);
    const seat: Asientos = sortedSeats[sortedSeats.length - 1];
    await apiRequest(null, `/FlyEaseApi/Asientos/Delete/${seat.idasiento}`, "delete");
    const plane: Avion = (await apiRequest(null, `/FlyEaseApi/Aviones/GetById/${seat.avion.idavion}`, "get")).apiData;

    if (seat.categoria.comercial) {
      plane.cantidadpasajeros -= 1;
    }

    await apiRequest(plane, `/FlyEaseApi/Aviones/Put/${plane.idavion}`, "put");
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
            <h1 className="text-xl font-semibold tracking-tight">Eliminar asientos</h1>
            <p className="text-muted-foreground">Aquí puedes eliminar los asientos.</p>
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
