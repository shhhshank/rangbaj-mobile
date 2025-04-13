/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export type ThemeColorName = 
  | 'text' 
  | 'textSecondary' 
  | 'background' 
  | 'primary' 
  | 'solidBackground' 
  | 'border' 
  | 'tint' 
  | 'icon' 
  | 'tabIconDefault' 
  | 'tabIconSelected' 
  | 'borderSecondary'
  | 'inputBackground';

export function useThemeColor(
  colorName: ThemeColorName,
  props?: { light?: string; dark?: string }
) {

  const theme = useColorScheme() ?? 'light';

  if(props){
    return props[theme];
  }

  return Colors[theme][colorName];
  
}
