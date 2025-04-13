import { Tabs } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Simulating unread notifications (in a real app, this would come from a notifications service)
const hasUnreadNotifications = true;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [unreadNotifications, setUnreadNotifications] = useState(hasUnreadNotifications);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].solidBackground,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="magnify" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <TabBarIcon 
              name="bell" 
              color={color} 
              showBadge={unreadNotifications} 
            />
          ),
        }}
        listeners={{
          tabPress: () => {
            // When the user clicks on the notifications tab, clear the badge
            setUnreadNotifications(false);
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <TabBarIcon name="account" color={color} />,
        }}
      />
    </Tabs>
  );
}
