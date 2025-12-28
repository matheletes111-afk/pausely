import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="text-2xl font-bold">
              Pausely Admin
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/dashboard" className="text-sm hover:underline">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-sm hover:underline">
                Users
              </Link>
              <Link href="/admin/organizations" className="text-sm hover:underline">
                Organizations
              </Link>
              <Link href="/admin/analytics" className="text-sm hover:underline">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

