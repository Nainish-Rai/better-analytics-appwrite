import { TaskTable } from "@/components/task-table";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">
        Web Analytics Development Tasks
      </h1>
      <TaskTable />
    </main>
  );
}
