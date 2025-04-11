import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/common/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link, Stack, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Types for subscription plans
type BenefitType = {
  id: string;
  title: string;
  included: boolean;
};

type PlanType = {
  id: string;
  name: string;
  price: string;
  billingCycle: string;
  description: string;
  features: string[];
  benefits: BenefitType[];
  color: string;
  isMostPopular: boolean;
  isSelected?: boolean;
};

// Sample subscription plans
const subscriptionPlans: PlanType[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '₹149',
    billingCycle: 'per month',
    description: 'Perfect for casual viewers',
    features: ['Access to all content', 'Watch on one device at a time', 'SD quality'],
    benefits: [
      { id: '1', title: 'Ad-free viewing', included: false },
      { id: '2', title: 'HD streaming', included: false },
      { id: '3', title: '4K UHD streaming', included: false },
      { id: '4', title: 'Download for offline', included: false },
      { id: '5', title: 'Multiple profiles', included: false },
    ],
    color: '#3498db',
    isMostPopular: false,
    isSelected: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '₹299',
    billingCycle: 'per month',
    description: 'Our most popular plan',
    features: ['Access to all content', 'Watch on two devices', 'HD quality (1080p)'],
    benefits: [
      { id: '1', title: 'Ad-free viewing', included: true },
      { id: '2', title: 'HD streaming', included: true },
      { id: '3', title: '4K UHD streaming', included: false },
      { id: '4', title: 'Download for offline', included: true },
      { id: '5', title: 'Multiple profiles', included: true },
    ],
    color: '#9b59b6',
    isMostPopular: true,
    isSelected: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹499',
    billingCycle: 'per month',
    description: 'The ultimate experience',
    features: ['Access to all content', 'Watch on four devices', '4K Ultra HD + HDR'],
    benefits: [
      { id: '1', title: 'Ad-free viewing', included: true },
      { id: '2', title: 'HD streaming', included: true },
      { id: '3', title: '4K UHD streaming', included: true },
      { id: '4', title: 'Download for offline', included: true },
      { id: '5', title: 'Multiple profiles', included: true },
    ],
    color: '#e74c3c',
    isMostPopular: false,
    isSelected: false,
  },
];

// Annual plan modal data 
const annualPromotion = {
  title: "Save 25% with Annual Plan",
  description: "Get 12 months for the price of 9 when you choose annual billing",
  savings: "Save ₹897+ per year",
};

