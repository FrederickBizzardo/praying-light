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

  // Add "Catholic" to liturgical queries to get better imagery
  if (searchQuery.toLowerCase().includes('week') || searchQuery.toLowerCase().includes('easter') || searchQuery.toLowerCase().includes('lent')) {
    searchQuery = `Catholic ${searchQuery}`;
  }

  try {
    const images = await fetchImagesFromGoogle(searchQuery);
    
    if (images.length > 0) {
      console.log(`Found ${images.length} images for: ${searchQuery}`);
      return new Response(JSON.stringify({ imageUrl: images[0] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    }

    // Fallback: Try a broader query
    const simplerQuery = searchQuery.replace('Catholic ', '').includes(',') 
      ? searchQuery.split(',').slice(-1)[0].trim() 
      : 'Catholic Cross';
      
    console.log('Retrying with fallback query:', simplerQuery);
    const fallbackImages = await fetchImagesFromGoogle(simplerQuery);
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

async function fetchImagesFromGoogle(query: string): Promise<string[]> {
  const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}&safe=active`;
  
  const response = await fetch(searchLink, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/'
    },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) throw new Error(`Google Search failed: ${response.status}`);

  const html = await response.text();
  return getGoogleImages(html);
}

function getGoogleImages(googleHtml: string): string[] {
  const imageUrls: string[] = [];
  
  // 1. High-quality direct links (non-google domains)
  const highQualRegex = /"(https?:\/\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp))"/gi;
  let match;
  while ((match = highQualRegex.exec(googleHtml)) !== null) {
    const url = match[1];
    if (!url.includes('google.com') && !url.includes('gstatic.com')) {
      imageUrls.push(url);
    }
  }

  // 2. Fallback to gstatic.com thumbnails (very common on the "consent" or "lite" pages)
  if (imageUrls.length === 0) {
    const thumbRegex = /(https?:\/\/encrypted-tbn0\.gstatic\.com\/images\?q=tbn:[^"\\\s<>]+)/gi;
    while ((match = thumbRegex.exec(googleHtml)) !== null) {
      imageUrls.push(match[1]);
    }
  }

  // 3. Last resort: any img src that isn't a tracking pixel
  if (imageUrls.length === 0) {
    const anyImgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
    while ((match = anyImgRegex.exec(googleHtml)) !== null) {
      const url = match[1];
      if (!url.includes('gen_204')) {
        imageUrls.push(url);
      }
    }
  }

  return [...new Set(imageUrls)];
}