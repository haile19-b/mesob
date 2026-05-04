import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // In a real app:
      /*
      await apiClient.post('/auth/register', { name, phone, password });
      const res = await apiClient.post('/auth/login', { phone, password });
      await login(res.data.token, res.data.user);
      */
      
      // Mock Register
      await new Promise(r => setTimeout(r, 1000));
      await login('fake-jwt-token', {
        id: 'user-1',
        name,
        phone,
        roles: ['USER']
      });

      router.replace('/(tabs)' as any);
    } catch (error: any) {
      Alert.alert('Registration Failed', error?.response?.data?.message || 'Something went wrong');
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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
          <TouchableOpacity 
            className="absolute top-4 left-0 w-10 h-10 bg-gray-100 rounded-full items-center justify-center z-10"
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>

          <View className="mb-10 mt-12">
            <Text className="text-4xl font-extrabold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-gray-500 text-base">Join Campus Bites to order your favorite meals.</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-bold text-gray-700 mb-1 ml-1">Phone Number</Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-bold text-gray-700 mb-1 ml-1">Password</Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg"
                placeholder="Create a password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity 
            className={`w-full bg-orange-500 py-4 rounded-2xl mt-10 shadow-lg shadow-orange-500/30 ${loading ? 'opacity-70' : ''}`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
              <Text className="text-orange-500 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
