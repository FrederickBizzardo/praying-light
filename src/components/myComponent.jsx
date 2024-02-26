import React, { useState, useEffect } from 'react'
 
 const response = await fetch('http://calapi.inadiutorium.cz/api/v0/en/calendars/default/today')
 
 const data = await response.json();
const day = data.celebrations[0];
// const date = data.celebrations[0];

const index = day.title;

console.log(data);

function Movies() {
// Output the result to the page

/* return <div>{JSON.stringify(data)}</div>;
*/

/* return <div>{JSON.stringify(date)}</div>;
*/

return <div>
  {JSON.stringify(index)}
</div>;

  
};

  export default Movies;
  
