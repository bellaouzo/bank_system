import { Sidebar } from "./Sidebar.tsx";
import { Header } from "./Header.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
