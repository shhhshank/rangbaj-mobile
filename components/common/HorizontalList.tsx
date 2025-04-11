import { View, StyleSheet, ViewProps, FlatList, ListRenderItem } from 'react-native';

import { Styles } from '@/constants/Styles';
import { ThemedText } from './ThemedText';



export type HorizontalListProps = ViewProps & {
    title: string,
    RenderItem: ListRenderItem<any>,
    data: ArrayLike<any>

}

export default function HorizontalList({ title, style, data, RenderItem }: HorizontalListProps) {

    return (
        <View style={[styles.container, style]}>
            <ThemedText style={styles.title} type='subtitle'>{title}</ThemedText>
            <FlatList 
                showsHorizontalScrollIndicator={false} 
                horizontal data={data}
                ItemSeparatorComponent={() => (<View style={{width:Styles.PADDING}}/>)}
                renderItem={({ item, index }) => (
                    <RenderItem key={index.toString()} {...item} />
                )} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    title: {
        marginBottom: Styles.PADDING
    }
});
