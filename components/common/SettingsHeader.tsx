import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingsHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightElement?: React.ReactNode;
}

export default function SettingsHeader({ 
  title, 
  showBackButton = true,
  rightElement
}: SettingsHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[`${background}`, `${background}`]}
        style={[
          styles.headerContainer,
          { paddingTop: insets.top }
        ]}
      >
        <View style={styles.headerContent}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={text} />
            </TouchableOpacity>
          )}
          
          <Text 
            style={[styles.title, { color: text }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {rightElement ? (
            <View style={styles.rightElement}>
              {rightElement}
            </View>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  rightElement: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
});
