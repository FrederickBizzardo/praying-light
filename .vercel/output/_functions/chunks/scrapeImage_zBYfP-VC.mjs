const GET = async ({ request }) => {
  return handleImageScrape(request);
};
const POST = async ({ request }) => {
  return handleImageScrape(request);
};
async function handleImageScrape(request) {
  console.log("Request received at /api/scrapeImage:", request.url);
  const url = new URL(request.url);
  let searchQuery = url.searchParams.get("searchQuery");
  if (!searchQuery) {
    return new Response(JSON.stringify({ error: "Search query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let optimizedQuery = searchQuery;
  if (searchQuery.toLowerCase().includes("week") || searchQuery.toLowerCase().includes("easter") || searchQuery.toLowerCase().includes("lent")) {
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
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }
    const simplerQuery = searchQuery.includes(",") ? searchQuery.split(",").slice(-1)[0].trim() : "Catholic Cross";
    console.log("Retrying with fallback query:", simplerQuery);
    const fallbackImages = await fetchImagesFromBing(simplerQuery);
    if (fallbackImages.length > 0) {
      return new Response(JSON.stringify({ imageUrl: fallbackImages[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.warn("No images found for query:", searchQuery);
    return new Response(JSON.stringify({ error: "No images found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error scraping image:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: "Failed to scrape image", details: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
async function fetchImagesFromBing(query) {
  const searchLink = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`;
  const response = await fetch(searchLink, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    }
  });
  if (!response.ok) throw new Error(`Bing Search failed: ${response.status}`);
  const html = await response.text();
  return getBingImages(html);
}
function getBingImages(html) {
  const imageUrls = [];
  const murlRegex = /murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/gi;
  let match;
  while ((match = murlRegex.exec(html)) !== null) {
    imageUrls.push(match[1]);
  }
  if (imageUrls.length === 0) {
    const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1];
      if (!url.includes("bing.com") && !url.includes("bing.net") && !url.includes("gstatic.com") && url.length > 30) {
        imageUrls.push(url);
      }
    }
  }
  return [...new Set(imageUrls)];
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
