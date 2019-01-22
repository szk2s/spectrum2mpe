const port = 1234;
const io = require('socket.io')();

const sendPlotContent = async () => {
  const trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    mode: 'markers',
    type: 'scatter'
  };

  const trace2 = {
    x: [2, 3, 4, 5],
    y: [16, 5, 11, 9],
    mode: 'lines',
    type: 'scatter'
  };

  const trace3 = {
    x: [1, 2, 3, 4],
    y: [12, 9, 15, 12],
    mode: 'lines+markers',
    type: 'scatter'
  };

  const plotContent = { data: [trace1, trace2, trace3] };

  io.on('connection', (client) => {
    client.emit('plot', plotContent);
  });
  io.listen(port);
  console.log('Sent to', port);
};

sendPlotContent();
