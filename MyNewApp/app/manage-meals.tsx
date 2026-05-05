import { IconSymbol } from '@/components/ui/icon-symbol';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage } from '../lib/api-error';
import { mealService } from '../services/meal.service';
import { vendorService } from '../services/vendor.service';
import { useAuthStore } from '../store/authStore';
import type { Vendor } from '../types/domain';

export default function ManageMealsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const isAdmin = !!user?.roles?.includes('ADMIN');
  const isVendor = !!user?.roles?.includes('VENDOR');

  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin && !isVendor) {
      router.replace('/(tabs)/profile' as any);
      return;
    }
    loadContext();
  }, [isAdmin, isVendor]);

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId) ?? null,
    [vendors, selectedVendorId]
  );

  const loadContext = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const allVendors = await vendorService.getAllVendors();
        const approved = allVendors.filter((v) => v.isApproved);
        setVendors(approved);
        if (approved[0]) setSelectedVendorId(approved[0].id);
      } else if (isVendor) {
        const myVendor = await vendorService.getMyVendor();
        setVendors([myVendor]);
        setSelectedVendorId(myVendor.id);
      }
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Could not load vendor data.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeal = async () => {
    const parsedPrice = Number(price);
    if (!name || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid Input', 'Provide a meal name and a valid positive price.');
      return;
    }
    if (isAdmin && !selectedVendorId) {
      Alert.alert('Vendor Required', 'Select a vendor first.');
      return;
    }

    setSaving(true);
    try {
      await mealService.createMeal({
        name,
        price: parsedPrice,
        imageUrl: imageUrl || undefined,
        isDeliveryAvailable,
        isFreeDelivery,
        vendorId: isAdmin ? selectedVendorId : undefined,
      });
      setName('');
      setPrice('');
      setImageUrl('');
      setIsDeliveryAvailable(true);
      setIsFreeDelivery(false);
      Alert.alert('Success', 'Meal added successfully.');
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to add meal.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center" onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={22} color="#000" />
        </TouchableOpacity>

        <Text className="text-3xl font-extrabold text-gray-900 mt-6">Manage Meals</Text>
        <Text className="text-gray-500 mt-2">
          {isAdmin ? 'Select a vendor and add meals.' : 'Add meals to your vendor profile.'}
        </Text>

        <View className="mt-6">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Selected Vendor</Text>
          {vendors.length === 0 ? (
            <Text className="text-red-500">No approved vendor found.</Text>
          ) : (
            <View>
              {vendors.map((vendor) => (
                <TouchableOpacity
                  key={vendor.id}
                  className={`p-3 rounded-xl border ${selectedVendorId === vendor.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
                  onPress={() => isAdmin && setSelectedVendorId(vendor.id)}
                  disabled={!isAdmin}
                  style={{ marginBottom: 8 }}
                >
                  <Text className="font-bold text-gray-900">{vendor.name}</Text>
                  <Text className="text-gray-500">{vendor.location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="mt-6">
          <Input label="Meal Name" placeholder="Chicken Burger" value={name} onChangeText={setName} />
          <View className="mt-4">
            <Input label="Price" placeholder="50" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
          </View>
          <View className="mt-4">
            <Input label="Image URL (Optional)" placeholder="https://..." value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />
          </View>
        </View>

        <View className="mt-6">
          <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200" onPress={() => setIsDeliveryAvailable((v) => !v)}>
            <Text className="font-semibold text-gray-800">Delivery Available</Text>
            <Text className={isDeliveryAvailable ? 'text-green-600 font-bold' : 'text-gray-400 font-bold'}>
              {isDeliveryAvailable ? 'YES' : 'NO'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mt-3" onPress={() => setIsFreeDelivery((v) => !v)}>
            <Text className="font-semibold text-gray-800">Free Delivery</Text>
            <Text className={isFreeDelivery ? 'text-green-600 font-bold' : 'text-gray-400 font-bold'}>
              {isFreeDelivery ? 'YES' : 'NO'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <Button title="Add Meal" variant="orange" onPress={handleCreateMeal} loading={saving} disabled={!selectedVendor && isAdmin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
