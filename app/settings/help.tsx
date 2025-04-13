import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import FloatingAlert from '@/components/common/FloatingAlert';
import SettingsHeader from '@/components/common/SettingsHeader';

interface HelpTopic {
  id: string;
  title: string;
  icon: string;
}

const helpTopics: HelpTopic[] = [
  { id: 'account', title: 'Account & Billing', icon: 'person-circle-outline' },
  { id: 'playback', title: 'Playback Issues', icon: 'play-circle-outline' },
  { id: 'connection', title: 'Connection Problems', icon: 'wifi-outline' },
  { id: 'content', title: 'Content Questions', icon: 'film-outline' },
  { id: 'devices', title: 'Device Support', icon: 'phone-portrait-outline' },
  { id: 'downloading', title: 'Downloading Content', icon: 'download-outline' },
  { id: 'subscription', title: 'Subscription Plans', icon: 'card-outline' },
  { id: 'other', title: 'Other Issues', icon: 'help-circle-outline' }
];

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 'faq1',
    question: 'How do I reset my password?',
    answer: 'Go to Account settings > Security > Change Password. You can also request a password reset from the login screen if you cannot access your account.'
  },
  {
    id: 'faq2',
    question: 'Why am I experiencing buffering issues?',
    answer: 'Buffering can be caused by slow internet connection. Try the following: 1) Check your internet speed, 2) Lower your streaming quality in Settings > Quality, 3) Connect to a stronger Wi-Fi signal, or 4) Close other apps using bandwidth.'
  },
  {
    id: 'faq3',
    question: 'How can I download content for offline viewing?',
    answer: 'On any movie or show page, tap the download icon to save content for offline viewing. You can manage your downloads in the Downloads tab.'
  },
  {
    id: 'faq4',
    question: 'Can I use my account on multiple devices?',
    answer: 'Yes! You can use your Rangbaj account on multiple devices based on your subscription plan. Standard plans allow 2 concurrent streams, while Premium plans allow 4 concurrent streams.'
  },
  {
    id: 'faq5',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription from Settings > Payment & Subscription > Change Plan > Cancel Subscription. Your account will remain active until the end of your current billing period.'
  }
];

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  
  // Get theme colors
  const text = useThemeColor('text');
  const background = useThemeColor('background');
  const border = useThemeColor('border');
  const primary = useThemeColor('primary');
  const textSecondary = useThemeColor('textSecondary');
  const solidBackground = useThemeColor('solidBackground');
  const inputBackground = useThemeColor('inputBackground');
  
  const filteredFaqs = searchQuery
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;
  
  const handleTopicSelect = (id: string) => {
    setAlertMessage(`Navigating to ${helpTopics.find(t => t.id === id)?.title} help section`);
    setAlertType('info');
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };
  
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      setAlertMessage('Please enter your feedback');
      setAlertType('warning');
      setShowAlert(true);
      
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return;
    }
    
    // In a real app, send the feedback to a server
    setAlertMessage('Thank you for your feedback!');
    setAlertType('success');
    setShowAlert(true);
    setFeedbackText('');
    setShowFeedbackForm(false);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };
  
  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
    if (!showFeedbackForm) {
      setFeedbackText('');
      setFeedbackCategory('');
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
      <SettingsHeader title="Help & Support" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: inputBackground, borderColor: border }]}>
          <Ionicons name="search-outline" size={20} color={textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search for help topics..."
            placeholderTextColor={textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {!searchQuery && (
          <>
            {/* Help Topics */}
            <Text style={[styles.sectionTitle, { color: text }]}>
              How can we help you?
            </Text>
            
            <View style={styles.topicsGrid}>
              {helpTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.topicItem, { borderColor: border, backgroundColor: solidBackground }]}
                  onPress={() => handleTopicSelect(topic.id)}
                >
                  <Ionicons name={topic.icon as any} size={28} color={primary} style={styles.topicIcon} />
                  <Text style={[styles.topicTitle, { color: text }]} numberOfLines={2}>
                    {topic.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
        {/* FAQs */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: text }]}>
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </Text>
          
          {filteredFaqs.length > 0 ? (
            <View style={[styles.faqContainer, { borderColor: border }]}>
              {filteredFaqs.map((faq, index) => (
                <React.Fragment key={faq.id}>
                  <View style={styles.faqItem}>
                    <Text style={[styles.faqQuestion, { color: text }]}>
                      {faq.question}
                    </Text>
                    <Text style={[styles.faqAnswer, { color: textSecondary }]}>
                      {faq.answer}
                    </Text>
                  </View>
                  
                  {index < filteredFaqs.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { borderColor: border }]}>
              <Ionicons name="search-outline" size={48} color={textSecondary} />
              <Text style={[styles.emptyText, { color: textSecondary }]}>
                No results found for "{searchQuery}"
              </Text>
              <Text style={[styles.emptySubtext, { color: textSecondary }]}>
                Try a different search term or browse our help topics
              </Text>
            </View>
          )}
        </View>
        
        {/* Contact Support */}
        <View style={[styles.contactContainer, { borderColor: border }]}>
          <View style={styles.contactHeader}>
            <Ionicons name="headset-outline" size={24} color={primary} />
            <Text style={[styles.contactTitle, { color: text }]}>
              Need more help?
            </Text>
          </View>
          
          <Text style={[styles.contactText, { color: textSecondary }]}>
            Our support team is available 24/7 to assist you with any issues you may encounter.
          </Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: solidBackground, borderColor: border }]}
              onPress={() => {
                setAlertMessage('Opening live chat');
                setAlertType('info');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color={text} />
              <Text style={[styles.contactButtonText, { color: text }]}>Live Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactButton, { backgroundColor: solidBackground, borderColor: border }]}
              onPress={() => {
                setAlertMessage('Opening email support');
                setAlertType('info');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
              }}
            >
              <Ionicons name="mail-outline" size={20} color={text} />
              <Text style={[styles.contactButtonText, { color: text }]}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Feedback Form */}
        <TouchableOpacity 
          style={[styles.feedbackToggle, { borderColor: border }]}
          onPress={toggleFeedbackForm}
        >
          <View style={styles.feedbackToggleContent}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color={primary} style={styles.feedbackIcon} />
            <Text style={[styles.feedbackToggleText, { color: text }]}>
              {showFeedbackForm ? 'Hide Feedback Form' : 'Send Us Feedback'}
            </Text>
          </View>
          <Ionicons 
            name={showFeedbackForm ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={textSecondary} 
          />
        </TouchableOpacity>
        
        {showFeedbackForm && (
          <View style={[styles.feedbackForm, { borderColor: border, backgroundColor: solidBackground }]}>
            <Text style={[styles.feedbackLabel, { color: text }]}>
              What's on your mind?
            </Text>
            
            <View style={styles.feedbackCategories}>
              {['Bug Report', 'Feature Request', 'Content Request', 'General Feedback'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    { 
                      borderColor: feedbackCategory === category ? primary : border,
                      backgroundColor: feedbackCategory === category ? `${primary}15` : 'transparent'
                    }
                  ]}
                  onPress={() => setFeedbackCategory(category)}
                >
                  <Text 
                    style={[
                      styles.categoryText, 
                      { color: feedbackCategory === category ? primary : text }
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={[
                styles.feedbackTextInput, 
                { 
                  backgroundColor: inputBackground, 
                  borderColor: border,
                  color: text
                }
              ]}
              placeholder="Tell us what you think..."
              placeholderTextColor={textSecondary}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            
            <View style={styles.feedbackActions}>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: border }]}
                onPress={toggleFeedbackForm}
              >
                <Text style={[styles.cancelButtonText, { color: text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: primary }]}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.footerSpace} />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  topicItem: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  topicIcon: {
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  faqItem: {
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  emptyContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  feedbackToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  feedbackToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIcon: {
    marginRight: 12,
  },
  feedbackToggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  feedbackForm: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  feedbackCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
  },
  feedbackTextInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
  },
  feedbackActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footerSpace: {
    height: 40,
  },
});
