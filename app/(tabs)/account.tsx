import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Dimensions } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Mock user data
const userData = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  plan: 'Basic',
  watchlist: 14,
  downloads: 3,
};

// Mock settings data
const settingsSections = [
  {
    title: 'Content Preferences',
    icon: 'film-outline',
    items: [
      { id: 'language', title: 'Display Language', value: 'English', type: 'option' },
      { id: 'subtitles', title: 'Subtitles', value: true, type: 'toggle' },
      { id: 'autoplay', title: 'Autoplay Previews', value: true, type: 'toggle' },
    ]
  },
  {
    title: 'Playback',
    icon: 'play-circle-outline',
    items: [
      { id: 'quality', title: 'Streaming Quality', value: 'Auto', type: 'option' },
      { id: 'data', title: 'Data Saver', value: false, type: 'toggle' },
      { id: 'download-quality', title: 'Download Quality', value: 'High', type: 'option' },
    ]
  },
  {
    title: 'Account',
    icon: 'person-circle-outline',
    items: [
      { id: 'security', title: 'Security', value: null, type: 'link' },
      { id: 'payment', title: 'Payment Details', value: null, type: 'link' },
      { id: 'history', title: 'Billing History', value: null, type: 'link' },
    ]
  },
  {
    title: 'About',
    icon: 'information-circle-outline',
    items: [
      { id: 'help', title: 'Help & Support', value: null, type: 'link' },
      { id: 'terms', title: 'Terms & Conditions', value: null, type: 'link' },
      { id: 'privacy', title: 'Privacy Policy', value: null, type: 'link' },
    ]
  },
];

export default function Account() {
  const router = useRouter();
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  const solidBackground = useThemeColor('solidBackground');
  const insets = useSafeAreaInsets();
  
  const [settings, setSettings] = useState(
    settingsSections.flatMap(section => 
      section.items.map(item => ({ id: item.id, value: item.value !== null ? item.value : false }))
    )
  );
  
  const handleSettingChange = (id: string, value: any) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };
  
  const getSetting = (id: string) => {
    return settings.find(setting => setting.id === id)?.value;
  };
  
  const renderSettingItem = (item: any) => {
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
          <View style={styles.settingValue}>
            <Text style={[styles.settingValueText, { color: textSecondary }]}>{value}</Text>
            <Ionicons name="chevron-forward" size={20} color={textSecondary} />
          </View>
        );
      case 'link':
        return (
          <Ionicons name="chevron-forward" size={20} color={textSecondary} />
        );
      default:
        return null;
    }
  };
  
  const renderSettingsSection = (section: any, index: number) => {
    return (
      <View key={section.title} style={styles.settingsSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name={section.icon} size={22} color={primary} />
          <Text style={[styles.sectionTitle, { color: text }]}>{section.title}</Text>
        </View>
        
        <View style={[styles.sectionContent, { backgroundColor: solidBackground }]}>
          {section.items.map((item: any, i: number) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                styles.settingItem, 
                i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: border }
              ]}
              onPress={() => item.type === 'link' && console.log(`Navigate to ${item.id}`)}
            >
              <Text style={[styles.settingLabel, { color: text }]}>{item.title}</Text>
              {renderSettingItem(item)}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ExpoStatusBar style="light" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 16 } // Use safe area insets for status bar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: text }]}>{userData.name}</Text>
              <Text style={[styles.userEmail, { color: textSecondary }]}>{userData.email}</Text>
              <View style={styles.planBadge}>
                <Text style={styles.planText}>{userData.plan} Plan</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Feather name="edit-2" size={16} color={text} />
          </TouchableOpacity>
        </View>
        
        {/* User Stats */}
        <View style={[styles.statsContainer, { backgroundColor: solidBackground }]}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark" size={22} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>{userData.watchlist}</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Watchlist</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="download" size={22} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>{userData.downloads}</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Downloads</Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: border }]} />
          
          <View style={styles.statItem}>
            <Ionicons name="heart" size={22} color={primary} />
            <Text style={[styles.statValue, { color: text }]}>19</Text>
            <Text style={[styles.statLabel, { color: textSecondary }]}>Liked</Text>
          </View>
        </View>
        
        {/* Subscription Banner */}
        <View style={styles.subscriptionContainer}>
          <LinearGradient
            colors={['rgba(255,71,87,0.7)', 'rgba(128,0,128,0.9)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subscriptionBanner}
          >
            <View style={styles.subscriptionContent}>
              <View>
                <Text style={styles.subscriptionTitle}>Upgrade to Premium</Text>
                <Text style={styles.subscriptionDescription}>
                  Enjoy ad-free streaming, unlimited downloads, and exclusive content
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.subscribeButton}
                onPress={() => router.push('/subscriptions')}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="diamond" size={18} color="#fff" />
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        {/* Settings Sections */}
        {settingsSections.map(renderSettingsSection)}
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: border }]}
          onPress={() => console.log('Logout')}
        >
          <Ionicons name="log-out-outline" size={22} color="tomato" />
          <Text style={[styles.logoutText, { color: 'tomato' }]}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: textSecondary }]}>Version 1.0.0 (51)</Text>
        
        {/* Company Info */}
        <View style={styles.companyContainer}>
          <Text style={[styles.companyText, { color: textSecondary }]}>
            Built by MNSA Technologies
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

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
    backgroundColor: '#9b59b6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  planText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  editProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subscriptionDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    maxWidth: width * 0.55,
  },
  subscribeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 14,
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
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
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
    color: 'white',
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