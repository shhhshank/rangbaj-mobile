import { View, StyleSheet, Image } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useThemeImage } from '@/hooks/useThemeImage';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import { Styles } from '@/constants/Styles';

export default function Header() {
    const logo = useThemeImage('rangbajColored')

    const colors = {
        background:useThemeColor("background"),
        textSecondary:useThemeColor("textSecondary")
    }

    const containerStyle = {
        backgroundColor:colors.background,
        borderBottomColor:colors.textSecondary
    }

    

    return (
        <View style={[styles.container, containerStyle]}>
            <Image source={logo} style={styles.logo} />
        </View>
    );
}

const styles = StyleSheet.create({
  container:{
    width:"100%",
    padding:Styles.PADDING,
    //borderBottomWidth:0.2,
    paddingTop:Constants.statusBarHeight + Styles.PADDING,
    height: 60  + Constants.statusBarHeight,
    
  },
  logo:{
    height:50,
    width:140,
    resizeMode:'contain'
  }
});
