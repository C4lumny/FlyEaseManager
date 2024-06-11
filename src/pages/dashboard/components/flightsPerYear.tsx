import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const FlightsPerYear = ({ flights }: any) => {
  const data = useMemo(() => {
    const flightsPerMonth = Array.from({ length: 12 }, (_, i) => ({
      Meses: new Date(0, i).toLocaleString("es-ES", { month: "long" }),
      Vuelos: 0,
    }));

    flights.forEach((flight: any) => {
      const flightDate = new Date(flight.fechayhoradesalida);
      if (!isNaN(flightDate.getTime())) {
        flightsPerMonth[flightDate.getMonth()].Vuelos++;
      }
    });

    return flightsPerMonth;
  }, [flights]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="Meses" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="Vuelos" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  );
};
