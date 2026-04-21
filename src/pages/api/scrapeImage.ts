import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  return handleImageScrape(request);
};

export const POST: APIRoute = async ({ request }) => {
  return handleImageScrape(request);
};

async function handleImageScrape(request: Request) {
  console.log('Request received at /api/scrapeImage:', request.url);

  const url = new URL(request.url);
  let searchQuery = url.searchParams.get('searchQuery');

  if (!searchQuery) {
    return new Response(JSON.stringify({ error: 'Search query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Clean up the query for better results
  let optimizedQuery = searchQuery;
  // If it's a liturgical query, try to extract the main subject (Saint or Feast)
  if (searchQuery.toLowerCase().includes('week') || searchQuery.toLowerCase().includes('easter') || searchQuery.toLowerCase().includes('lent')) {
    const saintMatch = searchQuery.match(/(Saint|St\.)\s+([^,]+)/i);
    if (saintMatch) {
      optimizedQuery = `Catholic ${saintMatch[0]}`;
    } else {
      optimizedQuery = `Catholic ${searchQuery}`;
    }
  }

  try {
    console.log(`Searching for: ${optimizedQuery}`);
    let images = await fetchImagesFromBing(optimizedQuery);
    
    if (images.length === 0 && optimizedQuery !== searchQuery) {
      console.log(`No results for optimized query, trying original: ${searchQuery}`);
      images = await fetchImagesFromBing(searchQuery);
    }

    if (images.length > 0) {
      console.log(`Found ${images.length} images for: ${optimizedQuery}`);
      return new Response(JSON.stringify({ imageUrl: images[0] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    }

    // Fallback: Try a broader query
    const simplerQuery = searchQuery.includes(',') 
      ? searchQuery.split(',').slice(-1)[0].trim() 
      : 'Catholic Cross';
      
    console.log('Retrying with fallback query:', simplerQuery);
    const fallbackImages = await fetchImagesFromBing(simplerQuery);
    if (fallbackImages.length > 0) {
      return new Response(JSON.stringify({ imageUrl: fallbackImages[0] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.warn('No images found for query:', searchQuery);
    return new Response(JSON.stringify({ error: 'No images found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error scraping image:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function fetchImagesFromBing(query: string): Promise<string[]> {
  const searchLink = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`;
  
  const response = await fetch(searchLink, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) throw new Error(`Bing Search failed: ${response.status}`);

  const html = await response.text();
  return getBingImages(html);
}

function getBingImages(html: string): string[] {
  const imageUrls: string[] = [];
  
  // Bing uses murl in m attributes for high res images, encoded with &quot;
  const murlRegex = /murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/gi;
  let match;
  while ((match = murlRegex.exec(html)) !== null) {
    imageUrls.push(match[1]);
  }

  // Fallback to simpler regex if murl fails
  if (imageUrls.length === 0) {
    const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1];
      // Filter out tracking pixels and icons
      if (!url.includes('bing.com') && !url.includes('bing.net') && !url.includes('gstatic.com') && url.length > 30) {
        imageUrls.push(url);
      }
    }
  }

  return [...new Set(imageUrls)];
}
