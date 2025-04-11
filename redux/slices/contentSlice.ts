import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Mock data - to be replaced with API calls later
import { movieData } from '../mock/movieData';
import { showData } from '../mock/showData';

export interface Movie {
  id: string;
  title: string;
  description: string;
  releaseYear: string;
  rating: string;
  duration: string;
  genres: string[];
  starRating: number;
  thumbnailUrl: string;
  coverUrl: string;
  director: string;
  studio: string;
  cast: {
    name: string;
    character: string;
    image: string;
  }[];
  relatedMovies?: {
    id: string;
    title: string;
    thumbnail: string;
  }[];
}

export interface Show {
  id: string;
  title: string;
  description: string;
  releaseYear: string;
  rating: string;
  seasons: number;
  episodes: number;
  genres: string[];
  starRating: number;
  thumbnailUrl: string;
  coverUrl: string;
  creator: string;
  network: string;
  cast: {
    name: string;
    character: string;
    image: string;
  }[];
  relatedShows?: {
    id: string;
    title: string;
    thumbnail: string;
  }[];
  seasonDetails?: {
    number: number;
    title: string;
    episodes: {
      id: string;
      number: number;
      title: string;
      duration: string;
      thumbnail: string;
      description: string;
    }[];
  }[];
}

export interface ContentSection {
  title: string;
  contentType: 'movie' | 'show' | 'mixed';
  data: any[];
}

// Define content filter types
export enum ContentFilterType {
  ALL = 'all',
  MOVIES = 'movies',
  SHOWS = 'shows',
  NEW = 'new',
  TRENDING = 'trending',
  ORIGINALS = 'originals'
}

export interface ContentState {
  movies: Record<string, Movie>;
  shows: Record<string, Show>;
  contentSections: ContentSection[];
  activeFilter: ContentFilterType;
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
}

const initialState: ContentState = {
  movies: {},
  shows: {},
  contentSections: [],
  activeFilter: ContentFilterType.ALL,
  loading: {
    movies: false,
    shows: false,
    sections: false,
  },
  error: null,
  featuredContent: null,
};

// Async thunks for data fetching with middleware pattern
// These will be replaced with actual API calls in the future

