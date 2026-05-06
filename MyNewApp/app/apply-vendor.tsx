import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
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
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
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
      if (!selectedImageUri) {
        Alert.alert('Image Required', 'Please select a vendor image.');
        setLoading(false);
        return;
      }

      await vendorService.applyAsVendor({ name, location, phone: phone || undefined, imageUri: selectedImageUri });
      Alert.alert('Application Submitted', 'Your vendor application was submitted and is waiting for admin approval.');
      router.back();
    } catch (error) {
      Alert.alert('Failed', getApiErrorMessage(error, 'Could not submit vendor application.'));
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromDevice = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow media access to select vendor image.');
      return;
    }

    setUploadingImage(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImageUri(result.assets[0].uri);
      }
    } finally {
      setUploadingImage(false);
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
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">Vendor Image (Required)</Text>
            <TouchableOpacity
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 items-center"
              onPress={pickImageFromDevice}
              disabled={uploadingImage}
            >
              {selectedImageUri ? (
                <Image source={{ uri: selectedImageUri }} className="w-full h-36 rounded-lg" resizeMode="cover" />
              ) : (
                <Text className="text-gray-600 font-semibold">{uploadingImage ? 'Opening gallery...' : 'Pick image from device'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8">
          <Button title="Submit Application" variant="orange" onPress={handleSubmit} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
