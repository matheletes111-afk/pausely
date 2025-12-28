import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/client';
import type { ImpulseTypeEnum } from '@pausely/shared';

const IMPULSE_TYPES: { value: ImpulseTypeEnum; label: string; description: string }[] = [
  {
    value: 'PHONE_USAGE',
    label: 'Phone Usage',
    description: 'Reduce excessive phone checking and scrolling',
  },
  {
    value: 'LATE_NIGHT_EATING',
    label: 'Late Night Eating',
    description: 'Control late-night snacking and binge eating',
  },
  {
    value: 'ONLINE_SHOPPING',
    label: 'Online Shopping',
    description: 'Manage impulsive online purchases',
  },
  {
    value: 'DOOM_SCROLLING',
    label: 'Doom Scrolling',
    description: 'Break the cycle of endless negative news consumption',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<ImpulseTypeEnum[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (types: ImpulseTypeEnum[]) => {
      // Get impulse types from API
      const impulseTypes = await apiRequest<Array<{ id: string; type: ImpulseTypeEnum }>>(
        '/impulse-types'
      );

      // Create user impulse type associations
      const selectedImpulseTypes = impulseTypes.filter((it) => types.includes(it.type));

      await Promise.all(
        selectedImpulseTypes.map((it) =>
          apiRequest('/user-impulse-types', {
            method: 'POST',
            body: JSON.stringify({
              impulseTypeId: it.id,
              isActive: true,
            }),
          })
        )
      );
    },
    onSuccess: () => {
      router.replace('/(tabs)/home');
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to save preferences');
    },
  });

  const toggleType = (type: ImpulseTypeEnum) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleContinue = () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one impulse type');
      return;
    }
    mutate(selectedTypes);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>What would you like to work on?</Text>
      <Text style={styles.subtitle}>
        Select the impulse behaviors you want to control. You can change these later.
      </Text>

      <View style={styles.options}>
        {IMPULSE_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.value);
          return (
            <TouchableOpacity
              key={type.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggleType(type.value)}
            >
              <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                {type.label}
              </Text>
              <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
                {type.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={isPending || selectedTypes.length === 0}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  options: {
    marginBottom: 32,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionSelected: {
    borderColor: '#1a1a1a',
    backgroundColor: '#f9f9f9',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#1a1a1a',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  optionDescriptionSelected: {
    color: '#333',
  },
  button: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

