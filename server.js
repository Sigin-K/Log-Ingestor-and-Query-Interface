const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/logs', { useNewUrlParser: true, useUnifiedTopology: true });


const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String
  }
});


const Log = mongoose.model('Log', logSchema);

app.use(bodyParser.json());


app.post('/logs', async (req, res) => {
  const logData = req.body;
 
  const log = new Log(logData);
  await log.save();
  res.status(200).send('Log received and stored successfully.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
