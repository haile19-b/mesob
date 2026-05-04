import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, Pressable, View } from 'react-native';

export default function WelcomeScreen() {
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

          <Link href="/(tabs)" asChild>
            <Pressable
              className="w-full bg-orange-500 py-4 rounded-2xl shadow-lg shadow-orange-500/50 mb-4 active:opacity-80"
              onPress={() => console.log('Explore button clicked')}
            >
              <Text className="text-white text-center font-bold text-lg">
                Explore Menu
              </Text>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable
              className="w-full bg-transparent border-2 border-white/20 py-4 rounded-2xl active:opacity-50"
              onPress={() => console.log('Sign In button clicked')}
            >
              <Text className="text-white text-center font-bold text-lg">
                Sign In
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
