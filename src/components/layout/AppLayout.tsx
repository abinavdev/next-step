import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="ml-64 flex-1 transition-all duration-300">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
