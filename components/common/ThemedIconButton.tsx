import { View, type ViewProps, TouchableOpacity, TouchableOpacityProps, Text, StyleSheet, StyleProp } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useThemeColor } from '@/hooks/useThemeColor';
import { IconProps } from '@expo/vector-icons/build/createIconSet';


export type ThemedIconButtonProps = IconProps<any> & {
    onPress: () => void;
    style?:StyleProp<View>

};

export function ThemedIconButton({ onPress, style, ...otherProps }: ThemedIconButtonProps) {
    const backgroundColor = useThemeColor('solidBackground');
    const buttonText = useThemeColor('text')
    const borderColor = useThemeColor('border')

    return (
        <TouchableOpacity activeOpacity={0.9} style={[{ backgroundColor, borderColor }, styles.iconButton, style]} {...otherProps}>
            <Ionicons size={21} color={buttonText} {...otherProps}/>
        </TouchableOpacity>
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
