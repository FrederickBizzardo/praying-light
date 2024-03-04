import React, { useState, useEffect } from 'react';
import { JSDOM } from 'jsdom';
 
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
    
    
    // DO NOT DELETE THIS CODE IT PARTLY WORKS
    
     /* const googleResponse = await fetch(searchLink);
  const googleHtml = await googleResponse.text();
  
  const dom = new JSDOM(googleHtml);
  const firstImage = dom.window.document.querySelector('img').getAttribute('src');
  */

 /* const url = 'https://google-api31.p.rapidapi.com/imagesearch';
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': '8f968af43amsh76cadb057036071p1a5d10jsn7b5bad7d572b',
		'X-RapidAPI-Host': 'google-api31.p.rapidapi.com'
	},
	body: {
		text: 'rose',
		safesearch: 'off',
		region: 'wt-wt',
		color: '',
		size: '',
		type_image: '',
		layout: '',
		max_results: 100
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}*/
  
//===============================


      
//const imageSearch = searchLink[0];


  console.log('results', searchLink);
  

function Celebration() {
 
 
  
  //==========================
  
// Output the result to the page

// return <div>{JSON.stringify(data)}</div>;


//return <div>{JSON.stringify(day)}</div>;


//return <div>{JSON.stringify(titles)}</div>;




return (
  
  <div className="text-center">
    <h2 className="font-black font-sans font-mono text-2xl">Celebration Title</h2>
        <p className="italic">{titles.join(', ')}</p>
          <div>
        <p>Google Search Link: <a href={searchLink} target="_blank" rel="noopener noreferrer">{/*results*/}Link</a></p>
      </div>
      <div>
        <img src={searchLink} alt="First Image" />
        <img src={searchQuery} alt="First Image" />
        {/*<p>{searchLink}</p>*/}
        <p>Google Search Link: <a href={searchLink} target="_blank" rel="noopener noreferrer">{/*results*/}new Link</a></p>
        </div>
  </div>
  )
};

  export default Celebration;