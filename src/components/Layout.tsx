import { Outlet, NavLink } from "react-router-dom";
import { useCurrentStore } from "../lib/query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { FileJsonIcon, SettingsIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function Layout() {
  const navigate = useNavigate();
  const { data: currentStore } = useCurrentStore();

  return (
    <div className="min-h-screen bg-background flex">
      <nav className="w-[200px] bg-zinc-50">
        <ul className="px-3 pt-3">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl cursor-default select-none",
                  isActive && "bg-primary text-primary-foreground"
                )
              }
            >
              <FileJsonIcon size={14} />
              配置
            </NavLink>
          </li>
        </ul>
      </nav>
      <ScrollArea className="flex-1 h-screen">
        <main className="">
          <Outlet />
        </main>
      </ScrollArea>
    </div>
  );
}