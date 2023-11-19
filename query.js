const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.QUERY_PORT || 4000;


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


app.get('/logs', async (req, res) => {
  
  const filteredLogs = await filterLogs(req.query);
  res.json(filteredLogs);
});


async function filterLogs(query) {
  try {
    
    const mongoQuery = {};

    if (query.level) {
      mongoQuery.level = query.level;
    }

    if (query.message) {
      mongoQuery.message = { $regex: query.message, $options: 'i' }; // Case-insensitive search
    }

    if (query.resourceId) {
      mongoQuery.resourceId = query.resourceId;
    }

    
    const logs = await Log.find(mongoQuery);
    return logs;
  } catch (error) {
    console.error(`Error filtering logs: ${error}`);
    throw error;
  }
}


app.listen(PORT, () => {
  console.log(`Query interface is running on http://localhost:${PORT}`);
});
