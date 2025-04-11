import { View, type ViewProps, TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { IconProps } from '@expo/vector-icons/build/createIconSet';


export type ThemedIconProps = IconProps<any> & {
    onPress?: () => void;
    style?:ViewStyle,
    passive?:boolean

};

export function ThemedIcon({ onPress, style, passive = false, ...otherProps }: ThemedIconProps) {
    const backgroundColor = useThemeColor('solidBackground');
    const buttonText = useThemeColor('text')
    const borderColor = useThemeColor('border')
    const textSecondary = useThemeColor('textSecondary')

    return (
       <Ionicons style={[style]} onPress={onPress} size={21} color={passive ? textSecondary : buttonText} {...otherProps}/>
    );
}

const styles = StyleSheet.create({
    text:{
        fontSize:16,
        fontWeight:'bold',
        marginHorizontal:6
    },
    iconButton:{
        borderRadius:5,
        justifyContent:'center',
        alignItems:"center",
        flexDirection:'row',
        height:40,
        width:40,
        borderWidth:1
    }
})
