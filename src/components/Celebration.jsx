import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header.jsx";
import ImageScraper from "./ImageScraper.jsx";
import Rosary from "./Rosary.jsx";
import "../assets/fonts.css";

export default function Celebration() {
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          "http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const day = data.celebrations;
        const titles = day.map((celebration) => celebration.title);
        setTitles(titles);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div
        className="h-screen bg-no-repeat bg-cover bg-center m-0"
        style={{ backgroundImage: `url('/images/jesus.jpeg')` }}
      >
        <Header />
        <motion.h1
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 100, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-60 left-5 font-OnestB text-6xl md:text-8xl text-white"
        >
          Shining Bright
        </motion.h1>
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-black to-transparent"></div>
        <p className="absolute bottom-32 left-5 right-5 font-OnestB text-white text-lg md:text-xl max-w-2xl">
          "Shining Light" is your go-to destination for enriching your Catholic
          faith journey. Dive into a wealth of articles, reflections, prayers, and
          multimedia content designed to inspire and deepen your understanding of
          Catholic teachings.
        </p>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-OnestB text-3xl mb-4">Today's Celebrations</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading celebrations...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="space-y-8">
            <p className="font-Onest italic text-xl">{titles.join(", ")}</p>
            <ImageScraper searchQuery={titles.join(" ")} />
          </div>
        )}
      </div>
      <div className="text-center py-8">
        <Rosary />
      </div>
    </main>
  );
}

