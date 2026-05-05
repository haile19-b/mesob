import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';

export default function WelcomeScreen() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar style="light" />
      <View className="flex-1 justify-end items-center pb-20 px-6">
        <View className="w-full items-center">
          <Text className="text-white text-5xl font-extrabold tracking-tight text-center mb-4">
            Campus Bites
          </Text>
          <Text className="text-gray-300 text-lg text-center mb-10 px-4">
            Order delicious meals from your favorite campus cafeterias and lounges, delivered right to you.
          </Text>

          <View className="w-full mb-4">
            <Button 
              title="Explore Menu" 
              variant="orange"
              onPress={() => router.push('/(tabs)' as any)} 
            />
          </View>

          <View className="w-full">
            <Button 
              title="Sign In" 
              variant="outline"
              className="border-white/20"
              textClassName="text-white"
              onPress={() => router.push('/login' as any)} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}
