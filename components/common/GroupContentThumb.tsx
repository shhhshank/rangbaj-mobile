import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ViewProps, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedIconButton } from '../common/ThemedIconButton';
import { ThemedIcon } from './ThemedIcon';

type Props = ViewProps & {};

const width = Dimensions.get('window').width


export default function GroupContentThumb() {

    const backgroundColor = useThemeColor('border')
    const borderColor = useThemeColor('borderSecondary')

    return (
        <View style={[styles.container, {
            width: width / 2.5,
            backgroundColor: backgroundColor,
            borderWidth:0.5,
            borderColor:borderColor
        }]}>
            <View style={styles.gridContainer}>
                <View style={styles.gridRow}>
                    <Image source={{ uri: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xxlarge/stree-2-et00364249-1721725490.jpg' }} style={styles.image} />
                    <Image source={{ uri: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xxlarge/shahkot-et00373612-1720432347.jpg' }} style={styles.image} />
                </View>
                <View style={styles.gridRow}>
                    <Image source={{ uri: 'https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/sidone-in-japan-et00392296-1726582310.jpg' }} style={styles.image} />
                    <Image source={{ uri: 'https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/bang-bang-et00020366-1727935134.jpg' }} style={styles.image} />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['transparent', backgroundColor!]}
                    locations={[0.4, 0.9]}
                >
                <View style={styles.row}>
                    <ThemedText type='defaultSemiBold'>Action</ThemedText>
                    <ThemedIcon name={'arrow-forward'}/> 
                </View>
                </LinearGradient>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
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
    gridContainer: {
        padding: 5
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center"
    },
    image: {
        width: '45%',
        aspectRatio: 1,
        borderRadius: 5,
        margin: 2
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
        alignItems:'center',
        flexDirection:"row"
    }
})