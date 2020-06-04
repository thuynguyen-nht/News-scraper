var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const Handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 8080;

var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Set Handlebars.
// var exphbs = require("express-handlebars");

app.engine("handlebars", expressHandlebars({

    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: "main",
}));
app.set("view engine", "handlebars");


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

var results = [];
//Routes
app.get("/", function (req, res) {
    res.render("index");;
});

// A GET route for scraping the newsbayarea website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    var found;
    var scrapeArr = [];
    db.Article.find({})
        .then(function (dbArticle) {
            for (var j = 0; j < dbArticle.length; j++) {
                scrapeArr.push(dbArticle[j].title);
                scrapeArr.push(dbArticle[j].link);
                scrapeArr.push(dbArticle[j].summary)
                scrapeArr.push(dbArticle[j].image)

            }
            console.log(scrapeArr);
        })
    axios.get("https://www.nbcbayarea.com/news/local/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);


        $(".story-card__title").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element)
                .children("a")
                .text();
            result.link = $(element)
                .children("a")
                .attr("href");
            result.summary = $(element).next("div").children("p").text();

            result.image = $(element).parent().parent().children("a").find("img").attr("srcset");
            if (!found && result.title && result.link && result.summary && result.image) {
                results.push(result);
            }

        });

        //Send a message to the client

        res.render("index", {
            articles: results

        });
    });
});

// Route for getting all Articles from the db
app.get("/saved", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // console.log(dbArticle);
            res.render("saved", {
                saved: dbArticle
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


// Route for creating an Article in the db
app.post("/api/saved", function (req, res) {
    db.Article.create(req.body)
        .then(function (dbArticle) {
            res.json(dbArticle);
            console.log(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Route for deleting an article from the db
app.delete("/saved/:id", function (req, res) {
    db.Article.deleteOne({ _id: req.params.id })
        .then(function (removed) {
            res.json(removed);
        }).catch(function (err, removed) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    console.log("This is line 155: " + req.params.id);
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findById(req.params.id)

        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            console.log(dbArticle);
            if (dbArticle) {
                res.render("articles", {
                    data: dbArticle
                });
            }
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
                .then(function (dbArticle) {
                    console.log(dbArticle);
                    res.json(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        })
        .catch(function (err) {
            res.json(err);
        })
});

//Route for deleting a note
app.delete("/articles/:id", function (req, res) {
    db.Note.deleteOne({ _id: req.params.id })
        .then(function (removed) {
            res.json(removed);
        }).catch(function (err, removed) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});