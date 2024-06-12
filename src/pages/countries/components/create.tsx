import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequest } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "country must be at least 2 characters.",
  }),
});

export const CreateCountries = () => {
  const { apiRequest } = useRequest();
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsResponseLoading(true);
    const response = await apiRequest(values, "/FlyEaseApi/Paises/Post", "post");

    if (!response.error) {
      setIsResponseLoading(false);
      toast.success("País creado con exito");
      form.reset();
    } else {
      setIsResponseLoading(false);
      toast.error("Error al crear el país", {});
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
    },
  });

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Crear paises</h1>
        <p className="text-muted-foreground">Aqui puedes crear los paises que desees.</p>
      </div>
      <Separator className="mt-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 👇 Espacio para el input de cedula  */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Colombia" {...field} />
                </FormControl>
                <FormDescription>El numero del pais a ingresar.</FormDescription>
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
  );
};
