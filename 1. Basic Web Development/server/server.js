const express = require('express');
const colors = require('colors');

const app = express();

app.use(express.json());

app.post('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen(3000, console.log("Server running on port 3000".brightBlue.bold));