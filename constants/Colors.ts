/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary:'#999999',
    background: '#fff',
    primary:'#6C4BEF',
    solidBackground:'#f0f0f0',
    border:'#cccccc',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    borderSecondary:'#cccccc',
    inputBackground: '#f0f0f0',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary:'#999999',
    background: '#1E1E1E',
    primary:'#6C4BEF',
    solidBackground:'#0f0f0f',
    border:'#262626',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    borderSecondary:'#444444',
    inputBackground: '#2a2a2a',
  },
};
