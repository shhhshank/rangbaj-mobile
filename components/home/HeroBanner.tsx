import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  Animated
} from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { HEADER_HEIGHT } from '@/components/common/Header';

// Types for the featured content
export interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  previewUrl: string | null;
  year: string;
  maturityRating: string;
  duration: string;
  genres: string[];
  isOriginal?: boolean;
  isNew?: boolean;
  isTopRated?: boolean;
  type: 'movie' | 'show';
}

interface HeroBannerProps {
  featured: FeaturedContent;
  onPlay: (id: string, type: 'movie' | 'show') => void;
  onAddToList: (id: string) => void;
  onInfoPress: (id: string, type: 'movie' | 'show') => void;
}

const { width, height } = Dimensions.get('window');

const HeroBanner = ({ featured, onPlay, onAddToList, onInfoPress }: HeroBannerProps) => {
  const videoRef = useRef<Video>(null);
  const [isPreviewReady, setIsPreviewReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Get theme colors
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');

  // Load and play video preview after component mounts
  useEffect(() => {
    if (featured.previewUrl) {
      setIsPreviewReady(true);
      
      // Fade in the video once it's loaded
      const fadeIn = () => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      };

      // Wait a bit before starting the preview to ensure UI is ready
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.playAsync();
          fadeIn();
        }
      }, 1500);

      return () => {
        clearTimeout(timer);
        if (videoRef.current) {
          videoRef.current.stopAsync();
        }
      };
    }
  }, [featured]);

  const handlePlayPress = () => {
    onPlay(featured.id, featured.type);
  };

  const handleInfoPress = () => {
    onInfoPress(featured.id, featured.type);
  };

  const handleAddToListPress = () => {
    onAddToList(featured.id);
  };

  return (
    <View style={styles.container}>
      {isPreviewReady && featured.previewUrl ? (
        <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: featured.previewUrl }}
            resizeMode="cover"
            isLooping
            isMuted={true}
            shouldPlay={false}
            onLoad={() => setVideoLoaded(true)}
            onError={() => setIsPreviewReady(false)}
          />
        </Animated.View>
      ) : (
        <Image 
          source={{ uri: featured.thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.2)',
          'rgba(0,0,0,0.4)',
          'rgba(0,0,0,0.8)'
        ]}
        style={styles.gradient}
      >
        {/* Content badges */}
        <View style={styles.badges}>
          {featured.isOriginal && (
            <View style={[styles.badge, { backgroundColor: primary }]}>
              <Text style={styles.badgeText}>ORIGINAL</Text>
            </View>
          )}
          {featured.isTopRated && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>TOP 10</Text>
            </View>
          )}
          {featured.isNew && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Title and description */}
        <View style={styles.contentInfo}>
          <Text style={[styles.title, { color: text }]}>{featured.title}</Text>
          
          {/* Meta information */}
          <View style={styles.metaInfo}>
            <Text style={[styles.metaText, { color: textSecondary }]}>{featured.year}</Text>
            <Text style={[styles.separator, { color: textSecondary }]}>•</Text>
            <Text style={[styles.metaText, { color: textSecondary }]}>{featured.maturityRating}</Text>
            <Text style={[styles.separator, { color: textSecondary }]}>•</Text>
            <Text style={[styles.metaText, { color: textSecondary }]}>{featured.duration}</Text>
          </View>
          
          <Text 
            style={[styles.description, { color: textSecondary }]} 
            numberOfLines={2}
          >
            {featured.description}
          </Text>
          
          {/* Genres */}
          <View style={styles.genreContainer}>
            {featured.genres.slice(0, 3).map((genre, index) => (
              <View key={index} style={styles.genreItem}>
                <Text style={[styles.genreText, { color: textSecondary }]}>{genre}</Text>
                {index < Math.min(featured.genres.length, 3) - 1 && (
                  <Text style={[styles.separator, { color: textSecondary }]}>•</Text>
                )}
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: primary }]} 
              onPress={handlePlayPress}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: textSecondary }]} 
              onPress={handleAddToListPress}
            >
              <AntDesign name="plus" size={20} color={text} />
              <Text style={[styles.secondaryButtonText, { color: text }]}>My List</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: textSecondary }]} 
              onPress={handleInfoPress}
            >
              <Ionicons name="information-circle-outline" size={20} color={text} />
              <Text style={[styles.secondaryButtonText, { color: text }]}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.7,
    position: 'relative',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: HEADER_HEIGHT + 10,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentInfo: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  genreItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 12,
  },
  secondaryButtonText: {
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
});

export default HeroBanner;
