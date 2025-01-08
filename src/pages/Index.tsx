import { ThemeProvider, ThemeToggle } from "@/components/theme/ThemeProvider";
    import { KanbanBoard } from "@/components/kanban/KanbanBoard";
    
    // Sample data for demonstration
    const sampleData = {
      projects: [
        { id: "1", name: "Project A", tasks: [] },
        { id: "2", name: "Project B", tasks: [] },
        { id: "3", name: "Project C", tasks: [] },
        { id: "4", name: "Project D", tasks: [] },
      ],
      tasks: [
        {
          id: "1",
          title: "Implement authentication",
          description: "Add user login and registration",
          status: "in_progress",
          priority: "high",
          projectId: "1",
          tags: ["Frontend", "Security"],
          subtasks: [
            { id: "1", title: "Setup auth provider", completed: true },
            { id: "2", title: "Create login form", completed: false },
          ],
          comments: [],
          files: [],
        },
        {
          id: "2",
          title: "Design system update",
          description: "Update component library",
          status: "not_started",
          priority: "medium",
          projectId: "1",
          tags: ["Design"],
          subtasks: [],
          comments: [],
          files: [],
        },
        {
          id: "3",
          title: "API Documentation",
          description: "Write API documentation",
          status: "done",
          priority: "low",
          projectId: "2",
          tags: ["Documentation"],
          subtasks: [
            { id: "3", title: "Document endpoints", completed: true },
            { id: "4", title: "Add examples", completed: true },
          ],
          comments: [],
          files: [],
        },
      ],
      tags: [
        { id: "1", name: "Frontend", color: "#9b87f5" },
        { id: "2", name: "Security", color: "#ef4444" },
        { id: "3", name: "Design", color: "#22c55e" },
        { id: "4", name: "Documentation", color: "#f59e0b" },
        { id: "5", name: "Maison", color: "#a855f7" },
        { id: "6", name: "Loisin", color: "#f97316" },
        { id: "7", name: "Chauffage", color: "#b45309" },
      ]
    };
    
    const Index = () => {
      return (
        <ThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            <ThemeToggle />
            <main className="container mx-auto py-8">
              <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
              <KanbanBoard
                projects={sampleData.projects}
                tasks={sampleData.tasks as any}
                tags={sampleData.tags as any}
              />
            </main>
          </div>
        </ThemeProvider>
      );
    };
    
    export default Index;
