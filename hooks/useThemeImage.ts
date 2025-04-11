import { useColorScheme } from 'react-native';

import { Images } from '@/constants/Images'

export function useThemeImage(
  imageName: keyof typeof Images.light & keyof typeof Images.dark,
  props?: { light?: any; dark?: any }
) {

  const theme = useColorScheme() ?? 'light';

  if(props){
    return props[theme];
  }

  return Images[theme][imageName];
  
}
