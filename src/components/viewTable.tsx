// DataTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps {
  columnTitles: string[];
  data: any[];
}

export const DataTable: React.FC<DataTableProps> = ({ columnTitles, data }) => (
  <div className="rounded-md border overflow-scroll h-96">
    <Table>
      <TableHeader>
        <TableRow>
          {columnTitles.map((title: string, index: any) => (
            <TableHead key={index}>{title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index}>
              {Object.values(item).map((value, i) => (
                <TableCell key={i} className={i === 0 ? "font-medium" : ""}>
                  {value as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnTitles.length}>No hay registros</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
