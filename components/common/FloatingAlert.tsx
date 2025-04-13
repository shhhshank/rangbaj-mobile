import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface FloatingAlertProps {
  visible: boolean;
  type: AlertType;
  message: string;
  duration?: number;
  onClose?: () => void;
  position?: 'top' | 'bottom';
  action?: {
    label: string;
    onPress: () => void;
  };
}

const getAlertColors = (type: AlertType) => {
  switch (type) {
    case 'success':
      return {
        background: '#10B981',
        icon: 'checkmark-circle',
      };
    case 'error':
      return {
        background: '#EF4444',
        icon: 'alert-circle',
      };
    case 'warning':
      return {
        background: '#F59E0B',
        icon: 'warning',
      };
    case 'info':
    default:
      return {
        background: '#3B82F6',
        icon: 'information-circle',
      };
  }
};

export const FloatingAlert: React.FC<FloatingAlertProps> = ({
  visible,
  type,
  message,
  duration = 3000,
  onClose,
  position = 'top',
  action,
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  const { background: alertColor, icon } = getAlertColors(type);

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;
    
    if (visible) {
      // Reset animation values if they were changed
      translateY.setValue(position === 'top' ? -100 : 100);
      opacity.setValue(0);
      
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto-hide after duration if no action is provided
      if (duration > 0 && !action) {
        hideTimeout = setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, duration);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: position === 'top' ? -100 : 100,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [visible, position, duration, action, onClose, translateY, opacity]);
  
  if (!visible) {
    return null;
  }
  
  const animatedStyle = {
    transform: [{ translateY }],
    opacity,
  };

  const animatedInnerStyle = {
    opacity,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        animatedStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.alertContainer,
          { backgroundColor: alertColor },
          animatedInnerStyle,
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color="#fff" />
        </View>
        <Text style={styles.message}>{message}</Text>
        {action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  topPosition: {
    top: Platform.OS === 'ios' ? 90 : 70,
  },
  bottomPosition: {
    bottom: 20,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    maxWidth: 420,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default FloatingAlert;
