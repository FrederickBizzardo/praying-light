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
  const searchQuery = url.searchParams.get('searchQuery');

  if (!searchQuery) {
    return new Response(JSON.stringify({ error: 'Search query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const images = await fetchImagesFromGoogle(searchQuery);
    
    if (images.length > 0) {
      return new Response(JSON.stringify({ imageUrl: images[0] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    }

    // Fallback: Try a slightly broader query if the specific one fails
    const simplerQuery = searchQuery.includes(',') ? searchQuery.split(',').slice(-1)[0].trim() : null;
    if (simplerQuery) {
      console.log('Retrying with simpler query:', simplerQuery);
      const fallbackImages = await fetchImagesFromGoogle(simplerQuery);
      if (fallbackImages.length > 0) {
        return new Response(JSON.stringify({ imageUrl: fallbackImages[0] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
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
  // Use a mobile User-Agent to get a simpler HTML structure
  // Also add safe=active to avoid filtering and try to get more direct results
  const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}&safe=active`;
  
  const response = await fetch(searchLink, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5'
    },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) throw new Error(`Google Search failed: ${response.status}`);

  const html = await response.text();
  console.log(`Fetched HTML length: ${html.length}`);
  return getGoogleImages(html);
}

function getGoogleImages(googleHtml: string): string[] {
  const imageUrls: string[] = [];
  
  // 1. Try to find the common JSON-like structure in mobile/lite results
  // Pattern: ["https://url.com/image.jpg", height, width]
  const jsonPattern = /\["(https?:\/\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp|gif))",\s*\d+,\s*\d+\]/gi;
  let match;
  while ((match = jsonPattern.exec(googleHtml)) !== null) {
    imageUrls.push(match[1]);
  }

  // 2. Try to find direct image URLs in any attribute (src, data-src, etc.)
  // We look for patterns that look like URLs ending in image extensions
  const broadPattern = /(https?:\/\/[^"\\\s<>]+?\.(?:jpg|jpeg|png|webp))/gi;
  while ((match = broadPattern.exec(googleHtml)) !== null) {
    const url = match[1];
    if (!url.includes('google.com') && 
        !url.includes('gstatic.com') && 
        !url.includes('googleusercontent.com')) {
      imageUrls.push(url);
    }
  }

  // 3. Fallback: Extract from <img> tags directly
  if (imageUrls.length === 0) {
    const imgTagPattern = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
    while ((match = imgTagPattern.exec(googleHtml)) !== null) {
      const url = match[1];
      if (!url.includes('google.com') && !url.includes('gstatic.com')) {
        imageUrls.push(url);
      }
    }
  }

  // Remove duplicates and return
  return [...new Set(imageUrls)];
}