import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../api/client';
import { useCartStore } from '../../store/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function VendorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  const fetchVendorDetails = async () => {
    try {
      // Mocking parallel requests. In real app, you fetch vendor and meals.
      // const vendorRes = await apiClient.get(`/vendors/${id}`);
      // const mealsRes = await apiClient.get(`/meals/vendor/${id}`);
      // setVendor(vendorRes.data);
      // setMeals(mealsRes.data);
      
      // Mock data
      setVendor({ id: id as string, name: 'Campus Cafeteria', location: 'Building A' });
      setMeals([
        { id: 'm1', name: 'Cheeseburger', price: 5.99, description: 'Juicy beef patty with cheese' },
        { id: 'm2', name: 'Caesar Salad', price: 4.50, description: 'Fresh romaine with caesar dressing' },
        { id: 'm3', name: 'Fries', price: 2.99, description: 'Crispy golden fries' },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (meal: any) => {
    if (vendor) {
      addItem(
        { mealId: meal.id, name: meal.name, price: meal.price, quantity: 1 },
        vendor.id,
        vendor.name
      );
    }
  };

  const renderMeal = ({ item }: { item: any }) => (
    <View className="flex-row bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100 items-center justify-between">
      <View className="flex-1 pr-4">
        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>{item.description}</Text>
        <Text className="text-orange-500 font-bold mt-2">${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity 
        className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center shadow-md shadow-orange-500/40"
        onPress={() => handleAddToCart(item)}
      >
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Image Area */}
      <View className="h-64 bg-orange-200 relative">
        <TouchableOpacity 
          className="absolute top-12 left-4 w-10 h-10 bg-white/80 rounded-full items-center justify-center z-10"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
           <Text className="text-6xl text-orange-500/50 font-bold">{vendor?.name?.[0]}</Text>
        </View>
      </View>

      <View className="flex-1 px-6 -mt-10 pt-6 bg-gray-50 rounded-t-[40px]">
        <Text className="text-3xl font-extrabold text-gray-900">{vendor?.name}</Text>
        <Text className="text-gray-500 mt-1 mb-6">{vendor?.location}</Text>
        
        <Text className="text-lg font-bold text-gray-900 mb-4">Menu Items</Text>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={renderMeal}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </View>
  );
}
