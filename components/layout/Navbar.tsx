"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/feedback/", label: "Submit Feedback" },
  { href: "/dashboard/", label: "Dashboard" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">Quippi</span>
          </Link>
          <div className="flex space-x-1">
            {navLinks.map((link) => {
              // Normalize pathname for comparison (handle trailing slashes)
              const normalizedPathname = pathname?.replace(/\/$/, "") || "/";
              const normalizedHref = link.href === "/" ? "/" : link.href.replace(/\/$/, "");
              const isActive = normalizedPathname === normalizedHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
