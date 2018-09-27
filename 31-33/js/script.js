var regionWrap = document.getElementById("region-radio-wrapper");
var productWrap = document.getElementById("product-radio-wrapper");
var tw = document.getElementById("table-wrapper");
var months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]

createCheckBox(regionWrap, ["region", "华东", "华南", "华北"]);
createCheckBox(productWrap, ["product", "手机", "笔记本", "智能音箱"]);



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
        for (var i=0; i<list[0].length; i++) {
            for (var j=0; j<sourceData.length; j++) {
                if (sourceData[j].region == list[0][i]) {
                    list[2].push(sourceData[j]);
                } 
            }
        }
    } else if (list[0].length == 0 && list[1].length > 0) {
        //只有商品，没有地区
        for (var i=0; i<list[1].length; i++) {
            for (var j=0; j<sourceData.length; j++) {
                if (sourceData[j].product == list[1][i]) {
                    list[2].push(sourceData[j]);
                } 
            }
        }        
    } else if (list[0].length > 0 && list[1].length > 0) {
        for (var i=0; i<list[0].length; i++) {
            for (var j=0; j<list[1].length; j++) {
                for (var x=0; x<sourceData.length; x++) {
                    if (sourceData[x].product == list[1][j] && sourceData[x].region == list[0][i]) {
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
        var td = document.createElement("td");
        var text = document.createTextNode(data[2][i].product);
        td.appendChild(text);
        tr.appendChild(td);
        var td = document.createElement("td");
        var text = document.createTextNode(data[2][i].region);
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


}

function createCheckBox(wrap, obj) {
    var text = document.createTextNode(obj[0]);
    wrap.appendChild(text);
    var text = document.createTextNode(": ");
    wrap.appendChild(text);
    for (var i=1; i<obj.length; i++) {
        var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("name", obj[0]);
        cb.setAttribute("value", obj[i]);
        cb.setAttribute("checkbox-type", "one");
        cb.setAttribute("id", obj[i]);
        wrap.appendChild(cb);
        var label = document.createElement("label");
        label.setAttribute("for", obj[i]);
        var text = document.createTextNode(obj[i]);
        label.appendChild(text);
        wrap.appendChild(label);
    }
    var cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.setAttribute("checkbox-type", "all");
        cb.setAttribute("id", "id"+obj[0]);
        cb.setAttribute("name", obj[0]);
        wrap.appendChild(cb);
        var label = document.createElement("label");
        label.setAttribute("for", "id"+obj[0]);
        var text = document.createTextNode("全选");
        label.appendChild(text);
        wrap.appendChild(label);

    wrap.onclick = function(e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        var type = target.getAttribute("checkbox-type");
        var name = target.getAttribute("name");
        var inputs = document.getElementsByName(name);
        var length = inputs.length;

        if (type == "one") {
            if (target.checked) {
                var num = 0;
                //因为是操作最后一个，不计算最后一个
                for (var i=0; i<length-1; i++) {
                    if (inputs[i].checked) {
                        num++;
                    }
                }
                if (length-1 == num) {
                    inputs[length-1].checked = true;
                }
            } else {
                var num = 0;
                //判断最后一个，所以计算全部
                for (var i=0; i<length; i++) {
                    if (inputs[i].checked) {
                        num++;
                    }
                }
                //如果最后一个被取消掉，从新选择
                if (0 == num) {
                    target.checked = true;
                } else if (length-1 == num) {
                    //如果全选后，取消掉其中一个，取消全选
                    inputs[length-1].checked = false;
                }
            }
        } else if (type == "all") {
            if (target.checked) {
                for (var i=0; i<length-1; i++) {
                    inputs[i].checked = true;
                }
            } else {
                for (var i=0; i<length-1; i++) {
                    inputs[i].checked = false;
                }
            }
            
        }
        var data = getData();
        drawTable(data);
    }
}