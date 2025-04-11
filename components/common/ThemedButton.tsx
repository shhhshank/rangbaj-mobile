import { View, type ViewProps, TouchableOpacity, TouchableOpacityProps, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { IconProps } from '@expo/vector-icons/build/createIconSet';


export type ThemedButtonProps = TouchableOpacityProps & {
    text:string,
    iconLeft?:IconProps<any>,
    iconRight?:IconProps<any>
};

export function ThemedButton({ style, text, iconLeft, iconRight, ...otherProps }: ThemedButtonProps) {
    const backgroundColor = useThemeColor('primary');
    const buttonText = useThemeColor('text', {light:'white', dark:'white'})

    return (
        <TouchableOpacity activeOpacity={0.9} style={[{ backgroundColor }, styles.button, style]} {...otherProps}>
            {iconLeft && <Ionicons {...iconLeft} />}
            <Text style={[styles.text, {color:buttonText}]}>{text}</Text>
            {iconRight && <Ionicons {...iconRight} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text:{
        fontSize:16,
        fontWeight:'bold',
        marginHorizontal:6
    },
    button:{
        borderRadius:10,
        justifyContent:'center',
        alignItems:"center",
        flexDirection:'row'
    }
})
