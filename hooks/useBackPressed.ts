

import { useNavigation } from 'expo-router';
import { DependencyList, useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackPressed(onGoBackCallback: () => boolean | null | undefined, deps?: DependencyList) {
  const navigation = useNavigation();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onGoBackCallback);
    navigation.addListener('blur', onGoBackCallback);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onGoBackCallback);
      navigation.removeListener('blur', onGoBackCallback);
    };
  }, [navigation, onGoBackCallback, deps]);
}