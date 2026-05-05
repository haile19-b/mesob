import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage } from '../lib/api-error';
import { orderService } from '../services/order.service';
import { vendorService } from '../services/vendor.service';
import { useAuthStore } from '../store/authStore';
import type { Agent, Order } from '../types/domain';

export default function VendorDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    if (!user?.roles?.includes('VENDOR')) {
      router.replace('/(tabs)/profile' as any);
      return;
    }
    fetchDashboard();
  }, [user]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [orderRes, agentRes] = await Promise.all([
        orderService.getVendorOrders(),
        vendorService.getMyVendorAgents(),
      ]);
      setOrders(orderRes);
      setAgents(agentRes);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to load vendor dashboard.'));
    } finally {
      setLoading(false);
    }
  };

  const uniqueCustomers = useMemo(() => {
    return new Map(orders.map((o) => [o.user?.id ?? o.userId, o.user])).size;
  }, [orders]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center" onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-gray-900 ml-3">Vendor Dashboard</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
              <Text className="font-bold text-gray-900 mb-2">Overview</Text>
              <Text className="text-gray-600">Orders: {orders.length}</Text>
              <Text className="text-gray-600">Customers: {uniqueCustomers}</Text>
              <Text className="text-gray-600">Agents Serving You: {agents.length}</Text>
            </View>

            <TouchableOpacity className="bg-orange-500 py-3 rounded-xl mb-5" onPress={() => router.push('/manage-meals' as any)}>
              <Text className="text-white text-center font-bold">Add Meals</Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold text-gray-900 mb-2">Agents Working For You</Text>
            {agents.length === 0 ? (
              <Text className="text-gray-500 mb-4">No agents linked to your vendor yet.</Text>
            ) : (
              agents.map((agent) => (
                <View key={agent.id} className="bg-white border border-gray-100 rounded-xl p-3 mb-2">
                  <Text className="font-bold text-gray-800">{agent.user?.name ?? 'Agent'}</Text>
                  <Text className="text-gray-500">{agent.user?.phone}</Text>
                </View>
              ))
            )}

            <Text className="text-lg font-bold text-gray-900 mt-4 mb-2">Recent Orders / Users</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white border border-gray-100 rounded-xl p-4 mb-3">
            <Text className="font-bold text-gray-900">Order #{item.id.slice(0, 8)}</Text>
            <Text className="text-gray-500 mt-1">Status: {item.status.replace(/_/g, ' ')}</Text>
            <Text className="text-gray-500">Type: {item.orderType}</Text>
            <Text className="text-gray-500">User: {item.user?.name ?? 'Unknown'} ({item.user?.phone ?? 'N/A'})</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-500">No orders yet.</Text>}
      />
    </SafeAreaView>
  );
}
