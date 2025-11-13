"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RoleGuard } from "@/components/auth/RoleGuard";

export function CategoryManager() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("No se pudieron cargar las categorías");
      return (await res.json()).categories as { id: string; name: string }[];
    },
  });

  return (
    <RoleGuard roles={["admin"]}>
      <Card>
        <CardHeader>
          <CardTitle>Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Para agregar o modificar categorías, edita directamente el archivo <code className="bg-gray-100 px-2 py-1 rounded">config/categories.json</code> y haz un POST a la API.
            </p>

            <div className="space-y-2">
              {isLoading && <div>Cargando...</div>}
              {!isLoading && !data?.length && <div>No hay categorías</div>}
              {!isLoading && data?.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-4 p-3 border rounded">
                  <div>
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-sm text-gray-500">ID: {cat.id}</div>
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
