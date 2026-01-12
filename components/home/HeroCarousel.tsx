import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  FlatList,
  ViewToken
} from 'react-native';
import HeroBanner, { FeaturedContent } from './HeroBanner';

interface HeroCarouselProps {
  heroContent: FeaturedContent[];
  onInfoPress: (id: string, type: 'movie' | 'show') => void;
  isVisible?: boolean;
  onVideoEnd?: (currentIndex: number) => void;
}

const { width } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(width * 9 / 16);

const HeroCarousel = ({ heroContent, onInfoPress, isVisible = true, onVideoEnd }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollEnabled = useRef(true);

  // Handle viewable items change
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
      console.log(`🎠 [HeroCarousel] Active slide: ${viewableItems[0].index}`);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Item is considered visible when 50% is visible
  }).current;

  // Handle video end - scroll to next slide
  const handleVideoEnd = () => {
    if (!isVisible || heroContent.length <= 1 || !autoScrollEnabled.current) return;

    console.log('🎬 [HeroCarousel] Video ended, moving to next slide');
    
    setActiveIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % heroContent.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      return nextIndex;
    });
  };

  // Disable auto-scroll when user manually swipes
  const handleScrollBeginDrag = () => {
    autoScrollEnabled.current = false;
    console.log('👆 [HeroCarousel] User swiped, disabling auto-scroll');
  };

  // Re-enable auto-scroll after a delay
  const handleScrollEndDrag = () => {
    setTimeout(() => {
      autoScrollEnabled.current = true;
      console.log('✅ [HeroCarousel] Auto-scroll re-enabled');
    }, 3000); // Re-enable after 3 seconds
  };

  const renderItem = ({ item, index }: { item: FeaturedContent; index: number }) => {
    // Only the active slide should have video playing
    const isActive = index === activeIndex;
    
    return (
      <View style={styles.slide}>
        <HeroBanner
          featured={item}
          onInfoPress={onInfoPress}
          isVisible={isVisible && isActive} // Only active slide plays video
          onVideoEnd={isActive ? handleVideoEnd : undefined} // Only active slide triggers next
        />
      </View>
    );
  };

  // Pagination removed as per user request

  if (heroContent.length === 0) {
    return null;
  }

  // If only one item, render single HeroBanner without carousel
  if (heroContent.length === 1) {
    return (
      <HeroBanner
        featured={heroContent[0]}
        onInfoPress={onInfoPress}
        isVisible={isVisible}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={heroContent}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="center"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: HERO_HEIGHT,
    position: 'relative',
  },
  slide: {
    width: width,
    height: HERO_HEIGHT,
  },
  // Pagination styles removed
});

export default HeroCarousel;
