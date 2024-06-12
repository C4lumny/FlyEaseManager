import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequest } from "@/hooks/useApiRequest";
// 👇 UI imports
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  nombre: z
    .string({ required_error: "Por favor ingrese un nombre" })
    .min(1, {
      message: "El nombre de la aerolinea debe tener al menos 2 caracteres.",
    })
    .max(20, {
      message: "El nombre no debe tener más de 20 caracteres",
    }),
  codigoiata: z
    .string({ required_error: "Por favor ingrese un codigo IATA" })
    .min(2, { message: "El codigo IATA debe contener unicamente 2 caracteres" })
    .max(2, {
      message: "El codigo IATA debe contener unicamente 2 caracteres",
    }),
  codigoicao: z
    .string({ required_error: "Por favor ingrese un codigo ICAO" })
    .min(3, { message: "El codigo ICAO debe contener unicamente 3 caracteres" })
    .max(3, {
      message: "El codigo ICAO debe contener unicamente 3 caracteres",
    }),
});

export const CreateAirlines = () => {
  const { apiRequest } = useRequest();
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      codigoiata: "",
      codigoicao: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsResponseLoading(true);
    const airlineData = {
      nombre: values.nombre,
      codigoiata: values.codigoiata,
      codigoicao: values.codigoicao,
    };

    const response = await apiRequest(airlineData, "/FlyEaseApi/Aerolineas/Post", "post");

    if (!response.error) {
      setIsResponseLoading(false);
      toast.success("Aerolínea creado con éxito");
      form.reset();
    } else {
      setIsResponseLoading(false);
      toast.error("Error al crear el aerolínea", {});
    }
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Crear aerolineas
        </h1>
        <p className="text-muted-foreground">
          Aqui puedes crear las aerolineas que desees para tu sistema.
        </p>
      </div>
      <Separator className="mt-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 👇 Espacio para el input del nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la aerolinea</FormLabel>
                <FormControl>
                  <Input placeholder="AireLatam" {...field} />
                </FormControl>
                <FormDescription>
                  El nombre de la aerolinea a ingresar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 👇 Espacio para el input del codigo IATA  */}
          <FormField
            control={form.control}
            name="codigoiata"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo IATA de la aerolinea</FormLabel>
                <FormControl>
                  <Input placeholder="AI" {...field} />
                </FormControl>
                <FormDescription>
                  El codigo IATA de la aerolinea a ingresar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* 👇 Espacio para el input del codigo ICAO  */}
          <FormField
            control={form.control}
            name="codigoicao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo ICAO de la aerolinea</FormLabel>
                <FormControl>
                  <Input placeholder="AIR" {...field} />
                </FormControl>
                <FormDescription>
                  El codigo ICAO de la aerolinea a ingresar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isResponseLoading}>
            {isResponseLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear
          </Button>
        </form>
      </Form>
    </>
  );
};