// Payment methods
const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card' },
  { id: 'upi', name: 'UPI', icon: 'mobile-alt' },
  { id: 'wallet', name: 'Mobile Wallet', icon: 'wallet' },
  { id: 'netbanking', name: 'Net Banking', icon: 'university' },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

  const router = useRouter();
  const background = useThemeColor('background');
  const secondaryBackground = useThemeColor('solidBackground');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');

  const handleSelectPlan = (id: string) => {
    setSelectedPlan(id);
  };

  const handleBillingCycleChange = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
  };

  const handleSelectPayment = (id: string) => {
    setSelectedPayment(id);
  };

  const getDiscountedPrice = (price: string): string => {
    if (billingCycle === 'annual') {
      // Remove currency symbol, convert to number, calculate 25% discount for 12 months
      const numericPrice = parseFloat(price.replace('₹', ''));
      const annualPrice = (numericPrice * 12 * 0.75).toFixed(0);
      return `₹${annualPrice}`;
    }
    return price;
  };

  const getMonthlyEquivalent = (price: string): string => {
    if (billingCycle === 'annual') {
      const numericPrice = parseFloat(price.replace('₹', ''));
      const monthlyEquivalent = ((numericPrice * 12 * 0.75) / 12).toFixed(0);
      return `₹${monthlyEquivalent}/mo`;
    }
    return '';
  };

  const renderPlanCard = (plan: PlanType) => {
    const isSelected = selectedPlan === plan.id;
    const displayPrice = billingCycle === 'annual' 
      ? getDiscountedPrice(plan.price) 
      : plan.price;
    const billingText = billingCycle === 'annual' ? 'per year' : 'per month';
    
    return (
      <TouchableOpacity
        key={plan.id}
        style={[
          styles.planCard, 
          { backgroundColor: secondaryBackground },
          isSelected && { borderColor: plan.color, borderWidth: 2 }
        ]}
        onPress={() => handleSelectPlan(plan.id)}
        activeOpacity={0.8}
      >
        {plan.isMostPopular && (
          <View style={[styles.popularTag, { backgroundColor: plan.color }]}>
            <Text style={styles.popularTagText}>MOST POPULAR</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={[styles.planName, { color: text }]}>{plan.name}</Text>
          <View>
            <Text style={[styles.planPrice, { color: text }]}>{displayPrice}</Text>
            <Text style={[styles.billingCycle, { color: textSecondary }]}>{billingText}</Text>
            {billingCycle === 'annual' && (
              <Text style={[styles.monthlyEquivalent, { color: plan.color }]}>
                {getMonthlyEquivalent(plan.price)}
              </Text>
            )}
          </View>
        </View>
        
        <Text style={[styles.planDescription, { color: textSecondary }]}>{plan.description}</Text>
        
        <View style={styles.featuresList}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={plan.color} />
              <Text style={[styles.featureText, { color: text }]}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.selectButton,
            isSelected 
              ? { backgroundColor: plan.color } 
              : { borderColor: plan.color, borderWidth: 1 }
          ]}
          onPress={() => handleSelectPlan(plan.id)}
        >
          <Text 
            style={[
              styles.selectButtonText, 
              { color: isSelected ? '#fff' : plan.color }
            ]}
          >
            {isSelected ? 'Selected' : 'Select Plan'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderBenefitComparison = () => {
    const plans = subscriptionPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      benefits: plan.benefits,
      color: plan.color,
      isSelected: plan.id === selectedPlan
    }));

    // Get unique benefits from all plans
    const allBenefits = plans[0].benefits;

    return (
      <View style={styles.benefitsContainer}>
        <Text style={[styles.sectionTitle, { color: text }]}>Plan Comparison</Text>
        
        {/* Plan headers */}
        <View style={styles.comparisonHeader}>
          <View style={{ width: '40%' }} />
          {plans.map(plan => (
            <View key={plan.id} style={styles.planColumn}>
              <Text style={[styles.comparisonPlanName, { color: text }]}>
                {plan.name}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Benefit rows */}
        {allBenefits.map(benefit => (
          <View key={benefit.id} style={[styles.benefitRow, { borderBottomColor: border }]}>
            <View style={styles.benefitName}>
              <Text style={[styles.benefitText, { color: text }]}>{benefit.title}</Text>
            </View>
            
            {plans.map(plan => {
              const planBenefit = plan.benefits.find(b => b.id === benefit.id);
              const isIncluded = planBenefit?.included || false;
              
              return (
                <View key={plan.id} style={styles.planColumn}>
                  {isIncluded ? (
                    <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                  ) : (
                    <Ionicons name="close-circle" size={18} color={textSecondary} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderBillingOptions = () => {
    return (
      <View style={styles.billingOptionsContainer}>
        <Text style={[styles.sectionTitle, { color: text }]}>Billing Cycle</Text>
        
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'monthly' && [styles.activeBillingOption, { backgroundColor: primary }]
            ]}
            onPress={() => handleBillingCycleChange('monthly')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingCycle === 'monthly' && styles.activeBillingOptionText
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.billingOption,
              billingCycle === 'annual' && [styles.activeBillingOption, { backgroundColor: primary }]
            ]}
            onPress={() => handleBillingCycleChange('annual')}
          >
            <Text
              style={[
                styles.billingOptionText,
                billingCycle === 'annual' && styles.activeBillingOptionText
              ]}
            >
              Annual
            </Text>
          </TouchableOpacity>
        </View>
        
        {billingCycle === 'annual' && (
          <View style={[styles.annualPromoBanner, { backgroundColor: 'rgba(76, 175, 80, 0.2)' }]}>
            <Ionicons name="gift" size={22} color="#4CAF50" />
            <View style={styles.promoTextContainer}>
              <Text style={[styles.promoTitle, { color: text }]}>{annualPromotion.title}</Text>
              <Text style={[styles.promoDescription, { color: textSecondary }]}>
                {annualPromotion.description}
              </Text>
              <Text style={styles.savingsText}>{annualPromotion.savings}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderPaymentMethods = () => {
    return (
      <View style={styles.paymentMethodsContainer}>
        <Text style={[styles.sectionTitle, { color: text }]}>Payment Method</Text>
        
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              { backgroundColor: secondaryBackground },
              selectedPayment === method.id && { borderColor: primary, borderWidth: 1 }
            ]}
            onPress={() => handleSelectPayment(method.id)}
          >
            <FontAwesome5 name={method.icon} size={20} color={text} />
            <Text style={[styles.paymentOptionText, { color: text }]}>{method.name}</Text>
            {selectedPayment === method.id && (
              <Ionicons name="checkmark-circle" size={20} color={primary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const selectedPlanDetails = subscriptionPlans.find(plan => plan.id === selectedPlan);
  const displayPrice = billingCycle === 'annual' 
    ? getDiscountedPrice(selectedPlanDetails?.price || '') 
    : selectedPlanDetails?.price;
  const billingText = billingCycle === 'annual' ? 'per year' : 'per month';

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Stack.Screen
        options={{
          headerTitle: 'Subscription Plans',
          headerStyle: {
            backgroundColor: background,
          },
          headerShadowVisible: false,
          headerTintColor: text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Choose Your Plan</Text>
          <Text style={[styles.subtitle, { color: textSecondary }]}>
            All plans include full access to our growing library of shows and films
          </Text>
        </View>
        
        {/* Billing Options */}
        {renderBillingOptions()}
        
        {/* Plans */}
        <View style={styles.plansContainer}>
          {subscriptionPlans.map(plan => renderPlanCard(plan))}
        </View>
        
        {/* Benefits Comparison */}
        {renderBenefitComparison()}
        
        {/* Payment Methods */}
        {renderPaymentMethods()}
        
        {/* Checkout Summary */}
        <View style={[styles.checkoutSummary, { backgroundColor: secondaryBackground }]}>
          <View style={styles.summaryInfo}>
            <Text style={[styles.summaryTitle, { color: text }]}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: textSecondary }]}>Plan:</Text>
              <Text style={[styles.summaryValue, { color: text }]}>
                {selectedPlanDetails?.name} ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: textSecondary }]}>Price:</Text>
              <Text style={[styles.summaryValue, { color: text }]}>
                {displayPrice} {billingText}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: text }]}>Total:</Text>
              <Text style={[styles.totalValue, { color: primary }]}>{displayPrice}</Text>
            </View>
          </View>
        </View>
        
        {/* Subscribe Button */}
        <TouchableOpacity 
          style={[styles.subscribeButton, { backgroundColor: primary }]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textSecondary }]}>
            By subscribing, you agree to our Terms of Use and Privacy Policy.
          </Text>
          <Text style={[styles.footerText, { color: textSecondary }]}>
            You can cancel your subscription anytime.
          </Text>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  plansContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  popularTag: {
    position: 'absolute',
    top: 12,
    right: -30,
    paddingVertical: 4,
    paddingHorizontal: 30,
    transform: [{ rotate: '45deg' }],
    zIndex: 1,
  },
  popularTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  billingCycle: {
    fontSize: 14,
  },
  monthlyEquivalent: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  billingOptionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  billingToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
  },
  activeBillingOption: {
    backgroundColor: '#FF4081',
  },
  billingOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
  },
  activeBillingOptionText: {
    color: '#fff',
  },
  annualPromoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  promoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  comparisonHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonPlanName: {
    fontSize: 14,
    fontWeight: '600',
  },
  benefitRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  benefitName: {
    width: '40%',
  },
  benefitText: {
    fontSize: 14,
  },
  paymentMethodsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  checkoutSummary: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryInfo: {
    width: '100%',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subscribeButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
