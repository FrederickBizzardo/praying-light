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
  const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
  
  const response = await fetch(searchLink, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    },
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) throw new Error(`Google Search failed: ${response.status}`);

  const html = await response.text();
  return getGoogleImages(html);
}

function getGoogleImages(googleHtml: string): string[] {
  const imageUrls: string[] = [];
  
  // Broadly match URLs ending in common image extensions that are NOT google-owned
  // This is more resilient than looking for specific JSON structures
  const regex = /"(https?:\/\/[^"\\ ]+?\.(?:jpg|jpeg|png|webp))"/gi;
  let match;
  while ((match = regex.exec(googleHtml)) !== null) {
    const url = match[1];
    if (!url.includes('google.com') && 
        !url.includes('gstatic.com') && 
        !url.includes('googleusercontent.com')) {
      imageUrls.push(url);
    }
  }

  // Fallback to searching for <img> tags if no script URLs found
  if (imageUrls.length === 0) {
    const imgTagRegex = /<img[^>]+src="([^">]+)"/gi;
    while ((match = imgTagRegex.exec(googleHtml)) !== null) {
      const url = match[1];
      if (url.startsWith('http') && !url.includes('google.com')) {
        imageUrls.push(url);
      }
    }
  }

  return [...new Set(imageUrls)];
}