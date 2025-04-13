import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Dimensions, StatusBar } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingAlert from '@/components/common/FloatingAlert';

// Mock user data
const userData = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  plan: 'Premium',
  watchlist: 14,
  downloads: 3,
};

// Define types for settings items
type RoutePathType = string;

interface SettingItem {
  id: string;
  title: string;
  value: string | boolean | null;
  type: 'toggle' | 'option' | 'link';
  route?: RoutePathType;
}

interface SettingsSection {
  title: string;
  icon: string;
  items: SettingItem[];
}

// Mock settings data
const settingsSections: SettingsSection[] = [
  {
    title: 'Content Preferences',
    icon: 'film-outline',
    items: [
      { id: 'language', title: 'Display Language', value: 'English', type: 'option', route: '/settings/language' },
      { id: 'subtitles', title: 'Subtitles', value: true, type: 'toggle' },
      { id: 'autoplay', title: 'Autoplay Previews', value: true, type: 'toggle' },
      { id: 'notifications', title: 'Notifications', value: null, type: 'link', route: '/settings/notifications' },
    ]
  },
  {
    title: 'Playback',
    icon: 'play-circle-outline',
    items: [
      { id: 'quality', title: 'Streaming Quality', value: 'Auto', type: 'option', route: '/settings/quality' },
      { id: 'data-usage', title: 'Data Usage', value: null, type: 'link', route: '/settings/data-usage' },
      { id: 'download-quality', title: 'Download Quality', value: 'High', type: 'option', route: '/settings/quality' },
    ]
  },
  {
    title: 'Account',
    icon: 'person-circle-outline',
    items: [
      { id: 'security', title: 'Security', value: null, type: 'link', route: '/settings/security' },
      { id: 'payment', title: 'Payment & Subscription', value: null, type: 'link', route: '/settings/payment' },
      { id: 'profile', title: 'Edit Profile', value: null, type: 'link' },
    ]
  },
  {
    title: 'About',
    icon: 'information-circle-outline',
    items: [
      { id: 'help', title: 'Help & Support', value: null, type: 'link', route: '/settings/help' },
      { id: 'terms', title: 'Terms & Conditions', value: null, type: 'link' },
      { id: 'privacy', title: 'Privacy Policy', value: null, type: 'link' },
    ]
  },
];

interface SettingState {
  id: string;
  value: string | boolean;
}

