import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getApiErrorMessage } from '../lib/api-error';
import { adminService } from '../services/admin.service';
import type { AdminDashboardStats, Agent, Vendor } from '../types/domain';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [vendorApps, setVendorApps] = useState<Vendor[]>([]);
  const [agentApps, setAgentApps] = useState<Agent[]>([]);

  useEffect(() => {
    if (!user?.roles?.includes('ADMIN')) {
      router.replace('/(tabs)/profile' as any);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, vendorsRes, agentsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getVendorApplications(),
        adminService.getAgentApplications(),
      ]);
      setStats(statsRes);
      setVendorApps(vendorsRes);
      setAgentApps(agentsRes);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error, 'Failed to load admin dashboard'));
    } finally {
      setLoading(false);
    }
  };

  const handleVendorDecision = async (vendorId: string, action: 'approve' | 'decline') => {
    try {
      if (action === 'approve') await adminService.approveVendor(vendorId);
      else await adminService.declineVendor(vendorId);
      await fetchData();
    } catch (error) {
      Alert.alert('Failed', getApiErrorMessage(error, 'Could not update vendor application.'));
    }
  };

  const handleAgentDecision = async (agentId: string, action: 'approve' | 'decline') => {
    try {
      if (action === 'approve') await adminService.approveAgent(agentId);
      else await adminService.declineAgent(agentId);
      await fetchData();
    } catch (error) {
      Alert.alert('Failed', getApiErrorMessage(error, 'Could not update agent application.'));
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-extrabold text-gray-900 ml-3">Admin Dashboard</Text>
      </View>

      <FlatList
        data={vendorApps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        ListHeaderComponent={
          <View>
            <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
              <Text className="font-bold text-gray-900 mb-2">System Overview</Text>
              <Text className="text-gray-600">Users: {stats?.users ?? 0}</Text>
              <Text className="text-gray-600">Approved Vendors: {stats?.vendors ?? 0}</Text>
              <Text className="text-gray-600">Approved Agents: {stats?.agents ?? 0}</Text>
              <Text className="text-gray-600">Orders: {stats?.orders ?? 0}</Text>
              <Text className="text-gray-600">Meals: {stats?.meals ?? 0}</Text>
              <Text className="text-gray-600">Pending Vendor Apps: {stats?.pendingVendors ?? 0}</Text>
              <Text className="text-gray-600">Pending Agent Apps: {stats?.pendingAgents ?? 0}</Text>
            </View>

            <TouchableOpacity
              className="bg-orange-500 rounded-xl px-4 py-3 mb-4"
              onPress={() => router.push('/manage-meals' as any)}
            >
              <Text className="text-white font-bold text-center">Add Meals (Admin)</Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold text-gray-900 mb-3">Vendor Applications</Text>
            {vendorApps.length === 0 && <Text className="text-gray-500 mb-5">No pending vendor applications.</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white border border-gray-100 rounded-xl p-4 mb-3">
            <Text className="text-base font-bold text-gray-900">{item.name}</Text>
            <Text className="text-gray-500">{item.location}</Text>
            <Text className="text-gray-500">{item.manager?.name} • {item.manager?.phone}</Text>
            <View className="flex-row mt-3">
              <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-lg mr-2" onPress={() => handleVendorDecision(item.id, 'approve')}>
                <Text className="text-white text-center font-bold">Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-red-500 py-2 rounded-lg" onPress={() => handleVendorDecision(item.id, 'decline')}>
                <Text className="text-white text-center font-bold">Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View className="mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Agent Applications</Text>
            {agentApps.length === 0 ? (
              <Text className="text-gray-500">No pending agent applications.</Text>
            ) : (
              agentApps.map((agent) => (
                <View key={agent.id} className="bg-white border border-gray-100 rounded-xl p-4 mb-3">
                  <Text className="text-base font-bold text-gray-900">{agent.user?.name ?? 'Agent'}</Text>
                  <Text className="text-gray-500">{agent.user?.phone}</Text>
                  <View className="flex-row mt-3">
                    <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-lg mr-2" onPress={() => handleAgentDecision(agent.id, 'approve')}>
                      <Text className="text-white text-center font-bold">Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-red-500 py-2 rounded-lg" onPress={() => handleAgentDecision(agent.id, 'decline')}>
                      <Text className="text-white text-center font-bold">Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
