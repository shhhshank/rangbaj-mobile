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

// Mock saved payment methods
const savedPaymentMethods = [
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

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [savedMethods, setSavedMethods] = useState(savedPaymentMethods);
  const [selectedSavedMethod, setSelectedSavedMethod] = useState<string>(
    savedPaymentMethods.find(method => method.isDefault)?.id || savedPaymentMethods[0]?.id || ''
  );

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

  const handleSelectSavedMethod = (id: string) => {
    setSelectedSavedMethod(id);
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

  const renderCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" />;
      case 'mastercard':
        return <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />;
      case 'upi':
        return <MaterialIcons name="smartphone" size={24} color={primary} />;
      default:
        return <FontAwesome5 name="credit-card" size={24} color={text} />;
    }
  };

  const renderPaymentMethods = () => {
    return (
      <View style={styles.paymentMethodsContainer}>
        <Text style={[styles.sectionTitle, { color: text }]}>Payment Method</Text>
        
        {savedMethods.length > 0 ? (
          <View style={[styles.paymentMethodsList, { backgroundColor: secondaryBackground, borderColor: border }]}>
            {savedMethods.map((method, index) => (
              <React.Fragment key={method.id}>
                <TouchableOpacity
                  style={[
                    styles.savedMethodItem,
                    { backgroundColor: selectedSavedMethod === method.id ? `${primary}10` : 'transparent' }
                  ]}
                  onPress={() => handleSelectSavedMethod(method.id)}
                >
                  <View style={styles.methodIconContainer}>
                    {renderCardIcon(method.type)}
                  </View>
                  <View style={styles.methodDetails}>
                    <View style={styles.methodHeader}>
                      <Text style={[styles.methodTitle, { color: text }]}>
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                        {method.type !== 'upi' ? ` ••••${method.last4}` : ` (${method.details})`}
                      </Text>
                      {method.isDefault && (
                        <Text style={[styles.defaultBadge, { color: primary }]}>Default</Text>
                      )}
                    </View>
                    {method.type !== 'upi' && (
                      <Text style={[styles.methodExpiry, { color: textSecondary }]}>
                        Expires {method.expiry}
                      </Text>
                    )}
                  </View>
                  <View style={[
                    styles.methodRadio,
                    { 
                      borderColor: selectedSavedMethod === method.id ? primary : border,
                      backgroundColor: selectedSavedMethod === method.id ? primary : 'transparent'
                    }
                  ]}>
                    {selectedSavedMethod === method.id && (
                      <View style={styles.methodRadioInner} />
                    )}
                  </View>
                </TouchableOpacity>
                {index < savedMethods.length - 1 && (
                  <View style={[styles.methodDivider, { backgroundColor: border }]} />
                )}
              </React.Fragment>
            ))}
            
            <TouchableOpacity 
              style={[styles.addNewMethod, { borderTopColor: border }]}
              onPress={() => {
                // Navigation to add payment method would go here
                // For now, we'll just log to console
                console.log('Add new payment method');
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color={primary} />
              <Text style={[styles.addNewMethodText, { color: primary }]}>
                Add New Payment Method
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.paymentOptions, { backgroundColor: secondaryBackground, borderColor: border }]}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  { backgroundColor: selectedPayment === method.id ? `${primary}15` : 'transparent' }
                ]}
                onPress={() => handleSelectPayment(method.id)}
              >
                <FontAwesome5 name={method.icon as any} size={20} color={primary} />
                <Text style={[styles.paymentOptionText, { color: text }]}>{method.name}</Text>
                <View style={[
                  styles.radioButton,
                  { 
                    borderColor: selectedPayment === method.id ? primary : border,
                    backgroundColor: selectedPayment === method.id ? primary : 'transparent'
                  }
                ]}>
                  {selectedPayment === method.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
        <View style={[styles.checkoutSummary, { backgroundColor: secondaryBackground, borderColor: border }]}>
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
  paymentOptions: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
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
  // Payment method styles
  methodIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  methodDetails: {
    flex: 1,
    marginLeft: 12,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultBadge: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  methodExpiry: {
    fontSize: 14,
    marginTop: 2,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  methodDivider: {
    height: 1,
    marginLeft: 68,
  },
  addNewMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  addNewMethodText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  paymentMethodsList: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 24,
  },
});
