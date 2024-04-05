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

export interface Asientos {
  idasiento?: number;
  posicion: number;
  disponibilidad: boolean;
  fecharegistro?: Date;
  avion: Avion;
  categoria: Categoria;
}

interface Avion {
  idavion: string;
  nombre: string;
  modelo: string;
  fabricante: string;
  velocidadpromedio: number;
  cantidadpasajeros: number;
  cantidadcarga: number;
  fecharegistro: Date;
  aereolinea: Aereolinea;
}

interface Aereolinea {
  idaereolinea: number;
  nombre: string;
  codigoiata: string;
  codigoicao: string;
  fecharegistro: Date;
}

interface Categoria {
  idcategoria: number;
  nombre: string;
  descripcion: string;
  estadocategoria: boolean;
  tarifa: number;
  fecharegistro: Date;
  comercial: boolean;
}

const formSchema = z
  .object({
    // Validaciones para el id
    idavion: z
      .string({ required_error: "Por favor ingrese un id" })
      .min(1, {
        message: "El id debe tener al menos 1 caracter.",
      })
      .max(10, {
        message: "El id no puede tener mas de 10 caracteres.",
      }),
    // Validaciones para el nombre
    nombre: z
      .string({ required_error: "Por favor ingrese un nombre" })
      .min(1, {
        message: "country must be at least 2 characters.",
      })
      .max(20, {
        message: "El nombre no debe tener más de 20 caracteres",
      }),
    modelo: z.string().min(1).max(20),
    fabricante: z.string().min(1).max(40),
    velocidadpromedio: z.number().min(0),
    cantidadcarga: z.number().min(0),
    cantidadasientoscomerciales: z.number().min(0),
    numeroasientospremium: z.number().min(0),
    numeroasientoseconomicos: z.number().min(0),
    cantidadasientosnocomerciales: z.number().min(0),
    associatedAirline: z.string({
      required_error: "Please select an airline.",
    }),
  })
  .refine((data) => data.numeroasientospremium + data.numeroasientoseconomicos === data.cantidadasientoscomerciales, {
    message:
      "El numero de asientos premium sumado al numero de asientos economicos debe ser igual a la cantidad de asientos comerciales",
    path: ["cantidadasientoscomerciales"],
  });

export const CreatePlanes = () => {
  const { apiRequest } = useRequest();
  const categorias = useGet("/FlyEaseApi/Categorias/GetAll");
  const { data, loading } = useGet("/FlyEaseApi/Aerolineas/GetAll");

  const saveSeats = async (
    categoriaNombre: string,
    cantidad: number,
    disponibilidad: boolean,
    avion: Avion,
    categorias: Categoria[],
    contador: number | undefined
  ) => {
    const categoria = categorias.find((categoria) => categoria.nombre === categoriaNombre);
    if (!categoria) return;

    for (let i = 0; i < cantidad; i++) {
      const seat: Asientos = {
        categoria: categoria,
        disponibilidad: disponibilidad,
        avion: avion,
        posicion: (contador ?? 0) + i + 1,
      };

      await apiRequest(seat, "/FlyEaseApi/Asientos/Post", "post");
    }
    return (contador ?? 0) + cantidad;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idavion: "",
      nombre: "",
      fabricante: "",
      modelo: "",
      velocidadpromedio: 0,
      cantidadcarga: 0,
      cantidadasientoscomerciales: 0,
      numeroasientospremium: 0,
      numeroasientoseconomicos: 0,
      cantidadasientosnocomerciales: 0,
      associatedAirline: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const planeData = {
      idavion: values.idavion,
      nombre: values.nombre,
      modelo: values.modelo,
      fabricante: values.fabricante,
      velocidadpromedio: values.velocidadpromedio,
      cantidadpasajeros: values.cantidadasientoscomerciales,
      cantidadcarga: values.cantidadcarga,
      fecharegistro: new Date().toISOString(),
      aereolinea: (await apiRequest(null, `/FlyEaseApi/Aerolineas/GetById/${values.associatedAirline}`, "get")).apiData,
    };

    const planeDataWithDate = {
      ...planeData,
      fecharegistro: new Date(planeData.fecharegistro),
    };

    const request = await apiRequest(planeData, "/FlyEaseApi/Aviones/Post", "post");
    if (!request.error) {

      let contadorGeneral: number | undefined = 0;

      contadorGeneral = await saveSeats(
        "No comercial",
        values.cantidadasientosnocomerciales,
        true,
        planeDataWithDate,
        categorias.data.response,
        contadorGeneral
      );

      contadorGeneral = await saveSeats(
        "Primera clase",
        values.numeroasientospremium,
        true,
        planeDataWithDate,
        categorias.data.response,
        contadorGeneral
      );

      saveSeats(
        "Turista",
        values.numeroasientoseconomicos,
        true,
        planeDataWithDate,
        categorias.data.response,
        contadorGeneral
      );
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
            <h1 className="text-xl font-semibold tracking-tight">Crear aviones</h1>
            <p className="text-muted-foreground">Aqui puedes crear los aviones que desees para tu sistema.</p>
          </div>
          <Separator className="mt-8" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 👇 Espacio para el input del ID avion  */}
              <FormField
                control={form.control}
                name="idavion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del aeropuerto</FormLabel>
                    <FormControl>
                      <Input placeholder="AV123" {...field} />
                    </FormControl>
                    <FormDescription>El ID del avion a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de nombre  */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del avión</FormLabel>
                    <FormControl>
                      <Input placeholder="Avianca 789" {...field} />
                    </FormControl>
                    <FormDescription>El nombre del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input del modelo  */}
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo del avión</FormLabel>
                    <FormControl>
                      <Input placeholder="Airbus A321" {...field} />
                    </FormControl>
                    <FormDescription>El modelo del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input del modelo  */}
              <FormField
                control={form.control}
                name="fabricante"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabricante del avión</FormLabel>
                    <FormControl>
                      <Input placeholder="Airbus A321" {...field} />
                    </FormControl>
                    <FormDescription>El modelo del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la velocidad promedio  */}
              <FormField
                control={form.control}
                name="velocidadpromedio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocidad promedio del avión en km/h</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="270"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La velocidad promedio del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la cantidad de carga */}
              <FormField
                control={form.control}
                name="cantidadcarga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de carga del Avión en Kg</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="270"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La cantidad de carga del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la cantidad de asientos comerciales  */}
              <FormField
                control={form.control}
                name="cantidadasientoscomerciales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de asientos comerciales del avión</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="50"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La Cantidad de asientos comerciales del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la cantidad de asientos comerciales  */}
              <FormField
                control={form.control}
                name="numeroasientospremium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de asientos premium del avión</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="25"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>El numero de asientos premium del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la cantidad de asientos comerciales  */}
              <FormField
                control={form.control}
                name="numeroasientoseconomicos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de asientos economicos del avión</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="25"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La numero de asientos economicos del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la cantidad de asientos comerciales  */}
              <FormField
                control={form.control}
                name="cantidadasientosnocomerciales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad de asientos no comerciales del avión</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La Cantidad de asientos no comerciales del avión a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el select de la aerolinea */}
              <FormField
                control={form.control}
                name="associatedAirline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aerolinea asignada al aeropuerto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Seleccione una aerolinea" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Aerolineas</SelectLabel>
                          {data.response.length > 0 ? (
                            data.response.map((aerolinea: any) => {
                              return (
                                <SelectItem value={`${aerolinea.idaereolinea.toString()}`}>
                                  {aerolinea?.nombre}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div>No hay aerolineas activos</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione la aerolinea que se asignará al aeropuerto.</FormDescription>
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
