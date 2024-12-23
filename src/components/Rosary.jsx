import React, { useEffect, useState } from 'react';
//import React, { useEffect, useRef } from '@astrojs/react';
// import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
// import { useInView } from 'react-intersection-observer';
//import { JSDOM } from 'jsdom';
import '../assets/fonts.css';


const roseResponse = await fetch('https://the-rosary-api.vercel.app/v1/today');
const roseData = await roseResponse.json();
const rosary = roseData.map(celebration => celebration.mystery);
const rosaryDown = roseData.map(celebration => celebration.mp3Link);


console.log('Rosary Data:', roseData);
console.log('Rosary:', rosary);
console.log('Rosary MP3 Links:', rosaryDown);

export default function Rosary() {
    return (
        <main className="">
            <h1 className="font-black text-4xl mt-30 mb-2">Rosary</h1>
            <p className="italic text-2xl">{rosary.join(', ')} Mysteries</p>
        <audio controls>
            <source src={rosaryDown} type="audio/mpeg"/>
        </audio>
        </main>

    )
}
;