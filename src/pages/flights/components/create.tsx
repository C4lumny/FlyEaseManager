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
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

const formSchema = z
  .object({
    precio: z.number().min(1),
    descuento: z.number().min(0).max(100),
    fechadesalida: z
      .date({ required_error: "Seleccione una fecha" })
      .min(new Date(), { message: "No puede seleccionar una fecha menor a la actual" }),
    horadesalida: z.string().min(4).max(4),
    tarifa: z.number().min(1),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      precio: 0,
      descuento: 0,
      fechadesalida: new Date(),
      tarifa: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let fechasalida = new Date(values.fechadesalida);
    let horadesalida = values.horadesalida.substring(0, 2);
    let minutosalida = values.horadesalida.substring(2, 4);
    console.log(horadesalida, minutosalida);

    fechasalida.setHours(parseInt(horadesalida));
    fechasalida.setMinutes(parseInt(minutosalida));

    const flightData = {
      preciovuelo: values.precio,
      tarifatemporada: values.tarifa,
      descuento: values.descuento,
      cupo: true,
      fechayhoradesalida: fechasalida.toISOString(),
      fechayhorallegada: new Date().toISOString(),
      avion: (await apiRequest(null, `/FlyEaseApi/Aviones/GetById/${values.avion.split(",")[0]}`, "get")).apiData,
      aeropuertodespegue: (await apiRequest(
        null,
        `/FlyEaseApi/Aeropuertos/GetById/${values.takeoffAirport.split(",")[0]}`,
        "get"
      )).apiData,
      aeropuertodestino: (await apiRequest(
        null,
        `/FlyEaseApi/Aeropuertos/GetById/${values.arrivalAirport.split(",")[0]}`,
        "get"
      )).apiData,
      estado: (await apiRequest(null, `/FlyEaseApi/Estados/GetById/8`, "get")).apiData,

      // avion: {
      //   idavion: values.avion.split(",")[0],
      //   nombre: values.avion.split(",")[1],
      //   modelo: values.avion.split(",")[2],
      //   fabricante: values.avion.split(",")[3],
      //   velocidadpromedio: parseFloat(values.avion.split(",")[4]),
      //   cantidadpasajeros: parseInt(values.avion.split(",")[5]),
      //   cantidadcarga: parseInt(values.avion.split(",")[6]),
      //   fecharegistro: values.avion.split(",")[7],
      //   aerolinea: {
      //     idaerolinea: parseInt(values.avion.split(",")[8]),
      //     nombre: values.avion.split(",")[9],
      //     codigoiata: values.avion.split(",")[10],
      //     codigoicao: values.avion.split(",")[11],
      //     fecharegistro: values.avion.split(",")[12],
      //   },
      // },
      // aeropuertodespegue: {
      //   idaereopuerto: parseInt(values.takeoffAirport.split(",")[0]),
      //   nombre: values.takeoffAirport.split(",")[1],
      //   fecharegistro: values.takeoffAirport.split(",")[2],
      //   ciudad: {
      //     idciudad: parseInt(values.takeoffAirport.split(",")[3]),
      //     nombre: values.takeoffAirport.split(",")[4],
      //     fecharegistro: values.takeoffAirport.split(",")[5],
      //     imagen: values.takeoffAirport.split(",")[6],
      //     region: {
      //       idregion: parseInt(values.takeoffAirport.split(",")[7]),
      //       nombre: values.takeoffAirport.split(",")[8],
      //       fecharegistro: values.takeoffAirport.split(",")[9],
      //       pais: {
      //         idpais: parseInt(values.takeoffAirport.split(",")[10]),
      //         nombre: values.takeoffAirport.split(",")[11],
      //         fecharegistro: values.takeoffAirport.split(",")[12],
      //       },
      //     },
      //   },
      //   coordenadas: {
      //     idcoordenada: parseInt(values.takeoffAirport.split(",")[13]),
      //     latitud: parseFloat(values.takeoffAirport.split(",")[14]),
      //     longitud: parseFloat(values.takeoffAirport.split(",")[15]),
      //     fecharegistro: values.takeoffAirport.split(",")[16],
      //   },
      // },
      // aeropuertodestino: {
      //   idaereopuerto: parseInt(values.arrivalAirport.split(",")[0]),
      //   nombre: values.arrivalAirport.split(",")[1],
      //   fecharegistro: values.arrivalAirport.split(",")[2],
      //   ciudad: {
      //     idciudad: parseInt(values.arrivalAirport.split(",")[3]),
      //     nombre: values.arrivalAirport.split(",")[4],
      //     fecharegistro: values.arrivalAirport.split(",")[5],
      //     imagen: values.arrivalAirport.split(",")[6],
      //     region: {
      //       idregion: parseInt(values.arrivalAirport.split(",")[7]),
      //       nombre: values.arrivalAirport.split(",")[8],
      //       fecharegistro: values.arrivalAirport.split(",")[9],
      //       pais: {
      //         idpais: parseInt(values.arrivalAirport.split(",")[10]),
      //         nombre: values.arrivalAirport.split(",")[11],
      //         fecharegistro: values.arrivalAirport.split(",")[12],
      //       },
      //     },
      //   },
      //   coordenadas: {
      //     idcoordenada: parseInt(values.arrivalAirport.split(",")[13]),
      //     latitud: parseFloat(values.arrivalAirport.split(",")[14]),
      //     longitud: parseFloat(values.arrivalAirport.split(",")[15]),
      //     fecharegistro: values.arrivalAirport.split(",")[16],
      //   },
      // },
      // estado: {
      //   idestado: 8,
      //   nombre: "Disponible",
      //   descripcion: "El vuelo y su compra se encuentra completamente disponible",
      //   fecharegistro: new Date().toISOString(),
      //   detencion: true,
      // },
    };

    console.log(flightData);
    const apiData = await apiRequest(flightData, "/FlyEaseApi/Vuelos/Post", "post");
    console.log(apiData);
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
                    <FormDescription>El nombre de la ciudad a ingresar.</FormDescription>
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
                    <FormDescription>El descuento del vuelo a ingresar. {"(En horario militar)"}</FormDescription>
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
              <Button type="submit">Crear</Button>
            </form>
          </Form>
        </>
      )}
    </>
  );
};