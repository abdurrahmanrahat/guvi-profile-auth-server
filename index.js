const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Middle
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('guvi task is Running!!');
})

app.listen(port, () => {
    console.log(`guvi task is running on port: ${port}`);
})