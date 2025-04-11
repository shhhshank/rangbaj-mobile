import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedContainerProps = ViewProps & {
    invert?:boolean
};

export function ThemedContainer({ style, invert = false, ...otherProps }: ThemedContainerProps) {
  const backgroundColor = invert ? useThemeColor('background') : useThemeColor('border')
  const borderColor = useThemeColor('borderSecondary')

  return <View style={[{ backgroundColor, borderWidth:0.5, borderColor:borderColor, borderRadius:11 }, style]} {...otherProps} />;
}
