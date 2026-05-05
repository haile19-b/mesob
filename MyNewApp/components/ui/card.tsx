import * as React from 'react';
import { View, Text, ViewProps, TextProps } from 'react-native';
import { cn } from '../../lib/utils';

const Card = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View
    ref={ref as any}
    className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => (
  <Text
    ref={ref as any}
    className={cn('font-semibold leading-none tracking-tight text-2xl text-slate-900', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, TextProps>(({ className, ...props }, ref) => (
  <Text
    ref={ref as any}
    className={cn('text-sm text-slate-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View ref={ref as any} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, ViewProps>(({ className, ...props }, ref) => (
  <View
    ref={ref as any}
    className={cn('flex flex-row items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
