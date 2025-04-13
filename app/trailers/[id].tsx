import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar, ScrollView, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Trailer } from '@/redux/types';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

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

// Function to format time in mm:ss format
const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TrailerScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Get theme colors
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const background = useThemeColor('background');
  const primary = useThemeColor('primary');
  
  // Video playback state
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Find the current trailer from mock data
  const trailer = trailersData.find(t => t.id === id) || trailersData[0];
  
  // Related trailers - all other trailers for this demo
  const relatedTrailers = trailersData.filter(t => t.id !== id);
  
  // Handle video status updates
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    
    if (status.isLoaded) {
      setCurrentPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish && !status.isLooping) {
        setIsPlaying(false);
        setShowControls(true);
        showControlsWithTimeout();
      }
    }
  };
  
  // Toggle video controls visibility
  const toggleControls = () => {
    if (showControls) {
      hideControls();
    } else {
      showControlsWithTimeout();
    }
  };
  
  // Show controls with a timeout to hide them
  const showControlsWithTimeout = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    
    // Clear any existing timeout
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    // Hide controls after 4 seconds of inactivity
    controlsTimeout.current = setTimeout(() => {
      hideControls();
    }, 4000);
  };
  
  // Hide controls
  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowControls(false);
    });
  };
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pauseAsync().catch(err => console.log('Error pausing video:', err));
      } else {
        videoRef.current.playAsync().catch(err => console.log('Error playing video:', err));
      }
      setIsPlaying(!isPlaying);
      showControlsWithTimeout();
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      showControlsWithTimeout();
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (isFullscreen) {
        // Switch back to normal view
        setIsFullscreen(false);
      } else {
        // Switch to fullscreen view
        setIsFullscreen(true);
      }
      showControlsWithTimeout();
    }
  };
  
  // Seek to position
  const seekToPosition = (value: number) => {
    if (videoRef.current && status?.isLoaded) {
      videoRef.current.setPositionAsync(value);
      setCurrentPosition(value);
      showControlsWithTimeout();
    }
  };
  
  // Handle going back
  const handleBackPress = () => {
    router.back();
  };
  
  // Reset control timeout when component mounts
  useEffect(() => {
    showControlsWithTimeout();
    
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      {/* Video Section */}
      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
          <Video
            ref={videoRef}
            source={{ uri: trailer.videoUrl }}
            style={styles.video}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            isMuted={isMuted}
          />
          
          {/* Video Controls - visible based on showControls state */}
          {showControls && (
            <Animated.View 
              style={[
                styles.controlsOverlay,
                { opacity: fadeAnim }
              ]}
            >
              {/* Top controls with back button and title */}
              <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.topControls}
              >
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={handleBackPress}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.videoTitle} numberOfLines={1}>
                  {trailer.title}
                </Text>
                <View style={{ width: 40 }} /> {/* Empty space for alignment */}
              </LinearGradient>
              
              {/* Center play/pause button */}
              <TouchableOpacity 
                style={styles.centerButton}
                onPress={togglePlayPause}
              >
                <Ionicons 
                  name={isPlaying ? "pause" : "play"}
                  size={42}
                  color="#fff"
                />
              </TouchableOpacity>
              
              {/* Bottom controls with seekbar and buttons */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.bottomControls}
              >
                {/* Seek bar */}
                <View style={styles.seekBarContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(currentPosition)}
                  </Text>
                  <Slider
                    style={styles.seekBar}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentPosition}
                    onValueChange={seekToPosition}
                    minimumTrackTintColor={primary}
                    maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                    thumbTintColor={primary}
                  />
                  <Text style={styles.timeText}>
                    {formatTime(duration)}
                  </Text>
                </View>
                
                {/* Playback controls */}
                <View style={styles.playbackControls}>
                  <TouchableOpacity onPress={togglePlayPause}>
                    <Ionicons 
                      name={isPlaying ? "pause" : "play"} 
                      size={26} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={toggleMute} style={styles.controlButton}>
                    <Ionicons 
                      name={isMuted ? "volume-mute" : "volume-high"} 
                      size={22} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
                    <MaterialIcons
                      name={isFullscreen ? "fullscreen-exit" : "fullscreen"}
                      size={22}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
      
      {/* Content section */}
      {!isFullscreen && (
        <ScrollView 
          style={[styles.contentContainer, { backgroundColor: background }]} // Use the theme background color variable
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text style={[styles.title, { color: text }]}>{trailer.title}</Text>
          
          <View style={styles.metaInfo}>
            <Text style={[styles.metaText, { color: textSecondary }]}>
              {trailer.duration}
            </Text>
            {trailer.releaseDate && (
              <>
                <Text style={[styles.metaText, { color: textSecondary }]}> • </Text>
                <Text style={[styles.metaText, { color: textSecondary }]}>
                  Released: {trailer.releaseDate}
                </Text>
              </>
            )}
          </View>
          
          <Text style={[styles.description, { color: textSecondary }]}>
            {trailer.description}
          </Text>
          
          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: primary }]}
              onPress={() => console.log('Playing related content')}
            >
              <Ionicons name="play" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Watch Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
              onPress={() => console.log('Adding to list')}
            >
              <Ionicons name="add" size={22} color="#fff" />
              <Text style={styles.actionButtonText}>Add to List</Text>
            </TouchableOpacity>
          </View>
          
          {/* Related trailers */}
          {relatedTrailers.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={[styles.sectionTitle, { color: text }]}>More Trailers</Text>
              <View style={styles.relatedTrailersContainer}>
                {relatedTrailers.map((relatedTrailer) => (
                  <TouchableOpacity
                    key={relatedTrailer.id}
                    style={styles.relatedTrailerItem}
                    onPress={() => router.push({
                      pathname: `/trailers/[id]`,
                      params: { id: relatedTrailer.id }
                    })}
                  >
                    <View style={styles.relatedTrailerThumbnailContainer}>
                      <Image 
                        source={{ uri: relatedTrailer.thumbnailUrl }} 
                        style={styles.relatedTrailerThumbnail} 
                        resizeMode="cover"
                      />
                      <View style={styles.relatedTrailerDuration}>
                        <Text style={styles.relatedTrailerDurationText}>{relatedTrailer.duration}</Text>
                      </View>
                      <View style={styles.relatedTrailerPlayButton}>
                        <Ionicons name="play" size={20} color="#fff" />
                      </View>
                    </View>
                    <Text 
                      style={[styles.relatedTrailerTitle, { color: text }]} 
                      numberOfLines={2}
                    >
                      {relatedTrailer.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Add background color to avoid transparency issues
  },
  videoContainer: {
    width: '100%',
    height: height * 0.35,
    backgroundColor: '#000',
    position: 'relative',
    marginBottom: 0, // Ensure no margin at bottom
    zIndex: 1, // Set proper z-index for layering
  },
  fullscreenVideo: {
    height: height,
    zIndex: 5, // Higher z-index when in fullscreen
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    zIndex: 10, // Controls above video
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 44, // Push down from top edge to avoid status bar
    paddingHorizontal: 16,
    paddingBottom: 20,
    zIndex: 15, // Ensure this is above other elements
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  videoTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  centerButton: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15, // Ensure this is above other elements
  },
  bottomControls: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 15, // Ensure this is above other elements
  },
  seekBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  seekBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    marginLeft: 24,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16, // Add padding at the top
    zIndex: 1, // Lower z-index than video
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingBottom: 40, // Add padding at the bottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  relatedSection: {
    marginTop: 12,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 4,
  },
  relatedTrailersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedTrailerItem: {
    width: (width - 48) / 2,
    marginBottom: 20,
  },
  relatedTrailerThumbnailContainer: {
    width: '100%',
    height: 110,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  relatedTrailerThumbnail: {
    width: '100%',
    height: '100%',
  },
  relatedTrailerDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  relatedTrailerDurationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  relatedTrailerPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedTrailerTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TrailerScreen;
