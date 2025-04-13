import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

const languages = [
  { id: 'en', name: 'English', region: 'United States' },
  { id: 'en-gb', name: 'English', region: 'United Kingdom' },
  { id: 'hi', name: 'Hindi', region: 'India' },
  { id: 'ta', name: 'Tamil', region: 'India' },
  { id: 'te', name: 'Telugu', region: 'India' },
  { id: 'bn', name: 'Bengali', region: 'India' },
  { id: 'mr', name: 'Marathi', region: 'India' },
  { id: 'gu', name: 'Gujarati', region: 'India' },
  { id: 'kn', name: 'Kannada', region: 'India' },
  { id: 'ml', name: 'Malayalam', region: 'India' },
  { id: 'pa', name: 'Punjabi', region: 'India' },
  { id: 'es', name: 'Spanish', region: 'Spain' },
  { id: 'fr', name: 'French', region: 'France' },
  { id: 'de', name: 'German', region: 'Germany' },
  { id: 'it', name: 'Italian', region: 'Italy' },
  { id: 'ja', name: 'Japanese', region: 'Japan' },
  { id: 'ko', name: 'Korean', region: 'South Korea' },
  { id: 'zh', name: 'Chinese', region: 'China' },
  { id: 'ru', name: 'Russian', region: 'Russia' },
  { id: 'ar', name: 'Arabic', region: 'Saudi Arabia' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showAlert, setShowAlert] = useState(false);
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  
  const handleLanguageSelect = (langId: string) => {
    setSelectedLanguage(langId);
    setShowAlert(true);
    
    // In a real app, you'd save this to settings/preferences
    // For now, we just show a success message
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hide the default header */}
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      
      {/* Custom header */}
      <SettingsHeader title="Display Language" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Select your preferred language for the app interface. Your content language preferences can be managed separately.
        </Text>
        
        <View style={[styles.languageList, { borderColor: border }]}>
          {languages.map((language, index) => (
            <React.Fragment key={language.id}>
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  selectedLanguage === language.id && { backgroundColor: `${primary}10` }
                ]}
                onPress={() => handleLanguageSelect(language.id)}
                activeOpacity={0.7}
              >
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: text }]}>
                    {language.name}
                  </Text>
                  <Text style={[styles.languageRegion, { color: textSecondary }]}>
                    {language.region}
                  </Text>
                </View>
                
                {selectedLanguage === language.id && (
                  <Ionicons name="checkmark-circle" size={24} color={primary} />
                )}
              </TouchableOpacity>
              
              {index < languages.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
      
      <FloatingAlert
        visible={showAlert}
        type="success"
        message="Language updated successfully"
        duration={3000}
        onClose={() => setShowAlert(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  languageList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageRegion: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
