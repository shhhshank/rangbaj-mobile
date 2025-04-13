import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

const qualityOptions = [
  {
    id: 'auto',
    name: 'Auto',
    description: 'Adjusts quality based on your connection speed',
    dataUsage: 'Varies',
    image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=600&auto=format&fit=crop'
  },
  {
    id: 'low',
    name: 'Data Saver',
    description: 'Lower resolution to reduce data usage',
    dataUsage: 'Up to 0.3GB per hour',
    image: 'https://images.unsplash.com/photo-1519120126473-8be7aedcd6c6?w=600&auto=format&fit=crop'
  },
  {
    id: 'medium',
    name: 'Standard',
    description: 'Good balance between quality and data usage',
    dataUsage: 'Up to 0.7GB per hour',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&auto=format&fit=crop'
  },
  {
    id: 'high',
    name: 'High',
    description: 'Enhanced quality for a better viewing experience',
    dataUsage: 'Up to 1.5GB per hour',
    image: 'https://images.unsplash.com/photo-1563874257547-d19fbb71b46c?w=600&auto=format&fit=crop'
  },
  {
    id: 'ultra',
    name: 'Ultra HD',
    description: 'Maximum quality for the best viewing experience',
    dataUsage: 'Up to 7GB per hour',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop'
  }
];

export default function QualityScreen() {
  const router = useRouter();
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [showAlert, setShowAlert] = useState(false);
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const solidBackground = useThemeColor('solidBackground');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  
  const handleQualitySelect = (qualityId: string) => {
    setSelectedQuality(qualityId);
    setShowAlert(true);
    
    // In a real app, you'd save this to settings/preferences
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
      <SettingsHeader title="Streaming Quality" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Select your preferred streaming quality. Higher quality uses more data.
        </Text>
        
        <View style={styles.qualityContainer}>
          {qualityOptions.map((quality) => (
            <TouchableOpacity
              key={quality.id}
              style={[
                styles.qualityCard, 
                { borderColor: selectedQuality === quality.id ? primary : border }
              ]}
              onPress={() => handleQualitySelect(quality.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: quality.image }}
                style={styles.qualityImage}
                resizeMode="cover"
              />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.qualityGradient}
              />
              
              <View style={styles.qualityContent}>
                <View style={styles.labelContainer}>
                  <Text style={styles.qualityName}>{quality.name}</Text>
                  {selectedQuality === quality.id && (
                    <View style={[styles.selectedMark, { backgroundColor: primary }]}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </View>
                
                <Text style={styles.qualityDataUsage}>{quality.dataUsage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: solidBackground, borderColor: border }]}>
          <Ionicons name="information-circle-outline" size={22} color={primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: text }]}>
            Your video quality preferences will be used when streaming on Wi-Fi. For mobile data, you can set separate preferences in the Data Usage settings.
          </Text>
        </View>
        
        <View style={styles.footerSpace} />
      </ScrollView>
      
      <FloatingAlert
        visible={showAlert}
        type="success"
        message="Streaming quality updated successfully"
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
  qualityContainer: {
    marginBottom: 24,
  },
  qualityCard: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    position: 'relative',
  },
  qualityImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  qualityGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  qualityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qualityName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  selectedMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityDataUsage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footerSpace: {
    height: 40,
  },
});
