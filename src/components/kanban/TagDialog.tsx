import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Tag } from "@/types/kanban";
    import { useState, useCallback } from "react";
    import { useForm } from "react-hook-form";
    import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
    import { X, Circle, Pencil } from "lucide-react";
    
    interface TagDialogProps {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      tags: Tag[];
      onUpdateTags?: (tags: Tag[]) => void;
    }
    
    interface TagFormValues {
      name: string;
      color: string;
    }
    
    export function TagDialog({ open, onOpenChange, tags, onUpdateTags = () => {} }: TagDialogProps) {
      const [editTagId, setEditTagId] = useState<string | null>(null);
      const [tagSearch, setTagSearch] = useState("");
      const form = useForm<TagFormValues>({
        defaultValues: {
          name: "",
          color: "#9b87f5",
        },
      });
    
      const handleAddTag = (data: TagFormValues) => {
        const newTag = {
          ...data,
          id: Math.random().toString(36).substring(2, 15),
        };
        onUpdateTags([...tags, newTag]);
        form.reset();
      };
    
      const handleEditTag = (data: TagFormValues) => {
        if (!editTagId) return;
        const updatedTags = tags.map((tag) =>
          tag.id === editTagId ? { ...tag, name: data.name, color: data.color } : tag
        );
        onUpdateTags(updatedTags);
        setEditTagId(null);
        form.reset();
      };
    
      const handleDeleteTag = (id: string) => {
        const updatedTags = tags.filter((tag) => tag.id !== id);
        onUpdateTags(updatedTags);
      };
    
      const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(tagSearch.toLowerCase())
      );
    
      const handleSubmit = (data: TagFormValues) => {
        if (editTagId) {
          handleEditTag(data);
        } else {
          handleAddTag(data);
        }
      };
    
      const handleEditClick = (tag: Tag) => {
        setEditTagId(tag.id);
        form.setValue("name", tag.name);
        form.setValue("color", tag.color);
      };
    
      const handleCancelEdit = () => {
        setEditTagId(null);
        form.reset();
      };
    
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Manage Tags</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Tag name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  {editTagId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                  <Button type="submit">
                    {editTagId ? "Update Tag" : "Add Tag"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4">
              <Command>
                <CommandInput
                  placeholder="Search tag..."
                  onValueChange={setTagSearch}
                />
                <CommandList>
                  <CommandEmpty>No tag found.</CommandEmpty>
                  {filteredTags.map((tag) => (
                    <CommandItem key={tag.id}>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Circle className="h-2 w-2" style={{ color: tag.color }} />
                          {tag.name}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(tag)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
