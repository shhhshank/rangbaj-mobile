import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Image,
  StatusBar,
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { 
  selectContentSections,
  selectIsLoading,
  selectError,
  fetchContentSections,
  ContentFilterType
} from '@/redux/slices/contentSlice';
import { Movie, Show } from '@/redux/types';
import { useScrollY } from '@/hooks/useScrollY';
import { LinearGradient } from 'expo-linear-gradient';

// Types of supported sections
type SectionTypes = 'trending' | 'popular' | 'originals' | 'new' | 'recommended' | string;

export default function MoreContentScreen() {
  const router = useRouter();
  const { section, title, type } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const scrollY = useScrollY();
  const [refreshing, setRefreshing] = useState(false);
  
  // Theme colors
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  
  // Get content from Redux
  const contentSections = useSelector(selectContentSections);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [contentItems, setContentItems] = useState<any[]>([]);

  // Find the section data based on the section parameter
  useEffect(() => {
    if (section) {
      const sectionKey = section as string;
      const filterType = mapSectionToFilterType(sectionKey);
      
      // If we don't have content, fetch it
      if (!contentSections || contentSections.length === 0) {
        dispatch(fetchContentSections(filterType));
      } else {
        // Find the relevant section from our content
        let foundContent: any[] = [];
        
        contentSections.forEach(contentSection => {
          // Match by section key or section title that contains the key
          if (
            contentSection.title.toLowerCase().includes(sectionKey.toLowerCase()) ||
            (type && contentSection.contentType === type)
          ) {
            foundContent = [...foundContent, ...contentSection.data];
          }
        });
        
        // Filter duplicates by id
        const uniqueContent = foundContent.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );
        
        setContentItems(uniqueContent);
      }
    }
  }, [section, contentSections, dispatch, type]);

  // Map section name to ContentFilterType
  const mapSectionToFilterType = (sectionKey: string): ContentFilterType => {
    switch (sectionKey.toLowerCase()) {
      case 'trending':
        return ContentFilterType.TRENDING;
      case 'popular':
        return ContentFilterType.ALL;
      case 'new':
        return ContentFilterType.NEW;
      case 'originals':
        return ContentFilterType.ORIGINALS;
      case 'movies':
        return ContentFilterType.MOVIES;
      case 'shows':
        return ContentFilterType.SHOWS;
      default:
        return ContentFilterType.ALL;
    }
  };

  // Handle content press
  const handleContentPress = (id: string, contentType: 'movie' | 'show') => {
    router.push(`/content/${contentType}/${id}`);
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    const filterType = mapSectionToFilterType(section as string);
    await dispatch(fetchContentSections(filterType));
    setRefreshing(false);
  };

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Render content grid item
  const renderContentItem = ({ item, index }: { item: Movie | Show, index: number }) => {
    // Determine if it's movie or show based on properties
    const isMovie = 'duration' in item;
    const contentType = isMovie ? 'movie' : 'show';

    return (
      <TouchableOpacity 
        style={styles.gridItem}
        onPress={() => handleContentPress(item.id, contentType)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}
          >
            <View style={styles.contentInfo}>
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={12} color="#FFD700" />
                <Text style={styles.rating}>{item.starRating.toFixed(1)}</Text>
              </View>
              
              {item.isNew && (
                <View style={[styles.badge, { backgroundColor: primary }]}>
                  <Text style={styles.badgeText}>NEW</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
        
        <Text style={[styles.title, { color: text }]} numberOfLines={1}>
          {item.title}
        </Text>
        
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          {isMovie ? (item as Movie).duration : `${(item as Show).seasons} Seasons`}
        </Text>
      </TouchableOpacity>
    );
  };

  // Get screen title from params or use default
  const screenTitle = title ? decodeURIComponent(title as string) : 'More Content';

  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      {/* Header with gradient and back button */}
      <Animated.View 
        style={[
          styles.header,
          {
            backgroundColor: background,
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0.8, 1],
              extrapolate: 'clamp'
            })
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: text }]} numberOfLines={1}>
          {screenTitle}
        </Text>
        
        <View style={styles.rightPlaceholder} />
      </Animated.View>
      
      {/* Content Grid */}
      {loading.sections && contentItems.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={[styles.loadingText, { color: text }]}>Loading content...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: text }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: primary }]}
            onPress={() => {
              const filterType = mapSectionToFilterType(section as string);
              dispatch(fetchContentSections(filterType));
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contentItems}
          renderItem={renderContentItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          columnWrapperStyle={styles.columnWrapper}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={60} color={textSecondary} />
              <Text style={[styles.emptyText, { color: text }]}>No content found</Text>
              <Text style={[styles.emptySubtext, { color: textSecondary }]}>
                Try a different category or check back later
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_SPACING = 12;
const ITEM_WIDTH = (width - 32 - (COLUMN_COUNT - 1) * GRID_SPACING) / COLUMN_COUNT;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 40,
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingTop: 100, // For header
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: GRID_SPACING,
  },
  gridItem: {
    width: ITEM_WIDTH,
    marginBottom: 16,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  contentInfo: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rating: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
