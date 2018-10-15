var tw = document.getElementById("table-wrapper");
var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
var regionFirst = false;
var canvas = document.getElementById("canvas-wrapper");
var svg = document.getElementById("svg-wrapper");   
var saveData = document.getElementById("save");
var clearData = document.getElementById("clear");
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

    if (localStorage.localData) {
        var localData = JSON.parse(localStorage.getItem("localData"));
        getLocalData(localData, list);
    } else {
        getSourceData(list);
    }

    // console.log(list);
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
            // var input = document.createElement("input");
            // input.className = "data";
            // input.setAttribute("value", data[2][i].sale[j]);
            // td.appendChild(input);
            var text = document.createTextNode(data[2][i].sale[j]);
            td.appendChild(text);
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
    line.init(cleanData, canvas);
}

function bundEvent() {
    var table = document.querySelector("table");
    var tds = tw.getElementsByTagName("td");

    for (var i=0; i<tds.length; i++) {
        tds[i].onmouseenter = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var data = [];
            var tr = target.parentElement;
            var tds = tr.getElementsByTagName("td");
            var length = tds.length;
            var i = 0;
            length == 14 ? i=2 : i=1;
            for (; i<length; i++) {
                data.push(parseInt(tds[i].innerText));
            }
            var span = document.createElement("span");
            span.className = "edit";
            var text = document.createTextNode("编辑");
            span.appendChild(text);
            target.appendChild(span);
            line.init(data, canvas);
            bar.init(data, svg);
        }
        tds[i].onmouseleave = function(e) {
            var span = this.getElementsByTagName("span")[0];
            var buttons = this.getElementsByTagName("button");
            var input = this.getElementsByTagName("input")[0];
            //此处需要先做判断，有可能在点击时已经删除了
            if (input) {
                var oldValue = input.getAttribute("oldValue");
                this.removeChild(input);
                //先移除0会报错，不知怎么回事
                this.removeChild(buttons[1]);
                this.removeChild(buttons[0]);
                this.innerText = oldValue;
            }
            if (span) {
                this.removeChild(span);
            }
            bar.clearBar();
            line.init(cleanData, canvas);
        }
        
    }

    //over进入之后每经过一个tr都会触发, enter只在进入时触发一次
    // tw.onmouseenter = function(e) {
    //     e = e || window.event;
    //     var target = e.target || e.srcElement;
    //     var data = [];
    //     for (var k in target) {
    //         console.log(k, target[k]);
    //     }
    //     if (target.nodeName.toLowerCase() == "td") {
    //         var tr = target.parentElement;
    //         var tds = tr.getElementsByTagName("td");
    //         var length = tds.length;
    //         var i = 0;
    //         length == 14 ? i=2 : i=1;
    //         for (; i<length; i++) {
    //             data.push(parseInt(tds[i].innerText));
    //         }
    //         var span = document.createElement("span");
    //         span.className = "edit";
    //         var text = document.createTextNode("编辑");
    //         span.appendChild(text);
    //         target.appendChild(span);
    //     }
    //     line.init(data, canvas);
    //     bar.init(data, svg);
    // }

    // tw.onmouseout = function(e) {
    //     e = e || window.event;
    //     var target = e.target || e.srcElement;
    //     if (target.nodeName.toLowerCase() == "td") {
    //         var span = target.getElementsByTagName("span")[0];
    //         //此处需要先做判断，有可能在点击时已经删除了
    //         if (span) {
    //             target.removeChild(span);
    //         }

    //     }
    //     bar.clearBar();
    //     line.init(cleanData, canvas);
    // }
    tw.onclick = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.nodeName.toLowerCase() == "td") {
            var span = target.getElementsByTagName("span")[0];
            if (span) {
                target.removeChild(span);
            }
            var value = target.innerText;
            target.innerHTML = "";
            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.className = "edit-input";
            input.setAttribute("value", value);
            input.setAttribute("oldValue", value);
            target.appendChild(input);
            var btnConfirm = document.createElement("button");
            btnConfirm.setAttribute("id", "btn-confirm");
            var text = document.createTextNode("确认");
            btnConfirm.appendChild(text);
            target.appendChild(btnConfirm);
            var btnCancel = document.createElement("button");
            btnCancel.setAttribute("id", "btn-cancel");
            var text = document.createTextNode("取消");
            btnCancel.appendChild(text);
            target.appendChild(btnCancel);

            btnConfirm.onclick = confirmOpt;

            btnCancel.onclick = cancelOpt;

            input.onkeydown = function(e) {
                e = e || window.event;
                var target = e.target || e.srcElement;
                var key = e.keyCode;
                if (13 == key) {
                    confirmOpt();
                }
                else if (27 == key) {
                    cancelOpt();
                }
            }

            // input.onblur = cancelOpt;

            function confirmOpt() {
                var value = input.value;
                if (/^\d+$/.test(value)) {
                    target.innerText = value;
                } else {
                    alert("输入内容不是数字！");
                    var oldValue = input.getAttribute("oldValue");
                    target.innerText = oldValue;
                    return;
                }
            }

            function cancelOpt() {
                var oldValue = input.getAttribute("oldValue");
                target.innerText = oldValue;
            }
        }
    }
    // div没有onblur事件
    table.onblur = function(e) {
        alert("blur");
        e = e || window.event;
        var target = e.target || e.srcElement;
        console.log(target);
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
            // var inputs = trs[i].getElementsByTagName("input");
            var tds = trs[i].getElementsByTagName("td");
            var array = [];
            var j;  //因为有单元格合并，所以td的长度为14/13，需判断
            if (14 == tds.length) {
                j = 2;
            } else {
                j = 1;
            }
            for (; j<tds.length; j++) {
                array.push(tds[j].innerText);
            }
            obj.sale = array;
            localData.push(obj);
        }
        //使用localStorage/localStorage存储对象时，需先用JSON.stringify()转化为字符串， 取出时使用JSON.parse()还原
        // console.log(localData);
        localStorage.setItem("localData", JSON.stringify(localData));
    }
}

clearData.onclick = function(e) {
    localStorage.removeItem("localData");
}
