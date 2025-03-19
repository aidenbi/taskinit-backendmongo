const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const cors = require('cors');
const cookieParser = require('cookie-parser');


//Middlewares
app.use(cors({ credentials: true, origin: process.env.REACT_APP_CORS_LINK }));
app.use(express.json());
app.use(cookieParser());

//Import Routes
const tasksRoute = require('./routes/tasks');
const followingRoute = require('./routes/following');
const authRoute = require('./routes/auth');

app.use('/api/user', authRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/following', followingRoute);



//ROUTES
app.get('/', (req, res) => {
    res.send('hello')
});



//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
    console.log('connected to DB!')
);

//How do we start listening to the server
app.listen(process.env.PORT || 3000);