export default function Account() {
  const router = useRouter();
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  const solidBackground = useThemeColor('solidBackground');
  const insets = useSafeAreaInsets();
  
  const [settings, setSettings] = useState<SettingState[]>(
    settingsSections.flatMap(section => 
      section.items.map(item => ({ id: item.id, value: item.value !== null ? item.value : false }))
    )
  );

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  
  const handleSettingChange = (id: string, value: any) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );

    // Show a notification for toggle changes
    const settingItem = settingsSections.flatMap(s => s.items).find(item => item.id === id);
    if (settingItem && settingItem.type === 'toggle') {
      setAlertMessage(`${settingItem.title} ${value ? 'enabled' : 'disabled'}`);
      setAlertType('success');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };
  
  const getSetting = (id: string) => {
    return settings.find(setting => setting.id === id)?.value;
  };

  const handleSettingItemPress = (item: SettingItem) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.id === 'terms') {
      setAlertMessage('Opening Terms & Conditions');
      setAlertType('info');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else if (item.id === 'privacy') {
      setAlertMessage('Opening Privacy Policy');
      setAlertType('info');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } else if (item.id === 'profile') {
      setAlertMessage('Opening profile editor');
      setAlertType('info');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };
  
  const renderSettingItem = (item: SettingItem) => {
    const value = getSetting(item.id);
    
    switch (item.type) {
      case 'toggle':
        return (
          <Switch
            value={Boolean(value)}
            onValueChange={(newValue) => handleSettingChange(item.id, newValue)}
            trackColor={{ false: '#767577', true: primary }}
            thumbColor="#fff"
          />
        );
      case 'option':
        return (
          <TouchableOpacity 
            style={styles.settingValue}
            onPress={() => handleSettingItemPress(item)}
          >
            <Text style={[styles.settingValueText, { color: textSecondary }]}>{value}</Text>
            <Ionicons name="chevron-forward" size={20} color={textSecondary} />
          </TouchableOpacity>
        );
      case 'link':
        return (
          <TouchableOpacity
            onPress={() => handleSettingItemPress(item)}
          >
            <Ionicons name="chevron-forward" size={20} color={textSecondary} />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };
  
  const renderSettingsSection = (section: SettingsSection, index: number) => {
    return (
      <View key={section.title} style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name={section.icon as any} size={24} color={primary} />
          <Text style={[styles.sectionTitle, { color: text }]}>{section.title}</Text>
        </View>
        
        <View style={[styles.sectionContent, { backgroundColor: solidBackground, borderColor: border }]}>
          {section.items.map((item, i) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity 
                style={styles.settingItem}
                onPress={() => item.type !== 'toggle' && handleSettingItemPress(item)}
                activeOpacity={item.type === 'toggle' ? 1 : 0.7}
              >
                <Text style={[styles.settingLabel, { color: text }]}>{item.title}</Text>
                {renderSettingItem(item)}
              </TouchableOpacity>
              
              {i < section.items.length - 1 && (
                <View style={[{ height: 1, backgroundColor: border }]} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      <View style={[styles.headerContainer, { paddingTop: insets.top, backgroundColor: background }]}>
        <Text style={[styles.screenTitle, { color: text }]}>Account</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: userData.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: text }]}>{userData.name}</Text>
              <Text style={[styles.userEmail, { color: textSecondary }]}>{userData.email}</Text>
              <View style={[styles.planBadge, { backgroundColor: primary }]}>
                <Text style={[styles.planText, { color: '#fff' }]}>{userData.plan}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: `${primary}15` }]}
            onPress={() => {
              setAlertMessage('Opening profile editor');
              setAlertType('info');
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 2000);
            }}
          >
            <Feather name="edit-2" size={16} color={primary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.statsContainer, { backgroundColor: solidBackground, borderColor: border }]}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark-outline" size={24} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>{userData.watchlist}</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Watchlist</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>48h</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Watched</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="download-outline" size={24} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>{userData.downloads}</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Downloads</Text>
          </View>
        </View>
        
        {userData.plan !== 'Premium' && (
          <View style={styles.subscriptionContainer}>
            <LinearGradient
              colors={['#8E2DE2', '#4A00E0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.subscriptionBanner}
            >
              <View style={styles.subscriptionContent}>
                <View>
                  <Text style={styles.subscriptionTitle}>Upgrade to Premium</Text>
                  <Text style={styles.subscriptionDescription}>
                    Enjoy ad-free streaming, Ultra HD quality, and offline downloads
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.subscribeButton}
                  onPress={() => {
                    setAlertMessage('Opening Premium upgrade options');
                    setAlertType('info');
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 2000);
                  }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="star" size={16} color="#fff" />
                    <Text style={styles.subscribeButtonText}>Upgrade</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        
        {settingsSections.map(renderSettingsSection)}
        
        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: '#EF4444' }]}
          onPress={() => {
            setAlertMessage('You have been signed out');
            setAlertType('info');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={[styles.logoutText, { color: '#EF4444' }]}>Sign Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: textSecondary }]}>
          Version 1.0.0
        </Text>
        
        <View style={styles.companyContainer}>
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logoText}>R</Text>
          </LinearGradient>
          <Text style={[styles.companyText, { color: textSecondary }]}>
            Built by MNSA Technologies
          </Text>
        </View>
      </ScrollView>

      <FloatingAlert
        visible={showAlert}
        type={alertType}
        message={alertMessage}
        duration={2000}
        onClose={() => setShowAlert(false)}
      />
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  planText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 24,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '60%',
  },
  subscriptionContainer: {
    marginBottom: 24,
  },
  subscriptionBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  subscriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subscriptionDescription: {
    fontSize: 13,
    maxWidth: width * 0.55,
  },
  subscribeButton: {
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 14,
    marginRight: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 12,
  },
  companyContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  companyText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});