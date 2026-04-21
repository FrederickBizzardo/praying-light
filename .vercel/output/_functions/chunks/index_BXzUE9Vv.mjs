import { c as createComponent } from './astro-component_i26MeneT.mjs';
import 'piccolore';
import { h as addAttribute, l as renderHead, n as renderComponent, r as renderTemplate } from './entrypoint_BmNM34bE.mjs';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Header() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(motion.h1, { initial: { y: -100 }, animate: { y: 0 }, className: "absolute top-10 left-5 font-OnestB text-4xl text-white", children: "Shining Lights" }) });
}

function ImageScraper({ searchQuery }) {
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchImage() {
      if (!searchQuery) return;
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching image for query:", searchQuery);
        const response = await fetch(`/api/scrapeImage?searchQuery=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error(data.error || "No image URL found");
        }
      } catch (error2) {
        console.error("Error fetching image:", error2);
        setError(error2.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchImage();
  }, [searchQuery]);
  if (error) {
    return /* @__PURE__ */ jsxs("p", { className: "text-red-500", children: [
      "Error loading image: ",
      error
    ] });
  }
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      className: "w-full max-w-md mx-auto",
      children: isLoading ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Loading image..." }) : imageUrl ? /* @__PURE__ */ jsx("img", { className: "w-full rounded-lg shadow-lg", src: imageUrl, alt: "Scraped Image" }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No image found" })
    }
  );
}

function Rosary() {
  const [rosaryData, setRosaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetchRosary() {
      try {
        const response = await fetch("https://the-rosary-api.vercel.app/v1/today");
        const data = await response.json();
        if (data && data.length > 0) {
          setRosaryData(data[0]);
        }
      } catch (error) {
        console.error("Error fetching rosary:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRosary();
  }, []);
  if (isLoading) return /* @__PURE__ */ jsx("p", { children: "Loading Rosary..." });
  if (!rosaryData) return /* @__PURE__ */ jsx("p", { children: "No Rosary data found." });
  const mystery = rosaryData.mystery;
  const audioUrl = rosaryData.mp3AudioUrl;
  return /* @__PURE__ */ jsxs("main", { className: "", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-black text-4xl mt-30 mb-2", children: "Rosary" }),
    /* @__PURE__ */ jsxs("p", { className: "italic text-2xl", children: [
      mystery,
      " Mysteries"
    ] }),
    audioUrl && /* @__PURE__ */ jsxs("audio", { controls: true, className: "mx-auto mt-4", children: [
      /* @__PURE__ */ jsx("source", { src: audioUrl, type: "audio/mpeg" }),
      "Your browser does not support the audio element."
    ] })
  ] });
}

function Celebration() {
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/calendar");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const day = data.celebrations;
        const titles2 = day.map((celebration) => celebration.title);
        setTitles(titles2);
      } catch (error2) {
        console.error("Error fetching data:", error2.message);
        setError(error2.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "h-screen bg-no-repeat bg-cover bg-center m-0",
        style: { backgroundImage: `url('/images/jesus.jpeg')` },
        children: [
          /* @__PURE__ */ jsx(Header, {}),
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { x: 0, opacity: 0 },
              animate: { x: 100, opacity: 1 },
              transition: { duration: 1 },
              className: "absolute top-60 left-5 font-OnestB text-6xl md:text-8xl text-white",
              children: "Shining Bright"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent" }),
          /* @__PURE__ */ jsx("p", { className: "absolute bottom-32 left-5 right-5 font-OnestB text-white text-lg md:text-xl max-w-2xl", children: '"Shining Light" is your go-to destination for enriching your Catholic faith journey. Dive into a wealth of articles, reflections, prayers, and multimedia content designed to inspire and deepen your understanding of Catholic teachings.' })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-OnestB text-3xl mb-4", children: "Today's Celebrations" }),
      isLoading ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Loading celebrations..." }) : error ? /* @__PURE__ */ jsxs("p", { className: "text-red-500", children: [
        "Error: ",
        error
      ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsx("p", { className: "font-Onest italic text-xl", children: titles.join(", ") }),
        /* @__PURE__ */ jsx(ImageScraper, { searchQuery: titles.join(" ") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx(Rosary, {}) })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`<html lang="en" data-astro-cid-j7pv25f6> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro2.generator, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>Shining Light</title>${renderHead()}</head> <body data-astro-cid-j7pv25f6> <main data-astro-cid-j7pv25f6> ${renderComponent($$result, "Celebration", Celebration, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/fgnye/OneDrive/Desktop/projects/praying-light/src/components/Celebration.jsx", "client:component-export": "default", "data-astro-cid-j7pv25f6": true })} </main> </body></html>`;
}, "C:/Users/fgnye/OneDrive/Desktop/projects/praying-light/src/pages/index.astro", void 0);

const $$file = "C:/Users/fgnye/OneDrive/Desktop/projects/praying-light/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
