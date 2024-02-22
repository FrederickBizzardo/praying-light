import React, { useState, useEffect } from 'react'
 
 const response = await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today')
 
 const data = await response.json();
const randomUser = data.celebrations[0];
    

console.log(data);

function Movies() {
// Output the result to the page
  return <div>{JSON.stringify(data)}</div>;
};

  export default Movies;