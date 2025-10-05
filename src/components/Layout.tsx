import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { cn } from "../lib/utils";
import { FileJsonIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function Layout() {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Custom Title Bar - Draggable Region with traffic lights space */}
      <div 
        data-tauri-drag-region 
        className="h-12 bg-zinc-50 border-b flex items-center select-none cursor-default"
        style={{ WebkitUserSelect: 'none', WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="w-20" /> {/* Space for macOS traffic lights */}
        <span className="text-sm font-medium text-muted-foreground">cc-config</span>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
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
        <ScrollArea className="flex-1 h-[calc(100vh-3rem)]">
          <main className="">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}