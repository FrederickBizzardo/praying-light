  import React, { useState, useEffect } from 'react'
 
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
    
 //const imageSearch = searchLink[0];

  console.log('results', searchLink);

function Movies() {
  
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
        </div>
  </div>
  )
};

  export default Movies;
  
  
  /* import React, { useState, useEffect } from 'react';

function Movies() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today');
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                setError('Error fetching data. Please try again later.');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {error && <div>{error}</div>}
            {data && (
                <div>
                    <h2>API Data</h2>
                    <p>Title: {data.title}</p>
                    <p>Celebrations: {data.celebrations.map(celebration => celebration.title).join(', ')}</p>
                  */ //  {/* Add more output based on the structure of your data */}
              /*  </div>
            )}
        </div>
    );
}

export default Movies;*/
  
  /* import React, { useState, useEffect } from 'react';

function Movies() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today');
                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                setError('Error fetching data. Please try again later.');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
      
                <div>{JSON.stringify(data)}</div>

}

export default Movies;
*/