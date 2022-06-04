const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const TripDB = require("./modules/tripDB.js");

const db = new TripDB();

var HTTP_PORT = process.env.PORT || 8080;


db.initialize("mongodb+srv://fevin:Qwerty123@cluster0.evtyj.mongodb.net/sample_training?retryWrites=true&w=majority")
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });


//***POST /api/trips route***
app.post("/api/trips", (req, res) => {
    db.addNewTrip(req.body).then(() => {
        res.status(201).json("New trip was added successfully.")
    })
    .catch((error) => {
        res.status(500).json("Error occured while adding new trip: " + error);
    })
});


//***GET /api/trips route   |    This route gets the process the ***
app.get("/api/trips", (req, res) => {
   db.getAllTrips(req.query.page, req.query.perPage).then((data) => {
        res.status(200).json(data);
   })
   .catch((error) => {
       res.status(400).json(error);
   });
});



app.get("/api/trips/:_id", (req, res) => {
    db.getTripById(req.params._id).then((data) => {
        res.status(201).json(data); 
    })
    .catch((error) => {
        console.log(error);
    })
})


app.put("/api/trips/:_id", (req, res) => {
    db.updateTripById(req.body, req.params._id).then(() => {
        res.status(201).json({message: "Updated the Trip with ID: " + req.params._id}); //Check if it code catches error
    })
    .catch((error) => {

    })
})


app.delete("/api/trips/:_id", (req, res) => {
    db.deleteTripById(req.params._id).then(() => {
        res.status(201).json({message: "Deleted the Trip with ID: " + req.params._id});
    })
    .catch((error) => {
        console.log(error);
    })
})



//***GET / route***
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});
