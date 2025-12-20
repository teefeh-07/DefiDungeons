
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import { handleEvent } from './controller.js';

const app = express();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.post('/api/events', (req, res) => {
    handleEvent(req, res, io);
});

server.listen(port, () => {
    console.log(`Chainhook listener running at http://localhost:${port}`);
});
