import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, ListRenderItem } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovie, selectMovieById, selectIsLoading } from '@/redux/slices/contentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Movie, CastMember, RelatedContent } from '@/redux/types';

export default function MovieContentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get movie from Redux store
  const movie = useSelector((state: RootState) => selectMovieById(state, id as string));
  const loading = useSelector(selectIsLoading);
  
  // Fetch movie data if not already in store
  useEffect(() => {
    if (id) {
      // Always fetch fresh data when navigating to a movie
      console.log('Fetching movie data for ID:', id);
      dispatch(fetchMovie(id as string));
    }
  }, [dispatch, id]);
  
  // Get theme colors
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  
  // Handle play button press
  const handlePlay = () => {
    console.log('Playing movie:', id);
    // In a real app, navigate to video player or start playback
  };
  
  // Handle back button press
  const handleBack = () => {
    router.back();
  };
  
  // Render cast item
  const renderCastItem: ListRenderItem<CastMember> = ({ item }) => (
    <View style={styles.castItem}>
      <Image source={{ uri: item.image }} style={styles.castImage} />
      <Text style={styles.castName}>{item.name}</Text>
      <Text style={[styles.characterName, {color: textSecondary}]}>{item.character}</Text>
    </View>
  );
  
  // Render related movie item
  const renderRelatedItem: ListRenderItem<RelatedContent> = ({ item }) => (
    <TouchableOpacity style={styles.relatedItem} onPress={() => router.push(`/content/movie/${item.id}`)}>
      <Image source={{ uri: item.thumbnail }} style={styles.relatedThumbnail} />
      <Text style={[styles.relatedTitle, {color: text}]}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Show loading indicator while fetching movie
  if (loading.movies || !movie) {
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={primary} />
        <ThemedText style={styles.loadingText}>Loading movie details...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Cover Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: movie.coverUrl }} style={styles.coverImage} resizeMode="cover" />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)', background || '#000']}
            style={styles.gradient}
          >
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Hero Content */}
            <View style={styles.heroContent}>
              <View style={styles.heroInfo}>
                <Text style={styles.title}>{movie.title}</Text>
                
                <View style={styles.metaInfo}>
                  <Text style={styles.year}>{movie.releaseYear}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.rating}>{movie.rating}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.duration}>{movie.duration}</Text>
                </View>
                
                <View style={styles.genreContainer}>
                  {movie.genres.map((genre, index) => (
                    <View key={index} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre}</Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.ratingContainer}>
                  <AntDesign name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{movie.starRating}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        
        {/* Action Buttons */}
        <View style={[styles.actionButtons, {borderBottomColor: border}]}>
          <TouchableOpacity style={styles.playNowButton} onPress={handlePlay}>
            <Ionicons name="play" size={20} color="white" />
            <Text style={styles.playNowText}>Play Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-outline" size={28} color={text} />
            <Text style={[styles.actionText, {color: textSecondary}]}>My List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={28} color={text} />
            <Text style={[styles.actionText, {color: textSecondary}]}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Description */}
        <View style={[styles.descriptionContainer, {borderBottomColor: border}]}>
          <ThemedText style={styles.descriptionText}>{movie.description}</ThemedText>
          <Text style={[styles.directorText, {color: textSecondary}]}>
            Director: <Text style={[styles.directorName, {color: text}]}>{movie.director}</Text>
          </Text>
          <Text style={[styles.directorText, {color: textSecondary, marginTop: 4}]}>
            Studio: <Text style={[styles.directorName, {color: text}]}>{movie.studio}</Text>
          </Text>
        </View>
        
        {/* Cast */}
        <View style={[styles.sectionContainer, {borderBottomColor: border}]}>
          <Text style={[styles.sectionTitle, {color: text}]}>Cast</Text>
          <FlatList
            data={movie.cast}
            renderItem={renderCastItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castList}
          />
        </View>
        
        {/* Related Movies */}
        {movie.relatedMovies && movie.relatedMovies.length > 0 && (
          <View style={styles.relatedContainer}>
            <Text style={[styles.sectionTitle, {color: text}]}>More Like This</Text>
            <FlatList
              data={movie.relatedMovies}
              renderItem={renderRelatedItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.relatedColumnWrapper}
            />
          </View>
        )}
        
        {/* Bottom Space */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: height * 0.65, // Increase height for a more immersive hero
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 8,
  },
  heroContent: {
    padding: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  heroInfo: {
    width: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 32, // Increased font size
    fontWeight: 'bold',
    marginBottom: 12, // More spacing
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  year: {
    color: '#ddd',
    fontSize: 14,
  },
  dot: {
    color: '#ddd',
    marginHorizontal: 5,
  },
  rating: {
    color: '#ddd',
    fontSize: 14,
  },
  duration: {
    color: '#ddd',
    fontSize: 14,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  playNowButton: {
    backgroundColor: '#e50914',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 2,
    marginRight: 15,
  },
  playNowText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
  },
  descriptionContainer: {
    padding: 20,
    borderBottomWidth: 1,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  directorText: {
    fontSize: 14,
  },
  directorName: {
    fontWeight: '500',
  },
  sectionContainer: {
    padding: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  castList: {
    paddingRight: 10,
  },
  castItem: {
    marginRight: 15,
    width: 100,
    alignItems: 'center',
  },
  castImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  castName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  characterName: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  relatedContainer: {
    padding: 15,
  },
  relatedColumnWrapper: {
    justifyContent: 'space-between',
  },
  relatedItem: {
    width: (width - 45) / 2,
    marginBottom: 15,
  },
  relatedThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  relatedTitle: {
    color: '#fff',
    fontSize: 14,
  },
});
