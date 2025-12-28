'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  slug: string;
  seatCount: number;
  organizationUsers: Array<{
    user: {
      id: string;
      email: string;
    };
  }>;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/organizations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <Button>Create Organization</Button>
      </div>
      <div className="grid gap-4">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle>{org.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Slug:</span> {org.slug}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Seats:</span> {org.seatCount}
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Users:</span>{' '}
                  {org.organizationUsers.length}
                </div>
                <Link href={`/admin/organizations/${org.id}`}>
                  <Button variant="outline" className="mt-4">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        {organizations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No organizations yet
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

