import express = require('express');
import cors = require('cors');
import { connectDB } from './Config/DB';

const app = express();
const PORT = 5000;

connectDB();

import permissionsRoute from './Routes/Permissions';

app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: req.body
    });
});

app.use('/api/v1/permissions', permissionsRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});