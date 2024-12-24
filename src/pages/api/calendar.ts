import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return handleCalendarRequest();
};

async function handleCalendarRequest() {
  console.log('Request received at /api/calendar');

  try {
    // Use corsproxy.io to proxy the request
    const proxyUrl = "https://corsproxy.io/?";
    const targetUrl = "http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today";
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      console.error(`Calendar API returned status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched calendar data');

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      },
    });
  } catch (error) {
    console.error('Calendar API error:', error);
  
    const err = error as Error;
  
    if (err instanceof TypeError && err.message.includes('fetch failed')) {
      return new Response(JSON.stringify({ 
        error: 'Unable to connect to calendar service', 
        details: 'Service may be temporarily unavailable'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        },
      });
    }
  
    if (err.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        error: 'Request timeout', 
        details: 'Calendar service took too long to respond'
      }), {
        status: 504,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '30'
        },
      });
    }
  
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch calendar data',
      details: err.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
    });
  }
}