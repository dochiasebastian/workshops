import express = require('express');
import color from 'colorts';
import cors = require("cors");
import { Permission } from './Model/Permission';

const app = express();
let permissions: Permission[] = [];

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

app.post('/pref/create', (req, res) => {
    permissions.push(req.body);

    res.status(200).json({
        success: true,
        data: permissions
    });
});

app.delete('/pref/delete', (req, res) => {
    permissions = permissions.filter((el: Permission) => el.id !== req.body.target.name);

    res.status(200).json({
        success: true,
        data: permissions
    });
});

app.put('pref/update', (req, res) => {
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

process.once('SIGUSR2', () => {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
    // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});