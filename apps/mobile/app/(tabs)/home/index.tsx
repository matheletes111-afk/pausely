import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getCurrentStreak } from '@/lib/api/streaks';
import { getUserImpulseTypes } from '@/lib/api/impulse-types';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedImpulseType, setSelectedImpulseType] = useState<string | null>(null);

  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['currentStreak'],
    queryFn: getCurrentStreak,
  });

  const { data: impulseTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['userImpulseTypes'],
    queryFn: getUserImpulseTypes,
  });

  const activeTypes = impulseTypes?.filter((it) => it.isActive) || [];

  const handleUrgePress = () => {
    if (activeTypes.length === 0) {
      return;
    }
    if (activeTypes.length === 1) {
      router.push({
        pathname: '/(tabs)/home/urge-session',
        params: { impulseTypeId: activeTypes[0].id },
      });
    } else {
      // Show selection modal or navigate to selection screen
      // For now, just use the first one
      router.push({
        pathname: '/(tabs)/home/urge-session',
        params: { impulseTypeId: activeTypes[0].id },
      });
    }
  };

  if (streakLoading || typesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Pausely</Text>
        <Text style={styles.subtitle}>Take control, one moment at a time</Text>
      </View>

      <View style={styles.streakCard}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakNumber}>{streak?.currentStreak || 0}</Text>
        <Text style={styles.streakSubtext}>days strong</Text>
        {streak?.longestStreak && streak.longestStreak > 0 && (
          <Text style={styles.longestStreak}>Best: {streak.longestStreak} days</Text>
        )}
      </View>

      <TouchableOpacity style={styles.urgeButton} onPress={handleUrgePress}>
        <Text style={styles.urgeButtonText}>I feel an urge</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  streakCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  longestStreak: {
    fontSize: 12,
    color: '#999',
  },
  urgeButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  urgeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

