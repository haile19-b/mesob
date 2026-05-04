import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await apiClient.get('/vendors');
      setVendors(res.data);
    } catch (error) {
      console.error('Error fetching vendors', error);
      // Mock data in case backend is not running
      setVendors([
        { id: '1', name: 'Main Campus Cafeteria', location: 'Building A', phone: '123-456-7890' },
        { id: '2', name: 'Science Lounge Cafe', location: 'Building C', phone: '987-654-3210' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderVendor = ({ item }: { item: any }) => (
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
