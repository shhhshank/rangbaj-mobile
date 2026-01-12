

import { useNavigation } from 'expo-router';
import { DependencyList, useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackPressed(onGoBackCallback: () => boolean | null | undefined, deps?: DependencyList) {
  const navigation = useNavigation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onGoBackCallback);
    const unsubscribe = navigation.addListener('blur', onGoBackCallback);

    return () => {
      backHandler.remove();
      unsubscribe();
    };
  }, [navigation, onGoBackCallback, deps]);
}