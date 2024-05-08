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
const Allshowdata = require('./models/allshowdata');


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
  const { theatreId, theatreName, theatreLocation, totalScreens, theatreCity, theatrePinCode,pinCodesForAllocation, theatreOperatorEmail, theatreOperatorContact, theatreOperatorName, theatreOperatorIDproof, seatingCapacity, theaterScreens, rows } = req.body;

  try {
    const newData = new Theatredata({
      theatreId,
      theatreName,
      theatreLocation,
      theatreCity,
      theatrePinCode,
      pinCodesForAllocation,
      theatreOperatorEmail,
      theatreOperatorContact,
      theatreOperatorName,
      theatreOperatorIDproof,
      theaterScreens,
      seatingCapacity,
      totalScreens,
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

  ////////////for all show data ////////////////

  // Handle POST request to save data
app.post('/allshowdata', async (req, res) => {
  const {
    theaterID,
    title,
    description,
    slots,
    startDate,
    endDate,
    startDate_EP,
    endDate_EP,
    isActive,
    category,
    photos,
    totalLikes,
    totalComments,
    likedBy,
    screenID
  } = req.body;

  try {
    const newData = new Allshowdata({
      theaterID,
      title,
      description,
      slots,
      startDate,
      endDate,
      startDate_EP,
      endDate_EP,
      isActive,
      category,
      photos,
      totalLikes,
      totalComments,
      likedBy,
      screenID
    });

    await newData.save();
    console.log('Data saved successfully.');
    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
  }
});

  ///////For Movie ////////

 // Handle POST request to save data
app.post('/moviedata', async (req, res) => {
  const { movieName, posterImage, movieDesc, movieRuntime, intervalTime,extraImages, productionHouse, dateTime, startDate, endDate, isDeleted, isExpired } = req.body;

  try {
    const newData = new Moviedata({
      movieName,
      posterImage,
      extraImages,
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
// Handle POST request to Allocate data
app.post('/allocatedata', async (req, res) => {
  const {
    date,
    theatreId,
    theatreName,
    selectedscreen,
    city,
    movieData,
    photo,
    description,
    isActive,
    startDate,
    endDate,
    startDate_EP,
    endDate_EP,
    category,
    totalLikes,
    totalComments,
    likedBy,
    screenId,// Changed to screenId to match the request body
    matchId
  } = req.body;

  try {
    // Save the data without checking for duplicates
    const newData = new Allocatedata({
      date,
      theatreId,
      theatreName,
      selectedscreen,
      city,
      movieData,
      photo,
      description,
      isActive,
      startDate,
      endDate,
      startDate_EP,
      endDate_EP,
      category,
      totalLikes,
      totalComments,
      likedBy,
      screenId, // Changed to screenId to match the schema
      matchId
    });

    await newData.save();
    console.log('Data saved successfully.');
    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (err) {
    console.error('Error occurred while saving data:', err);
    res.status(500).json({ error: 'An error occurred while saving the data.' });
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



  // Handle GET request to retrieve data by theatreId and selectedscreen
app.get('/allocatedatafill', async (req, res) => {
  try {
      const { theatreId, selectedscreen } = req.query;
      
      // Check if both theatreId and selectedscreen are provided in the query parameters
      if (!theatreId || !selectedscreen) {
          return res.status(400).json({ error: 'Please provide both theatreId and selectedscreen parameters.' });
      }

      // Find data based on provided theatreId and selectedscreen
      const data = await Allocatedata.find({ theatreId, selectedscreen });

      // Check if data is found
      if (!data || data.length === 0) {
          return res.status(404).json({ error: 'No data found for the provided theatreId and selectedscreen.' });
      }

      // Send the found data
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

    // Validate required fields
    const requiredFields = ['theatreId', 'screenId', 'cardId', 'userId', 'theatreName', 'showDate', 'showTime', 'movieName', 'isCancel', 'seats'];
    for (const field of requiredFields) {
      if (!(field in bookingData)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const { theatreId, screenId, cardId, userId, theatreName, showDate, showTime, movieName, isCancel, seats } = bookingData;

    // Check if the seats are already booked for the given movie, date, and showtime
    const existingBooking = await Bookingdata.findOne({
      userId,
      cardId,
      theatreId,
      screenId,
      theatreName,
      showDate,
      showTime,
      movieName,
      isCancel,
      seats: { $in: seats },
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Seats are already booked for this show.' });
    }

    const booking = new Bookingdata(bookingData);
    await booking.save();

    res.status(201).json({ message: 'Data stored successfully.' });
  } catch (error) {
    console.error('Error storing data in the database:', error);
    res.status(500).json({ error: 'Error storing data in the database.' });
  }
});


// Define a PUT route to update the isCancel state of a booking// Define a PUT route to update the booking data
// Define a PUT route to update the booking data
app.put('/bookingdata/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updatedData = req.body;

    // Find the booking by ID
    const booking = await Bookingdata.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Check if any value is changed
    const isDataChanged = Object.keys(updatedData).some(key => updatedData[key] !== booking[key]);
    if (!isDataChanged) {
      return res.status(400).json({ error: 'No changes detected in the booking data.' });
    }

    // Update all fields with the provided data
    Object.assign(booking, updatedData);
    await booking.save();

    res.status(200).json({ message: 'Booking data updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking data.' });
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
