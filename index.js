const express = require('express');
const Allocatedata = require('./models/allocatedata')
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3005;

const Theatredata = require('./models/theatredata')
const Moviedata = require('./models/moviedata')
const Bookingdata = require('./models/bookingdata')

// MongoDB Connection
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors({ origin: '*' }));

// Simple get request
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Handle POST request to save data
app.post('/theatredata', async (req, res) => {
  const { theatreName, theatreLocation, theatreCity, theatrePinCode, theatreOperatorEmail, theatreOperatorContact, theatreOperatorName, theatreOperatorIDproof, theaterScreens, rows } = req.body;

  try {
    const newData = new Theatredata({
    
      theatreName,
      theatreLocation,
      theatreCity,
      theatrePinCode,
      theatreOperatorEmail,
      theatreOperatorContact,
      theatreOperatorName,
      theatreOperatorIDproof,
      theaterScreens,
      rows,
    });

    await newData.save();
    console.log('Data saved successfully.');
    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
  }
});
// Handle GET request to retrieve data
app.get('/theatredata', async (req, res) => {
    try {
      const data = await Theatredata.find();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching data:', err);

      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  });

  ///////For Movie ////////

 // Handle POST request to save data
app.post('/moviedata', async (req, res) => {
  const { movieName, posterImage, movieDesc, movieRuntime, intervalTime, productionHouse, dateTime, startDate, endDate, isDeleted, isExpired } = req.body;

  try {
    const newData = new Moviedata({
      movieName,
      posterImage,
      movieDesc,
      movieRuntime,
      intervalTime,
      productionHouse,
      dateTime,
      startDate,
      endDate,
      isDeleted,
      isExpired
    });

    await newData.save();
    console.log('Movie Data saved successfully.');
    res.status(200).json({ message: 'Movie Data saved successfully.' });
  } catch (err) {
    console.log('Error saving data:', err);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
  }
});

  
  // Handle GET request to retrieve data
  app.get('/moviedata', async (req, res) => {
    try {
      const data = await Moviedata.find();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  });


 // Handle DELETE request to delete a movie by ID
app.delete('/moviedata/:id', async (req, res) => {
    try {
      const deletedMovie = await Moviedata.findByIdAndRemove(req.params.id);
      if (deletedMovie) {
        res.status(200).json({ message: 'Movie deleted successfully' });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (err) {
      console.error('Error deleting movie:', err);
      res.status(500).json({ error: 'An error occurred while deleting the movie.' });
    }
  });
  
  ///////////For Allote Data//////////////
  
// Handle POST request to Allote data
app.post('/allocatedata', async (req, res) => {
  const { admin, date, movieData, selectedscreen, theatreId } = req.body;

  try {
    const newData = new Allocatedata({
      admin,
      date,
      movieData,
      selectedscreen,
      theatreId
    });

    await newData.save();
    console.log('Data saved successfully.');
    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      // Duplicate key error, handle accordingly
      console.error('Duplicate data:', err);
      res.status(400).json({ error: 'Data already exists.' });
    } else {
      console.error('Data already exists:', err);
      res.status(500).json({ error: 'An error occurred while saving the data.' });
    }
  }
});
  // Handle GET request to retrieve data
app.get('/allocatedata', async (req, res) => {
    try {
      const data = await Allocatedata.find();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  });
  
  // Handle DELETE request to delete data by _id
app.delete('/allocatedata/:id', async (req, res) => {
  const dataId = req.params.id;

  try {
    const deletedData = await Allocatedata.findByIdAndRemove(dataId);

    if (!deletedData) {
      // Data with the given _id was not found
      res.status(404).json({ error: 'Data not found.' });
    } else {
      res.status(200).json({ message: 'Data deleted successfully.' });
    }
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'An error occurred while deleting the data.' });
  }
});


// Define a POST route to store the booking data
app.post('/bookingdata', async (req, res) => {
  try {
    const bookingData = req.body;
    const {theatreId,screenId, theatreName, showDate, showTime, movieName, seats} = bookingData;

    // Check if the seats are already booked for the given movie, date, and showtime
    const existingBooking = await Bookingdata.findOne({
      theatreId,
      screenId,
      theatreName,
      showDate,
      showTime,
      movieName,
      seats: { $in: seats },
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Seats are already booked for this show.' });
    }

    const booking = new Bookingdata(bookingData);
    await booking.save();

    res.status(201).json({ message: 'Data stored successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error storing data in the database.' });
  }
});

// Define a GET route to retrieve booking data
app.get('/bookingdata', async (req, res) => {
  try {
    const bookingData = await Bookingdata.find(); // Retrieve all booking data from the database
    res.status(200).json(bookingData);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data from the database.' });
  }
});
  
// Start the Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
