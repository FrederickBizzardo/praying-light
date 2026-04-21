const GET = async () => {
  return handleCalendarRequest();
};
async function handleCalendarRequest() {
  console.log("Request received at /api/calendar");
  try {
    const targetUrl = "http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today";
    const response = await fetch(targetUrl);
    if (!response.ok) {
      console.error(`Calendar API returned status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Successfully fetched calendar data");
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : "UnknownError";
    if (errorMessage.includes("fetch failed")) {
      return new Response(JSON.stringify({
        error: "Unable to connect to calendar service",
        details: "Service may be temporarily unavailable"
      }), {
        status: 503,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    if (errorName === "AbortError") {
      return new Response(JSON.stringify({
        error: "Request timeout",
        details: "Calendar service took too long to respond"
      }), {
        status: 504,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      error: "Failed to fetch calendar data",
      details: errorMessage
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
