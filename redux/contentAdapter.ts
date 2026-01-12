import { Movie, Show, ContentType, CastMember, RelatedContent, Trailer, Episode } from './types';

// --- Helper: Extract string from object or return fallback ---
function extractStringFromObject(obj: any, key: string): string {
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'object' && obj && obj[key]) {
    return typeof obj[key] === 'string' ? obj[key] : String(obj[key]);
  }
  return '';
}

// --- Helper: Extract string from object or array ---
function extractStringFromObjectOrArray(data: any, key: string): string {
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && data.length > 0) {
    return extractStringFromObject(data[0], key);
  }
  if (typeof data === 'object' && data) {
    return extractStringFromObject(data, key);
  }
  return '';
}

// --- Adapter for API -> UI Movie ---
export function adaptApiMovie(apiData: any): Movie {
  // Log the raw API data structure for debugging
  console.log('🎬 [Adapter] Raw API Movie Data:', {
    id: apiData._id,
    title: apiData.title,
    hasContent: !!apiData.content,
    hasVideo: !!apiData.video,
    contentVideoPath: apiData?.content?.video?.processed?.url || 'Not found',
    videoProcessedPath: apiData?.video?.processed?.url || 'Not found',
    videoDirectPath: apiData?.video?.url || 'Not found',
    rawVideoObject: apiData.video,
    rawContentObject: apiData.content
  });
  
  // Extract video URL from nested structure: content -> video -> processed -> url
  const videoUrl = apiData?.content?.video?.processed?.url || 
                   apiData?.video?.processed?.url || 
                   apiData?.video?.url || 
                   null;
  
  console.log('🎥 [Adapter] Extracted video URL for movie:', videoUrl);
  console.log('🎥 [Adapter] Will create video object:', videoUrl ? 'YES' : 'NO');
  
  return {
    id: apiData._id,
    title: apiData.title,
    description: apiData.description,
    releaseYear: apiData.releaseDate ? new Date(apiData.releaseDate).getFullYear().toString() : '',
    rating: '', // Not present in API
    duration: apiData.duration || '120 min', // Add duration field
    genres: Array.isArray(apiData.genre) ? apiData.genre.map((g: any) => typeof g === 'string' ? g : g.name || g) : [],
    starRating: 0, // Not present in API
    thumbnailUrl: getPrimaryThumbnailUrl(apiData.thumbnails),
    coverUrl: getPrimaryThumbnailUrl(apiData.thumbnails),
    director: extractStringFromObjectOrArray(apiData.director, 'name') || 'Unknown Director',
    studio: '', // Not present in API
    cast: (apiData.cast || []).map((castItem: any, index: number) => ({
      name: extractStringFromObject(castItem, 'name') || `Cast Member ${index + 1}`,
      character: extractStringFromObject(castItem, 'role') || extractStringFromObject(castItem, 'character') || '',
      image: extractStringFromObject(castItem, 'photo') || extractStringFromObject(castItem, 'image') || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
    })),
    relatedMovies: [], // Not present in API
    relatedShows: [], // Not present in API
    isNew: false, // Not present in API
    isTrending: false, // Not present in API
    video: videoUrl ? {
      url: videoUrl,
      quality: apiData?.content?.video?.processed?.quality || 'HD',
      format: 'HLS'
    } : undefined
  };
}

// --- Adapter for API -> UI Show ---
export function adaptApiShow(apiData: any): Show {
  // Extract video URL from nested structure: content -> video -> processed -> url
  const videoUrl = apiData?.content?.video?.processed?.url || 
                   apiData?.video?.processed?.url || 
                   apiData?.video?.url || 
                   null;
  
  return {
    id: apiData._id,
    title: apiData.title,
    description: apiData.description,
    releaseYear: apiData.releaseDate ? new Date(apiData.releaseDate).getFullYear().toString() : '',
    rating: '',
    genres: Array.isArray(apiData.genre) ? apiData.genre.map((g: any) => typeof g === 'string' ? g : g.name || g) : [],
    starRating: 0,
    thumbnailUrl: getPrimaryThumbnailUrl(apiData.thumbnails),
    coverUrl: getPrimaryThumbnailUrl(apiData.thumbnails),
    director: extractStringFromObjectOrArray(apiData.director, 'name') || 'Unknown Director',
    studio: '',
    cast: (apiData.cast || []).map((castItem: any, index: number) => ({
      name: extractStringFromObject(castItem, 'name') || `Cast Member ${index + 1}`,
      character: extractStringFromObject(castItem, 'role') || extractStringFromObject(castItem, 'character') || '',
      image: extractStringFromObject(castItem, 'photo') || extractStringFromObject(castItem, 'image') || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop'
    })),
    relatedMovies: [],
    relatedShows: [],
    isNew: false,
    isTrending: false,
    isOriginal: false,
    trailers: [],
    seasons: (apiData.seasons || []).length,
    episodes: [],
    seasonDetails: [],
    creator: '',
    network: '',
    video: videoUrl ? {
      url: videoUrl,
      quality: apiData?.content?.video?.processed?.quality || 'HD',
      format: 'HLS'
    } : undefined
  };
}

// --- Helper: Get primary thumbnail URL ---
function getPrimaryThumbnailUrl(thumbnails: any[]): string {
  if (!Array.isArray(thumbnails)) return '';
  const primary = thumbnails.find((t: any) => t.is_primary);
  if (primary && primary.thumbnail && typeof primary.thumbnail === 'string') return primary.thumbnail;
  if (primary && primary.thumbnail && primary.thumbnail.url) return primary.thumbnail.url;
  // fallback to first
  const first = thumbnails[0];
  if (first && first.thumbnail && typeof first.thumbnail === 'string') return first.thumbnail;
  if (first && first.thumbnail && first.thumbnail.url) return first.thumbnail.url;
  return '';
}

// --- Adapter for ContentSection (IDs only) ---
export function adaptApiContentIdList(apiList: any[]): string[] {
  return apiList.map(item => item._id);
}

// --- Adapter for ContentGroup API to UI ContentSection ---
export function adaptApiContentGroupsToSections(apiGroups: any[]): Array<{ id: string; title: string; contentIds: string[]; type: 'standard' | 'hero' }> {
  return apiGroups.map(group => ({
    id: group._id,
    title: group.title,
    contentIds: Array.isArray(group.contents)
      ? group.contents.map((c: any) => typeof c === 'string' ? c : c._id)
      : [],
    type: group.type === 'hero' ? 'hero' : 'standard',
  }));
}
