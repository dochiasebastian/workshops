import express = require('express');
import cors = require('cors');
import { connectDB } from './Config/DB';
import { Permission } from './Model/Permission';
import { seeder } from './Util/Seeder';

const app = express();
let permissions: Permission[] = seeder();

connectDB();

app.use(cors());

app.use(express.json());

app.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: req.body
    });
});

app.post('/pref/create', (req, res) => {
    permissions.push(req.body);

    res.status(200).json({
        success: true,
        data: permissions
    });
});

app.delete('/pref/delete', (req, res) => {
    permissions = permissions.filter((el: Permission) => el.id !== req.body.name);

    res.status(200).json({
        success: true,
        data: permissions
    });
});

app.get('/pref', (req, res) => {
    res.status(200).json({
        success: true,
        data: permissions
    });
})

app.put('/pref/update', (req, res) => {
    permissions[req.body.index].type = req.body.type;
    permissions[req.body.index].text = req.body.text;

    res.status(200).json({
        success: true,
        data: permissions
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});