import { Navbar } from '../components/Navbar';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
