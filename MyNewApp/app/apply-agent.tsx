import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ApplyAgentScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!accountNumber) {
      Alert.alert('Error', 'Please provide an account number for payouts.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountNumber,
        workingHours: [
          { day: 'Monday', startTime: '08:00', endTime: '18:00' },
          { day: 'Tuesday', startTime: '08:00', endTime: '18:00' },
        ]
      };
      
      // await apiClient.post('/agents/apply', payload);
      
      // Mock Request
      await new Promise(r => setTimeout(r, 1000));
      
      Alert.alert('Success', 'Your application has been submitted and is pending admin approval.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <TouchableOpacity 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-8"
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>

          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-gray-900 mb-2">Deliver with Us</Text>
            <Text className="text-gray-500 text-base leading-6">
              Earn money by delivering food to your fellow students on campus. Apply below to become an agent.
            </Text>
          </View>

          <View className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-6 flex-row items-center">
            <IconSymbol name="info.circle.fill" size={24} color="#a855f7" />
            <Text className="text-purple-800 font-semibold ml-3 flex-1">
              Admins will review your application. Once approved, you can start accepting orders!
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1 ml-1">Bank Account Number</Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg"
                placeholder="Enter your account number for payouts"
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={setAccountNumber}
              />
            </View>
          </View>

          <TouchableOpacity 
            className={`w-full bg-orange-500 py-4 rounded-2xl mt-10 shadow-lg shadow-orange-500/30 ${loading ? 'opacity-70' : ''}`}
            onPress={handleApply}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Submit Application</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
