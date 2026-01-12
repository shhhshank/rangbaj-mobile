import PromotionSlider from '@/components/home/PromotionSlider';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { View, StyleSheet, Platform, ScrollView, Text, Image, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator, Animated } from 'react-native';
import ContentFilterChips from '@/components/home/ContentFilterChips';
import GroupContentThumb from '@/components/common/GroupContentThumb';
import HorizontalList from '@/components/common/HorizontalList';
import { useEffect, useState, useRef } from 'react';
import { Styles } from '@/constants/Styles';
import ContentThumb from '@/components/common/ContentThumb';
import { Link, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import HeroBanner, { FeaturedContent } from '@/components/home/HeroBanner';
import HeroCarousel from '@/components/home/HeroCarousel';
import { HEADER_HEIGHT } from '@/components/common/Header';
import { useScrollY } from '@/hooks/useScrollY';
import Header from '@/components/common/Header';
import { useDispatch, useSelector } from 'react-redux';
import TokenExpirySimulator from '@/components/common/TokenExpirySimulator';
import AuthDebugPanel from '@/components/common/AuthDebugPanel';
import { DEBUG_CONFIG } from '@/constants/DebugConfig';
import SeeAllButton from '@/components/common/SeeAllButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  fetchAllContentIds, 
  fetchContentById, 
  fetchContentSections, 
  selectContentSections, 
  selectHeroContent,
  selectAllHeroContent,
  selectIsLoading,
  selectError,
  selectAllContentIds,
  selectActiveFilter,
  setActiveFilter
} from '@/redux/slices/contentSlice';
import { ContentFilterType as ContentFilter } from '@/redux/ContentFilterType';
import { AppDispatch, RootState } from '@/redux/store';
import { Movie, Show, Trailer } from '@/redux/types';
import TrailerSection from '@/components/trailers/TrailerSection';

// Continue watching mock data (to be replaced with actual API in the future)
const continueWatchingData = [
  { 
    id: '101', 
    title: 'Quantum Resonance', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop', 
    progress: 0.6, 
    remainingTime: '35m left',
    episode: 'S1:E4',
    type: 'movie'
  },
  { 
    id: '102', 
    title: 'Stellar Odyssey', 
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop', 
    progress: 0.2, 
    remainingTime: '1h 10m left',
    episode: null,
    type: 'movie'
  },
  { 
    id: '103', 
    title: 'Dark Matter', 
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop', 
    progress: 0.8, 
    remainingTime: '12m left',
    episode: 'S2:E7',
    type: 'show'
  },
];

