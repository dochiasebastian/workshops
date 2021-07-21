import express = require('express');
import cors = require('cors');
import { connectDB } from './Config/DB';
import errorHandler from './Middleware/Error';
import permissionsRoute from './Routes/Permissions';
import authRoute from './Routes/Auth';

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: req.body
    });
});

app.use('/api/v1/permissions', permissionsRoute);
app.use('/api/v1/auth', authRoute);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});