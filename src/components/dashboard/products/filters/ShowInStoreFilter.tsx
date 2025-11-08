import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eye, EyeOff } from "lucide-react";
import { memo } from "react";

interface ShowInStoreFilterProps {
  value: boolean | undefined;
  onChange: (values: string[]) => void;
}

function ShowInStoreFilterComponent({ value, onChange }: ShowInStoreFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="in-store-filter">Mostrar en tienda</Label>
      <ToggleGroup
        id="in-store-filter"
        value={value === undefined ? [] : value ? ["show"] : ["hide"]}
        onValueChange={onChange}
        type="multiple"
        className="w-full border border-muted bg-sidebar"
      >
        <ToggleGroupItem value="hide" aria-label="Mostrar no" className="hover:text-foreground">
          <EyeOff className="ml-1 size-4" /> No
        </ToggleGroupItem>
        <ToggleGroupItem value="show" aria-label="Mostrar si" className="border-l hover:text-foreground">
          <Eye className="ml-1 size-4" /> Sí
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export const ShowInStoreFilter = memo(ShowInStoreFilterComponent);
