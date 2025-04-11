import PromotionSlider from '@/components/home/PromotionSlider';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import ContentTypeSwitch, { ContentType } from '@/components/home/ContentTypeSwitch';
import GroupContentThumb from '@/components/common/GroupContentThumb';
import HorizontalList from '@/components/common/HorizontalList';
import { useEffect, useState } from 'react';
import { Styles } from '@/constants/Styles';
import ContentThumb from '@/components/common/ContentThumb';
import { Link, useNavigation } from 'expo-router';




const contents = {
 'movie': [
  {
    title:'Our Genres',
    data:[1,2,3,4]
  },
  {
    title:'Popular Top 10 in Genres',
    data:[1,2,3,4]
  }
],
'show':[
  {
    title:'Top 10 Genres',
    data:[1,2,3,4]
  },
  {
    title:'Popular in Genres',
    data:[1,2,3,4]
  }
]
}

export default function HomeScreen() {

  const [currentType, setCurrentType] = useState<ContentType>(ContentType.MOVIE)

  const data = [1,2,3,4]



  useEffect(() => {

  },[])

  return (
    <ThemedView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <PromotionSlider />
        <ContentTypeSwitch contentType={ContentType.MOVIE} onTypeChange={(content:ContentType) => {setCurrentType(content)}}/>
        <HorizontalList style={styles.horizontalListItem} RenderItem={GroupContentThumb} data={data} title={'Our Genres'}/>
        <HorizontalList style={styles.horizontalListItem} RenderItem={ContentThumb} data={data} title={'Trending Now'}/>

        <Link href={'/content/movie/1'}>Press here</Link>
      
        <View style={{flex:1}}/>
      
     
    </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 11
  },
  scrollContainer: {
    flexGrow:1
  },
  horizontalListItem:{
    marginBottom:Styles.PADDING * 2
  }
});
