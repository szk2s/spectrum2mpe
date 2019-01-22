const port = 1111;
const io = require('socket.io')();
const s2m = require('..');

const sendPartials = async () => {
  const partials = await s2m.txtImport(
    __dirname + '/assets/txt/large_bowl.txt'
  );
  io.on('connection', (client) => {
    client.emit('partials', partials);
  });
  io.listen(port);
  console.log('Sent partials to', port);
};

sendPartials();
