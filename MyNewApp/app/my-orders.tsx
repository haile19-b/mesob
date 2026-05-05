import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { orderService } from '../services/order.service';
import type { Order } from '../types/domain';
import { getApiErrorMessage } from '../lib/api-error';

export default function MyOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setOrders([]);
      setError(getApiErrorMessage(err, 'Failed to load your orders.'));
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (orderId: string) => {
    try {
      await orderService.updateOrderStatus(orderId, 'COMPLETED');
      Alert.alert('Success', 'Order marked as completed! You can now rate your experience.');
      await fetchOrders();
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Failed to update order status.'));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800';
      case 'OUT_FOR_DELIVERY': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderTotal = (order: Order): number => {
    return (order.orderItems ?? []).reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-lg font-bold text-gray-900">{item.vendor?.name ?? 'Vendor'}</Text>
          <Text className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <Text className="text-lg font-extrabold text-orange-500">${getOrderTotal(item).toFixed(2)}</Text>
      </View>
      
      <View className="flex-row items-center justify-between mb-4 mt-2">
        <View className="flex-row items-center space-x-2">
          <IconSymbol name={item.orderType === 'DELIVERY' ? 'car.fill' : 'fork.knife'} size={16} color="#6b7280" />
          <Text className="text-gray-600 font-semibold">{item.orderType}</Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}>
          <Text className={`text-xs font-bold ${getStatusColor(item.status).split(' ')[1]}`}>
            {item.status.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      {item.status === 'OUT_FOR_DELIVERY' && (
        <TouchableOpacity 
          className="bg-green-500 py-3 rounded-xl items-center mt-2"
          onPress={() => markCompleted(item.id)}
        >
          <Text className="text-white font-bold">Mark as Received</Text>
        </TouchableOpacity>
      )}

      {item.status === 'COMPLETED' && (
        <TouchableOpacity 
          className="bg-orange-50 py-3 rounded-xl items-center mt-2 border border-orange-200"
          onPress={() => Alert.alert('Rating', 'Rating flow coming soon!')}
        >
          <Text className="text-orange-600 font-bold">Rate Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 flex-row items-center pt-4 pb-4">
        <TouchableOpacity 
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-gray-900 ml-4">My Orders</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity className="mt-4 bg-orange-500 px-5 py-3 rounded-xl" onPress={fetchOrders}>
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <IconSymbol name="tray.fill" size={64} color="#d1d5db" />
          <Text className="text-gray-500 text-lg mt-4 text-center">You have no orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
