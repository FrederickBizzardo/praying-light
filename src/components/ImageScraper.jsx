import React, { useEffect, useState } from 'react';
//import React, { useEffect, useRef } from '@astrojs/react';
// import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
// import { useInView } from 'react-intersection-observer';
//import { JSDOM } from 'jsdom';
import '../assets/fonts.css';

const response = await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today');
const data = await response.json();
const day = data.celebrations;
console.log(data);
const titles = day.map(celebration => celebration.title);
console.log(titles);


const searchQuery = titles.join(' ');
const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;


    const googleResponse = await fetch(searchLink);
    const googleHtml = await googleResponse.text();

    const getGoogleImages = (googleHtml) => {
    const imageUrls = [];
    const regex = /<img[^>]+src="([^">]+)/g;
    let match;

    while ((match = regex.exec(googleHtml)) !== null) {
        // Extract the image URL from the matched string
        const imageUrl = match[1];
        imageUrls.push(imageUrl);
    }

    return imageUrls;
};

// Usage:
const imageUrls = getGoogleImages(googleHtml);
console.log(imageUrls);

export default function ImageScraper() {
    return (
        <main className="">
            <img className=" w-full rounded-lg" src={imageUrls[3]} alt="First Image"/>
        </main>

    )
}
;

// DO NOT DELETE THIS CODE IT PARTLY WORKS
/*
const googleResponse = await fetch(searchLink);
const googleHtml = await googleResponse.text();

const dom = new JSDOM(googleHtml);

const imageElements = dom.window.document.querySelectorAll('img');
const urls = Array.from(imageElements).map(img => img.getAttribute('src'));

console.log('Google search results link:', searchLink);
console.log('Image URLs:', urls);*/