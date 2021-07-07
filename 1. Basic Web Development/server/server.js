const express = require('express');
const colors = require('colors');
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
    console.log(req.body);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    res.status(200).json({
        success: true,
        data: req.body
    });
});

app.listen(3000, console.log("Server running on port 3000".brightBlue.bold));