import PromotionSlider from '@/components/home/PromotionSlider';
import { ThemedView } from '@/components/common/ThemedView';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Styles } from '@/constants/Styles';
import { useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants'
import { ThemedContainer } from '@/components/common/ThemedContainer';
import { ThemedText } from '@/components/common/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedIcon } from '@/components/common/ThemedIcon';
import Chips from '@/components/common/Chips';


type TitleRowProps = {
    icon?: string,
    title: string
}

function TitleRow({ icon, title }: TitleRowProps) {
    const titleText = useThemeColor('textSecondary')
    return (
        <View style={styles.titleRowContainer}>
            {icon && <ThemedIcon passive style={{ marginEnd: Styles.PADDING / 2 }} name={icon} />}
            <ThemedText style={{ color: titleText, marginBottom: Styles.PADDING / 2 }} type='default'>{title}</ThemedText>
        </View>
    )
}

export default function MovieContentScreen() {
    const { id } = useLocalSearchParams();
    const textSecondary = useThemeColor('textSecondary')


    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                <PromotionSlider style={styles.promotionContainer} />

                <ThemedContainer style={styles.infoContainer}>
                    <TitleRow title='Description' />
                    <ThemedText type='defaultSemiBold'>M S Dhoni, a boy from Ranchi, aspires to play cricket for India. Though he initially tries to please his father by working for the Indian Railways, he ultimately decides to chase his dreams.</ThemedText>
                </ThemedContainer>
                <ThemedContainer style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <TitleRow icon='calendar-outline' title='Released Year' />
                        <ThemedText type='defaultSemiBold'>2016</ThemedText>
                    </View>

                    <View style={styles.infoItem}>
                        <TitleRow icon='grid-outline' title='Genres' />
                        <Chips items={['Drama', 'Comedy', 'Biography', 'Thriller', 'Romantic']}/>
                    </View>

                    <View style={styles.infoItem}>
                        <TitleRow title='Director' />
                        <ThemedContainer style={styles.talentContainer} invert>
                            <Image source={{uri:'https://cdn.britannica.com/25/222725-050-170F622A/Indian-cricketer-Mahendra-Singh-Dhoni-2011.jpg'}} style={styles.talentImage}/>
                            <View style={styles.talentInfoContainer}>
                                <ThemedText type='defaultSemiBold'>Mahendra Singh Dhoni</ThemedText>
                                <ThemedText style={[styles.textTalentSub, {color:textSecondary}]}>Chennai Media Studio</ThemedText>
                                
                            </View>
                        </ThemedContainer>
                    </View>
                </ThemedContainer>
                <ThemedContainer style={styles.infoContainer}>
                    <TitleRow title='Cast' />
                    
                </ThemedContainer>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Styles.PADDING
    },
    scrollContainer: {
        flexGrow: 1
    },
    promotionContainer: {
        marginTop: Constants.statusBarHeight,
        aspectRatio: 0.8,
        marginBottom: Styles.PADDING

    },
    infoContainer: {
        padding: Styles.PADDING,
        marginBottom: Styles.PADDING
    },
    titleRowContainer: {
        flexDirection: 'row'
    },
    infoItem: {
        marginBottom: Styles.PADDING
    },
    talentContainer:{
        padding:Styles.PADDING,
        flexDirection:'row'
    },
    talentImage:{
        width:60,
        aspectRatio:1,
        borderRadius:Styles.PADDING / 2
    },
    textTalentSub:{

    },
    talentInfoContainer:{
        justifyContent:"center",
        marginStart:Styles.PADDING
    }
});
