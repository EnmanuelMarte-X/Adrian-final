"use client";

import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export interface ProductBrandSelectProps extends Omit<SelectProps, "children"> {
  className?: string;
}

const fetchBrands: () => Promise<{ id: string; name: string }[]> = async () => {
  try {
    const res = await fetch("/api/brands");
    if (!res.ok) throw new Error("Error cargando marcas");
    const data = await res.json();
    return data.brands ?? [];
  } catch (err) {
    return [];
  }
};

export function ProductBrandSelect({
  className,
  onValueChange,
  value,
  defaultValue,
  ...props
}: ProductBrandSelectProps & {
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
    initialData: [],
  });

  const brands = data ?? [];

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((c) => c.name.toLowerCase().includes(q));
  }, [brands, query]);

  useEffect(() => {
    if (isError) {
      toast.error("Error al cargar las marcas. Por favor, inténtelo de nuevo.");
    }
  }, [isError]);

  const mapExternalToId = (val?: string) => {
    if (!val) return undefined;
    const foundByName = brands.find((c) => c.name === val);
    if (foundByName) return foundByName.id;
    return val;
  };

  const internalValue = mapExternalToId(value);
  const internalDefault = mapExternalToId(defaultValue);

  const handleValueChange = (selectedId: string) => {
    const found = brands.find((c) => c.id === selectedId);
    const out = found ? found.name : selectedId;
    onValueChange?.(out);
  };

  return (
    <Select
      {...props}
      value={internalValue}
      defaultValue={internalDefault}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={cn(className)} disabled={isLoading}>
        {isLoading && <Spinner className="size-4 text-muted-foreground mr-2" />}
        <SelectValue placeholder="Seleccionar marca" />
      </SelectTrigger>

      <SelectContent position="popper" sideOffset={6} align="start">
        <div className="px-3 py-2">
          <Input
            placeholder="Buscar marca..."
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            className="w-full"
          />
        </div>

        <div className="max-h-56 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">No hay resultados</div>
          ) : (
            filtered.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
