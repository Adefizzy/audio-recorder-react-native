import React from 'react';
import {config} from './config';
import {
  ColorSchemeName,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import {OverlayProvider} from '@gluestack-ui/overlay';
import {ToastProvider} from '@gluestack-ui/toast';
import {colorScheme as colorSchemeNW} from 'nativewind';

type ModeType = 'light' | 'dark' | 'system';

const getColorSchemeName = (
  colorScheme: ColorSchemeName,
  mode: ModeType,
): 'light' | 'dark' => {
  if (mode === 'system') {
    return colorScheme ?? 'light';
  }
  return mode;
};

export function GluestackUIProvider({
  mode = 'light',
  ...props
}: {
  mode?: 'light' | 'dark' | 'system';
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const colorScheme = useColorScheme();
  const {height, width} = useWindowDimensions();

  const colorSchemeName = getColorSchemeName(colorScheme, mode);

  colorSchemeNW.set(mode);

  return (
    <View
      style={[
        config[colorSchemeName],
        // eslint-disable-next-line react-native/no-inline-styles
        {flex: 1, height: height ?? 100, width: isNaN(width) ? 100 : width},
        props.style,
      ]}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
