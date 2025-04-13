import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

interface DataUsageSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface QualitySetting {
  id: string;
  name: string;
  description: string;
  dataUsage: string;
  selected: boolean;
}

const dataSettings: DataUsageSetting[] = [
  {
    id: 'wifi_only',
    title: 'Wi-Fi Only',
    description: 'Only stream videos when connected to Wi-Fi',
    enabled: false,
  },
  {
    id: 'auto_adjust',
    title: 'Auto-Adjust Quality',
    description: 'Automatically adjust streaming quality based on connection speed',
    enabled: true,
  },
  {
    id: 'bg_data',
    title: 'Background Data',
    description: 'Allow the app to use data in the background',
    enabled: true,
  },
  {
    id: 'preload',
    title: 'Preload Content',
    description: 'Download content ahead of time for smoother playback',
    enabled: true,
  },
  {
    id: 'download_wifi',
    title: 'Downloads on Wi-Fi Only',
    description: 'Only download videos when connected to Wi-Fi',
    enabled: true,
  }
];

const mobileQualitySettings: QualitySetting[] = [
  {
    id: 'auto',
    name: 'Auto',
    description: 'Adjusts quality based on your connection',
    dataUsage: 'Varies',
    selected: true,
  },
  {
    id: 'data_saver',
    name: 'Data Saver',
    description: 'Reduced quality, less data',
    dataUsage: '~0.3GB/hour',
    selected: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balance of quality and data usage',
    dataUsage: '~0.7GB/hour',
    selected: false,
  },
  {
    id: 'high',
    name: 'High',
    description: 'Better quality, more data',
    dataUsage: '~1.5GB/hour',
    selected: false,
  }
];

export default function DataUsageScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<DataUsageSetting[]>(dataSettings);
  const [qualitySettings, setQualitySettings] = useState<QualitySetting[]>(mobileQualitySettings);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [dataUsage, setDataUsage] = useState({ current: 2.7, limit: 5.0 });
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  const solidBackground = useThemeColor('solidBackground');
  
  const handleToggle = (id: string, newValue: boolean) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled: newValue } : setting
    );
    
    setSettings(updatedSettings);
    
    // Show success message
    const setting = settings.find(s => s.id === id);
    if (setting) {
      setAlertMessage(`${setting.title} ${newValue ? 'enabled' : 'disabled'}`);
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };
  
  const handleQualitySelect = (id: string) => {
    const updatedSettings = qualitySettings.map(setting => ({
      ...setting,
      selected: setting.id === id
    }));
    
    setQualitySettings(updatedSettings);
    
    // Show success message
    const setting = qualitySettings.find(s => s.id === id);
    if (setting) {
      setAlertMessage(`Mobile quality set to ${setting.name}`);
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };
  
  const percentUsed = (dataUsage.current / dataUsage.limit) * 100;
  const progressColor = percentUsed > 90 ? '#EF4444' : percentUsed > 75 ? '#F59E0B' : primary;
  
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
      <SettingsHeader title="Data Usage" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Usage Summary */}
        <View style={[styles.usageSummary, { backgroundColor: solidBackground, borderColor: border }]}>
          <Text style={[styles.summaryTitle, { color: text }]}>Mobile Data Usage</Text>
          
          <View style={styles.usageStats}>
            <Text style={[styles.usageAmount, { color: text }]}>{dataUsage.current} GB</Text>
            <Text style={[styles.usageTotal, { color: textSecondary }]}>of {dataUsage.limit} GB used</Text>
          </View>
          
          <View style={[styles.progressBarBg, { backgroundColor: `${progressColor}30` }]}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: progressColor,
                  width: `${Math.min(percentUsed, 100)}%`
                }
              ]}
            />
          </View>
          
          <Text style={[styles.billingPeriod, { color: textSecondary }]}>
            Billing period: May 1 - May 31
          </Text>
        </View>
        
        {/* Data Settings */}
        <Text style={[styles.sectionTitle, { color: text }]}>Data Settings</Text>
        
        <View style={[styles.settingsContainer, { borderColor: border }]}>
          {settings.map((setting, index) => (
            <React.Fragment key={setting.id}>
              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: text }]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, { color: textSecondary }]}>
                    {setting.description}
                  </Text>
                </View>
                
                <Switch
                  value={setting.enabled}
                  onValueChange={(newValue) => handleToggle(setting.id, newValue)}
                  trackColor={{ false: '#767577', true: primary }}
                  thumbColor="#fff"
                />
              </View>
              
              {index < settings.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
        
        {/* Mobile Quality Settings */}
        <Text style={[styles.sectionTitle, { color: text, marginTop: 24 }]}>
          Mobile Data Streaming Quality
        </Text>
        
        <View style={[styles.qualityContainer, { borderColor: border }]}>
          {qualitySettings.map((quality, index) => (
            <React.Fragment key={quality.id}>
              <Pressable
                style={styles.qualityItem}
                onPress={() => handleQualitySelect(quality.id)}
                android_ripple={{ color: `${primary}30` }}
              >
                <View style={styles.qualityContent}>
                  <View style={styles.qualityHeader}>
                    <Text style={[styles.qualityName, { color: text }]}>
                      {quality.name}
                    </Text>
                    <Text style={[styles.qualityUsage, { color: quality.selected ? primary : textSecondary }]}>
                      {quality.dataUsage}
                    </Text>
                  </View>
                  
                  <Text style={[styles.qualityDescription, { color: textSecondary }]}>
                    {quality.description}
                  </Text>
                </View>
                
                <View style={[
                  styles.radioButton, 
                  { 
                    borderColor: quality.selected ? primary : border,
                    backgroundColor: quality.selected ? primary : 'transparent'
                  }
                ]}>
                  {quality.selected && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </Pressable>
              
              {index < qualitySettings.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: solidBackground, borderColor: border }]}>
          <Ionicons name="information-circle-outline" size={22} color={primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: text }]}>
            Higher quality streams use more data. For Wi-Fi streaming quality, visit the Quality settings.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.resetButton, { borderColor: border }]}
          onPress={() => {
            setAlertMessage('Data usage statistics reset');
            setShowAlert(true);
            setDataUsage({ current: 0, limit: 5.0 });
            setTimeout(() => setShowAlert(false), 2000);
          }}
        >
          <Ionicons name="refresh-outline" size={20} color={text} />
          <Text style={[styles.resetText, { color: text }]}>
            Reset Data Usage Statistics
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footerSpace} />
      </ScrollView>
      
      <FloatingAlert
        visible={showAlert}
        type="success"
        message={alertMessage}
        duration={2000}
        onClose={() => setShowAlert(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  usageSummary: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  usageStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  usageAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
  },
  usageTotal: {
    fontSize: 16,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  billingPeriod: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  qualityContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  qualityContent: {
    flex: 1,
    marginRight: 12,
  },
  qualityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  qualityName: {
    fontSize: 16,
    fontWeight: '500',
  },
  qualityUsage: {
    fontSize: 14,
    fontWeight: '500',
  },
  qualityDescription: {
    fontSize: 13,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footerSpace: {
    height: 20,
  },
});
