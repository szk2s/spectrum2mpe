var GRAPH = document.getElementById('graph');
Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-line1.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) 
        { return row[key]; }); 
    }
        
    var x = unpack(rows , 'x');
    var y = unpack(rows , 'y');
    var z = unpack(rows , 'z'); 
    var c = unpack(rows , 'color');

    var data = [{
        type: 'scatter3d',
        mode: 'lines',
        x: x,
        y: y,
        z: z,
        opacity: 1,
        line: {
            width: 6,
            color: c,
            reversescale: false
        }
    }];

    var layout = {
        title: '3D Lines',
        font: {size: 18}
    };

    Plotly.plot( GRAPH, data, layout, {responsive: true});
});