import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Button, ViewProps } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from 'expo-router';
import useBackPressed from '@/hooks/useBackPressed';

export default function ContentPlayerScreen() {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [resizeMode, setResizeMode] = useState<ResizeMode>(ResizeMode.CONTAIN)
  const navigation = useNavigation()


  const background = useThemeColor('background')

  const pinch = Gesture.Pinch().onStart(() => {
    console.log("Started")
  }).onUpdate((event) => {
    if (Math.round(event.scale) === 0) {
      setResizeMode(ResizeMode.CONTAIN)
    } else {
      setResizeMode(ResizeMode.COVER)
    }
    console.log(Math.round(event.scale))
  })
    .runOnJS(true);

  useBackPressed(() => {
    const run = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT)
      if (navigation.canGoBack()) {
        navigation.goBack()
      }
    }

    run()
    return true
  }, [])


  useFocusEffect(() => {

    const run = async () => {
      if (((await ScreenOrientation.getOrientationLockAsync()) !== ScreenOrientation.OrientationLock.LANDSCAPE)) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      }
    }

    run()

  })

  const VideoController = (props: ViewProps) => {
    return (
      <View style={[styles.controllerContainer, {backgroundColor:'#00000050'}]}>
       
      </View>
    )
  }

  return (
    <GestureDetector gesture={pinch}>
      <View style={[styles.container, { backgroundColor: background }]}>

      <VideoController />
        <Video
          ref={video}
          style={[styles.video, { backgroundColor: background }]}
          source={{
            uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
          }}
          resizeMode={resizeMode}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(status)}
        />



      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  video: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controllerContainer:{
    position:'absolute',
    left:0,
    right:0,
    bottom:0,
    top:0
  }
});
