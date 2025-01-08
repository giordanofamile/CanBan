import * as React from "react";
    import { cn } from "@/lib/utils";
    import { Tag } from "@/types/kanban";
    
    interface MultiSelectTagsProps<T extends { id: string; name: string; color: string }> {
      tags: T[];
      value?: string[];
      onValueChange: (value: string[]) => void;
    }
    
    export const MultiSelectTags = <T extends { id: string; name: string; color: string }>({
      tags,
      value = [],
      onValueChange,
    }: MultiSelectTagsProps<T>) => {
      const handleTagClick = (tag: T) => {
        if (value.includes(tag.name)) {
          onValueChange(value.filter((t) => t !== tag.name));
        } else {
          onValueChange([...value, tag.name]);
        }
      };
    
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={cn(
                "text-xs px-2 py-1 rounded-full transition-colors",
                value.includes(tag.name)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              style={{ backgroundColor: tag.color + "40", color: tag.color }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      );
    };
