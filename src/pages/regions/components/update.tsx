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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

export const UpdateRegions = () => {
  const { data, loading } = useGet("/FlyEaseApi/Regiones/GetAll");
  const countriesData = useGet("/FlyEaseApi/Paises/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = ["Id de la region", "Nombre de la region", "Nombre del pais", "Fecha de registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const formSchema = z.object({
    nombre: z.string().min(2, {
      message: "country must be at least 2 characters.",
    }),
    pais: z.string({
      required_error: "Please select a country to display.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedRegion: any, region: any) => {
    const regionToUpdate = {
      idregion: region.idregion,
      nombre: updatedRegion.nombre,
      fecharegistro: region.fecharegistro,
      pais: {
        idpais: parseInt(updatedRegion.pais.split(",")[0]),
        nombre: updatedRegion.pais.split(",")[1],
        fecharegistro: region.pais.fecharegistro,
      },
    };
    await apiRequest(regionToUpdate, `/FlyEaseApi/Regiones/Put/${region.idregion}`, "put");
  };

  const handleRefreshClick = (region: any) => {
    form.setValue("nombre", region.nombre);
    form.setValue("pais", `${region.pais.idpais},${region.pais.nombre}`);
  };

  if (!loading) {
    console.log(countriesData);
    dataTable = data.response.map(
      (item: any) =>
        ({
          idregion: item.idregion,
          nombre: item.nombre,
          nombrePais: item.pais.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar region</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedSubject) => handleUpdateClick(updatedSubject, item))}
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
                      {/* 👇 Espacio para el select de paises */}
                      <FormField
                        control={form.control}
                        name="pais"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pais asignado a la región</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione un pais" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Paises</SelectLabel>
                                  {countriesData.data.response.length > 0 ? (
                                    countriesData.data.response.map((country: any) => {
                                      return (
                                        <SelectItem
                                          key={country.idpais.toString()}
                                          value={`${country.idpais},${country.nombre}`}
                                        >
                                          {country.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay paises registrados</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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

    filteredData = dataTable.filter((item: any) => item.idregion.toString().includes(filter));
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar region</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar a las regiones.</p>
          </div>
          <Separator className="my-5" />
          <div className="flex items-center py-4">
            <Input
              placeholder="Filtrar por cédula..."
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
