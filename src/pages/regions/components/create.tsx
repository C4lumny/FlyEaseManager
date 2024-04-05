import { useGet } from "@/hooks/useGet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export const CreateRegions = () => {
  const { apiRequest } = useRequest();
  const { data, loading } = useGet("/FlyEaseApi/Paises/GetAll");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const regionData = {
      nombre: values.nombre,
      pais: {
        idpais: parseInt(values.associatedCountry.split(",")[0]),
        nombre: values.associatedCountry.split(",")[1],
      },
    };
    await apiRequest(regionData, "/FlyEaseApi/Regiones/Post", "post");
  };

  const formSchema = z.object({
    nombre: z.string().min(2, {
      message: "country must be at least 2 characters.",
    }),
    associatedCountry: z.string({
      required_error: "Please select an email to display.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  return (
    <>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Crear regiones</h1>
            <p className="text-muted-foreground">Aqui puedes crear las regiones que desees para tu sistema.</p>
          </div>
          <Separator className="mt-8" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 👇 Espacio para el input de nro_documento  */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la región</FormLabel>
                    <FormControl>
                      <Input placeholder="Cordoba" {...field} />
                    </FormControl>
                    <FormDescription>El nombre de la región a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el select del acudiente */}
              <FormField
                control={form.control}
                name="associatedCountry"
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
                          {data.response.length > 0 ? (
                            data.response.map((country: any) => {
                              return (
                                <SelectItem value={`${country.idpais.toString()},${country.nombre}`}>
                                  {country?.nombre}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div>No hay paises activos</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione el pais que se asignará a la región.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
};
