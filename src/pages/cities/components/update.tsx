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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Image } from "lucide-react";
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { DataTable } from "@/components/viewTable";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton";

export const UpdateCities = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Ciudades/GetAll");
  const regionsData = useGet("/FlyEaseApi/Regiones/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = ["Id de la ciudad", "Nombre de la ciudad", "Nombre de la region", "Fecha de registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const formSchema = z.object({
    nombre: z.string().min(2, {
      message: "country must be at least 2 characters.",
    }),
    associatedRegion: z.string({
      required_error: "Please select a region.",
    }),
    imagen: z.string().min(2, {
      message: "Please select an image to display.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      associatedRegion: "",
      imagen: "",
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedCity: any, city: any) => {
    const cityToUpdate = {
      idciudad: city.idciudad,
      nombre: updatedCity.nombre,
      imagen: updatedCity.imagen,
      region: {
        idregion: parseInt(updatedCity.associatedRegion.split(",")[0]),
        nombre: updatedCity.associatedRegion.split(",")[1],
        pais: {
          idpais: parseInt(updatedCity.associatedRegion.split(",")[2]),
          nombre: updatedCity.associatedRegion.split(",")[3],
        },
      },
    };

    const response = await apiRequest(cityToUpdate, `/FlyEaseApi/Ciudades/Put/${city.idciudad}`, "put");
    
    if (!response.error) {
      toast.success("Ciudad actualizada correctamente");
    } else {
      toast.error("Error al actualizar la ciudad");
    }
    mutate();
  };

  const handleRefreshClick = (ciudad: any) => {
    form.setValue("nombre", ciudad.nombre);
    form.setValue(
      "associatedRegion",
      `${ciudad.region.idregion},${ciudad.region.nombre},${ciudad.region.pais.idpais},${ciudad.region.pais.nombre}`
    );
    form.setValue("imagen", ciudad.imagen);
  };

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
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar ciudad</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCity) => handleUpdateClick(updatedCity, item))}
                    >
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
                      {/* 👇 Espacio para el select del acudiente */}
                      <FormField
                        control={form.control}
                        name="associatedRegion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Región asignada a la ciudad</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una región" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Regiones</SelectLabel>
                                  {regionsData.data.response.length > 0 ? (
                                    regionsData.data.response.map((region: any) => {
                                      return (
                                        <SelectItem
                                          key={region.idregion.toString()}
                                          value={`${region.idregion},${region.nombre},${region.pais.idpais},${region.pais.nombre}`}
                                        >
                                          {region?.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay paises activos</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de la imagen  */}
                      <FormField
                        control={form.control}
                        name="imagen"
                        render={() => (
                          <FormItem>
                            <FormLabel>Imagen de la ciudad</FormLabel>
                            <FormControl>
                              <Input
                                className="w-[280px]"
                                type="file"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                  const file = event.target.files?.[0];
                                  const maxSize = 102400; // 100kb
                                  if (file && file.size > maxSize) {
                                    alert("El archivo es demasiado grande");
                                    event.target.value = "";
                                  } else if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const arrayBuffer = reader.result;
                                      const byteArray = new Uint8Array(arrayBuffer as ArrayBuffer);
                                      const base64String = btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
                                      form.setValue("imagen", base64String); // Asigna el byte array convertido a base64 al valor del campo
                                    };
                                    reader.readAsArrayBuffer(file);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Nota: si no selecciona ningún archivo, la imagen actual persistirá
                            </FormDescription>
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar ciudad</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar las ciudades.</p>
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
