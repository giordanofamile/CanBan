import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";
    import { Project } from "@/types/kanban";
    import { useState, useCallback } from "react";
    import { useForm } from "react-hook-form";
    import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
    import { X, Pencil } from "lucide-react";
    
    interface ProjectDialogProps {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      projects?: Project[];
      onUpdateProjects: (projects: Project[]) => void;
    }
    
    interface ProjectFormValues {
      name: string;
    }
    
    export function ProjectDialog({ open, onOpenChange, projects = [], onUpdateProjects }: ProjectDialogProps) {
      const [editProjectId, setEditProjectId] = useState<string | null>(null);
      const [projectSearch, setProjectSearch] = useState("");
      const form = useForm<ProjectFormValues>({
        defaultValues: {
          name: "",
        },
      });
    
      const handleAddProject = (data: ProjectFormValues) => {
        const newProject = {
          ...data,
          id: Math.random().toString(36).substring(2, 15),
          tasks: [],
        };
        onUpdateProjects([...projects, newProject]);
        form.reset();
      };
    
      const handleEditProject = (data: ProjectFormValues) => {
        if (!editProjectId) return;
        const updatedProjects = projects.map((project) =>
          project.id === editProjectId ? { ...project, name: data.name } : project
        );
        onUpdateProjects(updatedProjects);
        setEditProjectId(null);
        form.reset();
      };
    
      const handleDeleteProject = (id: string) => {
        const updatedProjects = projects.filter((project) => project.id !== id);
        onUpdateProjects(updatedProjects);
      };
    
      const filteredProjects = Array.isArray(projects)
        ? projects.filter((project) =>
            project.name.toLowerCase().includes(projectSearch.toLowerCase())
          )
        : [];
    
      const handleSubmit = (data: ProjectFormValues) => {
        if (editProjectId) {
          handleEditProject(data);
        } else {
          handleAddProject(data);
        }
      };
    
      const handleEditClick = (project: Project) => {
        setEditProjectId(project.id);
        form.setValue("name", project.name);
      };
    
      const handleCancelEdit = () => {
        setEditProjectId(null);
        form.reset();
      };
    
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Manage Projects</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Project name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  {editProjectId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                  <Button type="submit">
                    {editProjectId ? "Update Project" : "Add Project"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-4">
              <Command>
                <CommandInput
                  placeholder="Search project..."
                  onValueChange={setProjectSearch}
                />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  {filteredProjects.map((project) => (
                    <CommandItem key={project.id}>
                      <div className="flex justify-between">
                        {project.name}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(project)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
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
