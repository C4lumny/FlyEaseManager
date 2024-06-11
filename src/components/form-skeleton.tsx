import { Skeleton } from "@/components/ui/skeleton";

function InputSkeleton() {
  return (
    <div className="mb-10">
      {/* Barra para simular el título del campo */}
      <Skeleton className="h-4 w-1/4 mb-2" />
      {/* Barra para simular el campo de entrada */}
      <Skeleton className="h-8 w-full mb-2" />
      {/* Barra para simular la descripción del campo */}
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="p-4">
      {/* Barra para simular el título */}
      <Skeleton className="h-8 w-1/4 mb-2" />
      {/* Barra para simular la descripción */}
      <Skeleton className="h-4 w-1/2 mb-8" />
      <InputSkeleton />
      <InputSkeleton />
      <InputSkeleton />
    </div>
  );
}
