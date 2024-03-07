import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { JSDOM } from 'jsdom';

// SHINING LIGHT

const response =  await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today')

const data = await response.json();
const day = data.celebrations;
// const date = data.celebrations[0];
const titles = day.map(celebration => celebration.title);

const index = day.title;
console.log(data);


 /*const searchQuery = titles.join(' ');
    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  */


const searchQuery = titles.join(' ');
const searchLink = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(searchQuery)}`;
// const searchLink = `https://thecatholicgallery.github.io/categories/artwork/?page=2`;


// DO NOT DELETE THIS CODE IT PARTLY WORKS

 const googleResponse = await fetch(searchLink);
 const googleHtml = await googleResponse.text();

 const dom = new JSDOM(googleHtml);
// const firstImage = dom.window.document.querySelector('img').getAttribute('src');

const imageElements = dom.window.document.querySelectorAll('img');
const urls = Array.from(imageElements).map(img => img.getAttribute('src'));

const image = (urls[0]);

//===============================



//const imageSearch = searchLink[0];


console.log('results', searchLink);

console.log('image url', urls);

function Celebration() {



  //==========================

// Output the result to the page

// return <div>{JSON.stringify(data)}</div>;


//return <div>{JSON.stringify(day)}</div>;


//return <div>{JSON.stringify(titles)}</div>;




return (

  <div className="absolute">
      <div className="relative mx-0 mb-20">
          <h1 className="font-black text-4xl">Shining Light</h1>
      </div>
      <div className="relative">
          <h2 className="font-black text-2xl mt-30 mb-2">Day</h2>
          <div className="flex inline">
              <p className="italic mb-5">{titles.join(', ')}</p>
              <img className=" w-1/2 rounded-lg" src={urls[3]} alt="First Image"/>
          </div>
      </div>
  </div>
)
};

export default Celebration;