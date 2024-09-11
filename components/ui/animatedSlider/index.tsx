import { useState, useEffect } from 'react';
import { Animated, Easing, View, Pressable, Platform } from 'react-native';
import React from 'react';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/nativewind-utils/withStyleContext';
import { withStyleContextAndStates } from '@gluestack-ui/nativewind-utils/withStyleContextAndStates';
import { cssInterop } from 'nativewind';
import { withStates } from '@gluestack-ui/nativewind-utils/withStates';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';
import { createSlider } from '@gluestack-ui/slider';

const AnimatedThumb = Animated.createAnimatedComponent(View);
const AnimatedFilledTrack = Animated.createAnimatedComponent(View);

const ThumbWrapper = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentProps<typeof View>
>((props, ref) => <View ref={ref} {...props} />);

const FilledTrackWrapper = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentProps<typeof View>
>((props, ref) => <View ref={ref} {...props} />);

const SCOPE = 'SLIDER';
export const UISlider = createSlider({
  Root:
    Platform.OS === 'web'
      ? withStyleContext(View, SCOPE)
      : withStyleContextAndStates(View, SCOPE),
  Thumb: Platform.OS === 'web' ? ThumbWrapper : withStates(AnimatedThumb),
  Track: Pressable,
  FilledTrack: Platform.OS === 'web' ? FilledTrackWrapper : withStates(AnimatedFilledTrack),
  ThumbInteraction: View,
});

cssInterop(UISlider, { className: 'style' });
cssInterop(ThumbWrapper, { className: 'style' });
cssInterop(UISlider.Track, { className: 'style' });
cssInterop(FilledTrackWrapper, { className: 'style' });

const sliderStyle = tva({
  base: 'justify-center items-center data-[disabled=true]:web:opacity-40 data-[disabled=true]:web:pointer-events-none',
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    isReversed: {
      true: '',
      false: '',
    },
  },
});

const sliderThumbStyle = tva({
  base: 'bg-primary-500 absolute rounded-full data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600 data-[disabled=true]:bg-primary-500 web:cursor-pointer web:active:outline-4 web:active:outline web:active:outline-primary-400 data-[focus=true]:web:outline-4 data-[focus=true]:web:outline data-[focus=true]:web:outline-primary-400 shadow-hard-1',

  parentVariants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
});

const sliderTrackStyle = tva({
  base: 'bg-background-300 rounded-lg overflow-hidden',
  parentVariants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    isReversed: {
      true: '',
      false: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  parentCompoundVariants: [
    // Add your compound variants here
  ],
});

const sliderFilledTrackStyle = tva({
  base: 'bg-primary-500 data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600',
  parentVariants: {
    orientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
});

type ISliderProps = React.ComponentProps<typeof UISlider> &
  VariantProps<typeof sliderStyle>;

export const Slider = React.forwardRef<
  React.ElementRef<typeof UISlider>,
  ISliderProps
>(
  (
    {
      className,
      size = 'md',
      orientation = 'horizontal',
      isReversed = false,
      ...props
    },
    ref
  ) => {
    const animatedValue = new Animated.Value(0); // Progress starts at 0

    const animateSlider = (toValue: number) => {
      Animated.timing(animatedValue, {
        toValue,
        duration: 300, // Animation duration
        easing: Easing.linear, // Smooth transition
        useNativeDriver: false,
      }).start();
    };

    return (
      <UISlider
        ref={ref}
        isReversed={isReversed}
        orientation={orientation}
        {...props}
        className={sliderStyle({
          orientation,
          isReversed,
          class: className,
        })}
        context={{ size, orientation, isReversed }}
        animatedValue={animatedValue} // Pass animated value to children
        animateSlider={animateSlider} // Call this function to trigger animation
      />
    );
  }
);

type ISliderThumbProps = React.ComponentProps<typeof UISlider.Thumb> &
  VariantProps<typeof sliderThumbStyle>;

export const SliderThumb = React.forwardRef<
  React.ElementRef<typeof UISlider.Thumb>,
  ISliderThumbProps
>(({ className, size, animatedValue, ...props }, ref) => {
  const { size: parentSize } = useStyleContext(SCOPE);

  // Interpolate thumb position from animatedValue
  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust the range according to slider width
  });

  return (
    <Animated.View
      //@ts-ignore
      ref={ref}
      {...props}
      className={sliderThumbStyle({
        parentVariants: {
          size: parentSize,
        },
        size,
        class: className,
      })}
      style={{ transform: [{ translateX }] }} // Apply animation
    />
  );
});

type ISliderFilledTrackProps = React.ComponentProps<
  typeof UISlider.FilledTrack
> &
  VariantProps<typeof sliderFilledTrackStyle>;

export const SliderFilledTrack = React.forwardRef<
  React.ElementRef<typeof UISlider.FilledTrack>,
  ISliderFilledTrackProps
>(({ className, animatedValue, ...props }, ref) => {
  const { orientation: parentOrientation } = useStyleContext(SCOPE);

  // Interpolate filled track width from animatedValue
  const width = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'], // Full width progress animation
  });

  return (
    <Animated.View
      //@ts-ignore
      ref={ref}
      {...props}
      className={sliderFilledTrackStyle({
        parentVariants: {
          orientation: parentOrientation,
        },
        class: className,
      })}
      style={{ width }} // Apply animation
    />
  );
});
