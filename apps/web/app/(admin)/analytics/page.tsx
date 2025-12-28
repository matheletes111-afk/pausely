'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const [streakData, setStreakData] = useState<any[]>([]);
  const [aiUsageData, setAiUsageData] = useState<any[]>([]);
  const [impulseData, setImpulseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const [sessionsRes, usersRes] = await Promise.all([
        fetch('/api/urge-sessions?limit=1000', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/users?pageSize=100', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const sessions = await sessionsRes.json();
      const usersData = await usersRes.json();

      // Process streak data (simplified - would need proper aggregation)
      const streakChartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          streaks: Math.floor(Math.random() * 50) + 20, // Placeholder
        };
      });
      setStreakData(streakChartData);

      // Process AI usage data
      const aiUsageChartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sessions: Math.floor(Math.random() * 100) + 50, // Placeholder
        };
      });
      setAiUsageData(aiUsageChartData);

      // Process impulse type frequency
      const impulseFrequency: Record<string, number> = {};
      if (Array.isArray(sessions)) {
        sessions.forEach((session: any) => {
          const type = session.impulseType?.name || 'Unknown';
          impulseFrequency[type] = (impulseFrequency[type] || 0) + 1;
        });
      }

      const impulseChartData = Object.entries(impulseFrequency).map(([name, value]) => ({
        name,
        value,
      }));
      setImpulseData(impulseChartData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Streaks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={streakData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="streaks" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Usage Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sessions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Common Impulse Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impulseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {impulseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

