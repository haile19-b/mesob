import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { orderService } from '../services/order.service';
import { Button } from '@/components/ui/button';
import type { Agent } from '../types/domain';
import { getApiErrorMessage } from '../lib/api-error';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, vendorId, vendorName, getTotal, orderType, setOrderType, clearCart } = useCartStore();
  const token = useAuthStore((state) => state.token);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 || !vendorId) {
      router.replace('/(tabs)/cart' as any);
      return;
    }

    if (!token) {
      Alert.alert('Authentication Required', 'Please login before placing an order.', [
        { text: 'Go to Login', onPress: () => router.replace('/login' as any) },
      ]);
      return;
    }

    if (orderType === 'DELIVERY') {
      fetchAgents();
    }
  }, [orderType, vendorId, items.length, token]);

  const fetchAgents = async () => {
    if (!vendorId) return;
    setLoadingAgents(true);
    setAgentError(null);
    try {
      const agentsList = await orderService.getAvailableAgents(vendorId);
      setAgents(agentsList);
    } catch (err) {
      setAgents([]);
      setAgentError(getApiErrorMessage(err, 'Could not load delivery agents.'));
    } finally {
      setLoadingAgents(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (orderType === 'DELIVERY' && !selectedAgent) {
      Alert.alert('Selection Required', 'Please select a delivery agent.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        vendorId: vendorId!,
        orderType,
        agentId: orderType === 'DELIVERY' ? selectedAgent! : undefined,
        items: items.map((i) => ({ mealId: i.mealId, quantity: i.quantity })),
      };

      await orderService.placeOrder(orderPayload);

      clearCart();
      Alert.alert('Success', 'Your order has been placed!', [
        { text: 'View Orders', onPress: () => router.replace('/my-orders' as any) },
      ]);
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Failed to place order. Please try again.'));
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 flex-row items-center pt-4 pb-2">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-gray-900 ml-4">Checkout</Text>
      </View>

      <View className="px-6 flex-1">
        <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-4 mb-6">
          <Text className="text-gray-500 font-semibold mb-2 uppercase text-xs">Order Summary</Text>
          <Text className="text-lg font-bold text-gray-900">{vendorName}</Text>
          <Text className="text-gray-500 mt-1">{items.length} items • Total: ${getTotal().toFixed(2)}</Text>
        </View>

        <Text className="text-lg font-bold text-gray-900 mb-3">Order Type</Text>
        <View className="flex-row space-x-4 mb-6">
          <TouchableOpacity
            className={`flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${orderType === 'DELIVERY' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
            onPress={() => setOrderType('DELIVERY')}
          >
            <IconSymbol name="car.fill" size={20} color={orderType === 'DELIVERY' ? '#f97316' : '#9ca3af'} />
            <Text className={`font-bold ${orderType === 'DELIVERY' ? 'text-orange-600' : 'text-gray-500'}`}>Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-4 rounded-xl border-2 flex-row items-center justify-center space-x-2 ${orderType === 'DINE_IN' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
            onPress={() => setOrderType('DINE_IN')}
          >
            <IconSymbol name="fork.knife" size={20} color={orderType === 'DINE_IN' ? '#f97316' : '#9ca3af'} />
            <Text className={`font-bold ${orderType === 'DINE_IN' ? 'text-orange-600' : 'text-gray-500'}`}>Dine In</Text>
          </TouchableOpacity>
        </View>

        {orderType === 'DELIVERY' && (
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-3">Select Delivery Agent</Text>
            {loadingAgents ? (
              <ActivityIndicator color="#f97316" />
            ) : agentError ? (
              <View>
                <Text className="text-red-500">{agentError}</Text>
                <TouchableOpacity className="mt-3 bg-orange-500 px-4 py-2 rounded-lg self-start" onPress={fetchAgents}>
                  <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : agents.length === 0 ? (
              <Text className="text-gray-500">No agents available for this vendor right now.</Text>
            ) : (
              <FlatList
                data={agents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`flex-row items-center p-4 rounded-xl mb-3 border-2 ${selectedAgent === item.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white'}`}
                    onPress={() => setSelectedAgent(item.id)}
                  >
                    <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-4">
                      <Text className="font-bold text-gray-500">{item.user?.name?.[0] ?? 'A'}</Text>
                    </View>
                    <View>
                      <Text className="font-bold text-gray-900 text-base">{item.user?.name ?? 'Agent'}</Text>
                      <Text className="text-gray-500 text-xs">{item.user?.phone ?? 'Available now'}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </View>

      <View className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <Button 
          title={`Place Order - $${getTotal().toFixed(2)}`}
          variant="orange"
          onPress={handlePlaceOrder}
          loading={placingOrder}
          disabled={orderType === 'DELIVERY' && !selectedAgent}
        />
      </View>
    </SafeAreaView>
  );
}
