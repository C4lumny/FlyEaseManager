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
import { toast } from "sonner";
import { FormSkeleton } from "@/components/form-skeleton";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";

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

export const CreateAirports = () => {
  const { apiRequest } = useRequest();
  const { data, loading } = useGet("/FlyEaseApi/Ciudades/GetAll");
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      associatedCity: "",
      latitud: 0,
      longitud: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsResponseLoading(true);
    const cityData = {
      nombre: values.nombre,
      ciudad: {
        idciudad: parseInt(values.associatedCity.split(",")[0]),
        nombre: values.associatedCity.split(",")[1],
        region: {
          idregion: parseInt(values.associatedCity.split(",")[2]),
          nombre: values.associatedCity.split(",")[3],
          pais: {
            idpais: parseInt(values.associatedCity.split(",")[4]),
            nombre: values.associatedCity.split(",")[5],
          },
        },
      },
      coordenadas: {
        longitud: values.longitud,
        latitud: values.latitud,
      },
    };

    const response = await apiRequest(cityData, "/FlyEaseApi/Aeropuertos/Post", "post");

    if (!response.error) {
      setIsResponseLoading(false);
      toast.success("Aeropuerto creado con exito");
      form.reset();
    } else {
      setIsResponseLoading(false);
      toast.error("Error al crear el aeropuerto", {});
    }
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

  return (
    <>
      {loading ? (
        <FormSkeleton />
      ) : (
        <>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Crear aeropuertos</h1>
            <p className="text-muted-foreground">Aqui puedes crear los aeropuertos que desees para tu sistema.</p>
          </div>
          <Separator className="mt-8" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 👇 Espacio para el input de nombre  */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del aeropuerto</FormLabel>
                    <FormControl>
                      <Input placeholder="Valledupar" {...field} />
                    </FormControl>
                    <FormDescription>El nombre de la ciudad a ingresar.</FormDescription>
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
              {/* 👇 Espacio para el select de la ciudad */}
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
                          {data.response.length > 0 ? (
                            data.response.map((ciudad: any) => {
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
              <Button type="submit" disabled={isResponseLoading}>
                {isResponseLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Crear
              </Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
};
