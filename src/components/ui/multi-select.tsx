import * as React from "react";
    import { Checkbox } from "./checkbox";
    import { cn } from "@/lib/utils";
    import { Input } from "./input";
    
    interface MultiSelectProps<T extends { id: string; name: string }> {
      tags: T[];
      value?: string[];
      onValueChange: (value: string[]) => void;
    }
    
    export const MultiSelect = <T extends { id: string; name: string }>({
      tags,
      value = [],
      onValueChange,
    }: MultiSelectProps<T>) => {
      const [search, setSearch] = React.useState("");
    
      const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
      );
    
      const handleCheckboxChange = (tag: T) => {
        if (Array.isArray(value) && value.includes(tag.name)) {
          onValueChange(value.filter((t) => t !== tag.name));
        } else {
          onValueChange([...(Array.isArray(value) ? value : []), tag.name]);
        }
      };
    
      return (
        <div className="relative">
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-1"
          />
          <div className="max-h-40 overflow-y-auto border rounded-md bg-popover p-2">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="flex items-center py-1">
                <Checkbox
                  id={tag.id}
                  checked={Array.isArray(value) && value.includes(tag.name)}
                  onCheckedChange={() => handleCheckboxChange(tag)}
                />
                <label
                  htmlFor={tag.id}
                  className={cn("ml-2 text-sm leading-none")}
                >
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    };
