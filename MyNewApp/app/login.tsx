import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone and password');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would uncomment this:
      /*
      const res = await apiClient.post('/auth/login', { phone, password });
      await login(res.data.token, res.data.user);
      */
      
      // Mock Login
      await new Promise(r => setTimeout(r, 1000));
      await login('fake-jwt-token', {
        id: 'user-1',
        name: 'John Doe',
        phone: phone,
        roles: ['USER']
      });

      router.replace('/(tabs)' as any);
    } catch (error: any) {
      Alert.alert('Login Failed', error?.response?.data?.message || 'Invalid credentials');
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
        <View className="px-6 flex-1 justify-center relative">
          <TouchableOpacity 
            className="absolute top-4 left-6 w-10 h-10 bg-gray-100 rounded-full items-center justify-center z-10"
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>

          <View className="mb-10 mt-12">
            <Text className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-500 text-base">Sign in to continue ordering delicious campus food.</Text>
          </View>

          <View className="space-y-4">
            <View>
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
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Pressable 
            className={`w-full bg-orange-500 py-4 rounded-2xl mt-10 shadow-lg shadow-orange-500/30 active:opacity-80 ${loading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">Sign In</Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register' as any)}>
              <Text className="text-orange-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
