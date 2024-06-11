import { useGet } from "@/hooks/useGet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRequest } from "@/hooks/useApiRequest";
import { format } from "date-fns";
// 👇 UI imports
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useState } from "react";
import { Icons } from "@/components/ui/icons";
import { FormSkeleton } from "@/components/form-skeleton";

const formSchema = z
  .object({
    precio: z.number().min(1),
    descuento: z.number().min(0).max(100),
    fechadesalida: z
      .date({ required_error: "Seleccione una fecha" })
      .min(new Date(), { message: "No puede seleccionar una fecha menor a la actual" }),
    horadesalida: z.string().min(4).max(4),
    tarifa: z.number().min(0),
    takeoffAirport: z.string({
      required_error: "Seleccione un aeropuerto de despegue.",
    }),
    arrivalAirport: z.string({
      required_error: "Seleccione un aeropuerto de llegada.",
    }),
    avion: z.string({
      required_error: "Seleccione un avión para el vuelo",
    }),
  })
  .refine((data) => data.arrivalAirport !== data.takeoffAirport, {
    message: "El aeropuerto de despegue no puede ser igual al de llegada.",
    path: ["arrivalAirport"],
  });

export const CreateFlights = () => {
  const { apiRequest } = useRequest();
  const airportsData = useGet("/FlyEaseApi/Aeropuertos/GetAll");
  const planesData = useGet("/FlyEaseApi/Aviones/GetAll");
  const loading = planesData && airportsData;
  const [isResponseLoading, setIsResponseLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      precio: 0,
      descuento: 0,
      fechadesalida: new Date(),
      tarifa: 0,
      horadesalida: "",
      takeoffAirport: "",
      arrivalAirport: "",
      avion: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsResponseLoading(true);
    let fechasalida = new Date(values.fechadesalida);
    let horadesalida = values.horadesalida.substring(0, 2);
    let minutosalida = values.horadesalida.substring(2, 4);

    fechasalida.setHours(parseInt(horadesalida));
    fechasalida.setMinutes(parseInt(minutosalida));

    const flightData = {
      preciovuelo: values.precio,
      tarifatemporada: values.tarifa,
      descuento: values.descuento,
      cupo: true,
      fechayhoradesalida: fechasalida.toISOString().split("T")[0],
      fechayhorallegada: new Date().toISOString().split("T")[0],
      avion: (await apiRequest(null, `/FlyEaseApi/Aviones/GetById/${values.avion.split(",")[0]}`, "get")).apiData,
      aeropuerto_Despegue: (
        await apiRequest(null, `/FlyEaseApi/Aeropuertos/GetById/${values.takeoffAirport.split(",")[0]}`, "get")
      ).apiData,
      aeropuerto_Destino: (
        await apiRequest(null, `/FlyEaseApi/Aeropuertos/GetById/${values.arrivalAirport.split(",")[0]}`, "get")
      ).apiData,
      estado: (await apiRequest(null, `/FlyEaseApi/Estados/GetById/8`, "get")).apiData,
    };

    const response = await apiRequest(flightData, "/FlyEaseApi/Vuelos/Post", "post");

    if (!response.error) {
      setIsResponseLoading(false);
      toast.success("Vuelo creado con exito");
      form.reset();
    } else {
      setIsResponseLoading(false);
      toast.error("Error al crear el vuelo", {});
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
      {loading.loading ? (
        <FormSkeleton />
      ) : (
        <>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Crear vuelos</h1>
            <p className="text-muted-foreground">Aqui puedes crear los vuelos que desees para tu sistema.</p>
          </div>
          <Separator className="mt-8" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 👇 Espacio para el input del precio  */}
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio del vuelo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$100.000"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>El precio del vuelo a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input del descuento  */}
              <FormField
                control={form.control}
                name="descuento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descuento del vuelo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10.4833"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>El descuento del vuelo a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la fecha  */}
              <FormField
                control={form.control}
                name="fechadesalida"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de salida</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Seleccione una fecha</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date: any) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>La fecha del vuelo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la hora  */}
              <FormField
                control={form.control}
                name="horadesalida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de salida</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>La hora del vuelo. {"(En horario militar)"}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el input de la tarifa  */}
              <FormField
                control={form.control}
                name="tarifa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarifa del vuelo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10.4833"
                        {...field}
                        onChange={handleInputChange(field)}
                        onBlur={handleInputBlur(field)}
                      />
                    </FormControl>
                    <FormDescription>La Tarifa del vuelo a ingresar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el select del aeropuerto de despegue */}
              <FormField
                control={form.control}
                name="takeoffAirport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aeropuerto de despegue</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Seleccione una aeropuerto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Aeropuertos</SelectLabel>
                          {airportsData.data.response.length > 0 ? (
                            airportsData.data.response.map((airport: any) => {
                              return (
                                <SelectItem
                                  value={`${airport.idaereopuerto.toString()},${airport.nombre},${
                                    airport.fecharegistro
                                  },${airport.ciudad.idciudad},${airport.ciudad.nombre},${
                                    airport.ciudad.fecharegistro
                                  },${airport.ciudad.imagen},${airport.ciudad.region.idregion},${
                                    airport.ciudad.region.nombre
                                  },${airport.ciudad.region.fecharegistro},${airport.ciudad.region.pais.idpais},${
                                    airport.ciudad.region.pais.nombre
                                  },${airport.ciudad.region.pais.fecharegistro},${airport.coordenadas.idcoordenada},${
                                    airport.coordenadas.latitud
                                  },${airport.coordenadas.longitud},${airport.coordenadas.fecharegistro}`}
                                >
                                  {airport?.nombre}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div>No hay aeropuertos activos</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione el aeropuerto de despegue.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el select del aeropuerto de despegue */}
              <FormField
                control={form.control}
                name="arrivalAirport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aeropuerto de destino</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Seleccione un aeropuerto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Aeropuertos</SelectLabel>
                          {airportsData.data.response.length > 0 ? (
                            airportsData.data.response.map((airport: any) => {
                              return (
                                <SelectItem
                                  value={`${airport.idaereopuerto.toString()},${airport.nombre},${
                                    airport.fecharegistro
                                  },${airport.ciudad.idciudad},${airport.ciudad.nombre},${
                                    airport.ciudad.fecharegistro
                                  },${airport.ciudad.imagen},${airport.ciudad.region.idregion},${
                                    airport.ciudad.region.nombre
                                  },${airport.ciudad.region.fecharegistro},${airport.ciudad.region.pais.idpais},${
                                    airport.ciudad.region.pais.nombre
                                  },${airport.ciudad.region.pais.fecharegistro},${airport.coordenadas.idcoordenada},${
                                    airport.coordenadas.latitud
                                  },${airport.coordenadas.longitud},${airport.coordenadas.fecharegistro}`}
                                >
                                  {airport?.nombre}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div>No hay paises activos</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione el aeropuerto de destino.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 👇 Espacio para el select del avión del vuelo */}
              <FormField
                control={form.control}
                name="avion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avión asignado al vuelo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Seleccione un avion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Aviones</SelectLabel>
                          {planesData.data.response.length > 0 ? (
                            planesData.data.response.map((avion: any) => {
                              return (
                                <SelectItem
                                  value={`${avion.idavion.toString()},${avion.nombre},${avion.modelo},${
                                    avion.fabricante
                                  },${avion.velocidadpromedio},${avion.cantidadpasajeros},${avion.cantidadcarga},${
                                    avion.fecharegistro
                                  },${avion.aereolinea.idaereolinea},${avion.aereolinea.nombre},${
                                    avion.aereolinea.codigoiata
                                  },${avion.aereolinea.codigoicao},${avion.aereolinea.fecharegistro}`}
                                >
                                  {avion?.nombre}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div>No hay aviones activos</div>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription>Seleccione el avion.</FormDescription>
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
