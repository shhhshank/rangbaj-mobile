/**
 * Types for Redux store and related components
 */

// Content Types
export type ContentType = 'movie' | 'show';

// Cast member structure
export interface CastMember {
  name: string;
  character: string;
  image: string;
}

// Related content structure
export interface RelatedContent {
  id: string;
  title: string;
  thumbnail: string;
}

// Trailer structure
export interface Trailer {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  releaseDate?: string;
  description?: string;
}

// Episode structure
export interface Episode {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  trailer?: Trailer;
}

// Base content interface for shared properties
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  releaseYear: string;
  rating: string;
  genres: string[];
  starRating: number;
  thumbnailUrl: string;
  coverUrl: string;
  director: string;
  studio: string;
  cast: CastMember[];
  relatedMovies?: RelatedContent[];
  relatedShows?: RelatedContent[];
  isNew?: boolean;
  isTrending?: boolean;
  isOriginal?: boolean;
  trailers?: Trailer[];
}

// Movie specific interface
export interface Movie extends BaseContent {
  duration: string;
}

// Show specific interface
export interface Show extends BaseContent {
  seasons: number;
  episodes: Episode[];
  seasonDetails?: {
    number: number;
    title: string;
    episodes: Episode[];
  }[];
  creator?: string;
  network?: string;
}

// Content state structure
export interface ContentState {
  movies: { [key: string]: Movie };
  shows: { [key: string]: Show };
  trailers: { [key: string]: Trailer };
  loading: {
    movies: boolean;
    shows: boolean;
    content: boolean;
    trailers: boolean;
  };
  error: string | null;
  contentSections: {
    [key in ContentType]: ContentSection[];
  };
  filteredContent: {
    [key: string]: (Movie | Show)[];
  };
  featuredTrailers: Trailer[];
}

// Content section for homepage
export interface ContentSection {
  id: string;
  title: string;
  type: ContentType;
  data: RelatedContent[];
}

// Filter category
export interface FilterCategory {
  id: string;
  name: string;
  type: 'all' | 'movie' | 'show' | 'new' | 'trending' | 'original';
}

// Root state type for useSelector
export interface RootState {
  content: ContentState;
}
