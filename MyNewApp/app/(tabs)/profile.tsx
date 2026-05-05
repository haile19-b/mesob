import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
  const { user, token, logout, refreshUser } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  if (!token || !user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <IconSymbol name="person.crop.circle.badge.exclamationmark" size={80} color="#d1d5db" />
        <Text className="text-2xl font-bold text-gray-900 mt-6 text-center">You are not logged in</Text>
        <Text className="text-gray-500 text-center mt-2 mb-8">
          Sign in to view your profile, track orders, and apply as agent or vendor.
        </Text>
        <TouchableOpacity 
          className="w-full bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-500/30 mb-4"
          onPress={() => router.push('/login' as any)}
        >
          <Text className="text-white text-center font-bold text-lg">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isAgent = user.roles?.includes('AGENT');
  const isVendor = user.roles?.includes('VENDOR');
  const isAdmin = user.roles?.includes('ADMIN');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f97316" />}
      >
        {/* Header Profile Info */}
        <View className="bg-white px-6 py-8 border-b border-gray-100 items-center">
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-orange-500">{user.name?.[0] || 'U'}</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
          <Text className="text-gray-500">{user.phone}</Text>
          <View className="flex-row mt-3 space-x-2">
            {user.roles?.map(role => (
              <View key={role} className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-700 text-xs font-bold">{role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-6">
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
            onPress={() => router.push('/my-orders' as any)}
          >
            <View className="flex-row items-center space-x-3">
              <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                <IconSymbol name="list.bullet.clipboard" size={20} color="#3b82f6" />
              </View>
              <Text className="text-base font-semibold text-gray-800">My Orders</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Vendor Section */}
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Vendor Services</Text>
          {isVendor ? (
            <>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                onPress={() => router.push('/vendor-dashboard' as any)}
              >
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center">
                    <IconSymbol name="building.2.fill" size={20} color="#f97316" />
                  </View>
                  <Text className="text-base font-semibold text-gray-800">Vendor Dashboard</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                onPress={() => router.push('/manage-meals' as any)}
              >
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center">
                    <IconSymbol name="fork.knife" size={20} color="#d97706" />
                  </View>
                  <Text className="text-base font-semibold text-gray-800">Manage Meals</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
              onPress={() => router.push('/apply-vendor' as any)}
            >
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center">
                  <IconSymbol name="building.2" size={20} color="#f97316" />
                </View>
                <Text className="text-base font-semibold text-gray-800">Apply to be a Vendor</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}

          {/* Agent Section */}
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Agent Services</Text>
          {isAgent ? (
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
              onPress={() => router.push('/agent' as any)}
            >
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
                  <IconSymbol name="car.fill" size={20} color="#22c55e" />
                </View>
                <Text className="text-base font-semibold text-gray-800">Agent Dashboard</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
              onPress={() => router.push('/apply-agent' as any)}
            >
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center">
                  <IconSymbol name="briefcase.fill" size={20} color="#a855f7" />
                </View>
                <Text className="text-base font-semibold text-gray-800">Apply to be an Agent</Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}

          {isAdmin && (
            <>
              <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Admin</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white p-4 rounded-2xl mb-3 shadow-sm border border-gray-100"
                onPress={() => router.push('/admin-dashboard' as any)}
              >
                <View className="flex-row items-center space-x-3">
                  <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
                    <IconSymbol name="shield.fill" size={20} color="#ef4444" />
                  </View>
                  <Text className="text-base font-semibold text-gray-800">Admin Dashboard</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </>
          )}

          {/* Logout */}
          <TouchableOpacity 
            className="flex-row items-center bg-red-50 p-4 rounded-2xl mt-8 shadow-sm border border-red-100"
            onPress={logout}
          >
            <View className="w-10 h-10 items-center justify-center">
              <IconSymbol name="arrow.right.square.fill" size={24} color="#ef4444" />
            </View>
            <Text className="text-base font-bold text-red-600 ml-2">Sign Out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
