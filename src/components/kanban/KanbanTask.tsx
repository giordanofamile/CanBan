import { Task } from "@/types/kanban";
    import { CheckSquare, Eye, Pencil } from "lucide-react";
    import { Button } from "@/components/ui/button";
    import { useState } from "react";
    import { TaskDialog } from "./TaskDialog";
    
    interface KanbanTaskProps {
      task: Task;
    }
    
    export function KanbanTask({ task }: KanbanTaskProps) {
      const [dialogOpen, setDialogOpen] = useState(false);
    
      const getPriorityColor = (priority: Task["priority"]) => {
        switch (priority) {
          case "high":
            return "bg-priority-high";
          case "medium":
            return "bg-priority-medium";
          case "low":
            return "bg-priority-low";
          default:
            return "bg-gray-500";
        }
      };
    
      const completedSubtasks = task.subtasks.filter((st) => st.completed).length;
    
      return (
        <div className="bg-background rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow animate-fade-in">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-medium">{task.title}</h3>
              <span
                className={`${getPriorityColor(
                  task.priority
                )} text-white text-xs px-2 py-1 rounded mt-1 inline-block`}
              >
                {task.priority}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" title="View task" onClick={() => setDialogOpen(true)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Edit task" onClick={() => setDialogOpen(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          )}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: "#9b87f540", color: "#9b87f5" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {task.subtasks.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <CheckSquare className="w-4 h-4 mr-1" />
              {completedSubtasks}/{task.subtasks.length}
            </div>
          )}
          <TaskDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen}
            status={task.status}
            projects={[]}
            tags={[]}
            onCreateTask={() => {}}
          />
        </div>
      );
    }
