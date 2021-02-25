//everything that is required for this project.
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 8081;

// this string is the key to connect or access the mongo database
const connectionString = "mongodb+srv://prateekmadhesia:Sur@7050570240@cluster0.gj0ft.mongodb.net/crio_project?retryWrites=true&w=majority";

// express middlewares
app.set('view engine', 'ejs');
app.use(express.static('frontend'));
app.use(bodyParser.json());

//this method is used to connect to the database and do CRUD request
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log("connected to database");
    const db = client.db('crio'); //crio is the collection of the database.
    const memeCollection = db.collection('memes');
    app.use(bodyParser.urlencoded({ extended: true }));
    var size = 0;

    //it return the main webpage with 100 latest memes.
    app.get('/', (request, response) => {
      response.status(200);
      memeCollection.find().toArray()
        .then(result => {
          response.render('index.ejs', { values: result })
        })
        .catch(error => console.error(error))
    });

    //this method is used to store the name, url and the caption in the database.
    app.post('/memes', (request, response) => {
      memeCollection.find().toArray()
        .then(result => {
          size = result.length;
        })
        .then(() => {
          let obj = { "id": size + 1, "name": request.body.name, "caption": request.body.caption, "url": request.body.url };
          memeCollection.insertOne(obj)
            .then(result => {
              response.redirect('/');
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
      response.status(201);
    });

    //this method is used to return or show the name, url and the caption in the database to the user/client int the array of objects.
    app.get('/memes', (request, response) => {
      memeCollection.find().toArray()
        .then(result => {
          response.send(result);
          response.status(200);
        })
    });

    //this method is used to find and show the name, url and caption of the perticular id as an array of object.
    app.get('/memes/:id', (request, response) => {
      memeCollection.find().toArray()
        .then(result => {
          var len = result.length;
          var fid = request.params.id;
          if (len < fid) {
            response.status(404);
            response.send(`<h1 style="text-align: center; font-size:3em;">404 Not Found</h1>`);
          } else {
            var obj = {}
            for (var i = 0; i < result.length; i++) {
              if (result[i].id == fid) {
                obj = { "id": fid, "name": result[i].name, "caption": result[i].caption, "url": result[i].url };
                response.status(200);
                response.send(obj);
                break;
              }
            }
          }
        })
    });

    // this method is used to update the url and the caption of an user.
    app.patch('/memes/:id', (request, response) => {
      memeCollection.updateOne(
        { id: request.params.id },
        {
          $set: {
            caption: request.body.caption,
            url: request.body.url
          }
        }
      )
        .then(result => {
          response.send(result);
        })
        .catch(err => { console.error(err); })
    });

    //this method is used for invalid request
    app.all("*", (request, response) => {

      response.status(404);

      response.send(`<h1 style="text-align: center; font-size:3em;">404 Not Found</h1>`);

    });

    //bind to the port 8081
    app.listen(process.env.PORT || port, () => {
      console.log(`Listening to port ${port}`)
    })

  })
  .catch(err => { console.error(err); })
