import { useState, useCallback } from "react";
    import { Task, GroupBy, Project, Priority, Status, Tag } from "@/types/kanban";
    import { KanbanColumn } from "./KanbanColumn";
    import { KanbanTask } from "./KanbanTask";
    import { TaskDialog } from "./TaskDialog";
    import { Button } from "@/components/ui/button";
    import { Settings, Search } from "lucide-react";
    import { ProjectDialog } from "./ProjectDialog";
    import { TagDialog } from "./TagDialog";
    import { Input } from "@/components/ui/input";
    
    interface KanbanBoardProps {
      projects: Project[];
      tasks: Task[];
      tags: Tag[];
    }
    
    export function KanbanBoard({ projects: initialProjects, tasks, tags: initialTags }: KanbanBoardProps) {
      const [groupBy, setGroupBy] = useState<GroupBy>("status");
      const [allTasks, setAllTasks] = useState<Task[]>(tasks);
      const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
      const [allTags, setAllTags] = useState<Tag[]>(initialTags);
      const [projectDialogOpen, setProjectDialogOpen] = useState(false);
      const [tagDialogOpen, setTagDialogOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState("");
    
      const getGroupedTasks = () => {
        const filteredTasks = allTasks.filter(task => {
          const searchLower = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower) ||
            task.comments.some(comment => comment.content.toLowerCase().includes(searchLower))
          );
        });
    
        switch (groupBy) {
          case "status":
            return {
              "Not Started": filteredTasks.filter((task) => task.status === "not_started"),
              "In Progress": filteredTasks.filter((task) => task.status === "in_progress"),
              Done: filteredTasks.filter((task) => task.status === "done"),
            };
          case "priority":
            return {
              High: filteredTasks.filter((task) => task.priority === "high"),
              Medium: filteredTasks.filter((task) => task.priority === "medium"),
              Low: filteredTasks.filter((task) => task.priority === "low"),
            };
          case "project":
            const projectGroups: Record<string, Task[]> = {};
            allProjects.forEach((project) => {
              projectGroups[project.name] = filteredTasks.filter(
                (task) => task.projectId === project.id
              );
            });
            return projectGroups;
          default:
            return {} as Record<string, Task[]>;
        }
      };
    
      const getStatusFromTitle = (title: string): Status | undefined => {
        const statusMap: Record<string, Status> = {
          "Not Started": "not_started",
          "In Progress": "in_progress",
          "Done": "done"
        };
        return statusMap[title];
      };
    
      const handleCreateTask = useCallback((newTask: Task) => {
        setAllTasks((prevTasks) => [...prevTasks, newTask]);
      }, []);
    
      const handleUpdateProjects = useCallback((updatedProjects: Project[]) => {
        setAllProjects(updatedProjects);
      }, []);
    
      const handleUpdateTags = useCallback((updatedTags: Tag[]) => {
        setAllTags(updatedTags);
      }, []);
    
      const groupedTasks = getGroupedTasks();
      const unfinishedTasks = allTasks.filter((task) => task.status !== "done");
    
      return (
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                className="px-3 py-2 rounded-md border bg-background"
              >
                <option value="status">Group by Status</option>
                <option value="priority">Group by Priority</option>
                <option value="project">Group by Project</option>
              </select>
              <div className="relative">
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-transparent px-4 py-2 rounded-lg">
                <span className="text-red-500 font-bold">
                  Unfinished Tasks: {unfinishedTasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon" title="Manage projects" onClick={() => setProjectDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Manage tags" onClick={() => setTagDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(groupedTasks).map(([columnTitle, columnTasks]) => (
              <KanbanColumn
                key={columnTitle}
                title={columnTitle}
                count={columnTasks.length}
                status={groupBy === "status" ? getStatusFromTitle(columnTitle) : undefined}
                projects={allProjects}
                tags={allTags}
              >
                {columnTasks.map((task) => (
                  <KanbanTask key={task.id} task={task} />
                ))}
                <TaskDialog
                  open={false}
                  onOpenChange={() => {}}
                  status={groupBy === "status" ? getStatusFromTitle(columnTitle) : undefined}
                  projects={allProjects}
                  tags={allTags}
                  onCreateTask={handleCreateTask}
                />
              </KanbanColumn>
            ))}
          </div>
          <ProjectDialog
            open={projectDialogOpen}
            onOpenChange={setProjectDialogOpen}
            projects={allProjects}
            onUpdateProjects={handleUpdateProjects}
          />
          <TagDialog
            open={tagDialogOpen}
            onOpenChange={setTagDialogOpen}
            tags={allTags}
            onUpdateTags={handleUpdateTags}
          />
        </div>
      );
    }
