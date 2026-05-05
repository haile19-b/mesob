import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CartScreen() {
  const { items, vendorName, getTotal, updateQuantity, clearCart } = useCartStore();
  const { token } = useAuthStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    if (!token) {
      Alert.alert(
        'Authentication Required',
        'You need to be logged in to place an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login' as any) }
        ]
      );
      return;
    }

    // Proceed to checkout flow
    router.push('/checkout' as any);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-100">
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
        <Text className="text-orange-500 font-semibold">${item.price.toFixed(2)}</Text>
      </View>
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity 
          className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
          onPress={() => updateQuantity(item.mealId, item.quantity - 1)}
        >
          <Text className="text-xl font-bold text-gray-600">-</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold w-6 text-center">{item.quantity}</Text>
        <TouchableOpacity 
          className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center"
          onPress={() => updateQuantity(item.mealId, item.quantity + 1)}
        >
          <Text className="text-xl font-bold text-orange-600">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text className="text-red-500 font-bold">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <IconSymbol name="cart.fill" size={64} color="#d1d5db" />
          <Text className="text-gray-500 text-lg mt-4 text-center">Your cart is empty.</Text>
          <TouchableOpacity 
            className="mt-6 bg-orange-500 px-6 py-3 rounded-full"
            onPress={() => router.push('/(tabs)' as any)}
          >
            <Text className="text-white font-bold">Browse Food</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="px-6 pb-2">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              From: {vendorName}
            </Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.mealId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          />
          <View className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 text-lg">Total Amount</Text>
              <Text className="text-2xl font-extrabold text-gray-900">${getTotal().toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              className="bg-orange-500 py-4 rounded-2xl items-center shadow-lg shadow-orange-500/30"
              onPress={handleCheckout}
            >
              <Text className="text-white font-bold text-lg">Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
