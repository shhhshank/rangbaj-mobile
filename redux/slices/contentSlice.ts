import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Movie, Show, Trailer, ContentType } from '../types';

import axios from 'axios';
import { adaptApiMovie, adaptApiShow, adaptApiContentIdList } from '../contentAdapter';

// API endpoints
const CONTENT_LIST_URL = 'http://185.193.19.10:8000/content/get';
const CONTENT_DETAIL_URL = 'http://185.193.19.10:8000/content/getOne';

// --- Thunk: Fetch all content IDs ---
export const fetchAllContentIds = createAsyncThunk<string[], void, { rejectValue: string, state: RootState }>(
  'content/fetchAllContentIds',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('🌐 [API] Fetching all content IDs from:', CONTENT_LIST_URL);
      const token = getState().auth.token;
      console.log('🔑 [API] Using auth token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(CONTENT_LIST_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('✅ [API] Content IDs response:', {
        status: response.status,
        dataStructure: {
          hasData: !!response.data,
          hasDataData: !!response.data?.data,
          hasContents: !!response.data?.data?.contents,
          contentsIsArray: Array.isArray(response.data?.data?.contents),
          contentsLength: response.data?.data?.contents?.length || 0
        }
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data.contents)) {
        const adaptedIds = adaptApiContentIdList(response.data.data.contents);
        console.log('📈 [API] Adapted content IDs:', { count: adaptedIds.length, sample: adaptedIds.slice(0, 3) });
        return adaptedIds;
      }
      console.log('❌ [API] Invalid response structure for content IDs');
      return rejectWithValue('Invalid response');
    } catch (err: any) {
      console.error('❌ [API] Content IDs fetch error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      return rejectWithValue(err.response?.data?.message || err.message || 'Network error');
    }
  }
);

