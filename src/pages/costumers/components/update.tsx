import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
import { Clientes } from "@/interfaces/customer.interfaces";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { useGet } from "@/hooks/useGet";
import { Skeleton } from "@/components/ui/skeleton";
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

const formSchema = z.object({
  documento: z.string().min(5, {}).max(15, {}),
  tipodocumento: z.string(),
  nombres: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
  apellidos: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
  celular: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
  correo: z
    .string()
    .min(2, {
      message: "country must be at least 2 characters.",
    })
    .email({ message: "Ingrese un correo válido" }),
});

export const UpdateCostumers = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Clientes/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  const columnTitles = [
    "Documento",
    "Tipo de documento",
    "Nombres",
    "Apellidos",
    "Celular",
    "Correo",
    "Fecha de registro",
  ];
  let dataTable: string[] = [];
  let filteredData: string[] = [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documento: "",
      tipodocumento: "",
      nombres: "",
      apellidos: "",
      celular: "",
      correo: "",
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedCustomer: any, customer: Clientes) => {
    const customerToUpdate: Clientes = {
      numerodocumento: updatedCustomer.documento,
      tipodocumento: updatedCustomer.tipodocumento,
      nombres: updatedCustomer.nombres,
      apellidos: updatedCustomer.apellidos,
      celular: updatedCustomer.celular,
      correo: updatedCustomer.correo,
      fecharegistro: customer.fecharegistro,
    };

    await apiRequest(customerToUpdate, `/FlyEaseApi/Clientes/Put/${customer.numerodocumento}`, "put");
    mutate();
  };

  const handleRefreshClick = (costumer: Clientes) => {
    form.setValue("documento", costumer.numerodocumento);
    form.setValue("tipodocumento", costumer.tipodocumento);
    form.setValue("nombres", costumer.nombres);
    form.setValue("apellidos", costumer.apellidos);
    form.setValue("celular", costumer.celular);
    form.setValue("correo", costumer.correo);
  };

  const handleInputChange = (field: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9]+$/.test(value)) {
      field.onChange(value);
    }
  };

  if (!loading) {
    dataTable = data.response.map(
      (customer: Clientes) =>
        ({
          document: customer.numerodocumento,
          tipodocumento: customer.tipodocumento,
          nombre: customer.nombres,
          apellidos: customer.apellidos,
          celular: customer.celular,
          correo: customer.correo,
          fechaRegistro: new Date(customer.fecharegistro).toLocaleString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(customer)} />
              </SheetTrigger>
              <SheetContent className="overflow-auto">
                <SheetHeader>
                  <SheetTitle>Actualizar cliente</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCustomer) => handleUpdateClick(updatedCustomer, customer))}
                    >
                      {/* 👇 Espacio para el input de numero de documento */}
                      <FormField
                        control={form.control}
                        name="documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nro de documento</FormLabel>
                            <FormControl>
                              <Input placeholder="10XXXXXXXX" {...field} onChange={handleInputChange(field)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el select de tipo documento */}
                      <FormField
                        control={form.control}
                        name="tipodocumento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de documento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una ciudad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Tipo de documento</SelectLabel>
                                  <SelectItem value="CC">Cedula de ciudadania</SelectItem>
                                  <SelectItem value="CE">Cedula de extranjeria</SelectItem>
                                  <SelectItem value="TI">Tarjeta de identidad</SelectItem>
                                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>Seleccione el tipo de documento del cliente.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input del nombres  */}
                      <FormField
                        control={form.control}
                        name="nombres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del cliente</FormLabel>
                            <FormControl>
                              <Input placeholder="Victor Julian" {...field} />
                            </FormControl>
                            <FormDescription>Nombre del cliente a actualizar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de apellidos */}
                      <FormField
                        control={form.control}
                        name="apellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos del cliente</FormLabel>
                            <FormControl>
                              <Input placeholder="Torres Santos" {...field} />
                            </FormControl>
                            <FormDescription>Apellidos del cliente a actualizar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de celular */}
                      <FormField
                        control={form.control}
                        name="celular"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular del cliente</FormLabel>
                            <FormControl>
                              <Input placeholder="3012351234" {...field} onChange={handleInputChange(field)} />
                            </FormControl>
                            <FormDescription>Celular del cliente a actualizar.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* 👇 Espacio para el input de correo */}
                      <FormField
                        control={form.control}
                        name="correo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo del cliente</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@example.com" {...field} />
                            </FormControl>
                            <FormDescription>Correo del cliente a actualizar.</FormDescription>
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
