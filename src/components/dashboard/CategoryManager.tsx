"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash, Edit, Plus } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";

export function CategoryManager() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("No se pudieron cargar las categorías");
      return (await res.json()).categories as { id: string; name: string }[];
    },
  });

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string }) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payload.name }),
      });
      if (!res.ok) throw new Error("No se pudo crear");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewName("");
      toast.success("Categoría creada");
    },
    onError: (err: any) => toast.error(err?.message || "Error"),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; name?: string; newId?: string }) => {
      const res = await fetch(`/api/categories/${encodeURIComponent(payload.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: payload.name, newId: payload.newId }),
      });
      if (!res.ok) throw new Error("No se pudo actualizar");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setEditingName("");
      toast.success("Categoría actualizada");
    },
    onError: (err: any) => toast.error(err?.message || "Error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada");
    },
    onError: (err: any) => toast.error(err?.message || "Error"),
  });

  return (
    <RoleGuard roles={["admin"]}>
      <Card>
        <CardHeader>
          <CardTitle>Administrar categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nueva categoría"
                value={newName}
                onChange={(e) => setNewName((e.target as HTMLInputElement).value)}
              />
              <Button
                onClick={() => createMutation.mutate({ name: newName })}
                disabled={!newName || createMutation.status === "pending"}
              >
                <Plus className="mr-2" /> Agregar
              </Button>
            </div>

            <div className="space-y-2">
              {isLoading && <div>Cargando...</div>}
              {!isLoading && !data?.length && <div>No hay categorías</div>}
              {!isLoading && data?.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    {editingId === c.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName((e.target as HTMLInputElement).value)}
                      />
                    ) : (
                      <div>{c.name}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {editingId === c.id ? (
                      <>
                        <Button
                          onClick={() => updateMutation.mutate({ id: c.id, name: editingName })}
                          disabled={!editingName || updateMutation.status === "pending"}
                        >
                          Guardar
                        </Button>
                        <Button variant="ghost" onClick={() => { setEditingId(null); setEditingName(""); }}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" onClick={() => { setEditingId(c.id); setEditingName(c.name); }}>
                          <Edit />
                        </Button>
                        <Button variant="destructive" onClick={() => deleteMutation.mutate(c.id)} disabled={deleteMutation.status === "pending"}>
                          <Trash />
                        </Button>
                      </>
                    )}
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
