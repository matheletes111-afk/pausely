import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createUrgeSession, completeUrgeSession } from '@/lib/api/urge-sessions';
import { getUrgeSession } from '@/lib/api/urge-sessions';
import { sendAIMessage } from '@/lib/api/ai';
import { Timer } from '@/lib/timer';
import { scheduleTimerNotification } from '@/lib/notifications';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function UrgeSessionScreen() {
  const router = useRouter();
  const { impulseTypeId } = useLocalSearchParams<{ impulseTypeId: string }>();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes default
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<Timer | null>(null);

  const { mutate: createSession } = useMutation({
    mutationFn: createUrgeSession,
    onSuccess: (data) => {
      setSessionId(data.id);
      startTimer(data.timerMinutes * 60);
    },
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: sendAIMessage,
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.content },
      ]);
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const { mutate: completeSession } = useMutation({
    mutationFn: ({ id, outcome }: { id: string; outcome: 'SUCCESS' | 'RELAPSE' | 'ABANDONED' }) =>
      completeUrgeSession(id, outcome),
    onSuccess: () => {
      router.back();
    },
  });

  useEffect(() => {
    if (impulseTypeId) {
      createSession({ impulseTypeId, timerMinutes: 10 });
    }

    return () => {
      if (timerRef.current) {
        timerRef.current.stop();
      }
    };
  }, [impulseTypeId]);

  const startTimer = (duration: number) => {
    if (timerRef.current) {
      timerRef.current.stop();
    }

    setTimeRemaining(duration);
    setIsTimerActive(true);

    // Schedule push notification
    scheduleTimerNotification(
      duration,
      'Timer Complete!',
      'Great job waiting! How did it go?'
    );

    timerRef.current = new Timer(
      duration,
      (remaining) => {
        setTimeRemaining(remaining);
      },
      () => {
        setIsTimerActive(false);
        // Timer completed - show success option
      }
    );

    timerRef.current.start();
  };

  const handleSendMessage = () => {
    if (!message.trim() || !sessionId || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    sendMessage({ sessionId, content: userMessage });
  };

  const handleComplete = (outcome: 'SUCCESS' | 'RELAPSE' | 'ABANDONED') => {
    if (sessionId) {
      if (timerRef.current) {
        timerRef.current.stop();
      }
      completeSession({ id: sessionId, outcome });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.darkBackground}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerLabel}>Time remaining</Text>
        </View>

        <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {messages.length === 0 && (
            <View style={styles.welcomeMessage}>
              <Text style={styles.welcomeText}>
                I'm here to help you through this moment. Take a deep breath. You've got this.
              </Text>
            </View>
          )}
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.aiMessage]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
          {isLoading && (
            <View style={styles.aiMessage}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your thoughts..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!message.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {!isTimerActive && timeRemaining === 0 && (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>Timer completed! How did it go?</Text>
            <View style={styles.completionButtons}>
              <TouchableOpacity
                style={[styles.completionButton, styles.successButton]}
                onPress={() => handleComplete('SUCCESS')}
              >
                <Text style={styles.completionButtonText}>I succeeded</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.completionButton, styles.relapseButton]}
                onPress={() => handleComplete('RELAPSE')}
              >
                <Text style={styles.completionButtonText}>I gave in</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkBackground: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  timerContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#999',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  welcomeMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  message: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  completionContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  completionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  completionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  relapseButton: {
    backgroundColor: '#f44336',
  },
  completionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

