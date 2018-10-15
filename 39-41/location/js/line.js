

function drawLine(obj, canvas) {
    var height = 600;
    var width = 700;
    canvas.height = height;
    canvas.width = width;
    var ctx = canvas.getContext("2d");

    var axisWidth = 650;
    var axisHeight = 550;

    var dotRadius = 5;
    var dotColor = "#000000";
    var lineColor = "#0000ff";
    var lineWidth = 2;
    var interval = 40;

    var max = 0;
    for (var i=0; i<obj.sale.length; i++) {
        if (obj.sale[i] > max) {
            max = obj.sale[i];
        }
    }

    var ratio = (axisHeight-50)/max;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(axisWidth, height);
    ctx.moveTo(0, height);
    ctx.lineTo(0, height-axisHeight);
    ctx.stroke();
    var prevx = 0;
    var prevy = 0;
    for (var i=0; i<obj.sale.length; i++) {
        ctx.beginPath();
        var x = i*interval;
        var y = height - ratio*obj.sale[i];
        ctx.fillStyle = dotColor;
        ctx.arc(x, y, dotRadius, 0, Math.PI*2, true);
        ctx.fill();
        if (0 != i) {
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(prevx, prevy);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        prevx = x;
        prevy = y;
    }
}