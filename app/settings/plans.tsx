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

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹199',
    period: 'month',
    color: ['#3B82F6', '#1D4ED8'],
    benefits: [
      'Watch on 1 device at a time',
      'HD (720p) video quality',
      'Download on 1 device',
      'Ad-supported streaming',
    ],
    limitations: [
      'No Ultra HD',
      'Limited content library',
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹499',
    period: 'month',
    color: ['#8B5CF6', '#6D28D9'],
    benefits: [
      'Watch on 2 devices at a time',
      'Full HD (1080p) video quality',
      'Download on 2 devices',
      'Ad-free streaming',
      'Access to entire library',
    ],
    limitations: [
      'No Ultra HD',
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹999',
    period: 'month',
    color: ['#8E2DE2', '#4A00E0'],
    popular: true,
    benefits: [
      'Watch on 4 devices at a time',
      'Ultra HD (4K) and HDR',
      'Download on 6 devices',
      'Ad-free streaming',
      'Access to entire library',
      'Early access to new releases',
      'Exclusive premium content',
    ],
    limitations: []
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    price: '₹7999',
    period: 'year',
    color: ['#D946EF', '#9333EA'],
    benefits: [
      'Same benefits as Premium',
      'Save ₹3989 compared to monthly',
    ],
    limitations: []
  }
];

export default function PlansScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const border = useThemeColor('border');
  const textSecondary = useThemeColor('textSecondary');
  const solidBackground = useThemeColor('solidBackground');
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setAlertMessage(`${plans.find(p => p.id === planId)?.name} plan selected`);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };
  
  const handleSubscribe = () => {
    setAlertMessage('Subscription updated successfully');
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
      router.back();
    }, 2000);
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
      <SettingsHeader title="Subscription Plans" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: textSecondary }]}>
          Choose the plan that works for you. Upgrade, downgrade, or cancel anytime.
        </Text>
        
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                { borderColor: selectedPlan === plan.id ? plan.color[0] : border }
              ]}
              onPress={() => handleSelectPlan(plan.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[plan.color[0], plan.color[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.planHeader}
              >
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>
                    {plan.price}/{plan.period}
                  </Text>
                </View>
                
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                
                <View style={[
                  styles.radioOuter,
                  { borderColor: '#fff' }
                ]}>
                  {selectedPlan === plan.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </LinearGradient>
              
              <View style={[styles.planContent, { backgroundColor: solidBackground }]}>
                <View style={styles.benefitsContainer}>
                  <Text style={[styles.sectionLabel, { color: text }]}>Includes:</Text>
                  {plan.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons name="checkmark-circle" size={18} color={plan.color[0]} style={styles.benefitIcon} />
                      <Text style={[styles.benefitText, { color: text }]}>{benefit}</Text>
                    </View>
                  ))}
                </View>
                
                {plan.limitations.length > 0 && (
                  <View style={styles.limitationsContainer}>
                    <Text style={[styles.sectionLabel, { color: text }]}>Limitations:</Text>
                    {plan.limitations.map((limitation, index) => (
                      <View key={index} style={styles.limitationItem}>
                        <Ionicons name="close-circle" size={18} color="#EF4444" style={styles.limitationIcon} />
                        <Text style={[styles.limitationText, { color: textSecondary }]}>{limitation}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: plans.find(p => p.id === selectedPlan)?.color[0] }]}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeText}>Continue with {plans.find(p => p.id === selectedPlan)?.name}</Text>
        </TouchableOpacity>
        
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: textSecondary }]}>
            By subscribing, you agree to our Terms & Conditions and Privacy Policy.
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  planName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPrice: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  planContent: {
    padding: 16,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  limitationsContainer: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIcon: {
    marginRight: 8,
  },
  benefitText: {
    fontSize: 14,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitationIcon: {
    marginRight: 8,
  },
  limitationText: {
    fontSize: 14,
  },
  subscribeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginVertical: 16,
  },
  subscribeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
