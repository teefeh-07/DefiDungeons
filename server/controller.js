
export const handleEvent = (req, res, io) => {
    console.log('Received Chainhook Event:', JSON.stringify(req.body, null, 2));

    // Broadcast event to all connected clients
    io.emit('chainhook-event', req.body);

    res.status(200).send('Event received');
};
