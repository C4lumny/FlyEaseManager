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
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { DataTable } from "@/components/viewTable";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/table-skeleton";

export const UpdateCountries = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Paises/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = ["Id del pais", "Nombre del pais", "Fecha de registro"];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const formSchema = z.object({
    nombre: z.string().min(2, {
      message: "country must be at least 2 characters.",
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

  const handleUpdateClick = async (updatedCountry: any, country: any) => {
    const countryToUpdate = {
      idpais: parseInt(country.idpais),
      nombre: updatedCountry.nombre,
      fecharegistro: country.fecharegistro,
    };

    const response = await apiRequest(countryToUpdate, `/FlyEaseApi/Paises/Put/${country.idpais}`, "put");
    if (!response.error) {
      toast.success("País actualizado correctamente");
    } else {
      toast.error("Error al actualizar el país");
    }
    mutate();
  };

  const handleRefreshClick = (pais: any) => {
    form.setValue("nombre", pais.nombre);
  };

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idpais: item.idpais,
          nombre: item.nombre,
          fechaRegistro: new Date(item.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Actualizar pais</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCountry) => handleUpdateClick(updatedCountry, item))}
                    >
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Colombia" {...field} />
                            </FormControl>
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

    filteredData = dataTable.filter((item: any) => item.idpais.toString().includes(filter));
  }
  return (
    <div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Actualizar paises</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar los paises.</p>
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
