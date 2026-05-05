import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { orderService } from '../../services/order.service';
import { agentService } from '../../services/agent.service';
import type { AgentStatus, Order } from '../../types/domain';
import { getApiErrorMessage } from '../../lib/api-error';

export default function AgentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('OFFLINE');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const isWorking = agentStatus !== 'OFFLINE';

  useEffect(() => {
    if (!user?.roles?.includes('AGENT')) {
      router.replace('/(tabs)/profile' as any);
      return;
    }
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    setLoading(true);
    try {
      const [agentProfile, agentOrders] = await Promise.all([agentService.getMyProfile(), orderService.getAgentOrders()]);
      setAgentStatus(agentProfile.status);
      setOrders(agentOrders);
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Failed to load agent dashboard.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await orderService.acceptOrder(orderId);
      Alert.alert('Success', 'Order accepted! Status changed to PREPARING.');
      await fetchAssignedOrders();
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Could not accept order.'));
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: Order['status']) => {
    try {
      const nextStatus: Order['status'] = currentStatus === 'PREPARING' ? 'OUT_FOR_DELIVERY' : 'COMPLETED';
      await orderService.updateOrderStatus(orderId, nextStatus);
      Alert.alert('Success', `Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
      await fetchAssignedOrders();
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Failed to update order status.'));
    }
  };

  const toggleWorkingStatus = async () => {
    const nextStatus: AgentStatus = isWorking ? 'OFFLINE' : 'AVAILABLE';
    setUpdatingStatus(true);
    try {
      await agentService.updateMyStatus(nextStatus);
      setAgentStatus(nextStatus);
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, 'Could not update your status.'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getOrderTotal = (order: Order): number => {
    return (order.orderItems ?? []).reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    // Agent order endpoint currently does not include orderItems in backend response.
    const total = getOrderTotal(item);
    return (
      <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-900">{item.vendor?.name ?? 'Vendor'}</Text>
          <Text className="text-lg font-extrabold text-orange-500">{total > 0 ? `$${total.toFixed(2)}` : '--'}</Text>
        </View>

        <View className="flex-row items-center mb-4">
        <View className="bg-blue-100 px-3 py-1 rounded-full">
          <Text className="text-blue-800 text-xs font-bold">{item.status.replace(/_/g, ' ')}</Text>
        </View>
        <Text className="text-gray-400 text-xs ml-3">
          Ordered at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        </View>

        {item.status === 'PENDING' && (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-xl items-center shadow-sm"
              onPress={() => handleAcceptOrder(item.id)}
            >
              <Text className="text-white font-bold">Accept Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {(item.status === 'PREPARING' || item.status === 'OUT_FOR_DELIVERY') && (
          <TouchableOpacity
            className="w-full bg-orange-500 py-3 rounded-xl items-center shadow-sm"
            onPress={() => handleUpdateStatus(item.id, item.status)}
          >
            <Text className="text-white font-bold">
              {item.status === 'PREPARING' ? 'Mark as Out for Delivery' : 'Mark as Delivered'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 flex-row items-center justify-between pt-4 pb-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4"
            onPress={() => router.push('/(tabs)' as any)}
          >
            <IconSymbol name="house.fill" size={20} color="#4b5563" />
          </TouchableOpacity>
          <Text className="text-xl font-extrabold text-gray-900">Agent Hub</Text>
        </View>
        
        {/* Toggle Working Status */}
        <TouchableOpacity 
          className={`px-4 py-2 rounded-full ${isWorking ? 'bg-green-100' : 'bg-red-100'}`}
          onPress={toggleWorkingStatus}
          disabled={updatingStatus}
        >
          <Text className={`font-bold ${isWorking ? 'text-green-700' : 'text-red-700'}`}>
            {updatingStatus ? 'Saving...' : isWorking ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <View className="flex-1">
          <View className="px-6 py-4">
            <Text className="text-lg font-bold text-gray-900">Assigned Orders</Text>
            {!isWorking && <Text className="text-red-500 text-sm mt-1">You are offline. You won't receive new orders.</Text>}
          </View>
          
          {orders.length === 0 ? (
            <View className="flex-1 justify-center items-center px-6">
              <IconSymbol name="tray.fill" size={64} color="#d1d5db" />
              <Text className="text-gray-500 text-lg mt-4 text-center">No assigned orders right now.</Text>
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
        </View>
      )}
    </SafeAreaView>
  );
}
