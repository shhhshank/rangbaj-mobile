import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  Animated,
  ActivityIndicator,
  AppState
} from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter, useFocusEffect } from 'expo-router';
import { HEADER_HEIGHT } from '@/components/common/Header';

// Types for the featured content
export interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string | null;
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
  onInfoPress: (id: string, type: 'movie' | 'show') => void;
  isVisible?: boolean; // For scroll-based pause/resume
  onVideoEnd?: () => void; // Callback when video ends
}

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(width * 9 / 16);

const HeroBanner = ({ featured, onInfoPress, isVisible = true, onVideoEnd }: HeroBannerProps) => {
  const videoRef = useRef<Video>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Get theme colors
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');

  // Load and play video after component mounts
  useEffect(() => {
    if (featured.videoUrl) {
      console.log('🎥 [HeroBanner] Video URL available:', featured.videoUrl);
      setIsVideoReady(true);
      setVideoError(false);
      setIsBuffering(true);
    } else {
      console.log('⚠️ [HeroBanner] No video URL, showing thumbnail');
      setIsVideoReady(false);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.stopAsync().catch(() => {});
      }
    };
  }, [featured.videoUrl]);

  // Handle scroll-based pause/resume
  useEffect(() => {
    if (!videoRef.current || !isVideoReady || videoError) return;

    if (isVisible && isPlaying) {
      console.log('▶️ [HeroBanner] Resuming video (visible)');
      videoRef.current.playAsync().catch((err) => {
        console.error('Error resuming video:', err);
      });
    } else if (!isVisible) {
      console.log('⏸️ [HeroBanner] Pausing video (not visible)');
      videoRef.current.pauseAsync().catch((err) => {
        console.error('Error pausing video:', err);
      });
    }
  }, [isVisible, isPlaying, isVideoReady, videoError]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App is going to background or becoming inactive
        if (videoRef.current && isVideoReady && !videoError) {
          console.log('⏸️ [HeroBanner] Pausing video (app backgrounded)');
          videoRef.current.pauseAsync().catch((err) => {
            console.error('Error pausing video on background:', err);
          });
        }
      } else if (nextAppState === 'active') {
        // App is coming to foreground
        if (videoRef.current && isVideoReady && !videoError && isVisible) {
          console.log('▶️ [HeroBanner] Resuming video (app foregrounded)');
          videoRef.current.playAsync().catch((err) => {
            console.error('Error resuming video on foreground:', err);
          });
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isVideoReady, videoError, isVisible]);

  // Handle screen focus/blur (tab changes, navigation)
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused - resume video if conditions are met
      if (videoRef.current && isVideoReady && !videoError && isVisible) {
        console.log('▶️ [HeroBanner] Resuming video (screen focused)');
        videoRef.current.playAsync().catch((err) => {
          console.error('Error resuming video on focus:', err);
        });
      }

      // Cleanup function - called when screen loses focus
      return () => {
        if (videoRef.current && isVideoReady && !videoError) {
          console.log('⏸️ [HeroBanner] Pausing video (screen blurred)');
          videoRef.current.pauseAsync().catch((err) => {
            console.error('Error pausing video on blur:', err);
          });
        }
      };
    }, [isVideoReady, videoError, isVisible])
  );

  // Fade in video when it loads
  const handleVideoLoad = () => {
    console.log('✅ [HeroBanner] Video loaded successfully');
    setVideoLoaded(true);
    setIsBuffering(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Handle playback status updates
  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering);
      setIsPlaying(status.isPlaying);
      
      // Check if video has ended
      if (status.didJustFinish && !status.isLooping && onVideoEnd) {
        console.log('🎬 [HeroBanner] Video ended, triggering callback');
        onVideoEnd();
      }
    }
  };

  // Handle video tap to play/pause
  const handleVideoTap = async () => {
    if (!videoRef.current || videoError) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        console.log('⏸️ [HeroBanner] Video paused by user');
      } else {
        await videoRef.current.playAsync();
        console.log('▶️ [HeroBanner] Video resumed by user');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleInfoPress = () => {
    onInfoPress(featured.id, featured.type);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container}>
      {/* Video or Thumbnail */}
      {isVideoReady && featured.videoUrl && !videoError ? (
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={handleVideoTap}
          style={styles.videoContainer}
        >
          <Animated.View style={[styles.videoContainer, { opacity: fadeAnim }]}>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: featured.videoUrl }}
              resizeMode={ResizeMode.COVER}
              isLooping={!onVideoEnd} // Only loop if no onVideoEnd callback (single banner)
              isMuted={isMuted}
              shouldPlay={true}
              onLoad={handleVideoLoad}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              onError={(error) => {
                console.error('❌ [HeroBanner] Video playback error:', error);
                setVideoError(true);
                setIsVideoReady(false);
                setIsBuffering(false);
              }}
            />
          </Animated.View>

          {/* Loading Indicator */}
          {isBuffering && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading preview...</Text>
            </View>
          )}

          {/* Play/Pause Indicator (shows briefly on tap) */}
          {!isPlaying && !isBuffering && (
            <View style={styles.playPauseOverlay}>
              <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.9)" />
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <Image 
          source={{ uri: featured.thumbnailUrl }} 
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      {/* Gradient overlay - darker at bottom for better text readability */}
      <LinearGradient
        colors={[
          'transparent',
          'transparent',
          'rgba(0,0,0,0.3)',
          'rgba(0,0,0,0.9)'
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      >
        {/* Mute button in top right */}
        {isVideoReady && featured.videoUrl && !videoError && (
          <TouchableOpacity 
            style={styles.muteButton} 
            onPress={handleMuteToggle}
          >
            <Ionicons 
              name={isMuted ? "volume-mute" : "volume-high"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        )}

        {/* Bottom content area - minimal */}
        <View style={styles.contentInfo}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {featured.title}
          </Text>
          
          {/* Single Watch button */}
          <TouchableOpacity 
            style={[styles.playButton, { backgroundColor: primary }]} 
            onPress={handleInfoPress}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.playButtonText}>Watch</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    overflow: 'hidden', // Ensure video is clipped to container
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingTop: HEADER_HEIGHT + 8,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  muteButton: {
    position: 'absolute',
    top: HEADER_HEIGHT + 8,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  contentInfo: {
    width: '100%',
    alignItems: 'flex-start',
    maxWidth: width - 40,
  },
  title: {
    color: '#fff',
    fontSize: Math.min(width * 0.065, 28),
    fontWeight: '700',
    marginBottom: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: -0.3,
    lineHeight: Math.min(width * 0.075, 32),
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignSelf: 'flex-start',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 15,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default HeroBanner;