// My List mock data (to be replaced with actual API in the future)
const myListData = [
  { id: '201', title: 'Time Fracture', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop', type: 'movie' },
  { id: '202', title: 'Solar Wind', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop', type: 'show' },
  { id: '203', title: 'Galactic Horizon', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&auto=format&fit=crop', type: 'movie' },
  { id: '204', title: 'Cosmic Dawn', image: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=400&auto=format&fit=crop', type: 'show' },
];

// Mock trailers data
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

// Continue watching item component
function ContinueWatchingItem({ item, onPress }: { item: any, onPress: () => void }) {
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');

  return (
    <TouchableOpacity style={styles.continueWatchingItem} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.thumbnailOverlay}>
          <View style={styles.playIconContainer}>
            <Ionicons name="play-circle" size={40} color="#fff" />
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${item.progress * 100}%`, backgroundColor: primary }]} />
        </View>
      </View>
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: text }]}>{item.title}</Text>
        <View style={styles.itemInfo}>
          {item.episode && (
            <Text style={[styles.episodeInfo, { color: textSecondary }]}>{item.episode}</Text>
          )}
          <Text style={[styles.remainingTime, { color: textSecondary }]}>{item.remainingTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// New modern content item component with rating
function ContentItem({ item, onPress }: { item: any, onPress: () => void }) {
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  
  // Determine content type for badge display
  const isShow = item.seasons !== undefined || item.type === 'show' || item.contentType === 'show';
  
  return (
    <TouchableOpacity style={styles.contentItem} onPress={onPress}>
      <Image source={{ uri: item.thumbnailUrl || item.image }} style={styles.contentThumb} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.contentGradient}
      />
      <View style={styles.contentInfo}>
        <Text style={[styles.contentTitle, { color: '#fff' }]} numberOfLines={1}>
          {typeof item.title === 'string' ? item.title : String(item.title || 'Untitled')}
        </Text>
        {item.starRating && typeof item.starRating === 'number' && (
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={10} color="#FFD700" />
            <Text style={[styles.ratingText, { color: '#fff' }]}>{item.starRating}</Text>
          </View>
        )}
      </View>
      
      {/* Content type indicator */}
      {isShow && (
        <View style={[styles.contentTypeBadge, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          <Text style={styles.contentTypeBadgeText}>SHOW</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// Content section component
function ContentSection({ title, data, onItemPress }: { title: string, data: any[], onItemPress: (id: string, type?: 'movie' | 'show') => void }) {
  const router = useRouter();
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');

  // Skip rendering if no data
  if (!data || data.length === 0) return null;

  // Determine if section contains shows or movies based on data
  const contentType = title.toLowerCase().includes('show') || 
                     data.some(item => item.seasons !== undefined || item.type === 'show' || item.contentType === 'show')
                     ? 'show' : 'movie';

  // Extract section identifier from title
  const sectionId = title.toLowerCase().split(' ')[0];

  console.log('Section ID:', sectionId);

  const navigateToMore = () => {
    const encodedTitle = encodeURIComponent(title);
    router.push(`/content/more/${encodedTitle}?section=${sectionId}&type=${contentType}`);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: text }]}>{title}</Text>
        
        <SeeAllButton 
          title={title} 
          section={sectionId} 
          contentType={contentType === 'show' ? 'show' : 'movie'} 
          count={data.length}
        />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScrollView}
        contentContainerStyle={styles.sectionScrollContainer}
      >
        {data.map((item, index) => (
          <ContentItem
            key={item.id || index.toString()}
            item={item}
            onPress={() => onItemPress(item.id, contentType)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = useScrollY();
  const dispatch = useDispatch<AppDispatch>();
  const [heroVisible, setHeroVisible] = useState(true);
  
  console.log('🎨 [UI] HomeScreen render started');
  
  // Redux selectors
  const contentSections = useSelector(selectContentSections);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const heroContent = useSelector(selectHeroContent);
  const allHeroContent = useSelector(selectAllHeroContent); // All hero items for carousel
  const activeFilter = useSelector(selectActiveFilter);
  const allContentIds = useSelector(selectAllContentIds);
  const movies = useSelector((state: RootState) => state.content.movies);
  const shows = useSelector((state: RootState) => state.content.shows);
  const sectionsFetched = useSelector((state: RootState) => state.content.sectionsFetched);
  
  // Log current Redux state
  console.log('🎬 [Redux] Current state:', {
    contentSectionsCount: contentSections?.length || 0,
    allContentIdsCount: allContentIds?.length || 0,
    moviesCount: Object.keys(movies || {}).length,
    showsCount: Object.keys(shows || {}).length,
    heroContent: heroContent ? { id: heroContent.id, title: heroContent.title } : null,
    loading: {
      movies: loading?.movies,
      shows: loading?.shows,
      sections: loading?.sections
    },
    error,
    activeFilter
  });
  
  // Determine content type for hero banner
  const heroContentType = heroContent ? 
    ('seasons' in heroContent ? 'show' : 'movie') as 'movie' | 'show' : null;
  
  // Handle scroll event to track hero banner visibility
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        const heroThreshold = 400; // Pixels scrolled before pausing video
        const isVisible = scrollPosition < heroThreshold;
        
        if (isVisible !== heroVisible) {
          setHeroVisible(isVisible);
          console.log(`👁️ [HomeScreen] Hero banner visibility: ${isVisible ? 'visible' : 'hidden'}`);
        }
      }
    }
  );
  


const handleFilterChange = (filter: ContentFilter) => {
  dispatch(setActiveFilter(filter));
  dispatch(fetchContentSections());
};
  
  // Step 1: Initial data loading - fetch all content IDs first
  useEffect(() => {
    console.log('🚀 [DataFlow] Step 1: Starting - Fetching all content IDs');
    dispatch(fetchAllContentIds());
  }, [dispatch]);

  // Step 2: When content IDs are available, fetch details for each ID
  useEffect(() => {
    console.log('📊 [DataFlow] Step 2: Content IDs received:', {
      allContentIds,
      count: allContentIds?.length || 0,
      isArray: Array.isArray(allContentIds),
      moviesLoaded: Object.keys(movies || {}).length,
      showsLoaded: Object.keys(shows || {}).length
    });
    
    if (allContentIds && Array.isArray(allContentIds) && allContentIds.length > 0) {
      let fetchCount = 0;
      allContentIds.forEach((contentId: string) => {
        const hasMovie = movies && movies[contentId];
        const hasShow = shows && shows[contentId];
        const alreadyExists = hasMovie || hasShow;
        
        console.log(`🔍 [DataFlow] Checking content ID ${contentId}:`, {
          hasMovie: !!hasMovie,
          hasShow: !!hasShow,
          alreadyExists,
          willFetch: !alreadyExists
        });
        
        // Only fetch if we don't already have this content
        if (movies && shows && !alreadyExists) {
          console.log(`🌐 [DataFlow] Fetching content details for ID: ${contentId}`);
          dispatch(fetchContentById(contentId));
          fetchCount++;
        } else {
          console.log(`⏭️ [DataFlow] Skipping ${contentId} - already exists`);
        }
      });
      console.log(`📈 [DataFlow] Dispatched ${fetchCount} content detail requests`);
    }
  }, [allContentIds, movies, shows, dispatch]);

  // Step 3: When all content details are loaded, fetch content sections
  useEffect(() => {
    if (allContentIds && movies && shows && contentSections) {
      console.log('🎬 [DataFlow] Step 3: Checking if ready for content sections:', {
        allContentIds: allContentIds?.length || 0,
        moviesLoaded: Object.keys(movies || {}).length,
        showsLoaded: Object.keys(shows || {}).length,
      });
      
      const totalLoadedContent = Object.keys(movies).length + Object.keys(shows).length;
      const hasAllContent = allContentIds.length > 0 && totalLoadedContent >= allContentIds.length;
      
      console.log('📊 [DataFlow] Content loading progress:', {
        totalExpected: allContentIds.length,
        totalLoaded: totalLoadedContent,
        hasAllContent,
        sectionsAlreadyLoaded: contentSections.length > 0
      });
      
      // FIX: Only fetch sections if we haven't tried yet and we're not currently loading
      if (hasAllContent && !sectionsFetched && !loading.sections) {
        console.log('🎬 [DataFlow] Step 3: All content loaded, fetching content sections...');
        dispatch(fetchContentSections());
      }
    }
  }, [allContentIds, movies, shows, contentSections, sectionsFetched, loading.sections, dispatch]);


  // Handle content press
  const handleContentPress = (id: string, type?: 'movie' | 'show') => {
    if (!id) {
      console.error('Missing content ID in handleContentPress');
      return;
    }
    
    // If we already have a type, use it directly
    const finalType = type || 'movie';
    
    console.log(`Navigating to ${finalType} with ID: ${id}`);
    
    try {
      // Pre-fetch the content data before navigation
      if (finalType === 'movie') {
        
        router.push(`/content/movie/${id}`);
      } else {
        
        router.push(`/content/show/${id}`);
      }
    } catch (error) {
      console.error('Error navigating to content:', error);
    }
  };

  // Handle hero banner info button press
  const handleHeroInfo = (id: string, type: 'movie' | 'show') => {
    if (type === 'movie') {
      router.push(`/content/movie/${id}`);
    } else {
      router.push(`/content/show/${id}`);
    }
  };

  // Color for text elements based on theme
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const background = useThemeColor('background');
  const primary = useThemeColor('primary');
  
  // Create featured content array for hero carousel
  const heroCarouselContent: FeaturedContent[] = allHeroContent.map(content => {
    const contentType = 'seasons' in content ? 'show' : 'movie';
    return {
      id: content.id,
      title: content.title,
      description: content.description,
      thumbnailUrl: content.coverUrl,
      videoUrl: content.video?.url || null,
      year: content.releaseYear,
      maturityRating: content.rating,
      duration: contentType === 'movie' && 'duration' in content ? content.duration : `${'seasons' in content ? content.seasons : 1} Seasons`,
      genres: content.genres,
      isOriginal: content.isOriginal || false,
      isNew: content.isNew || false,
      isTopRated: content.starRating > 4.5,
      type: contentType
    };
  });

  // Create a featured content object for hero banner if available (backward compatibility)
  const heroBannerContent: FeaturedContent | null = heroContent && heroContentType ? {
    id: heroContent.id,
    title: heroContent.title,
    description: heroContent.description,
    thumbnailUrl: heroContent.coverUrl,
    videoUrl: heroContent.video?.url || null,
    year: heroContent.releaseYear,
    maturityRating: heroContent.rating,
    duration: heroContentType === 'movie' && 'duration' in heroContent ? heroContent.duration : `${'seasons' in heroContent ? heroContent.seasons : 1} Seasons`,
    genres: heroContent.genres,
    isOriginal: heroContent.isOriginal || false,
    isNew: heroContent.isNew || false,
    isTopRated: heroContent.starRating > 4.5,
    type: heroContentType
  } : null;
  
  // Debug logging for hero content
  useEffect(() => {
    if (heroContent) {
      console.log('🦸 [HomeScreen] Hero Content Details:', {
        id: heroContent.id,
        title: heroContent.title,
        hasVideo: !!heroContent.video,
        videoUrl: heroContent.video?.url || 'No video URL',
        videoObject: heroContent.video
      });
    }
    
    if (heroBannerContent) {
      console.log('🎬 [HomeScreen] Hero Banner Content Being Passed:', {
        id: heroBannerContent.id,
        title: heroBannerContent.title,
        videoUrl: heroBannerContent.videoUrl,
        thumbnailUrl: heroBannerContent.thumbnailUrl,
        hasVideoUrl: !!heroBannerContent.videoUrl
      });
    } else {
      console.log('⚠️ [HomeScreen] No hero banner content available');
    }
  }, [heroContent, heroBannerContent]);

  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      <Header
        scrollY={scrollY}
      />
      
      {loading.sections && !contentSections.length ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={[styles.loadingText, { color: text }]}>Loading content...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: text }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: primary }]}
            onPress={() => dispatch(fetchContentSections())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Hero Carousel */}
          {heroCarouselContent.length > 0 && (
            <HeroCarousel
              heroContent={heroCarouselContent}
              onInfoPress={(id, type) => handleHeroInfo(id, type)}
              isVisible={heroVisible}
            />
          )}
          
          <View style={styles.spacer} />
          
          <View style={styles.mainContent}>
            {/* Trailers Section */}
           
            
            {/* Continue Watching (mock data) */}
            
            {/* Dynamic Content Sections */}
            {contentSections.map((section, idx) => (
              <ContentSection 
                key={section.id || idx}
                title={section.title}
                data={section.contents}
                onItemPress={handleContentPress}
              />
            ))}
          </View>
        </ScrollView>
      )}
      
      {/* Debug Components - Only in development */}
      {/* Uncomment these to enable debug tools for testing token refresh */}
      {/* {__DEV__ && DEBUG_CONFIG.FAST_TOKEN_EXPIRY && <TokenExpirySimulator />} */}
      {/* {__DEV__ && DEBUG_CONFIG.SHOW_AUTH_DEBUG_PANEL && <AuthDebugPanel />} */}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  spacer: {
    height: 10, // Add space between hero and content
  },
  mainContent: {
    paddingHorizontal: 0, // Keep this at 0 to let children handle their own padding
    paddingTop: 10,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16, // Consistent padding for the entire section
    overflow: 'visible',
  },
  filterSpacerTop: {
    height: 16, // Add more space between Continue Watching and filter chips
  },
  filterSpacerBottom: {
    height: 6, // Reduce space between filter chips and filtered content
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  horizontalScrollView: {
    marginLeft: -16, // Offset the container padding to align content with screen edge
    paddingLeft: 0,
    overflow: 'visible',
  },
  sectionScrollContainer: {
    paddingLeft: 16, // Match the section container's left padding
    paddingRight: 24, // Extra padding at the end for better scrolling
  },
  contentItem: {
    marginRight: 12,
    // Use fixed dimensions for consistency
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    width: 110,
    height: 165,
  },
  contentThumb: {
    width: 110,
    height: 165,
    borderRadius: 6,
  },
  contentGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderRadius: 6,
  },
  contentInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  contentTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 4,
  },
  // Continue Watching Styles
  continueWatchingItem: {
    width: width * 0.5,
    marginRight: 12,
  },
  thumbnailContainer: {
    width: '100%',
    height: width * 0.28,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
  },
  itemDetails: {
    marginTop: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeInfo: {
    fontSize: 12,
    marginRight: 8,
  },
  remainingTime: {
    fontSize: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: 16,
    padding: 4,
  },
  listContainer: {
    overflow: 'visible', // Ensure content isn't clipped
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
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
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
  contentTypeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  contentTypeBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
