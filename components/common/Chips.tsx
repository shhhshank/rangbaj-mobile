import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedContainer } from './ThemedContainer';

type ChipProps = {
    label:string
}
const Chip = ({ label }:ChipProps) => {
  return (
    <ThemedContainer invert style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </ThemedContainer>
  );
};

type ChipsProps = {
    items:string[]
}

const Chips = ({ items }:ChipsProps) => {
  return (
    <ScrollView>
      <View style={styles.chipWrapper}>
        {items.map((item, index) => (
          <Chip key={index} label={item} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    chipWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap', 
    },
    chip: {
     
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginRight: 10,
      marginBottom: 10,
    },
    chipText: {
      color: '#fff',
      fontSize: 14,
    },
  });

export default Chips;