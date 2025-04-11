import { Styles } from '@/constants/Styles';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions, ViewProps } from 'react-native';

const width = Dimensions.get('window').width - (Styles.PADDING * 2);
const padding = 5

export enum ContentType {
    MOVIE = 'movie',
    SHOW = 'show'
}

type Props = ViewProps & {
    contentType: ContentType;
    onTypeChange:(contentType:ContentType) => void;
};


export default function ContentTypeSwitch({ contentType, onTypeChange }: Props) {
    const backgroundColor = useThemeColor('solidBackground');
    const buttonText = useThemeColor('text')
    const borderColor = useThemeColor('border')

    const slideAnim = useRef(new Animated.Value(padding)).current;
    
    const toggleOption = (option: ContentType) => {
        onTypeChange(option)

        Animated.timing(slideAnim, {
            toValue: option === ContentType.MOVIE ? padding : (width * 0.5) - padding,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={[styles.toggleContainer, {backgroundColor, borderColor}]}>
                <Animated.View
                    style={[
                        {
                            width: (width / 2),
                            backgroundColor:borderColor
                           
                        },
                        styles.slider,
                        {
                            transform: [{ translateX: slideAnim }],
                        },
                        
                    ]}
                />

                {/* Movie Option */}
                <TouchableOpacity
                    style={[styles.option]}
                    onPress={() => toggleOption(ContentType.MOVIE)}
                >
                    <Text style={[styles.optionText, {color:buttonText}]}>Movie</Text>
                </TouchableOpacity>

                {/* Show Option */}
                <TouchableOpacity
                    style={[styles.option]}
                    onPress={() => toggleOption(ContentType.SHOW)}
                >
                    <Text style={[styles.optionText, {color:buttonText}]}>Show</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:11
    },
    toggleContainer: {
        flexDirection: 'row',
        height: 50, // Height of the toggle container
        overflow: 'hidden', // Ensure the slider doesn't overflow
        position: 'relative',
        borderWidth:0.8,
        borderRadius:10,
        padding:5,
      
        alignItems:"center"
    },
    slider: {
        position: 'absolute',
        borderRadius: 5,
        height:'100%'
    },
    option: {
        flex: 1, // Take equal space for both options
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Text color for inactive state
    },
    activeOption: {
        color: '#fff', // Text color for active state
    },
});

