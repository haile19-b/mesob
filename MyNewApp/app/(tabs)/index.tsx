import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { vendorService } from '../../services/vendor.service';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Vendor } from '../../types/domain';
import { getApiErrorMessage } from '../../lib/api-error';

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
      className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden border border-gray-100"
      onPress={() => router.push(`/vendor/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <View className="h-40 bg-orange-100 items-center justify-center">
        {/* Placeholder for Vendor Image */}
        <Text className="text-orange-500 font-bold text-xl">{item.name[0]}</Text>
      </View>
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-1">{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">Discover</Text>
        <Text className="text-gray-500 text-base mt-1">Find your favorite campus food</Text>
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
