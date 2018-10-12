var tw = document.getElementById("table-wrapper");
var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
var regionFirst = false;
var canvas = document.getElementById("canvas-wrapper");
var svg = document.getElementById("svg-wrapper");   
var saveData = document.getElementById("save");
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

    if (sessionStorage.localData) {
        // console.log(JSON.parse(sessionStorage.localData));
        // list[2].push(JSON.parse(sessionStorage.localData));
        var localData = JSON.parse(sessionStorage.localData);
    getLocalData(localData, list);
    } else {
        getSourceData(list);
    }
    return list;
}

function getLocalData(localData, list) {
    //只有地区，没有商品  地区在前
    if (list[0].length > 0 && list[1].length == 0) {
        regionFirst = true;
        for (var i=0; i<list[0].length; i++) {
            for (var j=0; j<localData.length; j++) {
                if (localData[j].region == list[0][i]) {
                    list[2].push(localData[j]);
                } 
            }
        }
    } else if (list[0].length == 0 && list[1].length > 0) {
        //只有商品，没有地区
        regionFirst = false;
        for (var i=0; i<list[1].length; i++) {
            for (var j=0; j<localData.length; j++) {
                if (localData[j].product == list[1][i]) {
                    list[2].push(localData[j]);
                } 
            }
        }        
    } else if (list[0].length == 1 && list[1].length > 0) {
        //产品和地区都多个时，产品集中，所以先遍历list[1]
        regionFirst = true;
        for (var j=0; j<list[1].length; j++) {
            for (var x=0; x<localData.length; x++) {
                if (localData[x].product == list[1][j] && localData[x].region == list[0][0]) {
                    list[2].push(localData[x]);
                }
            }
        }
    }
    else if (list[0].length > 1 && list[1].length > 0) {
        regionFirst = false;
        for (var i=0; i<list[1].length; i++) {      //产品和地区都多个时，产品集中，所以先遍历list[1]
            for (var j=0; j<list[0].length; j++) {
                for (var x=0; x<localData.length; x++) {
                    if (localData[x].product == list[1][i] && localData[x].region == list[0][j]) {
                        list[2].push(localData[x]);
                    }
                }
            }
        }
    }
    return list;
}

function getSourceData(list) {
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
    console.log(data);
    tw.innerHTML = "";
    //表头
    var table = document.createElement("table");
    table.setAttribute("width", "800");
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
            var input = document.createElement("input");
            input.className = "data";
            input.setAttribute("value", data[2][i].sale[j]);
            // var text = document.createTextNode(data[2][i].sale[j]);
            // td.appendChild(text);
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tw.appendChild(table);
    bundEvent();
    cleanData = [];     //  需每次清空
    for (var i=0; i<data[2].length; i++) {
        cleanData.push(data[2][i].sale)
    }
    console.log(cleanData);
    line.init(cleanData, canvas);
}

function bundEvent() {
    var table = document.querySelector("table");
    var trs = tw.getElementsByTagName("tr");
    //over进入之后每经过一个tr都会触发, enter只在进入时触发一次
    tw.onmouseover = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var data = [];
        if (target.nodeName.toLowerCase() == "td" || target.nodeName.toLowerCase() == "input") {
            //获取tr元素，如果焦点在input上则需要找到父元素的父元素
            if (target.nodeName.toLowerCase() == "input") {
                //保存原始值
                var oldValue = target.value;
                target.onblur = function(e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    if (target.nodeName.toLowerCase() == "input") {
                        var value = target.value;
                        if (/\d/.test(value)) {
            
                        } else {
                            alert("输入内容不是数字！");
                            target.value = oldValue;
                            return;
                        }
                    }
                }
                var tr = target.parentElement.parentElement;
            } else {
                var tr = target.parentElement;
            }
            // console.log(tr);
            var tds = tr.getElementsByTagName("td");
            var length = tds.length;
            var i = 0;
            length == 14 ? i=2 : i=1;
            for (; i<length; i++) {
                // tds[i].getElementsByClassName("data")[0];
                data.push(parseInt(tds[i].getElementsByTagName("input")[0].value));
            }
        }
        line.init(data, canvas);
        bar.init(data, svg);
    }
    tw.onmouseleave = function(e) {
        bar.clearBar();
        line.init(cleanData, canvas);
    }
    //div没有onblur事件
    table.onblur = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLowerCase() == "input") {
            var value = target.value;
            if (/\d/.test(value)) {

            } else {
                alert("输入内容不是数字！");
            }
        }
    }

    saveData.onclick = function(e) {
        var localData = [];
        var trs = table.getElementsByTagName("tr");
        //i=1,跳过表头
        for (var i=1; i<trs.length; i++) {
            var obj = {};
            obj.product = trs[i].getAttribute("product");
            obj.region = trs[i].getAttribute("region");
            var inputs = trs[i].getElementsByTagName("input");
            var array = [];
            for (var j=0; j<inputs.length; j++) {
                array.push(inputs[j].value);
            }
            obj.sale = array;
            localData.push(obj);
        }
        //使用localStorage/sessionStorage存储对象时，需先用JSON.stringify()转化为字符串， 取出时使用JSON.parse()还原
        sessionStorage.localData = JSON.stringify(localData);
    }
}
