const fs = require("fs"); // require file system module
const fetch = require('node-fetch');

// const http = require('http');

const express = require("express"); // require express module

const app = express();
const path = require('path')
app.use(express.static(path.join(__dirname)));

// assigning which port the server will connect to.
const PORT = process.env.PORT || 3000; // port to be used is 3000 but you can use any port you want.
const machineReadableData = fs.readFileSync("data.json"); // Reading the contents of the json file.
const humanReadableData = JSON.parse(machineReadableData); // Parsing the machine readable data to human readable

//make an array
const arrOfQuotes = humanReadableData.map(e => e.quote);

//make a string variable to held star wars names
 let names = "";

 //function to get get data from a url
 function getData(url) {
  return new Promise((resolve, reject) => {
    return fetch(url).then(function(response) {
      const json = response.json();
      if (json) {
        resolve(json);
      } else {
        reject({ message: "Our promise has broken" });
      }
    });
  });
}

//sending the url to the fetch function, then to the addData function.
getData("https://swapi.co/api/people")
  .then(data => {
    addData(data.results);
  })
  .catch(err => {
    console.error("error: ", err);
  });

//add the names to the varriable
function addData(arr) {
  arr.splice(0, 10).forEach(function(person) {
      names += person.name;
      names += "<br>";
  });
}

//creates a string to store quotes
let quotes = "";

//puts the quotes in the varriable
arrOfQuotes.forEach(q => {
  quotes += q;
  quotes += "<br>";
});

//send quotes to main page
app.get("/", (request, response) => {
  response.status(200).send(quotes);
});

//send star wars names to star wars page
app.get("/starwars", (request, response) => {
  response.status(200).send(names);
});

//shows what port is in use
app.listen(PORT, () => console.log(`listening on ${PORT}`));

