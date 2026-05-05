import * as React from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, label, containerClassName, ...props }, ref) => {
    return (
      <View className={cn('flex flex-col space-y-1.5 w-full', containerClassName)}>
        {label && <Text className="text-sm font-semibold text-slate-700">{label}</Text>}
        <TextInput
          className={cn(
            'flex h-12 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base text-slate-900',
            'focus:border-slate-400 focus:ring-1 focus:ring-slate-400',
            'disabled:opacity-50',
            className
          )}
          placeholderTextColor="#94a3b8"
          ref={ref}
          {...props}
        />
      </View>
    );
  }
);
Input.displayName = 'Input';

export { Input };
