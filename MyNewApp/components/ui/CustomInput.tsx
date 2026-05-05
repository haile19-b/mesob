import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, className = '', ...props }) => {
  return (
    <View className={`w-full ${className}`}>
      <Text className="text-sm font-bold text-gray-700 mb-1 ml-1">{label}</Text>
      <TextInput
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-lg text-gray-900"
        placeholderTextColor="#9ca3af"
        {...props}
      />
    </View>
  );
};
