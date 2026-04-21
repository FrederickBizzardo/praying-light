import { useEffect, useState } from 'react';
import '../assets/fonts.css';

export default function Rosary() {
    const [rosaryData, setRosaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRosary() {
            try {
                const response = await fetch('https://the-rosary-api.vercel.app/v1/today');
                const data = await response.json();
                if (data && data.length > 0) {
                    setRosaryData(data[0]);
                }
            } catch (error) {
                console.error('Error fetching rosary:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRosary();
    }, []);

    if (isLoading) return <p>Loading Rosary...</p>;
    if (!rosaryData) return <p>No Rosary data found.</p>;

    const mystery = rosaryData.mystery;
    const audioUrl = rosaryData.mp3AudioUrl;

    return (
        <main className="">
            <h1 className="font-black text-4xl mt-30 mb-2">Rosary</h1>
            <p className="italic text-2xl">{mystery} Mysteries</p>
            {audioUrl && (
                <audio controls className="mx-auto mt-4">
                    <source src={audioUrl} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>
            )}
        </main>
    );
}