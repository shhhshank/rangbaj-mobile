import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'link';
  value?: boolean;
  icon: string;
  iconProvider: typeof Ionicons | typeof MaterialIcons;
}

const securitySettings: SecuritySetting[] = [
  {
    id: 'two-factor',
    title: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    type: 'toggle',
    value: false,
    icon: 'lock-closed',
    iconProvider: Ionicons
  },
  {
    id: 'biometric',
    title: 'Biometric Login',
    description: 'Use Face ID or Touch ID to log in',
    type: 'toggle',
    value: true,
    icon: 'finger-print',
    iconProvider: Ionicons
  },
  {
    id: 'change-password',
    title: 'Change Password',
    description: 'Update your account password',
    type: 'link',
    icon: 'key',
    iconProvider: Ionicons
  },
  {
    id: 'remember-devices',
    title: 'Remembered Devices',
    description: 'Manage devices that have access to your account',
    type: 'link',
    icon: 'devices',
    iconProvider: MaterialIcons
  },
  {
    id: 'pin-lock',
    title: 'PIN Lock',
    description: 'Require a PIN to access the app',
    type: 'toggle',
    value: false,
    icon: 'pin',
    iconProvider: MaterialIcons
  },
  {
    id: 'login-history',
    title: 'Login History',
    description: 'View recent account activity',
    type: 'link',
    icon: 'time',
    iconProvider: Ionicons
  }
];

export default function SecurityScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<SecuritySetting[]>(securitySettings);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const solidBackground = useThemeColor('solidBackground');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  
  const handleToggle = (id: string, newValue: boolean) => {
    const newSettings = settings.map(setting => 
      setting.id === id ? { ...setting, value: newValue } : setting
    );
    
    setSettings(newSettings);
    
    const setting = settings.find(s => s.id === id);
    if (setting) {
      const action = newValue ? 'enabled' : 'disabled';
      setAlertMessage(`${setting.title} ${action}`);
      setAlertType('success');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const handlePress = (id: string) => {
    // In a real app, navigate to appropriate screens
    // For now, just show an alert
    const setting = settings.find(s => s.id === id);
    
    if (setting) {
      setAlertMessage(`Navigating to ${setting.title}`);
      setAlertType('info');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
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
      <SettingsHeader title="Security Settings" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.securityContainer, { borderColor: border }]}>
          {settings.map((setting, index) => {
            const Icon = setting.iconProvider;
            
            return (
              <React.Fragment key={setting.id}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={() => setting.type === 'link' && handlePress(setting.id)}
                  activeOpacity={setting.type === 'link' ? 0.7 : 1}
                >
                  <View style={[styles.iconBg, { backgroundColor: `${primary}20` }]}>
                    <Icon name={setting.icon as any} size={20} color={primary} />
                  </View>
                  
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: text }]}>
                      {setting.title}
                    </Text>
                    <Text style={[styles.settingDescription, { color: textSecondary }]}>
                      {setting.description}
                    </Text>
                  </View>
                  
                  {setting.type === 'toggle' ? (
                    <Switch
                      value={Boolean(setting.value)}
                      onValueChange={(newValue) => handleToggle(setting.id, newValue)}
                      trackColor={{ false: '#767577', true: primary }}
                      thumbColor="#fff"
                    />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={textSecondary} />
                  )}
                </TouchableOpacity>
                
                {index < settings.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: border }]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: solidBackground, borderColor: border }]}>
          <Ionicons name="shield-checkmark-outline" size={22} color={primary} style={styles.infoIcon} />
          <Text style={[styles.infoText, { color: text }]}>
            We recommend enabling two-factor authentication for an additional layer of security to protect your account.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.signoutButton, { borderColor: 'rgba(239, 68, 68, 0.6)' }]}
          onPress={() => {
            setAlertMessage('You have been signed out');
            setAlertType('info');
            setShowAlert(true);
            
            setTimeout(() => {
              setShowAlert(false);
            }, 2000);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.signoutText}>Sign Out of All Devices</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <FloatingAlert
        visible={showAlert}
        type={alertType}
        message={alertMessage}
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
  securityContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginLeft: 64,
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
  signoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 30,
  },
  signoutText: {
    color: '#EF4444',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
});
