const fs = require("fs");

//requiring path package to construct paths for files
const path = require("path");

//creating server using express

const express = require("express");
const app = express();

//package for id generation
const uuid = require("uuid");

//setting up ejs engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//linking other files(css,js,images,etc)
app.use(express.static("public"));

//adding middleware --> helps in post request --> it tells the browser to look into incoming request and extract the incoming data
app.use(express.urlencoded({ extended: false }));

//migrating static frontend-site to backend

app.get("/restaurants", function (req, res) {
  //sending restuarant.html as response
  // const htmlFilePath = path.join(__dirname, "views", "restaurants.html");
  // res.sendFile(htmlFilePath);
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(filePath); //raw data of json file in json format

  const storedRestaurants = JSON.parse(fileData); //javascript array format
  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/about", function (req, res) {
  //sending restuarant.html as response
  // const htmlFilePath = path.join(__dirname, "views", "about.html");
  // res.sendFile(htmlFilePath);

  res.render("about");
});
app.get("/", function (req, res) {
  //sending restuarant.html as response
  res.render("index"); // render work because we set EJS ENGINE
});
app.get("/recommend", function (req, res) {
  //sending restuarant.html as response
  // const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  // res.sendFile(htmlFilePath);

  res.render("recommend");
});

app.get("/confirm", function (req, res) {
  //sending restuarant.html as response
  // const htmlFilePath = path.join(__dirname, "views", "confirm.html");
  // res.sendFile(htmlFilePath);

  res.render("confirm");
});

//handling form data using post request
app.post("/recommend", function (req, res) {
  const restaurant = req.body; //form data in javascript array format
  restaurant.id = uuid.v4();
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(filePath); //raw data of json file in json format

  const storedRestaurants = JSON.parse(fileData); //javascript array format

  storedRestaurants.push(restaurant);

  fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

  //once the data was submitted redirect this website to avoid confirm form resubmission
  res.redirect("/confirm");
});

/*
how to generate dynamic pages using EJS PACKAGE OF EXPRESS
-->we use template (html+with some twist)
-->ejs template engine will be used
--> npm install ejs 
--> in app.js we can now set templating engine (ejs)

    app.set('views',path.join(__dirname,'views'))//-->we will set it to let express know where it will find template files which we want to process 
    app.set('view engine','ejs')
    view engine--> we tell express that we want to use special engine for processing our view files
    ejs--> name of engine
*/

/*Code for Dynamic Route */

//defining dynamic route --> for every new restaurant added in recommend form we make one route for it
app.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;
  const filePath = path.join(__dirname, "data", "restaurants.json");
  const fileData = fs.readFileSync(filePath); //raw data of json file in json format

  const storedRestaurants = JSON.parse(fileData); //javascript array format

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", { restaurant: restaurant });
    }
  }
  // SENDING ERROR RESPONSE
  res.status(404).render("404");
});

//this will handle any page which is not handeled by any upper routes
app.use(function (req, res) {
  res.status(404).render("404");
});

//middleware to handle server side error
app.use(function (error, req, res, next) {
  res.status(500).render("500");
});

app.listen(3000);
