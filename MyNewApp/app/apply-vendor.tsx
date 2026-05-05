import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage } from '../lib/api-error';
import { vendorService } from '../services/vendor.service';
import { useAuthStore } from '../store/authStore';

export default function ApplyVendorScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isVendor = !!user?.roles?.includes('VENDOR');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token || !user) {
      Alert.alert('Authentication Required', 'Please login first.');
      router.replace('/login' as any);
      return;
    }

    if (!name || !location) {
      Alert.alert('Missing Fields', 'Vendor name and location are required.');
      return;
    }

    if (isVendor) {
      Alert.alert('Already Vendor', 'You already have vendor access.');
      router.replace('/vendor-dashboard' as any);
      return;
    }

    setLoading(true);
    try {
      await vendorService.applyAsVendor({ name, location, phone: phone || undefined });
      Alert.alert('Application Submitted', 'Your vendor application was submitted and is waiting for admin approval.');
      router.back();
    } catch (error) {
      Alert.alert('Failed', getApiErrorMessage(error, 'Could not submit vendor application.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 px-6">
        <TouchableOpacity
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mt-2"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>

        <View className="mt-6">
          <Text className="text-3xl font-extrabold text-gray-900">Apply As Vendor</Text>
          <Text className="text-gray-500 mt-2">
            Submit your cafeteria/cafe/lounge details. Admin approval is required before vendor access.
          </Text>
        </View>

        <View className="mt-8 gap-4">
          <Input label="Vendor Name" placeholder="Campus Central Cafe" value={name} onChangeText={setName} />
          <Input label="Location" placeholder="Building A, Ground Floor" value={location} onChangeText={setLocation} />
          <Input label="Phone (Optional)" placeholder="09xxxxxxxx" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>

        <View className="mt-8">
          <Button title="Submit Application" variant="orange" onPress={handleSubmit} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
