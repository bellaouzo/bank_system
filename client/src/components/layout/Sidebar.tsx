import { Link, useLocation } from "wouter";
import { LayoutDashboard, CreditCard, ArrowRightLeft, FileText, Settings, LogOut, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/accounts", label: "Accounts", icon: CreditCard },
    { href: "/transfer", label: "Pay & Transfer", icon: ArrowRightLeft },
    { href: "/statements", label: "Statements", icon: FileText },
    { href: "/analysis", label: "Analysis", icon: PieChart },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen fixed left-0 top-0 z-30">
      <div className="p-6 border-b border-sidebar-border/50">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <span className="text-lg font-bold">S</span>
          </div>
          SecureBank
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <a 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-sidebar-primary text-white shadow-sm" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white"
                )}
                data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-sidebar-foreground/50 group-hover:text-white")} />
                {item.label}
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors mt-1">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
