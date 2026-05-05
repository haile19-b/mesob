import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { vendorService } from '../../services/vendor.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Vendor } from '../../types/domain';
import { getApiErrorMessage } from '../../lib/api-error';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await vendorService.getAllVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to load vendors.'));
    } finally {
      setLoading(false);
    }
  };

  const renderVendor = ({ item }: { item: Vendor }) => (
    <TouchableOpacity 
      className="bg-white rounded-3xl mb-4 shadow-sm overflow-hidden border border-gray-100"
      onPress={() => router.push(`/vendor/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <View className="h-36 bg-orange-500 px-5 py-4 justify-between">
        <View className="self-start bg-white/20 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">Campus Vendor</Text>
        </View>
        <Text className="text-white text-2xl font-extrabold">{item.name}</Text>
      </View>
      <View className="p-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500 flex-1">{item.location}</Text>
          <IconSymbol name="chevron.right" size={18} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Discover</Text>
          <Text className="text-gray-500 text-base mt-1">Find your favorite campus food</Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center mr-2"
            onPress={() => router.push('/(tabs)/cart' as any)}
          >
            <IconSymbol name="cart.fill" size={18} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
            onPress={() => router.push('/(tabs)/profile' as any)}
          >
            <IconSymbol name="person.fill" size={18} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-center text-red-500">{error}</Text>
          <TouchableOpacity className="mt-4 bg-orange-500 px-5 py-3 rounded-xl" onPress={fetchVendors}>
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : vendors.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-gray-500 text-center">No vendors available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id}
          renderItem={renderVendor}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
