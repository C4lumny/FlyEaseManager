import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { DataTable } from "@/components/viewTable";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton";

const formSchema = z.object({
  // Validaciones para el id
  idavion: z
    .string({ required_error: "Por favor ingrese un id" })
    .min(1, {
      message: "El id debe tener al menos 1 caracter.",
    })
    .max(10, {
      message: "El id no puede tener mas de 10 caracteres.",
    }),
  // Validaciones para el nombre
  nombre: z
    .string({ required_error: "Por favor ingrese un nombre" })
    .min(1, {
      message: "country must be at least 2 characters.",
    })
    .max(20, {
      message: "El nombre no debe tener más de 20 caracteres",
    }),
  modelo: z.string().min(1).max(20),
  fabricante: z.string().min(1).max(40),
  velocidadpromedio: z.number().min(0),
  cantidadcarga: z.number().min(0),
  cantidadpasajeros: z.number().min(0),
  associatedAirline: z.string({
    required_error: "Please select an airline.",
  }),
});

export const UpdatePlanes = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Aviones/GetAll");
  const airlinesData = useGet("/FlyEaseApi/Aerolineas/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = [
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
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idavion: "",
      nombre: "",
      fabricante: "",
      modelo: "",
      velocidadpromedio: 0,
      cantidadcarga: 0,
      cantidadpasajeros: 0,
      associatedAirline: "",
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedPlane: any, plane: any) => {
    const planeToUpdate = {
      idavion: updatedPlane.idavion,
      nombre: updatedPlane.nombre,
      modelo: updatedPlane.modelo,
      fabricante: updatedPlane.fabricante,
      velocidadpromedio: updatedPlane.velocidadpromedio,
      cantidadpasajeros: updatedPlane.cantidadasientoscomerciales,
      cantidadcarga: updatedPlane.cantidadcarga,
      fecharegistro: new Date().toISOString(),
      aereolinea: (await apiRequest(null, `/FlyEaseApi/Aerolineas/GetById/${updatedPlane.associatedAirline}`, "get"))
        .apiData,
    };
    const response = await apiRequest(planeToUpdate, `/FlyEaseApi/Aviones/Put/${plane.idavion}`, "put");
    if (!response.error) {
      toast.success("Avión actualizado correctamente");
    } else {
      toast.error("Error al actualizar el avión");
    }
    mutate();
  };

  const handleRefreshClick = (plane: any) => {
    form.setValue("idavion", plane.idavion);
    form.setValue("nombre", plane.nombre);
    form.setValue("modelo", plane.modelo);
    form.setValue("fabricante", plane.fabricante);
    form.setValue("velocidadpromedio", plane.velocidadpromedio);
    form.setValue("cantidadpasajeros", plane.cantidadpasajeros);
    form.setValue("cantidadcarga", plane.cantidadcarga);
    form.setValue("associatedAirline", `${plane.aereolinea.idaereolinea}`);
  };

  const handleInputChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || value === ".") {
      field.onChange(value);
    } else {
      field.onChange(value);
    }
  };

  const handleInputBlur = (field: any) => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    field.onChange(value === "" ? 0 : parseFloat(value));
  };

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idavion: item.idavion,
          nombre: item.nombre,
          modelo: item.modelo,
          fabricante: item.fabricante,
          velocidadpromedio: item.velocidadpromedio,
          cantidadpasajeros: item.cantidadpasajeros,
          cantidadcarga: item.cantidadcarga,
          aerolinea: item.aereolinea.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent className="overflow-auto">
                <SheetHeader>
                  <SheetTitle>Actualizar avion</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCity) => handleUpdateClick(updatedCity, item))}
                    >
                      {/* 👇 Espacio para el input del ID avion  */}
                      <FormField
                        control={form.control}
                        name="idavion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID del aeropuerto</FormLabel>
                            <FormControl>
                              <Input placeholder="AV123" {...field} />
                            </FormControl>
                            <FormDescription>El ID del avion a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de nombre  */}
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del avión</FormLabel>
                            <FormControl>
                              <Input placeholder="Avianca 789" {...field} />
                            </FormControl>
                            <FormDescription>El nombre del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input del modelo  */}
                      <FormField
                        control={form.control}
                        name="modelo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo del avión</FormLabel>
                            <FormControl>
                              <Input placeholder="Airbus A321" {...field} />
                            </FormControl>
                            <FormDescription>El modelo del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input del modelo  */}
                      <FormField
                        control={form.control}
                        name="fabricante"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fabricante del avión</FormLabel>
                            <FormControl>
                              <Input placeholder="Airbus A321" {...field} />
                            </FormControl>
                            <FormDescription>El modelo del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la velocidad promedio  */}
                      <FormField
                        control={form.control}
                        name="velocidadpromedio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Velocidad promedio del avión en km/h</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="270"
                                {...field}
                                onChange={handleInputChange(field)}
                                onBlur={handleInputBlur(field)}
                              />
                            </FormControl>
                            <FormDescription>La velocidad promedio del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la cantidad de carga */}
                      <FormField
                        control={form.control}
                        name="cantidadcarga"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad de carga del Avión en Kg</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="270"
                                {...field}
                                onChange={handleInputChange(field)}
                                onBlur={handleInputBlur(field)}
                              />
                            </FormControl>
                            <FormDescription>La cantidad de carga del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la cantidad de asientos comerciales  */}
                      <FormField
                        control={form.control}
                        name="cantidadpasajeros"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad de pasajeros del avión</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="50"
                                {...field}
                                onChange={handleInputChange(field)}
                                onBlur={handleInputBlur(field)}
                                disabled={true}
                              />
                            </FormControl>
                            <FormDescription>La Cantidad de pasajeros del avión a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el select de la aerolinea */}
                      <FormField
                        control={form.control}
                        name="associatedAirline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Aerolinea asignada al aeropuerto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una aerolinea" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Aerolineas</SelectLabel>
                                  {airlinesData.data.response.length > 0 ? (
                                    airlinesData.data.response.map((aerolinea: any) => {
                                      return (
                                        <SelectItem value={`${aerolinea.idaereolinea.toString()}`}>
                                          {aerolinea?.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay aerolineas activos</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>Seleccione la aerolinea que se asignará al aeropuerto.</FormDescription>
                            <FormMessage />
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

    filteredData = dataTable.filter((item: any) => item.nombre.toString().includes(filter));
  }
  return (
    <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Actualizar aviones</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar los aviones.</p>
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
        </div>
      )}
    </div>
  );
};
