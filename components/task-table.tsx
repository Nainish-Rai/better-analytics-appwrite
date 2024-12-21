import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const tasks = [
  {
    id: 1,
    feature: "User Authentication",
    description: "Implement Appwrite authentication system",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    feature: "Website Management",
    description: "CRUD operations for website tracking",
    status: "pending",
    priority: "high",
  },
  {
    id: 3,
    feature: "Tracking Script",
    description: "Create lightweight tracking script",
    status: "pending",
    priority: "high",
  },
  {
    id: 4,
    feature: "Real-time Dashboard",
    description: "Implement WebSocket for live updates",
    status: "pending",
    priority: "medium",
  },
  // Add more tasks as needed
];

export function TaskTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.feature}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>
              <Badge
                variant={task.status === "completed" ? "default" : "secondary"}
              >
                {task.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={task.priority === "high" ? "destructive" : "default"}
              >
                {task.priority}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
