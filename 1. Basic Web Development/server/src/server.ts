import express = require('express');
import cors = require('cors');
import { connectDB } from './Config/DB';
import { Permission } from './Model/Permission';
import { seeder } from './Util/Seeder';

const app = express();
const permissions: Permission[] = seeder();
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

app.use('/api/v1/preferences', permissionsRoute);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});