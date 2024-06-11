import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function DashboardSkeleton() {
  return (
    <div className="hidden flex-col md:flex ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-10">
          <Skeleton className="h-8 w-1/6 mb-2" />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Skeleton className="h-10" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4 lg:rid-cols-2 mb-20">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <Skeleton />
                </CardHeader>
                <CardContent className="pl-2">
                  <Skeleton className="h-20" />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <Skeleton />
                </CardHeader>
                <CardContent className="pl-2">
                  <Skeleton className="h-20" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}