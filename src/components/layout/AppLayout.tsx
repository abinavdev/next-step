import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background animate-fade-in">
      <Sidebar />
      <main className="ml-0 md:ml-64 flex-1 transition-all duration-300 pb-20 md:pb-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
