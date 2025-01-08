import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
    import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Button } from "@/components/ui/button";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useForm } from "react-hook-form";
    import { Priority, Status, Project, Tag, Task, SubTask, Comment } from "@/types/kanban";
    import { useState, useCallback } from "react";
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
    import { Check, Settings } from "lucide-react";
    import { ProjectDialog } from "./ProjectDialog";
    import { TagDialog } from "./TagDialog";
    import { MultiSelect } from "@/components/ui/multi-select";
    
    interface TaskDialogProps {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      status?: Status;
      projects?: Project[];
      tags?: Tag[];
      onCreateTask: (task: Task) => void;
      onUpdateTags: (tags: Tag[]) => void;
    }
    
    interface TaskFormValues {
      title: string;
      description: string;
      priority: Priority;
      status: Status;
      projectId: string;
      tags: Tag[];
      subtasks: SubTask[];
      comments: Comment[];
    }
    
    export function TaskDialog({ open, onOpenChange, status = "not_started", projects = [], tags = [], onCreateTask, onUpdateTags }: TaskDialogProps) {
      const form = useForm<TaskFormValues>({
        defaultValues: {
          title: "",
          description: "",
          priority: "low",
          status,
          projectId: "",
          tags: [],
          subtasks: [],
          comments: [],
        },
      });
    
      const [tagSearch, setTagSearch] = useState("");
      const [projectSearch, setProjectSearch] = useState("");
      const [projectDialogOpen, setProjectDialogOpen] = useState(false);
      const [tagDialogOpen, setTagDialogOpen] = useState(false);
      const [newSubtask, setNewSubtask] = useState("");
      const [newComment, setNewComment] = useState("");
    
      const onSubmit = (data: TaskFormValues) => {
        const newTask = {
          ...data,
          id: Math.random().toString(36).substring(2, 15),
          comments: [{
            id: Math.random().toString(36).substring(2, 15),
            content: newComment,
            createdAt: new Date().toISOString(),
            author: "user",
          }],
          files: [],
        }
        onCreateTask(newTask);
        onOpenChange(false);
      };
    
      const filteredTags = Array.isArray(tags)
        ? tags.filter((tag) =>
            tag.name.toLowerCase().includes(tagSearch.toLowerCase())
          )
        : [];
    
      const filteredProjects = Array.isArray(projects)
        ? projects.filter((project) =>
            project.name.toLowerCase().includes(projectSearch.toLowerCase())
          )
        : [];
    
      const handleAddSubtask = useCallback(() => {
        if (newSubtask.trim() === "") return;
        form.setValue("subtasks", [
          ...form.getValues("subtasks"),
          {
            id: Math.random().toString(36).substring(2, 15),
            title: newSubtask,
            completed: false,
          },
        ]);
        setNewSubtask("");
      }, [form, newSubtask]);
    
      const handleSubtaskChange = useCallback((id: string, completed: boolean) => {
        form.setValue(
          "subtasks",
          form.getValues("subtasks").map((subtask) =>
            subtask.id === id ? { ...subtask, completed } : subtask
          )
        );
      }, [form]);
    
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Task title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Task description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>Project</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setProjectDialogOpen(true)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <MultiSelect
                            tags={filteredTags}
                            value={field.value.map(tag => tag.name)}
                            onValueChange={(value) => {
                              form.setValue("tags", tags.filter(tag => value.includes(tag.name)));
                            }}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setTagDialogOpen(true)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Subtasks</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Add a subtask"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                      />
                    </FormControl>
                    <Button type="button" onClick={handleAddSubtask}>
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {form.getValues("subtasks").map((subtask, index) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Checkbox
                          id={subtask.id}
                          checked={subtask.completed}
                          onCheckedChange={(checked) =>
                            handleSubtaskChange(subtask.id, checked)
                          }
                        />
                        <label
                          htmlFor={subtask.id}
                          className="text-sm leading-none"
                        >
                          {subtask.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </FormItem>
                 <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a comment"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </form>
            </Form>
            <ProjectDialog
              open={projectDialogOpen}
              onOpenChange={setProjectDialogOpen}
              projects={projects}
              onUpdateProjects={() => {}}
            />
            <TagDialog
              open={tagDialogOpen}
              onOpenChange={setTagDialogOpen}
              tags={tags}
              onUpdateTags={onUpdateTags}
            />
          </DialogContent>
        </Dialog>
      );
    }
