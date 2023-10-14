const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3005;

const Theatredata = require('./models/theatredata')
const Moviedata = require('./models/moviedata')
const Allocatedata = require('./models/allocatedata')

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
    const { location, loginid, name, password, rows } = req.body;
  
    try {
      const newData = new Theatredata({
        location,
        loginid,
        name,
        password,
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
    const { moviename, poster, description } = req.body;
  
    try {
      const newData = new Moviedata({
        moviename,
        poster,
        description
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
    const { date, movieData, theatreName } = req.body;
  
    try {
      const newData = new Allocatedata({
        date,
        movieData,
        theatreName
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
app.get('/allocatedata', async (req, res) => {
    try {
      const data = await Allocatedata.find();
      res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
  });

// Handle PUT request to update allocated data
app.put('/allocatedata/:date', async (req, res) => {
  const date = req.params.date;
  const { movieData, theatreName } = req.body;

  try {
    const existingData = await Allocatedata.findOne({ date });

    if (!existingData) {
      return res.status(404).json({ error: 'Data not found.' });
    }

    existingData.movieData = movieData;
    existingData.theatreName = theatreName;

    await existingData.save();

    console.log('Data updated successfully.');
    res.status(200).json({ message: 'Data updated successfully.' });
  } catch (err) {
    console.error('Error updating data:', err);
    res.status(500).json({ error: 'An error occurred while updating the data.' });
  }
});

  


  
// Start the Server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
