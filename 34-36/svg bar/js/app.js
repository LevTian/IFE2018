var regionWrap = document.getElementById("region-radio-wrapper");
var productWrap = document.getElementById("product-radio-wrapper");
var barWrap = document.getElementById("bar-wrapper");

createCheckBox(regionWrap, ["region", "华东", "华南", "华北"]);
createCheckBox(productWrap, ["product", "手机", "笔记本", "智能音箱"]);
drawBar(sourceData[0], barWrap);