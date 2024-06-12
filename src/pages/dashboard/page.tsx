import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";
import { useGet } from "@/hooks/useGet";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { FlightsPerYear } from "./components/flightsPerYear";
import { useMemo } from "react";
import MostPopularDestinations from "./components/mostPopularDestinations";

export const DashboardPage = () => {
  const { data: ticketsData, loading: ticketsLoading } = useGet("/FlyEaseApi/Boletos/GetAll");
  const { data: clientsData, loading: clientsLoading } = useGet("/FlyEaseApi/Clientes/GetAll");
  const { data: availableFlightsData, loading: availableFlightLoading } = useGet("/FlyEaseApi/Vuelos/GetAllAvailable");
  const { data: flightsData, loading: flightLoading } = useGet("/FlyEaseApi/Vuelos/GetAll");
  const { data: destinationsData, loading: destinationLoading } = useGet("/FlyEaseApi/Vuelos/GetAllAvailable");

  const currentYear = new Date().getFullYear();
  let currentYeartotal = 0;
  let lastYearTotal = 0;
  let yearlyTotalDifferencePercentage = 0;
  let clientCount = 0;
  let availableFlights = 0;
  let availableDestinations = 0;

  let currentYearFlights;
  let popularDestinations;

  if (!ticketsLoading && ticketsData) {
    const boletos = (ticketsData as any).response;

    const añoActual = new Date().getFullYear();
    const añoAnterior = añoActual - 1;

    const boletosAñoActual = boletos.filter(
      (boleto: any) => new Date(boleto.fecharegistro).getFullYear() === añoActual
    );
    const boletosAñoAnterior = boletos.filter(
      (boleto: any) => new Date(boleto.fecharegistro).getFullYear() === añoAnterior
    );

    currentYeartotal = boletosAñoActual.reduce((sum: number, boleto: any) => sum + boleto.precio, 0);
    lastYearTotal = boletosAñoAnterior.reduce((sum: number, boleto: any) => sum + boleto.precio, 0);

    yearlyTotalDifferencePercentage = ((currentYeartotal - lastYearTotal) / lastYearTotal) * 100;
  }

  if (clientsData && !clientsLoading) {
    clientCount = Array.isArray(clientsData.response) ? clientsData.response.length : 0;
  }

  if (availableFlightsData && !availableFlightLoading) {
    availableFlights = Array.isArray(availableFlightsData.response) ? availableFlightsData.response.length : 0;
  }

  if (destinationsData && !destinationLoading) {
    availableDestinations = Array.isArray(destinationsData.response) ? destinationsData.response.length : 0;
  }

  popularDestinations = useMemo(() => {
    if (flightsData && !flightLoading) {
      console.log(flightsData.response);
      const destinationCounts = flightsData.response.reduce((counts: any, flight: any) => {
        const destination = flight.aeropuerto_Destino.ciudad.nombre;
        counts[destination] = (counts[destination] || 0) + 1;
        return counts;
      }, {});

      const destinationsArray = Object.entries(destinationCounts).map(([destination, count]) => ({
        destination,
        count,
      }));

      destinationsArray.sort((a: any, b: any) => b.count - a.count);

      return destinationsArray;
    }
    return [];
  }, [flightsData, flightLoading]);

  if (flightsData && !flightLoading) {
    currentYearFlights = flightsData.response.filter((flight: any) => {
      const flightDate = new Date(flight.fechayhoradesalida);

      if (isNaN(flightDate.getTime())) {
        // Si fechayhoradesalida no es una fecha válida, ignora este vuelo
        return false;
      }

      return flightDate.getFullYear() === currentYear;
    });
  }

  return (
    <>
      {ticketsLoading || clientsLoading || availableFlightLoading || destinationLoading || flightLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="hidden flex-col md:flex">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-10">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Resumen</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Destinos activos</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+{availableDestinations}</div>
                      <p className="text-xs text-muted-foreground">para viajar y gozar</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#E28741]">Total recaudado</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#E28741]">
                        {ticketsLoading ? (
                          <Icons.spinner className="size-6 animate-spin" />
                        ) : (
                          `$${
                            currentYeartotal === 0
                              ? 0
                              : currentYeartotal.toLocaleString("es-ES", { minimumFractionDigits: 2 })
                          }`
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {" "}
                        {isNaN(yearlyTotalDifferencePercentage) ? 0 : yearlyTotalDifferencePercentage}% que el año
                        anterior
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#FF3965]">Clientes</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#E4335A]">+{clientCount}</div>
                      <p className="text-xs text-muted-foreground">Confian en nosostros</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-[#3BAABB]">Vuelos activos</CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#3BAABB]">+{availableFlights}</div>
                      <p className="text-xs text-muted-foreground">En este momento</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Vuelos programados en el año {currentYear} </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <FlightsPerYear flights={currentYearFlights} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Destinos más populares</CardTitle>
                      
                    </CardHeader>
                    <CardContent>
                      <MostPopularDestinations data={popularDestinations} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};
