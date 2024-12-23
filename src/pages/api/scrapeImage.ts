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
    console.warn('No search query provided');
    return new Response(JSON.stringify({ error: 'Search query is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  }

  try {
    const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
    console.log('Fetching Google Images with link:', searchLink);

    const googleResponse = await fetch(searchLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!googleResponse.ok) {
      console.error(`Google returned an error with status: ${googleResponse.status}`);
      throw new Error(`HTTP error! status: ${googleResponse.status}`);
    }

    const googleHtml = await googleResponse.text();
    const imageUrls = getGoogleImages(googleHtml);

    if (imageUrls.length > 0) {
      console.log('Images found:', imageUrls);
      return new Response(JSON.stringify({ imageUrl: imageUrls[0] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    } else {
      console.warn('No images found for query:', searchQuery);
      return new Response(JSON.stringify({ error: 'No images found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error scraping image:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function getGoogleImages(googleHtml: string): string[] {
  const imageUrls: string[] = [];
  
  // First try to find images in JSON data
  const jsonMatch = googleHtml.match(/AF_initDataCallback\({.*?data:([^\]]*\])[\s\S]*?}\);/g);
  if (jsonMatch) {
    jsonMatch.forEach(match => {
      try {
        const jsonStr = match.match(/data:([^\]]*\])/)?.[1];
        if (jsonStr) {
          const data = JSON.parse(jsonStr);
          JSON.stringify(data).match(/(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))/gi)?.forEach(url => {
            if (!url.includes('gstatic.com') && !url.includes('google.com')) {
              imageUrls.push(url);
            }
          });
        }
      } catch (e) {
        console.error('Error parsing JSON data:', e);
      }
    });
  }

  // Fallback to regular image tags if no images found in JSON
  if (imageUrls.length === 0) {
    const imgRegex = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))",[0-9]+,[0-9]+\]/g;
    let match;
    while ((match = imgRegex.exec(googleHtml)) !== null) {
      const imageUrl = match[1];
      if (!imageUrl.includes('gstatic.com') && !imageUrl.includes('google.com')) {
        imageUrls.push(imageUrl);
      }
    }
  }

  return imageUrls;
}