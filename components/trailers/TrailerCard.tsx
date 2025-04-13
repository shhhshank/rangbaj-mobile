import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Platform 
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Trailer } from '@/redux/types';

const { width } = Dimensions.get('window');

interface TrailerCardProps {
  trailer: Trailer;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  autoPlay?: boolean;
  showControls?: boolean;
}

const TrailerCard = ({ 
  trailer, 
  onPress, 
  size = 'medium',
  autoPlay = false,
  showControls = false
}: TrailerCardProps) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Get theme colors
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  
  // Determine dimensions based on size prop
  const getCardDimensions = () => {
    switch (size) {
      case 'small':
        return {
          width: width * 0.4,
          height: width * 0.225,
          titleSize: 12,
          durationSize: 10,
          playIconSize: 40
        };
      case 'large':
        return {
          width: width - 32,
          height: (width - 32) * 0.56,
          titleSize: 16,
          durationSize: 12,
          playIconSize: 60
        };
      case 'medium':
      default:
        return {
          width: width * 0.6,
          height: width * 0.34,
          titleSize: 14,
          durationSize: 11,
          playIconSize: 50
        };
    }
  };
  
  const { width: cardWidth, height: cardHeight, titleSize, durationSize, playIconSize } = getCardDimensions();
  
  // Handle play button press
  const handlePlayPress = () => {
    if (onPress) {
      onPress();
      return;
    }
    
    // Toggle video playback if no external handler
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync().catch(() => {
          console.log('Error pausing video');
        });
      } else {
        videoRef.current.playAsync().catch(() => {
          console.log('Error playing video');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted).then(() => {
        setIsMuted(!isMuted);
      }).catch(() => {
        console.log('Error toggling mute');
      });
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (isFullscreen) {
        videoRef.current.dismissFullscreenPlayer().catch(() => {
          console.log('Error exiting fullscreen');
        });
      } else {
        videoRef.current.presentFullscreenPlayer().catch(() => {
          console.log('Error entering fullscreen');
        });
      }
      setIsFullscreen(!isFullscreen);
    }
  };
  
  return (
    <View style={[styles.container, { width: cardWidth, height: cardHeight }]}>
      {!isPlaying ? (
        // Thumbnail view
        <TouchableOpacity activeOpacity={0.8} onPress={handlePlayPress} style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: trailer.thumbnailUrl }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
          <View style={styles.playButtonOverlay}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={playIconSize * 0.5} color="#fff" />
            </View>
          </View>
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={[styles.title, { fontSize: titleSize, color: '#fff' }]} numberOfLines={1}>
              {trailer.title}
            </Text>
            <View style={styles.metaInfo}>
              <Text style={[styles.duration, { fontSize: durationSize, color: '#fff' }]}>
                {trailer.duration}
              </Text>
            </View>
          </LinearGradient>
          
          {/* Trailer badge */}
          <View style={styles.trailerBadge}>
            <Text style={styles.trailerBadgeText}>TRAILER</Text>
          </View>
        </TouchableOpacity>
      ) : (
        // Video player view
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: trailer.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping={false}
            isMuted={isMuted}
            shouldPlay={autoPlay || isPlaying}
            useNativeControls={showControls}
            onPlaybackStatusUpdate={status => {
              if (status.isLoaded) {
                if (status.didJustFinish) {
                  setIsPlaying(false);
                }
              }
            }}
          />
          
          {/* Custom controls when not showing native controls */}
          {!showControls && (
            <View style={styles.customControls}>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={toggleMute}
              >
                <FontAwesome name={isMuted ? "volume-off" : "volume-up"} size={18} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={handlePlayPress}
              >
                <MaterialIcons name="replay" size={22} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={toggleFullscreen}
              >
                <MaterialIcons name="fullscreen" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Title overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.videoTitleGradient}
          >
            <Text style={[styles.title, { fontSize: titleSize, color: '#fff' }]} numberOfLines={1}>
              {trailer.title}
            </Text>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnailContainer: {
    flex: 1,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: '40%',
  },
  videoTitleGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: 60,
  },
  title: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  duration: {
    fontWeight: '500',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  customControls: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    flexDirection: 'row',
    padding: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  trailerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  trailerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TrailerCard;
