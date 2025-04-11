import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign } from '@expo/vector-icons';

interface SeeAllButtonProps {
  title: string;
  section: string;
  contentType?: 'movie' | 'show' | 'mixed';
  count?: number;
}

export default function SeeAllButton({ title, section, contentType, count }: SeeAllButtonProps) {
  const router = useRouter();
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  
  const handlePress = () => {
    // Create URL-safe section and title
    const encodedTitle = encodeURIComponent(title);
    const encodedSection = encodeURIComponent(section.toLowerCase());
    
    // Navigate to the more content page with appropriate parameters
    router.push({
      pathname: `/content/more/${encodedSection}`,
      params: { 
        title: encodedTitle,
        type: contentType
      }
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.text, { color: text }]}>See All</Text>
        {count !== undefined && (
          <Text style={[styles.count, { color: textSecondary }]}>{count}</Text>
        )}
      </View>
      <AntDesign name="right" size={14} color={textSecondary} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  count: {
    fontSize: 12,
    marginLeft: 4,
  },
  icon: {
    marginLeft: 4,
  }
});
