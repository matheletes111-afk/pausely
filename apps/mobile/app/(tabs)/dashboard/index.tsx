import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getCurrentStreak } from '@/lib/api/streaks';
import { getUrgeSessions } from '@/lib/api/urge-sessions';

export default function DashboardScreen() {
  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['currentStreak'],
    queryFn: getCurrentStreak,
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['urgeSessions'],
    queryFn: getUrgeSessions,
  });

  if (streakLoading || sessionsLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  const successSessions = sessions?.filter((s) => s.outcome === 'SUCCESS') || [];
  const totalSessions = sessions?.length || 0;
  const successRate = totalSessions > 0 ? Math.round((successSessions.length / totalSessions) * 100) : 0;

  const impulseFrequency: Record<string, number> = {};
  sessions?.forEach((session) => {
    const type = session.impulseType.name;
    impulseFrequency[type] = (impulseFrequency[type] || 0) + 1;
  });

  const recentSessions = sessions?.slice(0, 5) || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak?.currentStreak || 0}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Total Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{successRate}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Impulse Frequency</Text>
        {Object.entries(impulseFrequency).map(([type, count]) => (
          <View key={type} style={styles.frequencyItem}>
            <Text style={styles.frequencyType}>{type}</Text>
            <Text style={styles.frequencyCount}>{count}</Text>
          </View>
        ))}
        {Object.keys(impulseFrequency).length === 0 && (
          <Text style={styles.emptyText}>No sessions yet</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {recentSessions.map((session) => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionType}>{session.impulseType.name}</Text>
              <Text style={styles.sessionDate}>
                {new Date(session.startedAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.sessionOutcome}>
              {session.outcome || 'In Progress'}
            </Text>
            {session.summary && (
              <Text style={styles.sessionSummary} numberOfLines={2}>
                {session.summary}
              </Text>
            )}
          </View>
        ))}
        {recentSessions.length === 0 && (
          <Text style={styles.emptyText}>No sessions yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  frequencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  frequencyType: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  frequencyCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sessionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  sessionOutcome: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sessionSummary: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

