// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TabBarIconProps extends IconProps<ComponentProps<typeof MaterialCommunityIcons>['name']> {
  showBadge?: boolean;
}

export function TabBarIcon({ style, showBadge, ...rest }: TabBarIconProps) {
  const primary = useThemeColor('primary');
  
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />
      {showBadge && <View style={[styles.badge, { backgroundColor: primary }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 0,
    right: -3,
    borderWidth: 1,
    borderColor: '#000',
  }
});
