var c2e = {
    "华东" : "hd",
    "华南" : "hn",
    "华北" : "hb",
    "手机" : "ph",
    "笔记本" : "pc",
    "智能音箱" : "bx",
    "idproduct" : "ip",
    "idregion" : "id",
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
        var id = target.getAttribute("id");
        var inputs = document.getElementsByName(name);
        var length = inputs.length;

        
        if (type == "one") {
            if (target.checked) {
                window.location.hash += c2e[id];
                var num = 0;
                //因为是操作最后一个，不计算最后一个
                for (var i=0; i<length-1; i++) {
                    if (inputs[i].checked) {
                        num++;
                    }
                }
                if (length-1 == num) {
                    inputs[length-1].checked = true;
                    //如果前三个被选中，则全选会自动选中
                    var allId = inputs[length-1].getAttribute("id");
                    window.location.hash += c2e[allId];
                }
            } else {
                var oldValue = window.location.hash;
                window.location.hash = oldValue.replace(c2e[id], "");
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
                    var allId = inputs[length-1].getAttribute("id");
                    var oldValue = window.location.hash;
                    window.location.hash = oldValue.replace(c2e[allId], "");
                }
            }
        } else if (type == "all") {
            if (target.checked) {
                window.location.hash += c2e[id];
                for (var i=0; i<length-1; i++) {
                    inputs[i].checked = true;
                    var oneId = inputs[i].getAttribute("id");
                    var oldValue = window.location.hash;
                    console.log(oneId, oldValue);
                    if (oldValue.match(c2e[oneId])) {

                    } else {
                        window.location.hash += c2e[oneId];
                    }
                }
            } else {
                var oldValue = window.location.hash;
                window.location.hash = oldValue.replace(c2e[id], "");
                for (var i=0; i<length-1; i++) {
                    inputs[i].checked = false;
                }
            }
            
        }
        var data = getData();
        drawTable(data);
    }
}

function autoCheck() {
    var checks = window.location.hash.slice(1);
    // var length = checks.length/2;   //两个字母
    console.log(checks);
    var key = [];
    for (var i=0; i<checks.length; i+=2) {
        var value = checks.slice(i, i+2);
        for (var k in c2e) {
            if (c2e[k] == value) {
                key.push(k);
                break;
            }
        }
    }
    if (key.length > 0) {
        for (var j=0; j<key.length; j++) {
            var input = document.getElementById(key[j]);
            input.checked = true;
        }
        var data = getData();
        drawTable(data);
    }
    

}
