function Restaurant(obj) {
    this.cash = obj.cash;
    this.seats = obj.seats;
    this.staff = obj.staff;
}

Restaurant.prototype.hire = function(staff) {
    this.staff.push(staff);
}

Restaurant.prototype.fire = function(staff) {
    //删除特定值，使用splice.第一个参数位置，第二个位置删除的数目，第三个替换的值，删除则不传值
    this.staff.splice(this.staff.indexOf(staff), 1);
}

function Staff(id, name, salary) {
    this.id = id;
    this.name = name;
    this.salary = salary;
}
Staff.prototype.work = function() {
    console.log("staff working...");
}

function Waiter(id, name, salary) {
    Staff.call(this, id, name, salary);
}
Waiter.prototype = Object.create(Staff.prototype);
Waiter.prototype.constructor = Waiter;
Waiter.prototype.work = function(wk) {
    if (wk instanceof Array) {
        console.log("点菜...");
    } else {
        console.log("上菜...");
    }
}

function Cook(id, name, salary) {
    Staff.call(this, id, name, salary);
}
Cook.prototype = Object.create(Staff.prototype);
Cook.prototype.constructor = Cook;
Cook.prototype.work = function(wk) {
    console.log("做菜...");
}

function Customer() {

}
Customer.prototype.order = function() {
    console.log("点菜...");
}
Customer.prototype.eat = function() {
    console.log("细嚼慢咽...");
}

function Dish(name, cost, price) {
    this.name = name;
    this.cost = cost;
    this.price = price;
}