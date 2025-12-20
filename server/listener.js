
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

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

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.post('/api/events', (req, res) => {
    console.log('Received Chainhook Event:', JSON.stringify(req.body, null, 2));

    // Broadcast event to all connected clients
    io.emit('chainhook-event', req.body);

    res.status(200).send('Event received');
});

server.listen(port, () => {
    console.log(`Chainhook listener running at http://localhost:${port}`);
});
