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
  nombre: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  associatedCity: z.string({
    required_error: "Please select a region.",
  }),
});

export const UpdateAirports = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Aeropuertos/GetAll");
  const citiesData = useGet("/FlyEaseApi/Ciudades/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = ["Id", "Nombre", "Latitud", "Longitud", "Ciudad", "Fecha de registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      associatedCity: "",
      latitud: 0,
      longitud: 0,
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedAirport: any, airport: any) => {
    const airportToUpdate = {
      nombre: updatedAirport.nombre,
      ciudad: {
        idciudad: parseInt(updatedAirport.associatedCity.split(",")[0]),
        nombre: updatedAirport.associatedCity.split(",")[1],
        region: {
          idregion: parseInt(updatedAirport.associatedCity.split(",")[2]),
          nombre: updatedAirport.associatedCity.split(",")[3],
          pais: {
            idpais: parseInt(updatedAirport.associatedCity.split(",")[4]),
            nombre: updatedAirport.associatedCity.split(",")[5],
          },
        },
      },
      coordenadas: {
        longitud: updatedAirport.longitud,
        latitud: updatedAirport.latitud,
      },
    };
    const response = await apiRequest(airportToUpdate, `/FlyEaseApi/Aeropuertos/Put/${airport.idaereopuerto}`, "put");
    
    if (!response.error) {
      toast.success("Vuelo actualizado correctamente");
    } else {
      toast.error("Error al actualizar el vuelo");
    }
    mutate();
  };

  const handleRefreshClick = (airport: any) => {
    form.setValue("nombre", airport.nombre);
    form.setValue("longitud", airport.coordenadas.longitud);
    form.setValue("latitud", airport.coordenadas.latitud);
    form.setValue(
      "associatedCity",
      `${airport.ciudad.idciudad},${airport.ciudad.nombre},${airport.ciudad.region.idregion},${airport.ciudad.region.nombre}, ${airport.ciudad.region.pais.idpais},${airport.ciudad.region.pais.nombre}`
    );
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
          idaereopuerto: item.idaereopuerto,
          nombre: item.nombre,
          latitud: item.coordenadas.latitud,
          longitud: item.coordenadas.longitud,
          nombreCiudad: item.ciudad.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar aeropuerto</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCity) => handleUpdateClick(updatedCity, item))}
                    >
                      {/* 👇 Espacio para el input de nombre */}
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nro de documento" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la longitud  */}
                      <FormField
                        control={form.control}
                        name="longitud"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitud de la ubicación del aeropuerto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10.4833"
                                {...field}
                                onChange={handleInputChange(field)}
                                onBlur={handleInputBlur(field)}
                              />
                            </FormControl>
                            <FormDescription>La latitud de del aeropuerto a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la latitud  */}
                      <FormField
                        control={form.control}
                        name="latitud"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitud de la ubicación del aeropuerto</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="10.4833"
                                {...field}
                                onChange={handleInputChange(field)}
                                onBlur={handleInputBlur(field)}
                              />
                            </FormControl>
                            <FormDescription>La latitud del aeropuerto a ingresar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el select del acudiente */}
                      <FormField
                        control={form.control}
                        name="associatedCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad asignada al aeropuerto</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una ciudad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Ciudades</SelectLabel>
                                  {citiesData.data.response.length > 0 ? (
                                    citiesData.data.response.map((ciudad: any) => {
                                      return (
                                        <SelectItem
                                          value={`${ciudad.idciudad.toString()},${
                                            ciudad.nombre
                                          },${ciudad.region.idregion.toString()},${
                                            ciudad.region.nombre
                                          }, ${ciudad.region.pais.idpais.toString()},${ciudad.region.pais.nombre}`}
                                        >
                                          {ciudad?.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay paises activos</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>Seleccione la ciudad que se asignará al aeropuerto.</FormDescription>
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar aeropuerto</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar los aeropuertos.</p>
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
