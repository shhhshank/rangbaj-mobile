import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text, ViewProps, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation, useLocalSearchParams } from 'expo-router';
import useBackPressed from '@/hooks/useBackPressed';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function ContentPlayerScreen() {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | undefined>();
  const [isBuffering, setIsBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [resizeMode, setResizeMode] = useState<ResizeMode>(ResizeMode.CONTAIN);
  const controlsOpacity = useSharedValue(1);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  // We'll use mock content for now
  const mockContent = {
    title: "The Universe's Edge",
    description: "A journey beyond the known universe reveals secrets that challenge our understanding of reality.",
    source: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  };

  // Use theme colors
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);

  const showControls = () => {
    setControlsVisible(true);
    controlsOpacity.value = withTiming(1, { duration: 300 });
    
    // Auto-hide controls after 3 seconds of inactivity
    if (controlsTimer.current) {
      clearTimeout(controlsTimer.current);
    }
    
    controlsTimer.current = setTimeout(() => {
      if (status && 'isLoaded' in status && status.isLoaded && status.isPlaying) {
        hideControls();
      }
    }, 3000);
  };

  const hideControls = () => {
    controlsOpacity.value = withTiming(0, { duration: 300 });
    setTimeout(() => setControlsVisible(false), 300);
  };

  const togglePlayPause = async () => {
    if (!video.current) return;
    
    if (status && 'isLoaded' in status && status.isLoaded && status.isPlaying) {
      await video.current.pauseAsync();
    } else {
      await video.current.playAsync();
    }
    
    showControls();
  };

  const handleVideoTap = () => {
    if (controlsVisible) {
      hideControls();
    } else {
      showControls();
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    setStatus(status);
    
    if ('isLoaded' in status && status.isLoaded) {
      setIsBuffering(status.isBuffering);
    } else if ('error' in status) {
      setError(status.error || 'An error occurred while playing the video');
    }
  };

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      if (Math.round(event.scale) === 0) {
        setResizeMode(ResizeMode.CONTAIN);
      } else {
        setResizeMode(ResizeMode.COVER);
      }
    })
    .runOnJS(true);

  // Handle back button
  useBackPressed(() => {
    const run = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    };

    run();
    return true;
  }, []);

  // Set landscape orientation on focus
  useFocusEffect(() => {
    const run = async () => {
      if ((await ScreenOrientation.getOrientationLockAsync()) !== ScreenOrientation.OrientationLock.LANDSCAPE) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    };

    run();
  });

  // Seek forward/backward
  const seekForward = async () => {
    if (!video.current || !status || !('positionMillis' in status)) return;
    
    const newPosition = Math.min(
      status.positionMillis + 10000,
      'durationMillis' in status ? status.durationMillis || 0 : 0
    );
    
    await video.current.setPositionAsync(newPosition);
    showControls();
  };

  const seekBackward = async () => {
    if (!video.current || !status || !('positionMillis' in status)) return;
    
    const newPosition = Math.max(status.positionMillis - 10000, 0);
    await video.current.setPositionAsync(newPosition);
    showControls();
  };

  // Format time in mm:ss
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const controlsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: controlsOpacity.value,
    };
  });
  
  // Calculate progress
  const getProgress = () => {
    if (!status || !('positionMillis' in status) || !('durationMillis' in status) || !status.durationMillis) {
      return 0;
    }
    return status.positionMillis / status.durationMillis;
  };

  // Video controller component
  const VideoController = () => {
    if (!controlsVisible) return null;

    return (
      <Animated.View 
        style={[
          styles.controllerContainer, 
          { backgroundColor: 'rgba(0,0,0,0.5)' },
          controlsAnimatedStyle
        ]}
      >
        {/* Top bar with back button and title */}
        <View style={styles.topControls}>
          <TouchableOpacity 
            onPress={() => {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={text} />
          </TouchableOpacity>
          <Text style={[styles.videoTitle, { color: text }]}>{mockContent.title}</Text>
          <TouchableOpacity onPress={() => setResizeMode(
            resizeMode === ResizeMode.CONTAIN ? ResizeMode.COVER : ResizeMode.CONTAIN
          )}>
            <MaterialIcons name="fit-screen" size={24} color={text} />
          </TouchableOpacity>
        </View>

        {/* Center controls for seeking and play/pause */}
        <View style={styles.centerControls}>
          <TouchableOpacity onPress={seekBackward} style={styles.seekButton}>
            <Ionicons name="play-back" size={30} color={text} />
            <Text style={[styles.seekText, { color: textSecondary }]}>{'10s'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <AntDesign 
              name={(status && 'isLoaded' in status && status.isLoaded && status.isPlaying) ? "pausecircleo" : "playcircleo"} 
              size={50} 
              color={text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={seekForward} style={styles.seekButton}>
            <Ionicons name="play-forward" size={30} color={text} />
            <Text style={[styles.seekText, { color: textSecondary }]}>{'10s'}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom controls for progress and time */}
        <View style={styles.bottomControls}>
          {status && 'positionMillis' in status && 'durationMillis' in status ? (
            <Text style={[styles.timeText, { color: textSecondary }]}>{formatTime(status.positionMillis)} / {formatTime(status.durationMillis || 0)}</Text>
          ) : (
            <Text style={[styles.timeText, { color: textSecondary }]}>{'0:00'} / {'0:00'}</Text>
          )}
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg} />
            <View style={[styles.progressBar, { width: `${getProgress() * 100}%`, backgroundColor: primary }]} />
          </View>
          
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={text} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <GestureDetector gesture={pinch}>
      <View style={[styles.container, { backgroundColor: background }]}>
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.videoWrapper}
          onPress={handleVideoTap}
        >
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: mockContent.source }}
            resizeMode={resizeMode}
            isLooping
            shouldPlay
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            useNativeControls={false}
          />
          
          {isBuffering && !error && (
            <View style={styles.bufferingContainer}>
              <ActivityIndicator size="large" color={text} />
              <Text style={[styles.bufferingText, { color: textSecondary }]}>{'Loading...'}</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={40} color="#ff5252" />
              <Text style={[styles.errorText, { color: text }]}>{error}</Text>
              <TouchableOpacity 
                style={[styles.retryButton, { backgroundColor: primary }]}
                onPress={() => {
                  setError(null);
                  if (video.current) {
                    video.current.replayAsync();
                  }
                }}
              >
                <Text style={styles.retryText}>{'Retry'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <VideoController />
        </TouchableOpacity>
      </View>
    </GestureDetector>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  videoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bufferingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bufferingText: {
    marginTop: 10,
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controllerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    marginRight: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seekButton: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  seekText: {
    fontSize: 12,
    marginTop: 4,
  },
  playPauseButton: {
    marginHorizontal: 20,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
  },
  timeText: {
    fontSize: 14,
    marginRight: 10,
    minWidth: 80,
  },
  progressBarContainer: {
    height: 4,
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
});
