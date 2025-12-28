'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
  streaks?: {
    currentStreak: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/users?page=${page}&pageSize=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="block p-4 border rounded-lg hover:bg-accent"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {user.profile?.firstName || user.profile?.lastName
                        ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                        : user.email}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Streak: {user.streaks?.currentStreak || 0}</div>
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

