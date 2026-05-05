import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  loading = false, 
  variant = 'primary', 
  className = '', 
  disabled,
  ...props 
}) => {
  const isPrimary = variant === 'primary';
  const baseClasses = "w-full py-4 rounded-2xl flex-row justify-center items-center";
  const primaryClasses = "bg-orange-500 shadow-lg shadow-orange-500/30";
  const outlineClasses = "bg-transparent border-2 border-gray-200";
  
  const textPrimaryClasses = "text-white text-center font-bold text-lg";
  const textOutlineClasses = "text-gray-900 text-center font-bold text-lg";

  const appliedClasses = `${baseClasses} ${isPrimary ? primaryClasses : outlineClasses} ${(disabled || loading) ? 'opacity-70' : ''} ${className}`;
  const appliedTextClasses = isPrimary ? textPrimaryClasses : textOutlineClasses;

  return (
    <TouchableOpacity 
      className={appliedClasses} 
      disabled={disabled || loading} 
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : "#f97316"} />
      ) : (
        <Text className={appliedTextClasses}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
