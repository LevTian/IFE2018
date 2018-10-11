var regionWrap = document.getElementById("region-radio-wrapper");
var productWrap = document.getElementById("product-radio-wrapper");
var canvas = document.getElementById("canvas-wrapper");

createCheckBox(regionWrap, ["region", "华东", "华南", "华北"]);
createCheckBox(productWrap, ["product", "手机", "笔记本", "智能音箱"]);
drawLine(sourceData[0], canvas);