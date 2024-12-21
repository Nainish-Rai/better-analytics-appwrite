"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/websites",
      label: "Manage Websites",
      active: pathname === "/websites",
    },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          <div className="mr-8 font-bold">Analytics</div>
          <div className="flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active ? "text-black" : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
