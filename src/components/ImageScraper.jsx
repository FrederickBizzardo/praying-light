import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ImageScraper({ searchQuery }) {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchImage() {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching image for query:', searchQuery);
        
        const response = await fetch(`/api/scrapeImage?searchQuery=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error(data.error || 'No image URL found');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();
  }, [searchQuery]);

  if (error) {
    return <p className="text-red-500">Error loading image: {error}</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      {isLoading ? (
        <p className="text-gray-500">Loading image...</p>
      ) : imageUrl ? (
        <img className="w-full rounded-lg shadow-lg" src={imageUrl} alt="Scraped Image" />
      ) : (
        <p className="text-gray-500">No image found</p>
      )}
    </motion.div>
  );
}

