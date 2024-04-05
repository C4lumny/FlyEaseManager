import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { DataTable } from "@/components/viewTable";

// Interfaces
interface Asientos {
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

// Esquema de validación
const formSchema = z.object({
  associatedCategory: z.string(),
  availability: z.boolean(),
});

export const UpdateSeats = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Asientos/GetAll");
  const categoryData = useGet("/FlyEaseApi/Categorias/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = ["Id", "Posicion", "Disponibilidad", "Categoria", "Avion", "Fecha de registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associatedCategory: "",
      availability: false,
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedSeat: any, seat: Asientos) => {
    const plane: Avion = (await apiRequest(null, `/FlyEaseApi/Aviones/GetById/${seat.avion.idavion}`, "get")).apiData;
    const seatToUpdate: Asientos = {
      idasiento: seat.idasiento,
      posicion: seat.posicion,
      disponibilidad: updatedSeat.availability,
      fecharegistro: seat.fecharegistro,
      avion: seat.avion,
      categoria: {
        idcategoria: parseInt(updatedSeat.associatedCategory),
        nombre: "",
        descripcion: "",
        estadocategoria: false,
        tarifa: 0,
        fecharegistro: new Date(),
        comercial: false,
      },
    };

    await apiRequest(seatToUpdate, `/FlyEaseApi/Asientos/Put/${seat.idasiento}`, "put");

    // Si el asiento pasa de comercial a no comercial, restar un pasajero al avión
    if (!seatToUpdate.categoria.comercial && seat.categoria.comercial) {
      plane.cantidadpasajeros -= 1;
    }

    // Si el asiento pasa de no comercial a comercial, sumar un pasajero al avión
    if (seatToUpdate.categoria.comercial && seat.categoria.comercial === false) {
      plane.cantidadpasajeros += 1;
    }

    await apiRequest(plane, `/FlyEaseApi/Aviones/Put/${plane.idavion}`, "put");

    mutate();
  };

  const handleRefreshClick = (seat: Asientos) => {
    form.setValue("associatedCategory", seat.categoria.idcategoria.toString());
    form.setValue("availability", seat.disponibilidad);
  };

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idasiento: item.idasiento,
          posicion: item.posicion,
          disponibilidad: item.disponibilidad ? "Activo" : "Inactivo",
          categoria: item.categoria.nombre,
          avion: item.avion.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar asiento</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedSeat) => handleUpdateClick(updatedSeat, item))}
                    >
                      {/* 👇 Espacio para el select del acudiente */}
                      <FormField
                        control={form.control}
                        name="associatedCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria del asiento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Categorias</SelectLabel>
                                  {categoryData.data.response.length > 0 ? (
                                    categoryData.data.response.map((category: any) => {
                                      return (
                                        <SelectItem value={`${category.idcategoria.toString()}`}>
                                          {category?.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay categorias activos</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>Seleccione la categoria asignada al asiento.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Disponibilidad</FormLabel>
                              <FormDescription>
                                Dale click al switch para cambiar la disponibilidad del asiento.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button type="submit">Actualizar y finalizar</Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          ),
        } || [])
    );

    filteredData = dataTable.filter((seat: any) => seat.avion.toLowerCase().includes(filter.toLowerCase()));
  }
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar asientos</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar los asientos.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input placeholder="Filtrar por id..." className="max-w-sm" value={filter} onChange={handleFilterChange} />
          </div>
          <div className="rounded-md border">
            <DataTable columnTitles={columnTitles} data={filteredData} />
          </div>
        </div>
      )}
    </div>
  );
};