export const fetchMovie = createAsyncThunk(
  'content/fetchMovie',
  async (movieId: string, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Fetch from mock data
      const movie = movieData.find(m => m.id === movieId);
      if (!movie) {
        throw new Error('Movie not found');
      }
      return movie;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchShow = createAsyncThunk(
  'content/fetchShow',
  async (showId: string, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Fetch from mock data
      const show = showData.find((s: Show) => s.id === showId);
      if (!show) {
        throw new Error('Show not found');
      }
      
      // Map the "seasons" array to "seasonDetails" to avoid conflicts
      // with the numeric "seasons" property
      // Ensure seasons is an array for safety
      const showWithSeasonDetails = {
        ...show,
        seasonDetails: Array.isArray(show.seasons) ? show.seasons : [],
      };
      
      console.log('Show with seasons:', showWithSeasonDetails.title, 'Seasons:', showWithSeasonDetails.seasonDetails?.length || 0);
      
      // Return a properly structured show object
      return showWithSeasonDetails;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchContentSections = createAsyncThunk(
  'content/fetchContentSections',
  async (filterType: ContentFilterType, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let sections: ContentSection[] = [];
      
      // Generate content sections based on filter type
      switch (filterType) {
        case ContentFilterType.ALL:
          sections = [
            {
              title: 'Trending Now',
              contentType: 'mixed',
              data: [...movieData.slice(0, 5), ...showData.slice(0, 5)]
            },
            {
              title: 'Popular Movies',
              contentType: 'movie',
              data: movieData.slice(0, 10)
            },
            {
              title: 'Popular Shows',
              contentType: 'show',
              data: showData.slice(0, 10)
            },
          ];
          break;
        case ContentFilterType.MOVIES:
          sections = [
            {
              title: 'New Releases',
              contentType: 'movie',
              data: movieData.slice(0, 10)
            },
            {
              title: 'Action Movies',
              contentType: 'movie',
              data: movieData.filter((m: Movie) => m.genres.includes('Action')).slice(0, 10)
            },
            {
              title: 'Sci-Fi Adventures',
              contentType: 'movie',
              data: movieData.filter((m: Movie) => m.genres.includes('Sci-Fi')).slice(0, 10)
            },
          ];
          break;
        case ContentFilterType.SHOWS:
          sections = [
            {
              title: 'Top TV Shows',
              contentType: 'show',
              data: showData.slice(0, 10)
            },
            {
              title: 'Drama Series',
              contentType: 'show',
              data: showData.filter((s: Show) => s.genres.includes('Drama')).slice(0, 10)
            },
            {
              title: 'Comedy Series',
              contentType: 'show',
              data: showData.filter((s: Show) => s.genres.includes('Comedy')).slice(0, 10)
            },
          ];
          break;
        case ContentFilterType.NEW:
          sections = [
            {
              title: 'New Arrivals',
              contentType: 'mixed',
              data: [...movieData.slice(0, 5), ...showData.slice(0, 5)]
            },
            {
              title: 'Just Added Movies',
              contentType: 'movie',
              data: movieData.slice(0, 10)
            },
            {
              title: 'Fresh TV Episodes',
              contentType: 'show',
              data: showData.slice(0, 10)
            },
          ];
          break;
        case ContentFilterType.TRENDING:
          sections = [
            {
              title: 'Trending This Week',
              contentType: 'mixed',
              data: [...movieData.slice(5, 10), ...showData.slice(5, 10)]
            },
            {
              title: 'Viral Movies',
              contentType: 'movie',
              data: movieData.slice(10, 20)
            },
            {
              title: 'Buzzworthy Shows',
              contentType: 'show',
              data: showData.slice(10, 20)
            },
          ];
          break;
        case ContentFilterType.ORIGINALS:
          sections = [
            {
              title: 'Rangbaj Originals',
              contentType: 'mixed',
              data: [...movieData.filter((m: Movie) => m.studio === 'Rangbaj Studios'), 
                     ...showData.filter((s: Show) => s.network === 'Rangbaj Network')]
            },
            {
              title: 'Award-Winning Originals',
              contentType: 'mixed',
              data: [...movieData.filter((m: Movie) => m.starRating >= 4.5).slice(0, 5),
                     ...showData.filter((s: Show) => s.starRating >= 4.5).slice(0, 5)]
            },
          ];
          break;
      }
      
      return sections;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchFeaturedContent = createAsyncThunk(
  'content/fetchFeaturedContent',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Randomly select a movie or show as featured content
      const isMovie = Math.random() > 0.5;
      
      if (isMovie) {
        const randomIndex = Math.floor(Math.random() * movieData.length);
        return {
          id: movieData[randomIndex].id,
          type: 'movie' as const
        };
      } else {
        const randomIndex = Math.floor(Math.random() * showData.length);
        return {
          id: showData[randomIndex].id,
          type: 'show' as const
        };
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setActiveFilter: (state, action: PayloadAction<ContentFilterType>) => {
      state.activeFilter = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchMovie
      .addCase(fetchMovie.pending, (state) => {
        state.loading.movies = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.loading.movies = false;
        // Add movie to state with ID as key
        state.movies[action.payload.id] = action.payload;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.loading.movies = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchShow
      .addCase(fetchShow.pending, (state) => {
        state.loading.shows = true;
        state.error = null;
      })
      .addCase(fetchShow.fulfilled, (state, action) => {
        state.loading.shows = false;
        // Add show to state with ID as key
        state.shows[action.payload.id] = action.payload;
      })
      .addCase(fetchShow.rejected, (state, action) => {
        state.loading.shows = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchContentSections
      .addCase(fetchContentSections.pending, (state) => {
        state.loading.sections = true;
        state.error = null;
      })
      .addCase(fetchContentSections.fulfilled, (state, action) => {
        state.loading.sections = false;
        state.contentSections = action.payload;
      })
      .addCase(fetchContentSections.rejected, (state, action) => {
        state.loading.sections = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchFeaturedContent
      .addCase(fetchFeaturedContent.fulfilled, (state, action) => {
        state.featuredContent = action.payload;
      });
  },
});

export const { setActiveFilter, clearErrors } = contentSlice.actions;

// Selectors
export const selectMovieById = (state: RootState, movieId: string) => state.content.movies[movieId];
export const selectShowById = (state: RootState, showId: string) => state.content.shows[showId];
export const selectContentSections = (state: RootState) => state.content.contentSections;
export const selectActiveFilter = (state: RootState) => state.content.activeFilter;
export const selectIsLoading = (state: RootState) => state.content.loading;
export const selectError = (state: RootState) => state.content.error;
export const selectFeaturedContent = (state: RootState) => state.content.featuredContent;

export default contentSlice.reducer;
