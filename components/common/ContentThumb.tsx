import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ViewProps, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedIconButton } from '../common/ThemedIconButton';
import { ThemedIcon } from './ThemedIcon';

type Props = ViewProps & {};

const width = Dimensions.get('window').width


export default function ContentThumb() {

    const backgroundColor = useThemeColor('border')
    const borderColor = useThemeColor('borderSecondary')

    return (
        <View style={[styles.container, {
            width: width / 2.5,
            backgroundColor: backgroundColor,
            borderWidth:0.5,
            borderColor:borderColor
        }]}>
            <View style={styles.imageContainer}>
            <Image source={{ uri: 'https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/sidone-in-japan-et00392296-1726582310.jpg' }} style={styles.image} />
            </View>

            <View style={styles.infoContainer}>
                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['transparent', backgroundColor!]}
                    locations={[0.4, 0.9]}
                >
                <View style={styles.row}>
                    <ThemedText style={{maxWidth:"90%"}} type='defaultSemiBold'>Sidonie In Japan</ThemedText>
                    <ThemedIcon name={'arrow-forward'}/> 
                </View>
                </LinearGradient>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 0.75,
        borderRadius: 10,
        backgroundColor:"red",
        overflow:"hidden"
    },
    gradientContainer: {
        width:"100%",
        height:"100%",
        justifyContent:"flex-end",
        padding:11
    },
    imageContainer: {
        padding: 5
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center"
    },
    image: {
        width: '100%',
        aspectRatio: 0.75,
        borderRadius: 5,
    },
    infoContainer: {
        position: 'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0,
        zIndex: 1,
    },
    row:{
        justifyContent:'space-between',
        alignItems:'flex-end',
        flexDirection:"row"
    }
})