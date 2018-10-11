var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
function drawBar(obj, wrap) {
    svg.setAttribute("width", "700");
    svg.setAttribute("height", "600");
    var axisWidth = 650;
    var axisHeight = 500;
    var width = 40;
    var interval = 10;
    var color = "red";
    var axisColor = "blue";

    var max = 0;
    for (var i=0; i<obj.sale.length; i++) {
        if (obj.sale[i] > max) {
            max = obj.sale[i];
        }
    }
    //最大值
    var ratio = axisHeight/max;
    console.log(ratio);
    //X轴
    var axisX = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisX.setAttribute("x1", "0");
    axisX.setAttribute("y1", axisHeight);
    axisX.setAttribute("x2", axisWidth);
    axisX.setAttribute("y2", axisHeight);
    axisX.setAttribute("stroke", axisColor);
    svg.appendChild(axisX);
    //y轴
    var axisY = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisY.setAttribute("x1", "0");
    axisY.setAttribute("y1", axisHeight);
    axisY.setAttribute("x2", "0");
    axisY.setAttribute("y2", "0");
    axisY.setAttribute("stroke", axisColor);
    svg.appendChild(axisY);

    for (var i=0; i<obj.sale.length; i++) {
        var height = Math.round(obj.sale[i]*ratio);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", interval + i*(width+interval));
        rect.setAttribute("y", axisHeight - height);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", color);
        svg.appendChild(rect);
    }
    wrap.appendChild(svg);
}