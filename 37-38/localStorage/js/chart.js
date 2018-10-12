function line() {
    this.data = new Array(),
    this.height = 600;
    this.width = 600;
    this.axisWidth = 550;
    this.axisHight = 550;
    this.dotRadius = 3;
    this.dotColor = "#000000";
    this.lineColor = ["#00CCFF", "#CC33FF", "#66FFFF", "#FF3030", "#ADFF2F", "#CC66CC", "#FFCCFF", "#6633FF", "#CCFF99", "#6699FF"];
    this.lineWidth = 2;
    this.interval = 40;
    this.ratio = 0;
    this.max = 0;
    this.canvas = null;
    this.ctx = null;

    this.init = function(obj, canvas) { 
        this.data = obj;
        this.canvas = canvas;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.ctx = this.canvas.getContext("2d");
        //max必须每次清零，否则当取到最大值时，某一行比它小的最大值就取不到
        this.max = 0;
        for (var i=0; i<this.data.length; i++) {
            if (this.data[i] instanceof Array) {
                for (var j=0; j<this.data[i].length; j++) {
                    var num = parseInt(this.data[i][j])
                    if (num  > this.max) {
                        this.max = num;
                    }
                }
            } else {
                if (this.data[i] > this.max) {
                    this.max = this.data[i];
                }
            } 
        }
        this.ratio = (this.axisHight-50)/this.max;
        if (this.data[0] instanceof Array) {
            this.drawMore();
        } else {
            this.drawOne();
        }
    };

    this.drawAxis = function() {
        this.ctx.beginPath();
        //x轴
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(this.axisWidth, this.height);
        //y
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(0, this.height-this.axisHight);
        this.ctx.stroke();
    }

    this.drawOne = function() {
        this.drawAxis();
        var prevx = 0;
        var prevy = 0;
        for (var i=0; i<this.data.length; i++) {
            var x = i*this.interval;
            var y = this.height-this.ratio*this.data[i];
            this.ctx.beginPath();
            this.ctx.fillStyle = this.dotColor;
            this.ctx.arc(x, y, this.dotRadius, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
            if (i != 0) {
                this.ctx.strokeStyle = this.lineColor[0];
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.beginPath();
                this.ctx.moveTo(prevx, prevy);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
            }
            prevx = x;
            prevy = y;
        }
    };

    this.drawMore = function() {
        this.drawAxis();
        var prevx = 0;
        var prevy = 0;
        for (var i=0; i<this.data.length; i++) {
            for (var j=0; j<this.data[i].length; j++) {
                var x = j*this.interval;
                var y = this.height-this.ratio*parseInt(this.data[i][j]);
                this.ctx.beginPath();
                this.ctx.fillStyle = this.dotColor;
                this.ctx.arc(x, y, this.dotRadius, 0, Math.PI*2, true);
                this.ctx.closePath();
                this.ctx.fill();
                if (j != 0) {
                    this.ctx.strokeStyle = this.lineColor[i];
                    this.ctx.lineWidth = this.lineWidth;
                    this.ctx.beginPath();
                    this.ctx.moveTo(prevx, prevy);
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
                prevx = x;
                prevy = y;
            }
        }
    };
};

function bar() {
    this.data = new Array(),
    this.height = 600;
    this.width = 700;
    this.axisWidth = 650;
    this.axisHight = 550;
    this.barWidth = 40;
    this.interval = 10;
    this.color = "#ff0000";
    this.axisColor = "#000000";
    this.max = 0;
    this.ratio = 0;
    this.svg = null;
    this.wrap = null;

    this.init = function(obj, wrap) {
        this.data = obj;
        this.wrap = wrap;
        this.max = 0;
        for (var i=0; i<obj.length; i++) {
            if (obj[i] > this.max) {
                this.max = this.data[i];
            }
        }
        this.ratio = (this.axisHight-50)/this.max;
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("width", this.width);
        this.svg.setAttribute("height", this.height);
        this.clearBar();
        this.draw();
    };

    this.clearBar = function() {
        this.wrap.innerHTML = "";
    };

    this.draw = function() {
        //X轴
        var axisX = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axisX.setAttribute("x1", "0");
        axisX.setAttribute("y1", this.height);
        axisX.setAttribute("x2", this.axisWidth);
        axisX.setAttribute("y2", this.height);
        axisX.setAttribute("stroke", this.axisColor);
        this.svg.appendChild(axisX);
        //y轴
        var axisY = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axisY.setAttribute("x1", "0");
        axisY.setAttribute("y1", this.height);
        axisY.setAttribute("x2", "0");
        axisY.setAttribute("y2", this.height-this.axisHight);
        axisY.setAttribute("stroke", this.axisColor);
        this.svg.appendChild(axisY);

        for (var i=0; i<this.data.length; i++) {
            var height = this.height - this.data[i]*this.ratio;
            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", this.interval + i*(this.barWidth+this.interval));
            rect.setAttribute("y", height);
            rect.setAttribute("width", this.barWidth);
            rect.setAttribute("height", this.height-1);
            rect.setAttribute("fill", this.color);
            this.svg.appendChild(rect);
        }
        this.wrap.appendChild(this.svg);
    };
}