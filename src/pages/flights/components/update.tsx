import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRequest } from "@/hooks/useApiRequest";
import { format } from "date-fns";
// 👇 UI imports
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { DataTable } from "@/components/viewTable";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
// 👇 Icons
import { RefreshCcwDot } from "lucide-react";
import { Estado, Vuelo } from "@/interfaces/tickets.interfaces";

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
    estado: z.string({}),
  })
  .refine((data) => data.arrivalAirport !== data.takeoffAirport, {
    message: "El aeropuerto de despegue no puede ser igual al de llegada.",
    path: ["arrivalAirport"],
  });

export const UpdateFlights = () => {
  const { data, loading, mutate } = useGet("/FlyEaseApi/Vuelos/GetAll");
  const airportsData = useGet("/FlyEaseApi/Aeropuertos/GetAll");
  const planesData = useGet("/FlyEaseApi/Aviones/GetAll");
  const estadosData = useGet("/FlyEaseApi/Estados/GetAll");
  const [filter, setFilter] = useState("");
  const { apiRequest } = useRequest();
  let dataTable: string[] = [];
  let filteredData: string[] = [];
  const columnTitles = [
    "Id",
    "Precio",
    "Tarifa",
    "Descuento",
    "Distancia recorrida",
    "Fecha de despegue",
    "Fecha de llegada",
    "Despegue",
    "Destino",
    "Cupo",
    "Estado",
    "Avión",
    "Fecha registro",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      precio: 0,
      descuento: 0,
      fechadesalida: new Date(),
      tarifa: 0,
    },
  });

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  const handleUpdateClick = async (updatedFlight: any, flight: any) => {
    let fechasalida = new Date(updatedFlight.fechadesalida);
    let horadesalida = updatedFlight.horadesalida.substring(0, 2);
    let minutosalida = updatedFlight.horadesalida.substring(2, 4);
    console.log(horadesalida, minutosalida);

    fechasalida.setHours(parseInt(horadesalida));
    fechasalida.setMinutes(parseInt(minutosalida));

    const flightData = {
      preciovuelo: updatedFlight.precio,
      tarifatemporada: updatedFlight.tarifa,
      descuento: updatedFlight.descuento,
      cupo: true,
      fechayhoradesalida: fechasalida.toISOString().split("T")[0],
      fechayhorallegada: new Date().toISOString().split("T")[0],
      avion: (await apiRequest(null, `/FlyEaseApi/Aviones/GetById/${updatedFlight.avion}`, "get")).apiData,
      aeropuerto_Despegue: (
        await apiRequest(null, `/FlyEaseApi/Aeropuertos/GetById/${updatedFlight.takeoffAirport}`, "get")
      ).apiData,
      aeropuerto_Destino: (
        await apiRequest(null, `/FlyEaseApi/Aeropuertos/GetById/${updatedFlight.arrivalAirport}`, "get")
      ).apiData,
      estado: (await apiRequest(null, `/FlyEaseApi/Estados/GetById/${updatedFlight.estado}`, "get")).apiData,
    };
    const apidata = await apiRequest(flightData, `/FlyEaseApi/Vuelos/Put/${flight.idvuelo}`, "put");
    console.log(apidata);
    mutate();
  };

  const handleRefreshClick = (flight: Vuelo) => {
    form.setValue("precio", flight.preciovuelo);
    form.setValue("descuento", flight.descuento);
    form.setValue("tarifa", flight.tarifatemporada);
    form.setValue("fechadesalida", new Date(flight.fechayhoradesalida));
    form.setValue("horadesalida", new Date(flight.fechayhoradesalida).toLocaleTimeString().replace(/:/g, ""));
    form.setValue("takeoffAirport", `${flight.aeropuerto_Despegue.idaereopuerto}`);
    form.setValue("arrivalAirport", `${flight.aeropuerto_Destino.idaereopuerto}`);
    form.setValue("avion", `${flight.avion.idavion}`);
    form.setValue("estado", `${flight.estado.idestado}`);
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

  if (!loading) {
    dataTable = data.response.map(
      (item: any) =>
        ({
          idvuelo: item.idvuelo,
          precio: item.preciovuelo,
          tarifa: item.tarifatemporada,
          descuento: item.descuento,
          distanciarecorrida: `${parseFloat(item.distanciarecorrida).toFixed(2)} km`,
          fechadespegue: new Date(item.fechayhoradesalida).toLocaleDateString(),
          fechallegada: new Date(item.fechayhorallegada).toLocaleDateString(),
          despegue: item.aeropuerto_Despegue.nombre,
          destino: item.aeropuerto_Destino.nombre,
          cupo: item.cupo ? "Disponible" : "No disponible",
          estado: item.estado.nombre,
          avion: item.avion.nombre,
          fecharegistro: new Date(item.fecharegistro).toLocaleDateString(),
          sheet: (
            <Sheet>
              <SheetTrigger>
                <RefreshCcwDot className="cursor-pointer" onClick={() => handleRefreshClick(item)} />
              </SheetTrigger>
              <SheetContent className="overflow-auto">
                <SheetHeader>
                  <SheetTitle>Actualizar aeropuerto</SheetTitle>
                </SheetHeader>
                <div className="grid gap-5 py-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit((updatedCity) => handleUpdateClick(updatedCity, item))}
                    >
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
                            <FormDescription>
                              El descuento del vuelo a ingresar. {"(En horario militar)"}
                            </FormDescription>
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
                                        <SelectItem value={`${airport.idaereopuerto.toString()}`}>
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
                                        <SelectItem value={`${airport.idaereopuerto.toString()}`}>
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
                                        <SelectItem value={`${avion.idavion.toString()}`}>{avion?.nombre}</SelectItem>
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
                      {/* 👇 Espacio para el select del estado */}
                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado del vuelo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-[280px]">
                                  <SelectValue placeholder="Seleccione una aeropuerto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Estados</SelectLabel>
                                  {estadosData.data.response.length > 0 ? (
                                    estadosData.data.response.map((estado: Estado) => {
                                      return (
                                        <SelectItem value={`${estado.idestado.toString()}`}>
                                          {estado?.nombre}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div>No hay estados activos</div>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormDescription>Seleccione el estado del vuelo.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <SheetFooter>
                        <Button type="submit">Actualizar y finalizar</Button>
                        <SheetClose asChild></SheetClose>
                      </SheetFooter>
                    </form>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          ),
        } || [])
    );

    filteredData = dataTable.filter((item: any) => item.idvuelo.toString().includes(filter));
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
            <h1 className="text-xl font-semibold tracking-tight">Actualizar vuelos</h1>
            <p className="text-muted-foreground">Aquí puedes actualizar los vuelos.</p>
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
