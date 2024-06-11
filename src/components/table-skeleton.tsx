import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="p-4">
      {/* Barra para simular el título */}
      <Skeleton className="h-7 w-1/4 mb-2" />
      {/* Barra para simular la descripción */}
      <Skeleton className="h-4 w-1/3 mb-4" />
      {/* Barra para simular la línea delgada que separa */}
      <Skeleton className="h-0.5 w-full mb-10" />
      {/* Barra para simular el filtro */}
      <Skeleton className="h-7 w-1/2 mb-3" />

      <table className="w-full text-left">
        <thead>
          <tr>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <th key={i} className="p-2 border-b-2">
                  {/* Celda para simular los encabezados */}
                  <Skeleton className="h-10 w-full bg-gray-800" />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(4)
            .fill(0)
            .map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {["w-32", "w-32", "w-32", "w-32", "w-32", "w-32"].map(
                  (width, colIndex) => (
                    <td key={colIndex} className="p-2">
                      {/* Celda para simular las intancias */}
                      <Skeleton className={`h-10 ${width}`} />
                    </td>
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
