import * as React from 'react';
import { Text, Pressable, PressableProps, ActivityIndicator } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md px-4 py-3 active:opacity-80 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-slate-900',
        destructive: 'bg-red-500',
        outline: 'border border-slate-200 bg-transparent',
        secondary: 'bg-slate-100',
        ghost: 'bg-transparent active:bg-slate-100',
        link: 'bg-transparent underline-offset-4 active:underline',
        orange: 'bg-orange-500 shadow-sm shadow-orange-500/50', // specific to this app
      },
      size: {
        default: 'h-12',
        sm: 'h-9 px-3',
        lg: 'h-14 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-slate-900',
      secondary: 'text-slate-900',
      ghost: 'text-slate-900',
      link: 'text-slate-900',
      orange: 'text-white font-bold',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  title?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, title, loading, textClassName, children, disabled, ...props }, ref) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#0f172a' : '#fff'} />
        ) : title ? (
          <Text className={cn(textVariants({ variant, size, className: textClassName }))}>
            {title}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
