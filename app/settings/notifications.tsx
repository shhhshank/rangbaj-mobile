import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'content' | 'system' | 'marketing';
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'new_content',
    title: 'New Releases',
    description: 'Get notified when new content you might like is released',
    enabled: true,
    category: 'content'
  },
  {
    id: 'continue_watching',
    title: 'Continue Watching',
    description: "Reminders to continue watching shows you've started",
    enabled: true,
    category: 'content'
  },
  {
    id: 'recommendations',
    title: 'Recommendations',
    description: 'Personalized content recommendations based on your watch history',
    enabled: true,
    category: 'content'
  },
  {
    id: 'account',
    title: 'Account Updates',
    description: 'Important updates about your account and subscriptions',
    enabled: true,
    category: 'system'
  },
  {
    id: 'device_login',
    title: 'New Device Login',
    description: 'Get notified when your account is accessed from a new device',
    enabled: true,
    category: 'system'
  },
  {
    id: 'payment',
    title: 'Payment Reminders',
    description: 'Billing and payment notifications',
    enabled: true,
    category: 'system'
  },
  {
    id: 'offers',
    title: 'Special Offers',
    description: 'Exclusive deals and promotions',
    enabled: false,
    category: 'marketing'
  },
  {
    id: 'surveys',
    title: 'Surveys & Feedback',
    description: 'Participate in surveys to help improve Rangbaj',
    enabled: false,
    category: 'marketing'
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  const solidBackground = useThemeColor('solidBackground');
  
  const contentNotifications = settings.filter(setting => setting.category === 'content');
  const systemNotifications = settings.filter(setting => setting.category === 'system');
  const marketingNotifications = settings.filter(setting => setting.category === 'marketing');
  
  const handleToggle = (id: string, newValue: boolean) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled: newValue } : setting
    );
    
    setSettings(updatedSettings);
    
    // Show success message
    const setting = settings.find(s => s.id === id);
    if (setting) {
      setAlertMessage(`${setting.title} notifications ${newValue ? 'enabled' : 'disabled'}`);
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };
  
  const toggleAll = (category: 'content' | 'system' | 'marketing', enabled: boolean) => {
    const updatedSettings = settings.map(setting => 
      setting.category === category ? { ...setting, enabled } : setting
    );
    
    setSettings(updatedSettings);
    
    // Show success message
    setAlertMessage(`${category.charAt(0).toUpperCase() + category.slice(1)} notifications ${enabled ? 'enabled' : 'disabled'}`);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };
  
  const renderCategorySettings = (title: string, items: NotificationSetting[], category: 'content' | 'system' | 'marketing') => {
    const allEnabled = items.every(item => item.enabled);
    const allDisabled = items.every(item => !item.enabled);
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryTitle, { color: text }]}>{title}</Text>
          
          <TouchableOpacity 
            onPress={() => toggleAll(category, !allEnabled)}
            style={styles.toggleAllButton}
          >
            <Text style={[styles.toggleAllText, { color: primary }]}>
              {allEnabled ? 'Disable All' : allDisabled ? 'Enable All' : 'Toggle All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.settingsContainer, { borderColor: border }]}>
          {items.map((setting, index) => (
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
              
              {index < items.length - 1 && (
                <View style={[styles.divider, { backgroundColor: border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
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
      <SettingsHeader title="Notification Settings" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Manage notifications you receive from Rangbaj. You can customize settings for different 
          categories of notifications.
        </Text>
        
        {renderCategorySettings('Content Notifications', contentNotifications, 'content')}
        {renderCategorySettings('System Notifications', systemNotifications, 'system')}
        {renderCategorySettings('Marketing Notifications', marketingNotifications, 'marketing')}
        
        <View style={[styles.infoBox, { backgroundColor: solidBackground, borderColor: border }]}>
          <Ionicons name="information-circle-outline" size={22} color={primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: text }]}>
            System notifications for critical updates may still be sent even if disabled here.
            You can also manage notification permissions through your device settings.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.moreOptionsButton, { borderColor: border }]}
          onPress={() => {
            setAlertMessage('Opening system notification settings');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }}
        >
          <Text style={[styles.moreOptionsText, { color: text }]}>
            Open System Notification Settings
          </Text>
          <Ionicons name="open-outline" size={20} color={textSecondary} />
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
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  toggleAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleAllText: {
    fontSize: 14,
    fontWeight: '500',
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
  moreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  moreOptionsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerSpace: {
    height: 20,
  },
});