// --- Thunk: Fetch content detail by ID ---
export const fetchContentById = createAsyncThunk<any, string, { rejectValue: string, state: RootState }>(
  'content/fetchContentById',
  async (contentId, { getState, rejectWithValue }) => {
    try {
      console.log(`🌐 [API] Fetching content details for ID: ${contentId}`);
      const token = getState().auth.token;
      const url = `${CONTENT_DETAIL_URL}?content_id=${contentId}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log(`✅ [API] Content detail response for ${contentId}:`, {
        status: response.status,
        hasContent: !!response.data?.data?.content,
        contentType: response.data?.data?.content?.contentType
      });
      
      if (response.data && response.data.data && response.data.data.content) {
        const apiContent = response.data.data.content;
        // Use type to decide
        if (apiContent.contentType === 'movie') {
          const adaptedMovie = adaptApiMovie(apiContent);
          console.log(`🎬 [API] Adapted movie:`, { id: adaptedMovie.id, title: adaptedMovie.title });
          return { type: 'movie', data: adaptedMovie };
        } else {
          const adaptedShow = adaptApiShow(apiContent);
          console.log(`📺 [API] Adapted show:`, { id: adaptedShow.id, title: adaptedShow.title });
          return { type: 'show', data: adaptedShow };
        }
      }
      console.log(`❌ [API] Invalid response structure for content ${contentId}`);
      return rejectWithValue('Invalid response');
    } catch (err: any) {
      console.error(`❌ [API] Content detail fetch error for ${contentId}:`, {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      return rejectWithValue(err.response?.data?.message || err.message || 'Network error');
    }
  }
);

// --- Thunk: Fetch movie by ID (with fallback to mock data) ---
export const fetchMovie = createAsyncThunk<Movie, string, { rejectValue: string, state: RootState }>(
  'content/fetchMovie',
  async (movieId, { getState, dispatch, rejectWithValue }) => {
    try {
      console.log(`🎬 [API] Fetching movie details for ID: ${movieId}`);
      
      // Check if movie already exists in store
      const state = getState();
      const existingMovie = state.content.movies[movieId];
      if (existingMovie) {
        console.log(`✅ [CACHE] Movie ${movieId} found in store:`, { title: existingMovie.title });
        return existingMovie;
      }
      
      // Try to fetch from API first
      const result = await dispatch(fetchContentById(movieId));
      if (fetchContentById.fulfilled.match(result) && result.payload.type === 'movie') {
        console.log(`✅ [API] Movie fetched successfully:`, { id: result.payload.data.id, title: result.payload.data.title });
        return result.payload.data;
      }
      
      // Fallback to mock data
      console.log(`🔄 [FALLBACK] API failed, using mock data for movie ${movieId}`);
      const { movieData } = await import('../mock/movieData');
      const mockMovie = movieData.find(m => m.id === movieId);
      
      if (mockMovie) {
        console.log(`✅ [MOCK] Found mock movie:`, { id: mockMovie.id, title: mockMovie.title });
        return mockMovie;
      }
      
      // If no mock data either, return a generic movie
      console.log(`⚠️ [FALLBACK] No mock data found, creating generic movie for ID: ${movieId}`);
      return {
        id: movieId,
        title: 'Movie Title',
        description: 'Movie description not available.',
        releaseYear: '2024',
        rating: 'PG-13',
        duration: '2h 00m',
        genres: ['Drama'],
        starRating: 4.0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
        director: 'Unknown Director',
        studio: 'Rangbaj Studios',
        cast: [
          { name: 'Actor 1', character: 'Character 1', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' },
          { name: 'Actor 2', character: 'Character 2', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' }
        ],
        relatedMovies: [],
        isNew: false,
        isTrending: false,
        isOriginal: false,
        trailers: []
      };
    } catch (err: any) {
      console.error(`❌ [ERROR] Failed to fetch movie ${movieId}:`, err.message);
      return rejectWithValue(err.message || 'Failed to fetch movie');
    }
  }
);

// --- Thunk: Fetch show by ID (with fallback to mock data) ---
export const fetchShow = createAsyncThunk<Show, string, { rejectValue: string, state: RootState }>(
  'content/fetchShow',
  async (showId, { getState, dispatch, rejectWithValue }) => {
    try {
      console.log(`📺 [API] Fetching show details for ID: ${showId}`);
      
      // Check if show already exists in store
      const state = getState();
      const existingShow = state.content.shows[showId];
      if (existingShow) {
        console.log(`✅ [CACHE] Show ${showId} found in store:`, { title: existingShow.title });
        return existingShow;
      }
      
      // Try to fetch from API first
      const result = await dispatch(fetchContentById(showId));
      if (fetchContentById.fulfilled.match(result) && result.payload.type === 'show') {
        console.log(`✅ [API] Show fetched successfully:`, { id: result.payload.data.id, title: result.payload.data.title });
        return result.payload.data;
      }
      
      // Fallback to mock data
      console.log(`🔄 [FALLBACK] API failed, using mock data for show ${showId}`);
      const { showData } = await import('../mock/showData');
      const mockShow = showData.find(s => s.id === showId);
      
      if (mockShow) {
        console.log(`✅ [MOCK] Found mock show:`, { id: mockShow.id, title: mockShow.title });
        return mockShow;
      }
      
      // If no mock data either, return a generic show
      console.log(`⚠️ [FALLBACK] No mock data found, creating generic show for ID: ${showId}`);
      return {
        id: showId,
        title: 'Show Title',
        description: 'Show description not available.',
        releaseYear: '2024',
        rating: 'TV-14',
        genres: ['Drama'],
        starRating: 4.0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop',
        director: 'Unknown Director',
        studio: 'Rangbaj Studios',
        cast: [
          { name: 'Actor 1', character: 'Character 1', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop' },
          { name: 'Actor 2', character: 'Character 2', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop' }
        ],
        relatedShows: [],
        isNew: false,
        isTrending: false,
        isOriginal: false,
        trailers: [],
        seasons: 1,
        episodes: [],
        seasonDetails: [],
        creator: 'Unknown Creator',
        network: 'Rangbaj Network'
      };
    } catch (err: any) {
      console.error(`❌ [ERROR] Failed to fetch show ${showId}:`, err.message);
      return rejectWithValue(err.message || 'Failed to fetch show');
    }
  }
);

// --- Thunk: Fetch content groups/sections from API ---
import { adaptApiContentGroupsToSections } from '../contentAdapter';
export const fetchContentSections = createAsyncThunk<
  ContentSectionLite[],
  void,
  { rejectValue: string; state: RootState }
>(
  'content/fetchContentSections',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('🌐 [API] Fetching content sections/groups...');
      const token = getState().auth.accessToken;
      const url = 'http://185.193.19.10:8000/contentGroup/get';
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('✅ [API] Content sections response:', { status: response.status, dataStructure: { hasData: !!response.data, hasDataData: !!response.data?.data, hasContentGroups: !!response.data?.data?.contentGroups, groupsIsArray: Array.isArray(response.data?.data?.contentGroups), groupsCount: response.data?.data?.contentGroups?.length || 0 } });
      
      // Log the raw API response structure to debug (reduced logging)
      console.log('🔍 [API] Raw contentGroups structure:', {
        groupsCount: response.data?.data?.contentGroups?.length || 0,
        firstGroupSample: response.data?.data?.contentGroups?.[0] ? {
          id: response.data.data.contentGroups[0]._id,
          title: response.data.data.contentGroups[0].title,
          contentsCount: response.data.data.contentGroups[0].contents?.length || 0,
          contentsIsArray: Array.isArray(response.data.data.contentGroups[0].contents)
        } : null
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data.contentGroups)) {
        const adaptedSections = adaptApiContentGroupsToSections(response.data.data.contentGroups);
        console.log('📈 [API] Adapted content sections:', {
          count: adaptedSections.length,
          sections: adaptedSections.map(s => ({ id: s.id, title: s.title, contentIdsCount: s.contentIds.length }))
        });
        return adaptedSections;
      }
      console.log('❌ [API] Invalid response structure for content sections');
      return rejectWithValue('Invalid response from contentGroup API');
    } catch (err: any) {
      console.error('❌ [API] Content sections fetch error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      return rejectWithValue(err.response?.data?.message || err.message || 'Network error');
    }
  }
);

// Keep trailersData for now for UI compatibility
const trailersData: Trailer[] = [
  {
    id: '301',
    title: 'Stellar Odyssey - Official Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: '2:15',
    description: 'The fate of the galaxy rests in the hands of unlikely heroes. Watch the official trailer for Stellar Odyssey.',
    releaseDate: '2024-12-15'
  },
  {
    id: '302',
    title: 'Dark Matter - Season 2 Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518544865063-3ddfd548df3a?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    duration: '1:48',
    description: 'The journey continues as our heroes face their greatest challenges yet.',
    releaseDate: '2024-09-22'
  },
  {
    id: '303',
    title: 'Quantum Resonance - Teaser',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506272517965-ec6133efee7a?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '0:45',
    description: 'When reality breaks down, who can you trust? Coming this fall.',
    releaseDate: '2024-10-05'
  },
  {
    id: '304',
    title: 'Galactic Horizon - Final Trailer',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539717239864-491093663ae9?w=400&auto=format&fit=crop',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '2:30',
    description: 'The epic conclusion to the space saga that captivated audiences worldwide.',
    releaseDate: '2024-11-18'
  }
];

export interface ContentSectionLite {
  id: string;
  title: string;
  contentIds: string[];
  type: 'standard' | 'hero';
}

export interface ContentState {
  movies: Record<string, Movie>;
  shows: Record<string, Show>;
  contentSections: ContentSectionLite[];
  heroSection: ContentSectionLite | null;
  allContentIds: string[];
  activeFilter: string;
  loading: {
    movies: boolean;
    shows: boolean;
    sections: boolean;
  };
  error: string | null;
  featuredContent: {
    id: string;
    type: 'movie' | 'show';
  } | null;
  sectionsFetched: boolean; // Track if sections API was attempted
}


const initialState: ContentState = {
  movies: {},
  shows: {},
  contentSections: [],
  heroSection: null,
  allContentIds: [],
  activeFilter: 'all',
  loading: {
    movies: false,
    shows: false,
    sections: false,
  },
  error: null,
  featuredContent: null,
  sectionsFetched: false,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveFilter: (state: ContentState, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    clearErrors: (state: ContentState) => {
      state.error = null;
    },
    clearAllContent: (state: ContentState) => {
      // Reset content state to initial values on app start
      state.movies = {};
      state.shows = {};
      state.contentSections = [];
      state.heroSection = null;
      state.allContentIds = [];
      state.sectionsFetched = false;
      state.loading = {
        movies: false,
        shows: false,
        sections: false,
      };
      state.error = null;
      state.featuredContent = null;
      console.log('🧹 [REDUX] Content state cleared for fresh data loading');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllContentIds
      .addCase(fetchAllContentIds.pending, (state: ContentState) => {
        state.loading.movies = true;
        state.error = null;
      })
      .addCase(fetchAllContentIds.fulfilled, (state: ContentState, action: PayloadAction<string[]>) => {
        state.loading.movies = false;
        state.allContentIds = action.payload;
      })
      .addCase(fetchAllContentIds.rejected, (state: ContentState, action: PayloadAction<string | undefined>) => {
        state.loading.movies = false;
        state.error = action.payload || null;
      })
      // Handle fetchContentById
      .addCase(fetchContentById.fulfilled, (state: ContentState, action: PayloadAction<any>) => {
        if (action.payload.type === 'movie') {
          state.movies[action.payload.data.id] = action.payload.data;
        } else if (action.payload.type === 'show') {
          state.shows[action.payload.data.id] = action.payload.data;
        }
      })
      // Handle fetchMovie
      .addCase(fetchMovie.pending, (state: ContentState) => {
        state.loading.movies = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state: ContentState, action: PayloadAction<Movie>) => {
        state.loading.movies = false;
        state.movies[action.payload.id] = action.payload;
        console.log(`✅ [REDUX] Movie stored in state:`, { id: action.payload.id, title: action.payload.title });
      })
      .addCase(fetchMovie.rejected, (state: ContentState, action: PayloadAction<string | undefined>) => {
        state.loading.movies = false;
        state.error = action.payload || null;
        console.error(`❌ [REDUX] Movie fetch failed:`, action.payload);
      })
      // Handle fetchShow
      .addCase(fetchShow.pending, (state: ContentState) => {
        state.loading.shows = true;
        state.error = null;
      })
      .addCase(fetchShow.fulfilled, (state: ContentState, action: PayloadAction<Show>) => {
        state.loading.shows = false;
        state.shows[action.payload.id] = action.payload;
        console.log(`✅ [REDUX] Show stored in state:`, { id: action.payload.id, title: action.payload.title });
      })
      .addCase(fetchShow.rejected, (state: ContentState, action: PayloadAction<string | undefined>) => {
        state.loading.shows = false;
        state.error = action.payload || null;
        console.error(`❌ [REDUX] Show fetch failed:`, action.payload);
      })
      // Handle fetchContentSections
      .addCase(fetchContentSections.pending, (state: ContentState) => {
        state.loading.sections = true;
        state.error = null;
        state.sectionsFetched = true;
      })
      .addCase(fetchContentSections.fulfilled, (state: ContentState, action: PayloadAction<ContentSectionLite[]>) => {
        state.loading.sections = false;
        
        // Separate hero and standard sections
        const heroSections = action.payload.filter(s => s.type === 'hero');
        const standardSections = action.payload.filter(s => s.type === 'standard');
        
        // Store hero section (should only be one)
        state.heroSection = heroSections.length > 0 ? heroSections[0] : null;
        
        // Store standard sections
        state.contentSections = standardSections;
        
        console.log('🎯 [REDUX] Content sections stored in state:', {
          heroSection: state.heroSection ? { id: state.heroSection.id, title: state.heroSection.title, contentIdsCount: state.heroSection.contentIds.length } : null,
          standardSectionsCount: standardSections.length,
          sections: standardSections.map(s => ({ id: s.id, title: s.title, contentIdsCount: s.contentIds.length }))
        });
      })
      .addCase(fetchContentSections.rejected, (state: ContentState, action: PayloadAction<string | undefined>) => {
        state.loading.sections = false;
        state.error = action.payload || null;
        console.error('❌ [REDUX] Content sections fetch failed:', action.payload);
        
        // Fallback: Create hardcoded sections using available content
        const movieIds = Object.keys(state.movies);
        const showIds = Object.keys(state.shows);
        const allIds = [...movieIds, ...showIds];
        
        if (allIds.length > 0) {
          console.log('🔄 [REDUX] Creating fallback sections with available content');
          state.contentSections = [
            {
              id: 'trending-now',
              title: 'Trending Now',
              contentIds: allIds.slice(0, Math.min(6, allIds.length)),
              type: 'standard' as const
            },
            {
              id: 'popular-movies',
              title: 'Popular Movies',
              contentIds: movieIds.slice(0, Math.min(6, movieIds.length)),
              type: 'standard' as const
            },
            {
              id: 'popular-shows',
              title: 'Popular Shows',
              contentIds: showIds.slice(0, Math.min(6, showIds.length)),
              type: 'standard' as const
            }
          ].filter(section => section.contentIds.length > 0);
        }
      });
  },
});

export const { setActiveFilter, clearErrors, clearAllContent } = contentSlice.actions;

// Selectors
export const selectAllContentIds = (state: RootState) => (state.content as ContentState).allContentIds;

export const selectMovieById = (state: RootState, movieId: string) => (state.content as ContentState).movies[movieId];
export const selectShowById = (state: RootState, showId: string) => (state.content as ContentState).shows[showId];

import { createSelector } from '@reduxjs/toolkit';

// Memoized selector: Returns UI-ready sections with full content objects
export const selectContentSections = createSelector(
  [
    (state: RootState) => (state.content as ContentState).contentSections,
    (state: RootState) => (state.content as ContentState).movies,
    (state: RootState) => (state.content as ContentState).shows,
  ],
  (contentSections, movies, shows) => {
    console.log('🔍 [SELECTOR] selectContentSections called with:', {
      contentSectionsCount: contentSections?.length || 0,
      moviesCount: Object.keys(movies || {}).length,
      showsCount: Object.keys(shows || {}).length,
      contentSections: contentSections?.map(s => ({ id: s.id, title: s.title, contentIdsCount: s.contentIds?.length || 0 })) || []
    });
    
    const result = (contentSections || []).map((section) => {
      const mappedContents = (section.contentIds || []).map((cid: string) => {
        const content = movies[cid] || shows[cid];
        if (!content) {
          console.log(`⚠️ [SELECTOR] Content ID ${cid} not found in movies or shows`);
        }
        return content;
      }).filter(Boolean);
      
      console.log(`📋 [SELECTOR] Section "${section.title}" mapped:`, {
        originalContentIds: section.contentIds?.length || 0,
        mappedContents: mappedContents.length,
        contentTitles: mappedContents.map(c => c.title).slice(0, 3)
      });
      
      return {
        id: section.id,
        title: section.title,
        contents: mappedContents,
      };
    });
    
    console.log('✅ [SELECTOR] selectContentSections result:', {
      sectionsCount: result.length,
      totalContents: result.reduce((sum, s) => sum + s.contents.length, 0)
    });
    
    return result;
  }
);

export const selectActiveFilter = (state: RootState) => state.content.activeFilter;
export const selectIsLoading = (state: RootState) => state.content.loading;
export const selectError = (state: RootState) => state.content.error;
export const selectFeaturedContent = (state: RootState) => state.content.featuredContent;

// Selector for ALL hero section content (for carousel)
export const selectAllHeroContent = createSelector(
  [
    (state: RootState) => (state.content as ContentState).heroSection,
    (state: RootState) => (state.content as ContentState).movies,
    (state: RootState) => (state.content as ContentState).shows,
  ],
  (heroSection, movies, shows) => {
    if (!heroSection || !heroSection.contentIds || heroSection.contentIds.length === 0) {
      console.log('⚠️ [SELECTOR] No hero section available');
      return [];
    }
    
    console.log('🎠 [SELECTOR] selectAllHeroContent called with:', {
      heroSectionId: heroSection.id,
      heroSectionTitle: heroSection.title,
      contentIdsCount: heroSection.contentIds.length,
      moviesCount: Object.keys(movies || {}).length,
      showsCount: Object.keys(shows || {}).length,
    });
    
    // Map all content IDs to full content objects
    const allHeroContent = heroSection.contentIds
      .map(id => movies[id] || shows[id])
      .filter(content => content !== undefined);
    
    console.log('✅ [SELECTOR] All hero content found:', {
      totalItems: allHeroContent.length,
      itemsWithVideo: allHeroContent.filter(c => c.video).length,
      titles: allHeroContent.map(c => c.title)
    });
    
    return allHeroContent;
  }
);

// Selector for hero section with full content objects (single item - for backward compatibility)
export const selectHeroContent = createSelector(
  [
    (state: RootState) => (state.content as ContentState).heroSection,
    (state: RootState) => (state.content as ContentState).movies,
    (state: RootState) => (state.content as ContentState).shows,
  ],
  (heroSection, movies, shows) => {
    if (!heroSection || !heroSection.contentIds || heroSection.contentIds.length === 0) {
      console.log('⚠️ [SELECTOR] No hero section available');
      return null;
    }
    
    console.log('🦸 [SELECTOR] selectHeroContent called with:', {
      heroSectionId: heroSection.id,
      heroSectionTitle: heroSection.title,
      contentIdsCount: heroSection.contentIds.length,
      moviesCount: Object.keys(movies || {}).length,
      showsCount: Object.keys(shows || {}).length,
    });
    
    // Try to get the first content item from hero section
    const heroContentId = heroSection.contentIds[0];
    let content = movies[heroContentId] || shows[heroContentId];
    
    // FALLBACK: If hero content has no video, find first content WITH video
    if (content && !content.video) {
      console.log(`⚠️ [SELECTOR] Hero content "${content.title}" has no video, searching for fallback...`);
      
      // Search through all content for one with a video
      const allContent = [...Object.values(movies), ...Object.values(shows)];
      const contentWithVideo = allContent.find(c => c.video && c.video.url);
      
      if (contentWithVideo) {
        console.log(`✅ [SELECTOR] Using fallback hero content: "${contentWithVideo.title}" (has video)`);
        content = contentWithVideo;
      } else {
        console.log(`⚠️ [SELECTOR] No content with video found, using original hero content`);
      }
    }
    
    if (!content) {
      console.log(`⚠️ [SELECTOR] Hero content ID ${heroContentId} not found in movies or shows`);
      return null;
    }
    
    console.log('✅ [SELECTOR] Hero content found:', { 
      id: content.id, 
      title: content.title,
      hasVideo: !!content.video,
      videoUrl: content.video?.url || 'No video'
    });
    
    return content;
  }
);

export default contentSlice.reducer;
