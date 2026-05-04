import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AgentDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isWorking, setIsWorking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const fetchAssignedOrders = async () => {
    try {
      // const res = await apiClient.get('/orders/agent');
      // setOrders(res.data);

      // Mock Data
      await new Promise(r => setTimeout(r, 800));
      setOrders([
        {
          id: 'ord-101',
          vendor: { name: 'Campus Cafeteria' },
          status: 'PENDING',
          totalAmount: 14.50,
          createdAt: new Date().toISOString()
        },
        {
          id: 'ord-102',
          vendor: { name: 'Science Lounge Cafe' },
          status: 'PREPARING',
          totalAmount: 8.99,
          createdAt: new Date(Date.now() - 300000).toISOString() // 5 mins ago
        }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // await apiClient.post(`/orders/${orderId}/accept`);
      Alert.alert('Success', 'Order accepted! Status changed to PREPARING.');
      
      // Optimistic Update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'PREPARING' } : o));
    } catch (error) {
      Alert.alert('Error', 'Could not accept order.');
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'PREPARING' ? 'OUT_FOR_DELIVERY' : 'COMPLETED';
      // await apiClient.patch(`/orders/${orderId}/status`, { status: nextStatus });
      Alert.alert('Success', `Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
      
      // Optimistic Update
      if (nextStatus === 'COMPLETED') {
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const renderOrder = ({ item }: { item: any }) => (
    <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">{item.vendor.name}</Text>
        <Text className="text-lg font-extrabold text-orange-500">${item.totalAmount.toFixed(2)}</Text>
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
          onPress={() => setIsWorking(!isWorking)}
        >
          <Text className={`font-bold ${isWorking ? 'text-green-700' : 'text-red-700'}`}>
            {isWorking ? 'Online' : 'Offline'}
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
