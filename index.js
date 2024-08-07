const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3005;
const multer = require('multer');

const path = require('path');

const Allocatedata = require('./models/allocatedata')   
const Theatredata = require('./models/theatredata')
const Moviedata = require('./models/moviedata')
const Bookingdata = require('./models/bookingdata')
const Allshowdata = require('./models/allshowdata')
const Game = require('./models/gamesdata');
const Merchant = require('./models/Merchant');
// const Event = require('./models/Event')
const Evn = require('./models/evn')

const Response = require('./models/responsedata')

const FormData = require('./models/FormData');// MongoDB Connection

const MerchantData = require('./models/merchantData');



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


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


/////////////////////////////////////////////////////////////
app.post('/addmerchants', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'brandLogo', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 },
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 }
]), async (req, res) => {
  try {
    const newMerchant = new MerchantData({
      ...req.body,
      profileImage: req.files.profileImage ? req.files.profileImage[0].path : null,
      brandLogo: req.files.brandLogo ? req.files.brandLogo[0].path : null,
      businessLicense: req.files.businessLicense ? req.files.businessLicense[0].path : null,
      gstCertificate: req.files.gstCertificate ? req.files.gstCertificate[0].path : null,
      panCard: req.files.panCard ? req.files.panCard[0].path : null,
      proofOfAddress: req.files.proofOfAddress ? req.files.proofOfAddress[0].path : null
    });
    
    await newMerchant.save();
    res.status(201).json(newMerchant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route to fetch all merchants
app.get('/getmerchants', async (req, res) => {
  try {
    const merchants = await MerchantData.find();
    res.status(200).json(merchants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET route to fetch a single merchant by mobile number
app.get('/getmerchant/:contactPhoneNumber', async (req, res) => {
  const { contactPhoneNumber } = req.params;

  try {
    const merchant = await MerchantData.findOne({ contactPhoneNumber: contactPhoneNumber });
    
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    res.status(200).json(merchant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

////////////////////////////////


// Handle form submission
app.post('/submit', upload.fields([
  { name: 'photo' },
  { name: 'photo2' },
  { name: 'brandImage' },
  { name: 'additionalPhoto1' },
  { name: 'additionalPhoto2' }
]), async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.body.username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const username = req.body.username;

    // Get the current date and calculate the start of the week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).setHours(0, 0, 0, 0);

    // Count the number of entries by the user in the current week
    const count = await FormData.countDocuments({
      username: username,
      createdAt: { $gte: new Date(startOfWeek) }
    });

    // Limit to 3 entries per week
    if (count >= 3) {
      return res.status(403).json({ message: 'You can only submit 3 entries per week' });
    }

    // Create a new form data entry
    const formData = new FormData({
      username: req.body.username,
      appSection: req.body.appSection,
      productCategory: req.body.productCategory,
      brand: req.body.brand,
      brandImage: req.files.brandImage ? req.files.brandImage[0].path : '',
      title: req.body.title,
      offerHeadline: req.body.offerHeadline,
      description: req.body.description,
      excerptDescription: req.body.excerptDescription,
      photo: req.files.photo ? req.files.photo[0].path : '',
      videoLink: req.body.videoLink,
      photo2: req.files.photo2 ? req.files.photo2[0].path : '',
      additionalPhoto1: req.files.additionalPhoto1 ? req.files.additionalPhoto1[0].path : '',
      additionalPhoto2: req.files.additionalPhoto2 ? req.files.additionalPhoto2[0].path : '',
      unit: req.body.unit,
      price: req.body.price,
      discountedPrice: req.body.discountedPrice
    });

    // Save form data
    await formData.save();
    res.status(200).json({ message: 'Form data saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving form data', error: err });
  }
});


app.get('/entry-count', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Get the current date and calculate the start of the week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).setHours(0, 0, 0, 0);

    // Count the number of entries by the user in the current week
    const count = await FormData.countDocuments({
      username: username,
      createdAt: { $gte: new Date(startOfWeek) }
    });

    res.status(200).json({ count: count });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching entry count', error: err });
  }
});



// GET request to fetch all form data
app.get('/formdata', async (req, res) => {
  try {
    const formData = await FormData.find();
    res.status(200).json(formData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form data', error: err });
  }
});


///get by user 

// GET request to count form data by username
app.get('/formdata/count', async (req, res) => {
  try {
    const { username } = req.query; // Extract username from query parameters
    if (!username) {
      return res.status(400).json({ message: 'Username query parameter is required' });
    }
    const count = await FormData.countDocuments({ username });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error counting form data', error: err });
  }
});



////

app.put('/update/:id', upload.fields([{ name: 'photo' }, { name: 'photo2' }]), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      appSection: req.body.appSection,
      productCategory: req.body.productCategory,
      brand: req.body.brand,
      title: req.body.title,
      offerHeadline: req.body.offerHeadline,
      description: req.body.description,
      excerptDescription: req.body.excerptDescription,
      photo: req.files.photo ? req.files.photo[0].path : req.body.photo,
      videoLink: req.body.videoLink,
      photo2: req.files.photo2 ? req.files.photo2[0].path : req.body.photo2,
      price: req.body.price,
      discountedPrice: req.body.discountedPrice
    };

    const updatedFormData = await FormData.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Form data updated successfully', data: updatedFormData });
  } catch (err) {
    res.status(500).json({ message: 'Error updating form data', error: err });
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////////////







// POST request to create a new merchant
app.post('/merchants', async (req, res) => {
  try {
    const { businessName, businessAddress, contactPerson, contactEmail, contactPhoneNumber, loginPin } = req.body;

    // Create a new merchant
    const newMerchant = new Merchant({
      businessName,
      businessAddress,
      contactPerson,
      contactEmail,
      contactPhoneNumber,
      loginPin,
    });

    // Save the merchant to the database
    const savedMerchant = await newMerchant.save();

    res.status(201).json(savedMerchant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating merchant', error });
  }
});

// GET request to fetch all merchants
app.get('/allmerchants', async (req, res) => {
  try {
    const merchants = await Merchant.find();
    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching merchants', error });
  }
});

//CRUD OF Game CMS//
// Create a new game
app.post('/games', upload.fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      title,
      likes,
      description,
      prize,
      winners,
      category,
      entryFees,
      numberOfEntries,
      organizerName,
      startDate,
      endDate,
    } = req.body;

    const images = [
      req.files['image0'] ? `http://localhost:3005/uploads/${req.files['image0'][0].filename}` : '',
      req.files['image1'] ? `http://localhost:3005/uploads/${req.files['image1'][0].filename}` : '',
      req.files['image2'] ? `http://localhost:3005/uploads/${req.files['image2'][0].filename}` : '',
    ];

    const logo = req.files['logo'] ? `http://localhost:3005/uploads/${req.files['logo'][0].filename}` : '';

    const game = new Game({
      title,
      likes: parseInt(likes),
      description,
      prize,
      winners: parseInt(winners),
      images,
      category,
      entryFees,
      numberOfEntries: parseInt(numberOfEntries),
      organizerName,
      logo,
      startDate: new Date(startDate), // Handle startDate
      endDate: new Date(endDate),     // Handle endDate
    });

    await game.save();
    res.status(201).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all games
app.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a game by ID
app.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a game by ID
// Update a game by ID
app.put('/games/:id', upload.fields([
  { name: 'image0', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      title,
      likes,
      description,
      prize,
      winners,
      category,
      entryFees,
      numberOfEntries,
      organizerName,
      startDate,
      endDate,
    } = req.body;

    const images = [
      req.files['image0'] ? `http://localhost:3005/uploads/${req.files['image0'][0].filename}` : '',
      req.files['image1'] ? `http://localhost:3005/uploads/${req.files['image1'][0].filename}` : '',
      req.files['image2'] ? `http://localhost:3005/uploads/${req.files['image2'][0].filename}` : '',
    ];

    const logo = req.files['logo'] ? `http://localhost:3005/uploads/${req.files['logo'][0].filename}` : '';

    const game = await Game.findByIdAndUpdate(req.params.id, {
      title,
      likes: parseInt(likes),
      description,
      prize,
      winners: parseInt(winners),
      images,
      category,
      entryFees,
      numberOfEntries: parseInt(numberOfEntries),
      organizerName,
      logo,
      startDate: new Date(startDate), // Handle startDate
      endDate: new Date(endDate),     // Handle endDate
    }, { new: true });

    if (!game) return res.status(404).json({ message: 'Game not found' });

    res.status(200).json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete a game by ID
app.delete('/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//Post All events
app.post('/eventupload', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      eventName,
      eventDescription,
      eventCategory,
      pincode,
      city,
      eventAddress,
      startDate,
      endDate,
      eventTime,
      numberOfSeats,
      pricePerSeat,
    } = req.body;
    // const images = req.files['images']?.map((file) => `http://62.72.59.146:3005/uploads/${file.filename}`) || [];
    const video = req.files['video']?.[0]?.path ? `http://62.72.59.146:3005/uploads/${req.files['video'][0].filename}` : null;

    const evn = new Evn({ eventName,
      eventDescription,
      eventCategory,
      pincode,
      city,
      eventAddress,
      startDate,
      endDate,
      eventTime,
      numberOfSeats,
      pricePerSeat, 
      images, 
      video });
    await evn.save();

    res.status(200).json({ message: 'Files uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Geet all Events
app.get('/allevents', async (req, res) => {
  try {
    const evns = await Evn.find();
    res.status(200).json(evns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


/////Response ////

app.post('/submitresponse', async (req, res) => {
  try {
    const { name, mobile, email, questionType, comment } = req.body;

    // Create a new response instance
    const newResponse = new Response({
      name,
      mobile,
      email,
      questionType,
      comment,
    });

    // Save the response to the database
    await newResponse.save();

    // Send a success response
    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/responses', async (req, res) => {
  try {
    // Fetch all response documents from the database
    const responses = await Response.find();

    // Send the responses back to the client
    res.status(200).json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


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


  // Define a PUT route to update the pinCodesForAllocation field
app.put('/theatredata/:theatreId', async (req, res) => {
  const { theatreId } = req.params;
  const { pinCodesForAllocation } = req.body;

  try {
    // Find the theatre by ID
    const theatre = await Theatredata.findById(theatreId);

    if (!theatre) {
      return res.status(404).json({ error: 'Theatre not found.' });
    }

    // Update the pinCodesForAllocation field
    theatre.pinCodesForAllocation = pinCodesForAllocation;

    // Save the updated theatre
    await theatre.save();

    res.status(200).json({ message: 'Pin codes updated successfully.' });
  } catch (error) {
    console.error('Error updating pin codes:', error);
    res.status(500).json({ error: 'An error occurred while updating pin codes.' });
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

    const { theatreId, screenId, isActive, cardId, userId, theatreName, showDate, showTime, movieName, isCancel, seats } = bookingData;

    // Check if the seats are already booked for the given movie, date, and showtime
    const existingBooking = await Bookingdata.findOne({
      userId,
      cardId,
      isActive,
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

    // Update isActive field if provided in the request body
    if (updatedData.hasOwnProperty('isActive')) {
      booking.isActive = updatedData.isActive;
    }

    // Check if any other value is changed
    const isDataChanged = Object.keys(updatedData).some(key => key !== 'isActive' && updatedData[key] !== booking[key]);
    if (!isDataChanged) {
      return res.status(400).json({ error: 'No changes detected in the booking data.' });
    }

    // Save the updated booking data
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
