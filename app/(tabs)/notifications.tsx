import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Animated,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useScrollY } from '@/hooks/useScrollY';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

// Types for notifications
interface Notification {
  id: string;
  title: string;
  message: string;
  image: string;
  time: string;
  type: 'new_content' | 'update' | 'recommendation' | 'system';
  contentId?: string;
  contentType?: 'movie' | 'show';
  read: boolean;
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Release',
    message: 'Cosmic Dawn is now available to stream',
    image: 'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=400&auto=format&fit=crop',
    time: '2 hours ago',
    type: 'new_content',
    contentId: '204',
    contentType: 'show',
    read: false
  },
  {
    id: '2',
    title: 'Continue Watching',
    message: 'You\'re halfway through Quantum Resonance',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop',
    time: '1 day ago',
    type: 'recommendation',
    contentId: '101',
    contentType: 'movie',
    read: true
  },
  {
    id: '3',
    title: 'New Season Added',
    message: 'Season 3 of Dark Matter is now available',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop',
    time: '3 days ago',
    type: 'update',
    contentId: '103',
    contentType: 'show',
    read: false
  },
  {
    id: '4',
    title: 'Weekly Recommendation',
    message: 'Based on your interests, you might enjoy Solar Wind',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&auto=format&fit=crop',
    time: '4 days ago',
    type: 'recommendation',
    contentId: '202',
    contentType: 'show',
    read: true
  },
  {
    id: '5',
    title: 'Subscription Renewing',
    message: 'Your premium subscription will renew in 3 days',
    image: '',
    time: '5 days ago',
    type: 'system',
    read: true
  },
  {
    id: '6',
    title: 'New Original Film',
    message: 'Rangbaj Original film "Time Fracture" premieres today',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop',
    time: '1 week ago',
    type: 'new_content',
    contentId: '201',
    contentType: 'movie',
    read: true
  },
  {
    id: '7',
    title: 'Coming Soon',
    message: 'New episodes of your favorite shows dropping next week',
    image: '',
    time: '1 week ago',
    type: 'update',
    read: true
  },
  {
    id: '8',
    title: 'Account Update',
    message: 'Your profile settings have been updated successfully',
    image: '',
    time: '2 weeks ago',
    type: 'system',
    read: true
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const scrollY = useScrollY();
  const [refreshing, setRefreshing] = useState(false);

  // Theme colors
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  const solidBackground = useThemeColor('solidBackground');

  // Mark notification as read when clicked
  const handleNotificationPress = (notification: Notification) => {
    // Update read status
    const updatedNotifications = notifications.map(item => 
      item.id === notification.id ? { ...item, read: true } : item
    );
    setNotifications(updatedNotifications);
    
    // Navigate to content if available
    if (notification.contentId && notification.contentType) {
      router.push(`/content/${notification.contentType}/${notification.contentId}`);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(item => ({ ...item, read: true }));
    setNotifications(updatedNotifications);
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Render notification item
  const renderNotificationItem = ({ item: notification }: { item: Notification }) => {
    const getIconForType = () => {
      switch (notification.type) {
        case 'new_content':
          return <Ionicons name="film" size={24} color={primary} />;
        case 'update':
          return <Feather name="refresh-cw" size={24} color={primary} />;
        case 'recommendation':
          return <Ionicons name="thumbs-up" size={24} color={primary} />;
        case 'system':
          return <Ionicons name="settings-outline" size={24} color={primary} />;
        default:
          return <Ionicons name="notifications-outline" size={24} color={primary} />;
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem, 
          { 
            backgroundColor: notification.read ? solidBackground : 'rgba(73, 80, 250, 0.05)',
            borderBottomColor: border
          }
        ]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationIconContainer}>
          {notification.image ? (
            <Image source={{ uri: notification.image }} style={styles.notificationImage} />
          ) : (
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(73, 80, 250, 0.1)' }]}>
              {getIconForType()}
            </View>
          )}
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, { color: text }]} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={[styles.notificationTime, { color: textSecondary }]}>
              {notification.time}
            </Text>
          </View>
          
          <Text style={[styles.notificationMessage, { color: textSecondary }]} numberOfLines={2}>
            {notification.message}
          </Text>
        </View>
        
        {!notification.read && <View style={[styles.unreadIndicator, { backgroundColor: primary }]} />}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
      
      <View style={styles.headerContainer}>
        <Text style={[styles.screenTitle, { color: text }]}>Notifications</Text>
        
        {notifications.some(n => !n.read) && (
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
            activeOpacity={0.7}
          >
            <Text style={[styles.markAllText, { color: primary }]}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={[styles.loadingText, { color: text }]}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onRefresh={onRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={60} color={textSecondary} />
              <Text style={[styles.emptyText, { color: text }]}>No notifications yet</Text>
              <Text style={[styles.emptySubtitle, { color: textSecondary }]}>
                We'll notify you when there's something new
              </Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 60,
    marginBottom: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  notificationsList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  notificationIconContainer: {
    marginRight: 16,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
