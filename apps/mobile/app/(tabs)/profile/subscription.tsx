import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import type { SubscriptionResponse } from '@pausely/shared';

export default function SubscriptionScreen() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => apiRequest<SubscriptionResponse>('/subscriptions/current'),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  const plan = subscription?.plan || 'FREE';
  const isPremium = plan === 'PREMIUM';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Subscription</Text>

      <View style={styles.planCard}>
        <Text style={styles.planName}>{plan}</Text>
        <Text style={styles.planDescription}>
          {isPremium
            ? 'Unlimited AI coaching sessions and advanced analytics'
            : '5 AI sessions per month'}
        </Text>
      </View>

      {!isPremium && (
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      )}

      {isPremium && (
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Your subscription is active. You have access to all premium features.
          </Text>
        </View>
      )}
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
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
  },
});

