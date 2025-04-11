import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView, Image, Dimensions, StatusBar, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from 'react';
import { ThemedView } from '@/components/common/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debounce } from 'lodash';

// Mock trending searches
const trendingSearches = [
  'Quantum Realm',
  'The Universe\'s Edge',
  'Dark Matter',
  'Time Fracture',
  'Stellar Odyssey',
  'Cosmic Whispers',
];

// Mock recent searches
const initialRecentSearches = [
  'Galactic Horizon',
  'Void Travelers',
  'Beyond Stars',
  'Solar Wind',
];

// Define interfaces for our data types
interface Movie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: number;
  duration: string;
}

interface Show {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: number;
  seasons: number;
}

interface Actor {
  id: string;
  name: string;
  image: string;
  knownFor: string;
}

interface SearchResults {
  movies: Movie[];
  shows: Show[];
  actors: Actor[];
}

// Mock search results
const mockSearchResults: SearchResults = {
  movies: [
    { 
      id: '301', 
      title: 'Quantum Resonance', 
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop', 
      year: '2023',
      rating: 4.8,
      duration: '2h 15m',
    },
    { 
      id: '302', 
      title: 'Stellar Odyssey', 
      image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400&auto=format&fit=crop', 
      year: '2024',
      rating: 4.5,
      duration: '1h 58m',
    },
    { 
      id: '303', 
      title: 'Dark Matter', 
      image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&auto=format&fit=crop', 
      year: '2023',
      rating: 4.3,
      duration: '2h 05m',
    },
  ],
  shows: [
    { 
      id: '601', 
      title: 'The Universe\'s Edge', 
      image: 'https://images.unsplash.com/photo-1501862700950-18382cd41497?w=400&auto=format&fit=crop', 
      year: '2024',
      rating: 4.7,
      seasons: 1,
    },
    { 
      id: '602', 
      title: 'Quantum Echoes', 
      image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&auto=format&fit=crop', 
      year: '2023',
      rating: 4.5,
      seasons: 2,
    },
    { 
      id: '603', 
      title: 'Stellar Genesis', 
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop', 
      year: '2022',
      rating: 4.6,
      seasons: 3,
    },
  ],
  actors: [
    {
      id: 'a1',
      name: 'Ryan Gosling',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      knownFor: 'Quantum Resonance',
    },
    {
      id: 'a2',
      name: 'Sandra Bullock',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      knownFor: 'Stellar Odyssey',
    },
    {
      id: 'a3',
      name: 'Anthony Mackie',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      knownFor: 'Dark Matter',
    },
  ]
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [recentSearches, setRecentSearches] = useState(initialRecentSearches);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const background = useThemeColor('background');
  const text = useThemeColor('text');
  const textSecondary = useThemeColor('textSecondary');
  const primary = useThemeColor('primary');
  const border = useThemeColor('border');
  const solidBackground = useThemeColor('solidBackground');
  
  // Debounced search function
  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length === 0) {
        setSearchResults(null);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      
      // Simulate API call
      setTimeout(() => {
        // Filter mock results based on query
        const filteredResults: SearchResults = {
          movies: mockSearchResults.movies.filter(
            item => item.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          shows: mockSearchResults.shows.filter(
            item => item.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          actors: mockSearchResults.actors.filter(
            item => item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        };
        
        setSearchResults(filteredResults);
        setIsSearching(false);
        
        // Add to recent searches if not already there
        if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
          setRecentSearches(prev => [searchQuery, ...prev.slice(0, 3)]);
        }
      }, 500);
    }, 300),
    [recentSearches]
  );
  
  const handleQueryChange = (text: string) => {
    setQuery(text);
    performSearch(text);
  };
  
  const handleClearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };
  
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };
  
  const handleSearchItemPress = (item: string) => {
    setQuery(item);
    performSearch(item);
  };
  
  const handleContentPress = (item: Movie | Show | Actor, type: string) => {
    if (type === 'movie') {
      router.push(`/content/${item.id}`);
    } else if (type === 'show') {
      router.push(`/content/show/${item.id}`);
    } else {
      // Handle actor press
      console.log('Pressed actor:', isActor(item) ? item.name : 'unknown');
    }
  };
  
  // Helper type guard functions
  const isMovie = (item: Movie | Show | Actor): item is Movie => {
    return 'duration' in item;
  };
  
  const isShow = (item: Movie | Show | Actor): item is Show => {
    return 'seasons' in item;
  };
  
  const isActor = (item: Movie | Show | Actor): item is Actor => {
    return 'knownFor' in item;
  };
  
  // Render search chip
  const renderSearchChip = (item: string, index: number) => (
    <TouchableOpacity
      key={`${item}-${index}`}
      style={styles.searchChip}
      onPress={() => handleSearchItemPress(item)}
    >
      <Feather name="search" size={14} color={text} style={styles.chipIcon} />
      <Text style={[styles.chipText, { color: text }]} numberOfLines={1}>{item}</Text>
    </TouchableOpacity>
  );
  
  // Render result item
  const renderResultItem = ({ item, type }: { item: Movie | Show | Actor; type: string }) => {
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleContentPress(item, type)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.image }} style={styles.resultImage} />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultTitle, { color: text }]} numberOfLines={1}>
            {isActor(item) ? item.name : item.title}
          </Text>
          
          <View style={styles.resultMeta}>
            {(isMovie(item) || isShow(item)) && item.year && (
              <Text style={[styles.resultYear, { color: textSecondary }]}>{item.year}</Text>
            )}
            
            {(isMovie(item) || isShow(item)) && item.rating && (
              <View style={styles.ratingContainer}>
                <AntDesign name="star" size={12} color="#FFD700" />
                <Text style={[styles.ratingText, { color: textSecondary }]}>{item.rating}</Text>
              </View>
            )}
            
            {isMovie(item) && item.duration && (
              <Text style={[styles.resultDuration, { color: textSecondary }]}>
                {item.duration}
              </Text>
            )}
            
            {isShow(item) && item.seasons && (
              <Text style={[styles.resultDuration, { color: textSecondary }]}>
                {item.seasons} {item.seasons === 1 ? 'Season' : 'Seasons'}
              </Text>
            )}
            
            {isActor(item) && item.knownFor && (
              <Text style={[styles.resultKnownFor, { color: textSecondary }]} numberOfLines={1}>
                {item.knownFor}
              </Text>
            )}
          </View>
          
          {type === 'actor' && (
            <Text style={[styles.actorLabel, { color: textSecondary }]}>Actor</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Tabs for filtering results
  const renderResultTabs = () => {
    const tabs = [
      { id: 'all', label: 'All' },
      { id: 'movies', label: 'Movies' },
      { id: 'shows', label: 'TV Shows' },
      { id: 'actors', label: 'People' },
    ];
    
    return (
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && [styles.activeTab, { borderColor: primary }]
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: textSecondary },
                activeTab === tab.id && { color: primary, fontWeight: '600' }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Count total results
  const getTotalResultsCount = () => {
    if (!searchResults) return 0;
    
    return (
      searchResults.movies.length +
      searchResults.shows.length +
      searchResults.actors.length
    );
  };
  
  // Filter results based on active tab
  const getFilteredResults = () => {
    if (!searchResults) return null;
    
    switch (activeTab) {
      case 'movies':
        return {
          movies: searchResults.movies,
          shows: [],
          actors: [],
        };
      case 'shows':
        return {
          movies: [],
          shows: searchResults.shows,
          actors: [],
        };
      case 'actors':
        return {
          movies: [],
          shows: [],
          actors: searchResults.actors,
        };
      default:
        return searchResults;
    }
  };
  
  const filteredResults = getFilteredResults();
  
  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <StatusBar barStyle="light-content" />
      
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.searchHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={textSecondary} style={styles.searchIcon} />
          
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search for movies, shows, actors..."
            placeholderTextColor={textSecondary}
            value={query}
            onChangeText={handleQueryChange}
            autoCapitalize="none"
            returnKeyType="search"
          />
          
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        {query.length > 0 && (
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleClearSearch}
          >
            <Text style={[styles.cancelText, { color: text }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primary} />
            <Text style={[styles.loadingText, { color: textSecondary }]}>
              Searching...
            </Text>
          </View>
        ) : searchResults ? (
          // Search Results
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsTitle, { color: text }]}>
                Results for "{query}"
              </Text>
              <Text style={[styles.resultsCount, { color: textSecondary }]}>
                {getTotalResultsCount()} results
              </Text>
            </View>
            
            {renderResultTabs()}
            
            {filteredResults && (
              <>
                {filteredResults.movies.length > 0 && (
                  <View style={styles.resultSection}>
                    <Text style={[styles.resultSectionTitle, { color: text }]}>Movies</Text>
                    {filteredResults.movies.map((item: Movie) => renderResultItem({ item, type: 'movie' }))}
                  </View>
                )}
                
                {filteredResults.shows.length > 0 && (
                  <View style={styles.resultSection}>
                    <Text style={[styles.resultSectionTitle, { color: text }]}>TV Shows</Text>
                    {filteredResults.shows.map((item: Show) => renderResultItem({ item, type: 'show' }))}
                  </View>
                )}
                
                {filteredResults.actors.length > 0 && (
                  <View style={styles.resultSection}>
                    <Text style={[styles.resultSectionTitle, { color: text }]}>People</Text>
                    {filteredResults.actors.map((item: Actor) => renderResultItem({ item, type: 'actor' }))}
                  </View>
                )}
                
                {getTotalResultsCount() === 0 && (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={60} color={textSecondary} />
                    <Text style={[styles.noResultsText, { color: text }]}>
                      No results found
                    </Text>
                    <Text style={[styles.noResultsSubtext, { color: textSecondary }]}>
                      Try searching with different keywords
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          // Initial search state with trending and recent searches
          <>
            {/* Trending Searches */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                Trending Searches
              </Text>
              <View style={styles.chipsContainer}>
                {trendingSearches.map((item, index) => renderSearchChip(item, index))}
              </View>
            </View>
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: text }]}>
                    Recent Searches
                  </Text>
                  <TouchableOpacity onPress={handleClearRecentSearches}>
                    <Text style={[styles.clearText, { color: primary }]}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipsContainer}>
                  {recentSearches.map((item, index) => renderSearchChip(item, index))}
                </View>
              </View>
            )}
            
            {/* Explore Categories */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: text }]}>
                Explore Categories
              </Text>
              <View style={styles.categoriesContainer}>
                {[
                  { name: 'Action', icon: 'flash-outline' },
                  { name: 'Comedy', icon: 'happy-outline' },
                  { name: 'Sci-Fi', icon: 'planet-outline' },
                  { name: 'Horror', icon: 'skull-outline' },
                  { name: 'Drama', icon: 'film-outline' },
                  { name: 'Documentary', icon: 'camera-outline' },
                ].map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoryItem, { backgroundColor: solidBackground }]}
                  >
                    <Ionicons name={category.icon as any} size={24} color={primary} />
                    <Text style={[styles.categoryName, { color: text }]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    marginLeft: 10,
    paddingHorizontal: 6,
  },
  cancelText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  clearText: {
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.15)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 48) / 3,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsCount: {
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  resultImage: {
    width: 90,
    height: 120,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  resultMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultYear: {
    fontSize: 14,
    marginRight: 12,
  },
  resultDuration: {
    fontSize: 14,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  resultKnownFor: {
    fontSize: 14,
    marginTop: 2,
  },
  actorLabel: {
    fontSize: 13,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(150,150,150,0.15)',
    alignSelf: 'flex-start',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  noResultsSubtext: {
    fontSize: 15,
  },
});