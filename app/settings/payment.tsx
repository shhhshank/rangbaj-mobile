import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

// Mock payment methods
const paymentMethods = [
  {
    id: 'card1',
    type: 'visa',
    last4: '4242',
    expiry: '05/26',
    isDefault: true,
  },
  {
    id: 'card2',
    type: 'mastercard',
    last4: '8439',
    expiry: '11/25',
    isDefault: false,
  },
  {
    id: 'upi1',
    type: 'upi',
    details: 'user@ybl',
    isDefault: false,
  }
];

// Mock subscription details
const subscription = {
  plan: 'Premium',
  price: '₹999',
  period: 'year',
  status: 'active',
  nextBilling: 'March 15, 2026',
  features: [
    'Ultra HD streaming',
    'Watch on 4 devices at once',
    'Ad-free experience',
    'Download to watch offline',
    'Exclusive content',
  ]
};

export default function PaymentScreen() {
  const router = useRouter();
  const [paymentsList, setPaymentsList] = useState(paymentMethods);
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
  
  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentsList.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentsList(updatedMethods);
    setAlertMessage('Default payment method updated');
    setAlertType('success');
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  
  const handleRemovePayment = (id: string) => {
    const updatedMethods = paymentsList.filter(method => method.id !== id);
    
    setPaymentsList(updatedMethods);
    setAlertMessage('Payment method removed');
    setAlertType('success');
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };
  
  const renderCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" />;
      case 'mastercard':
        return <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />;
      case 'upi':
        return <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png' }}
          style={{ width: 28, height: 16 }}
          resizeMode="contain"
        />;
      default:
        return <FontAwesome5 name="credit-card" size={24} color={text} />;
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
      <SettingsHeader title="Payment & Subscription" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Plan */}
        <Text style={[styles.sectionTitle, { color: text }]}>
          Current Plan
        </Text>
        
        <View style={styles.planCard}>
          <LinearGradient
            colors={['#8E2DE2', '#4A00E0']}
            style={styles.planGradient}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{subscription.plan}</Text>
                <Text style={styles.planPrice}>{subscription.price} / {subscription.period}</Text>
              </View>
              
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {subscription.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.planDivider} />
            
            <View style={styles.planFeatures}>
              {subscription.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={18} 
                    color="#fff" 
                    style={styles.featureIcon} 
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            <Text style={styles.billingInfo}>
              Next billing date: {subscription.nextBilling}
            </Text>
            
            <TouchableOpacity 
              style={styles.changePlanButton}
              onPress={() => router.push('/subscriptions')}
            >
              <Text style={styles.changePlanText}>Change Plan</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        
        {/* Payment Methods */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            Payment Methods
          </Text>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: primary }]}
            onPress={() => {
              setAlertMessage('Adding new payment method');
              setAlertType('info');
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 2000);
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.paymentsContainer, { borderColor: border }]}>
          {paymentsList.length > 0 ? (
            paymentsList.map((method, index) => (
              <React.Fragment key={method.id}>
                <View style={styles.paymentItem}>
                  <View style={styles.paymentLeft}>
                    <View style={[styles.cardIconBg, { backgroundColor: solidBackground }]}>
                      {renderCardIcon(method.type)}
                    </View>
                    
                    <View style={styles.paymentDetails}>
                      <View style={styles.paymentHeader}>
                        <Text style={[styles.paymentTitle, { color: text }]}>
                          {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                          {method.isDefault && (
                            <Text style={[styles.defaultLabel, { color: primary }]}> (Default)</Text>
                          )}
                        </Text>
                      </View>
                      
                      <Text style={[styles.paymentSubtitle, { color: textSecondary }]}>
                        {method.type === 'upi' 
                          ? method.details 
                          : `•••• ${method.last4} | Expires ${method.expiry}`
                        }
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.paymentActions}>
                    {!method.isDefault && (
                      <TouchableOpacity 
                        style={styles.paymentAction}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color={primary} />
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.paymentAction}
                      onPress={() => handleRemovePayment(method.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {index < paymentsList.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: border }]} />
                )}
              </React.Fragment>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="card-outline" size={48} color={textSecondary} />
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                No payment methods added
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.billingHistoryButton, { borderColor: border }]}
          onPress={() => {
            setAlertMessage('Opening billing history');
            setAlertType('info');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
          }}
        >
          <Ionicons name="receipt-outline" size={20} color={text} />
          <Text style={[styles.billingHistoryText, { color: text }]}>View Billing History</Text>
          <Ionicons name="chevron-forward" size={20} color={textSecondary} />
        </TouchableOpacity>
        
        <View style={styles.footerSpace} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  planCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  planGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPrice: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  planDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
  },
  billingInfo: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  changePlanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePlanText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  paymentsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIconBg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultLabel: {
    fontWeight: '400',
    fontSize: 14,
  },
  paymentSubtitle: {
    fontSize: 13,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentAction: {
    padding: 8,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
  billingHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  billingHistoryText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  footerSpace: {
    height: 40,
  },
});
