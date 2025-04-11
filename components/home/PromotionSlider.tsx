import { useThemeColor } from '@/hooks/useThemeColor';
import { View, StyleSheet, Image, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../common/ThemedText';
import { ThemedButton } from '../common/ThemedButton';
import { ThemedIconButton } from '../common/ThemedIconButton';
import { Styles } from '@/constants/Styles';
import { router, useNavigation } from 'expo-router';

export type PromotionSliderProps = ViewProps & {

}

export default function PromotionSlider({
    style, ...rest
}:PromotionSliderProps) {
    const navigation = useNavigation()

    const colors = {
        background: useThemeColor('background'),
        text: useThemeColor('text', { light: 'white', dark: 'white' })
    }

    const playContent = () => {
        router.push('/content/1')
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageContainer}>

                <LinearGradient
                    style={styles.gradientContainer}
                    colors={['transparent', colors.background!]}
                    locations={[0.4, 0.99]}
                />

                <Image source={{ uri: "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/ms-dhoni-the-untold-story-et00025234-1725863462.jpg" }}
                    style={styles.image}
                />

                <View style={styles.infoContainer}>
                    <ThemedText
                        style={{textAlign:'center'}}
                        themeColor={{ light: 'white', dark: 'white' }}
                        type='title'>MS Dhoni: The Untold Story</ThemedText>

                    <ThemedButton
                        text='Play Now'
                        style={styles.buttonPlay}
                        iconLeft={{
                            name: 'play-outline',
                            color: colors.text,
                            size: 16,
                        }}
                        onPress={playContent}
                    />

                    <View style={styles.actionButtonRow}>
                        <ThemedIconButton name={'add'} onPress={() => {}}/>
                        <ThemedIconButton name={'thumbs-up'} onPress={() => {}}/>
                        <ThemedIconButton name={'volume-mute'} onPress={() => {}}/>
                    </View>
                        

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        aspectRatio:1,
        borderRadius: 20,
        overflow:"hidden"
        
    },
    imageContainer: {
        width: '100%',
        height: '100%',
    },
    gradientContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',

    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '50%',
        bottom: 0,
        zIndex: 2,
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: Styles.PADDING,
    },
    buttonPlay: {
        height: 45,
        width: 200
    },
    actionButtonRow:{
        flexDirection:'row',
        width:200,
        justifyContent:"space-evenly",
        alignItems:"center"
    }
});
