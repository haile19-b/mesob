import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getApiErrorMessage } from '../lib/api-error';

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
      const res = await authService.login(phone, password);
      await login(res.token, res.user);

      router.replace('/(tabs)' as any);
    } catch (error) {
      Alert.alert('Login Failed', getApiErrorMessage(error, 'Invalid credentials'));
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

          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to continue ordering delicious campus food.</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="space-y-4">
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  autoCapitalize="none"
                />
                <View className="mt-4">
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <View className="mt-6">
                <Button 
                  title="Sign In" 
                  onPress={handleLogin} 
                  loading={loading} 
                  variant="orange"
                />
              </View>
            </CardContent>
          </Card>

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
