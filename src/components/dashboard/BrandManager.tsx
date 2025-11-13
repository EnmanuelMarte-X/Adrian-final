"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/auth/RoleGuard";

export function BrandManager() {
  const { data, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("No se pudieron cargar las marcas");
      return (await res.json()).brands as { id: string; name: string }[];
    },
  });

  return (
    <RoleGuard roles={["admin"]}>
      <Card>
        <CardHeader>
          <CardTitle>Marcas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Para agregar o modificar marcas, edita directamente el archivo <code className="bg-gray-100 px-2 py-1 rounded">config/brands.json</code> y haz un POST a la API.
            </p>

            <div className="space-y-2">
              {isLoading && <div>Cargando...</div>}
              {!isLoading && !data?.length && <div>No hay marcas</div>}
              {!isLoading && data?.map((brand) => (
                <div key={brand.id} className="flex items-center justify-between gap-4 p-3 border rounded">
                  <div>
                    <div className="font-medium">{brand.name}</div>
                    <div className="text-sm text-gray-500">ID: {brand.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </RoleGuard>
  );
}
