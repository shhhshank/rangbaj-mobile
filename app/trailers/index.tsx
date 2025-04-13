import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import TrailerCard from '@/components/trailers/TrailerCard';
import { Trailer } from '@/redux/types';

// Mock trailers data - in a real app, this would come from Redux
const trailersData: Trailer[] = [
  {
    id: '301',
    title: 'Stellar Odyssey - Official Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '2:15',
    description: 'The fate of the galaxy rests in the hands of unlikely heroes. Watch the official trailer for Stellar Odyssey.',
    releaseDate: '2024-12-15'
  },
  {
    id: '302',
    title: 'Dark Matter - Season 2 Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518544865063-3ddfd548df3a?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1:48',
    description: 'The journey continues as our heroes face their greatest challenges yet.',
    releaseDate: '2024-09-22'
  },
  {
    id: '303',
    title: 'Quantum Resonance - Teaser',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506272517965-ec6133efee7a?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '0:45',
    description: 'When reality breaks down, who can you trust? Coming this fall.',
    releaseDate: '2024-10-05'
  },
  {
    id: '304',
    title: 'Galactic Horizon - Final Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539717239864-491093663ae9?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '2:30',
    description: 'The epic conclusion to the space saga that captivated audiences worldwide.',
    releaseDate: '2024-11-18'
  }
];

// Types of trailers for filtering
const trailerCategories = [
  { id: 'all', name: 'All' },
  { id: 'movies', name: 'Movies' },
  { id: 'shows', name: 'Shows' },
  { id: 'new', name: 'New Releases' },
  { id: 'popular', name: 'Popular' }
];

const AllTrailersScreen = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Get theme colors
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const background = useThemeColor('background');
  const primary = useThemeColor('primary');
  
  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };
  
  // Handle trailer selection
  const handleTrailerPress = (trailer: Trailer) => {
    router.push({
      pathname: `/trailers/[id]`,
      params: { id: trailer.id }
    });
  };
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Trailers',
          headerTintColor: text,
          headerStyle: {
            backgroundColor: background,
          },
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <MaterialIcons name="arrow-back" size={24} color={text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Category filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={trailerCategories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === item.id && { backgroundColor: primary }
              ]}
              onPress={() => setActiveCategory(item.id)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  { color: activeCategory === item.id ? '#fff' : textSecondary }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {/* Trailers grid */}
      <FlatList
        data={trailersData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.trailersGrid}
        renderItem={({ item }) => (
          <View style={styles.trailerCardWrapper}>
            <TrailerCard
              trailer={item}
              size="small"
              onPress={() => handleTrailerPress(item)}
            />
          </View>
        )}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  categoryContainer: {
    paddingVertical: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    fontWeight: '500',
  },
  trailersGrid: {
    padding: 8,
  },
  trailerCardWrapper: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
});

export default AllTrailersScreen;
