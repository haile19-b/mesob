import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getApiErrorMessage } from '../lib/api-error';

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
      await authService.register(name, phone, password);
      const res = await authService.login(phone, password);
      await login(res.token, res.user);

      router.replace('/(tabs)' as any);
    } catch (error) {
      Alert.alert('Registration Failed', getApiErrorMessage(error, 'Something went wrong'));
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

          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join Campus Bites to order your favorite meals.</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
                <View className="mt-4">
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    autoCapitalize="none"
                  />
                </View>
                <View className="mt-4">
                  <Input
                    label="Password"
                    placeholder="Create a password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <View className="mt-6">
                <Button 
                  title="Sign Up" 
                  onPress={handleRegister} 
                  loading={loading} 
                  variant="orange"
                />
              </View>
            </CardContent>
          </Card>

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
