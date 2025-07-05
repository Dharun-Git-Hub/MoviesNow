const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = 3000;
const app = express();
const upload = multer({ dest: 'upload/' });

app.use(cors());
app.use(express.json());

const uri = process.env.uri;

mongoose.connect(uri)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log(err));

app.use('/users', require('./Routers/userRouter.cjs'));
app.use('/admin', require('./Routers/adminRouter.cjs'));
app.use('/movies', require('./Routers/movieRouter.cjs'));
app.use('/theatres', require('./Routers/theatreRouter.cjs'));
app.use('/tickets', require('./Routers/ticketRouter.cjs'));
app.use('/queries', require('./Routers/queryRouter.cjs'));

app.listen(PORT, () => {
  console.log(`Server Running @Port: ${PORT}`);
});
