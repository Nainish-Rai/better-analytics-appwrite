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
    status: "completed",
    priority: "high",
  },
  {
    id: 2,
    feature: "Website Management",
    description: "CRUD operations for website tracking",
    status: "completed",
    priority: "high",
  },
  {
    id: 3,
    feature: "Basic Tracking Script",
    description: "Initial tracking script implementation",
    status: "completed",
    priority: "high",
  },
  {
    id: 4,
    feature: "Advanced Event Tracking",
    description: "Custom event tracking and user interactions",
    status: "in_progress", // Update status to show progress
    priority: "high",
  },
  {
    id: 5,
    feature: "Session Analytics",
    description: "Track user sessions and time on page",
    status: "pending",
    priority: "medium",
  },
  {
    id: 6,
    feature: "Real-time Dashboard",
    description: "Implement WebSocket for live updates",
    status: "pending",
    priority: "medium",
  },

  {
    id: 7,
    feature: "User Flow Visualization",
    description: "Visual representation of user journeys",
    status: "pending",
    priority: "medium",
  },
  {
    id: 8,
    feature: "Conversion Funnels",
    description: "Track and analyze conversion paths",
    status: "pending",
    priority: "medium",
  },
  {
    id: 9,
    feature: "Data Export",
    description: "Export analytics data in various formats",
    status: "pending",
    priority: "low",
  },
  {
    id: 10,
    feature: "Team Collaboration",
    description: "Multi-user access and role management",
    status: "pending",
    priority: "low",
  },
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
