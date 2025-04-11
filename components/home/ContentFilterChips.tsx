import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

// Filter types for the content
export enum ContentFilter {
  ALL = 'all',
  MOVIES = 'movies',
  SHOWS = 'shows',
  NEW = 'new',
  TRENDING = 'trending',
  ORIGINALS = 'originals'
}

// Filter option interface
interface FilterOption {
  id: ContentFilter;
  label: string;
  icon?: string; // Optional icon name
}

// Component props
interface ContentFilterChipsProps {
  activeFilter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
}

// Filter options with icons
const filterOptions: FilterOption[] = [
  { id: ContentFilter.ALL, label: 'For You' },
  { id: ContentFilter.MOVIES, label: 'Movies', icon: 'film-outline' },
  { id: ContentFilter.SHOWS, label: 'TV Shows', icon: 'tv-outline' },
  { id: ContentFilter.NEW, label: 'New', icon: 'sparkles-outline' },
  { id: ContentFilter.TRENDING, label: 'Trending', icon: 'trending-up-outline' },
  { id: ContentFilter.ORIGINALS, label: 'Originals', icon: 'star-outline' },
];

export default function ContentFilterChips({ activeFilter, onFilterChange }: ContentFilterChipsProps) {
  // Get theme colors
  const primary = useThemeColor('primary');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const solidBackground = useThemeColor('solidBackground');
  const border = useThemeColor('border');
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <TouchableOpacity 
              key={option.id}
              style={[
                styles.filterChip,
                { 
                  backgroundColor: isActive ? primary : 'rgba(150,150,150,0.1)',
                  borderColor: isActive ? primary : 'transparent',
                },
              ]}
              onPress={() => onFilterChange(option.id)}
              activeOpacity={0.7}
            >
              {option.icon && (
                <Ionicons 
                  name={option.icon as any} 
                  size={14} 
                  color={isActive ? '#fff' : text}
                  style={styles.chipIcon}
                />
              )}
              <Text 
                style={[
                  styles.chipText,
                  { color: isActive ? '#fff' : text }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Remove bottom margin as it's handled by the spacer in index.tsx
    marginTop: 0,
    paddingTop: 8,
    zIndex: 1, // Ensure proper layering
    backgroundColor: 'transparent',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8, // Adjusted for better alignment with the right edge
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
