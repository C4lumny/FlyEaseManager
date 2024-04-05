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


export const CreateCities = () => {
  const { apiRequest } = useRequest();
  const { data, loading } = useGet("/FlyEaseApi/Regiones/GetAll");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      associatedRegion: "",
      imagen: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const cityData = {
      nombre: values.nombre,
      imagen: values.imagen,
      region: {
        idregion: parseInt(values.associatedRegion.split(",")[0]),
        nombre: values.associatedRegion.split(",")[1],
        pais: {
          idpais: parseInt(values.associatedRegion.split(",")[2]),
          nombre: values.associatedRegion.split(",")[3],
        },
      },
    };
    await apiRequest(cityData, "/FlyEaseApi/Ciudades/Post", "post");
  };

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
            <h1 className="text-xl font-semibold tracking-tight">Crear ciudades</h1>
            <p className="text-muted-foreground">Aqui puedes crear las ciudades que desees para tu sistema.</p>
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
                    <FormLabel>Nombre de la ciudad</FormLabel>
                    <FormControl>
                      <Input placeholder="Valledupar" {...field} />
                    </FormControl>
                    <FormDescription>El nombre de la ciudad a ingresar.</FormDescription>
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
                    <FormDescription>La imagen de la ciudad a ingresar.</FormDescription>
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
                          {data.response.length > 0 ? (
                            data.response.map((region: any) => {
                              return (
                                <SelectItem
                                  value={`${region.idregion.toString()},${region.nombre},${region.pais.idpais},${
                                    region.pais.nombre
                                  }`}
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
