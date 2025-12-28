'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    activeStreaks: 0,
    totalOrganizations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const [usersRes, sessionsRes, orgsRes] = await Promise.all([
          fetch('/api/users?pageSize=1', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/urge-sessions?limit=1', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/organizations', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await usersRes.json();
        const sessionsData = await sessionsRes.json();
        const orgsData = await orgsRes.json();

        setStats({
          totalUsers: usersData.total || 0,
          totalSessions: Array.isArray(sessionsData) ? sessionsData.length : 0,
          activeStreaks: 0, // Would need separate endpoint
          totalOrganizations: Array.isArray(orgsData) ? orgsData.length : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sessions</CardTitle>
            <CardDescription>Urge intervention sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Streaks</CardTitle>
            <CardDescription>Users with active streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeStreaks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Corporate wellness orgs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrganizations}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

