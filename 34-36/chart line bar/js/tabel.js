var tw = document.getElementById("table-wrapper");
var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
var regionFirst = false;
var canvas = document.getElementById("canvas-wrapper");
var svg = document.getElementById("svg-wrapper");   
var line = new line();
var bar = new bar();
var cleanData = [];



function getData() {
    var inputs = document.getElementsByTagName("input");
    var list = new Array();
    list[0] = new Array();      //region
    list[1] = new Array();      //product
    list[2] = new Array();      //
    
    for (var i=0; i<inputs.length; i++) {
        if (inputs[i].checked){
            if (inputs[i].getAttribute("checkbox-type") == "one") {
                if (inputs[i].getAttribute("name") == "region") {
                    list[0].push(inputs[i].value);
                } else {
                    list[1].push(inputs[i].value);
                }
            }
        }
    }
    //只有地区，没有商品  地区在前
    if (list[0].length > 0 && list[1].length == 0) {
        regionFirst = true;
        for (var i=0; i<list[0].length; i++) {
            for (var j=0; j<sourceData.length; j++) {
                if (sourceData[j].region == list[0][i]) {
                    list[2].push(sourceData[j]);
                } 
            }
        }
    } else if (list[0].length == 0 && list[1].length > 0) {
        //只有商品，没有地区
        regionFirst = false;
        for (var i=0; i<list[1].length; i++) {
            for (var j=0; j<sourceData.length; j++) {
                if (sourceData[j].product == list[1][i]) {
                    list[2].push(sourceData[j]);
                } 
            }
        }        
    } else if (list[0].length == 1 && list[1].length > 0) {
        //产品和地区都多个时，产品集中，所以先遍历list[1]
        regionFirst = true;
        for (var j=0; j<list[1].length; j++) {
            for (var x=0; x<sourceData.length; x++) {
                if (sourceData[x].product == list[1][j] && sourceData[x].region == list[0][0]) {
                    list[2].push(sourceData[x]);
                }
            }
        }
    }
    else if (list[0].length > 1 && list[1].length > 0) {
        regionFirst = false;
        for (var i=0; i<list[1].length; i++) {      //产品和地区都多个时，产品集中，所以先遍历list[1]
            for (var j=0; j<list[0].length; j++) {
                for (var x=0; x<sourceData.length; x++) {
                    if (sourceData[x].product == list[1][i] && sourceData[x].region == list[0][j]) {
                        list[2].push(sourceData[x]);
                    }
                }
            }
        }
    }
    return list;
}

//渲染表格
function drawTable(data) {

    tw.innerHTML = "";
    //表头
    var table = document.createElement("table");
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    var text = document.createTextNode("商品");
    th.appendChild(text);
    tr.appendChild(th);
    var th = document.createElement("th");
    var text = document.createTextNode("地区");
    th.appendChild(text);
    tr.appendChild(th);
    for (var i=0; i<months.length; i++) {
        var vth = document.createElement("th");
        var text = document.createTextNode(months[i]);
        vth.appendChild(text);
        tr.appendChild(vth);
    }
    table.appendChild(tr);
    //
    for (var i=0; i<data[2].length; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("product", data[2][i].product);
        tr.setAttribute("region", data[2][i].region);
        var td = document.createElement("td");
        if (regionFirst) {
            var text = document.createTextNode(data[2][i].region);
        } else {
            var text = document.createTextNode(data[2][i].product);
        }
        //只选中其中一个，第一列三行相同
        if ((data[0].length > 0 && data[1].length == 0) || (data[0].length == 0 && data[1].length > 0)) {
            if ((i+1)%3 == 1) {
                td.setAttribute("rowspan", "3");
                td.appendChild(text);
                tr.appendChild(td);
            } else {

            }
        } else if ((data[0].length == 1 && data[1].length > 1) || (data[0].length > 1 && data[1].length == 1) || (data[0].length > 1 && data[1].length > 1)) {
            //其中一个只选中一个，或者每个都选中多个，根据长度判断
            var length = 0;
            if (regionFirst) {
                length = data[1].length;
            } else {
                length = data[0].length;
            }
            if ((i+1)%length == 1) {
                td.setAttribute("rowspan", length);
                td.appendChild(text);
                tr.appendChild(td);
            } else {

            }
        } else {
            td.appendChild(text);
            tr.appendChild(td);
        }
        
        var td = document.createElement("td");
        if (regionFirst) {
            var text = document.createTextNode(data[2][i].product);
        } else {
            var text = document.createTextNode(data[2][i].region);
        }
        
        td.appendChild(text);
        tr.appendChild(td);
        for (var j=0; j<data[2][i].sale.length; j++) {
            var td = document.createElement("td");
            var text = document.createTextNode(data[2][i].sale[j]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tw.appendChild(table);
    bundHoverEvent();
    for (var i=0; i<data[2].length; i++) {
        cleanData.push(data[2][i].sale)
    }
    line.init(cleanData, canvas);
}

function bundHoverEvent() {
    var trs = tw.getElementsByTagName("tr");
    //over进入之后每经过一个tr都会触发, enter只在进入时触发一次
    tw.onmouseover = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var data = [];
        if (target.nodeName.toLowerCase() == "td") {
            var tr = target.parentElement;
            var tds = tr.getElementsByTagName("td");
            var length = tds.length;
            var i = 0;
            length == 14 ? i=2 : i=1;
            for (; i<length; i++) {
                data.push(parseInt(tds[i].innerText));
            }
        }
        line.init(data, canvas);
        bar.init(data, svg);
    }
    tw.onmouseleave = function(e) {
        line.init(cleanData, canvas);
        bar.clearBar();
    }
}