import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import TrailerCard from './TrailerCard';
import { Trailer } from '@/redux/types';

interface TrailerSectionProps {
  title: string;
  trailers: Trailer[];
  onTrailerPress?: (trailer: Trailer) => void;
  showSeeAll?: boolean;
  trailerSize?: 'small' | 'medium' | 'large';
}

const TrailerSection = ({ 
  title, 
  trailers, 
  onTrailerPress, 
  showSeeAll = true,
  trailerSize = 'medium'
}: TrailerSectionProps) => {
  const router = useRouter();
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');

  // Skip rendering if no trailers
  if (!trailers || trailers.length === 0) return null;

  const handleSeeAllPress = () => {
    router.push(`/trailers/all?title=${encodeURIComponent(title)}`);
  };

  const handleTrailerPress = (trailer: Trailer) => {
    if (onTrailerPress) {
      onTrailerPress(trailer);
    } else {
      // Default behavior - navigate to trailer detail
      router.push(`/trailers/${trailer.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>{title}</Text>
        
        {showSeeAll && (
          <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllPress}>
            <Text style={[styles.seeAllText, { color: primary }]}>See All</Text>
            <MaterialIcons name="chevron-right" size={20} color={primary} />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {trailers.map((trailer) => (
          <TrailerCard
            key={trailer.id}
            trailer={trailer}
            size={trailerSize}
            onPress={() => handleTrailerPress(trailer)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  scrollView: {
    marginLeft: 0,
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});

export default TrailerSection;
