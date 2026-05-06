import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore } from '../../store/cartStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Meal, Vendor } from '../../types/domain';
import { vendorService } from '../../services/vendor.service';
import { getApiErrorMessage } from '../../lib/api-error';

export default function VendorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const cartVendorId = useCartStore((state) => state.vendorId);
  const cartTotal = useCartStore((state) => state.getTotal());

  const vendorId = typeof id === 'string' ? id : null;

  useFocusEffect(
    useCallback(() => {
      if (!vendorId) return;

      fetchVendorDetails(vendorId, { showLoading: !vendor, showRefreshing: false });

      const intervalId = setInterval(() => {
        refreshMeals(vendorId);
      }, 10000);

      return () => clearInterval(intervalId);
    }, [vendorId, vendor])
  );

  const fetchVendorDetails = async (
    vendorId: string,
    options?: { showLoading?: boolean; showRefreshing?: boolean }
  ) => {
    setError(null);
    const showLoading = options?.showLoading ?? true;
    const showRefreshing = options?.showRefreshing ?? false;

    if (showLoading) setLoading(true);
    if (showRefreshing) setRefreshing(true);
    try {
      const [vendorData, mealData] = await Promise.all([
        vendorService.getVendorDetails(vendorId),
        vendorService.getVendorMeals(vendorId),
      ]);
      setVendor(vendorData);
      setMeals(Array.isArray(mealData) ? mealData : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load vendor details.'));
    } finally {
      if (showRefreshing) setRefreshing(false);
      if (showLoading) setLoading(false);
    }
  };

  const refreshMeals = async (vendorId: string) => {
    try {
      const mealData = await vendorService.getVendorMeals(vendorId);
      setMeals(Array.isArray(mealData) ? mealData : []);
    } catch {
      return;
    }
  };

  const handleAddToCart = (meal: Meal) => {
    if (vendor) {
      addItem(
        { mealId: meal.id, name: meal.name, price: meal.price, quantity: 1 },
        vendor.id,
        vendor.name
      );
    }
  };

  const getMealQuantityInCart = (mealId: string): number => {
    return cartItems.find((item) => item.mealId === mealId)?.quantity ?? 0;
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <View className="bg-white rounded-2xl mb-4 p-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-xl mr-3" resizeMode="cover" />
          ) : (
            <View className="w-16 h-16 rounded-xl mr-3 bg-orange-100 items-center justify-center">
              <Text className="text-orange-600 font-bold text-xl">{item.name?.[0] ?? 'M'}</Text>
            </View>
          )}
          <View className="flex-1 pr-3">
            <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
            <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
              {item.description || 'Freshly prepared meal.'}
            </Text>
            <Text className="text-orange-500 font-bold mt-2">${item.price.toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center shadow-md shadow-orange-500/40"
          onPress={() => handleAddToCart(item)}
        >
          <IconSymbol name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {getMealQuantityInCart(item.id) > 0 ? (
        <View className="mt-3 self-start bg-green-100 px-3 py-1 rounded-full">
          <Text className="text-green-700 font-semibold text-xs">In cart: {getMealQuantityInCart(item.id)}</Text>
        </View>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-gray-50">
        <Text className="text-center text-red-500">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 px-5 py-3 rounded-xl"
          onPress={() => vendorId && fetchVendorDetails(vendorId)}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
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
        <TouchableOpacity
          className="absolute top-12 right-4 w-10 h-10 bg-white/80 rounded-full items-center justify-center z-10"
          onPress={() => router.push('/(tabs)/cart' as any)}
        >
          <IconSymbol name="cart.fill" size={20} color="#111827" />
        </TouchableOpacity>
        <View className="absolute inset-0 items-center justify-center" pointerEvents="none">
           <Text className="text-6xl text-orange-500/50 font-bold">{vendor?.name?.[0]}</Text>
        </View>
      </View>

      <View className="flex-1 px-6 -mt-10 pt-6 bg-gray-50 rounded-t-[40px]">
        <Text className="text-3xl font-extrabold text-gray-900">{vendor?.name}</Text>
        <Text className="text-gray-500 mt-1 mb-6">{vendor?.location}</Text>
        
        <Text className="text-lg font-bold text-gray-900 mb-4">Menu Items</Text>
        {meals.length === 0 ? (
          <Text className="text-gray-500">This vendor has no meals listed yet.</Text>
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.id}
            renderItem={renderMeal}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshing={refreshing}
            onRefresh={() =>
              vendorId ? fetchVendorDetails(vendorId, { showLoading: false, showRefreshing: true }) : undefined
            }
          />
        )}
      </View>

      {vendor?.id && cartVendorId === vendor.id && cartItems.length > 0 ? (
        <TouchableOpacity
          className="absolute bottom-5 left-6 right-6 bg-orange-500 rounded-2xl px-5 py-4 shadow-lg shadow-orange-500/40 flex-row items-center justify-between"
          onPress={() => router.push('/(tabs)/cart' as any)}
        >
          <View>
            <Text className="text-white font-bold">{cartItems.length} item(s) in cart</Text>
            <Text className="text-orange-100 text-xs">Tap to review and checkout</Text>
          </View>
          <Text className="text-white font-extrabold">${cartTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
