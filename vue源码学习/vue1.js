'use strict';
!(function(global, factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') //是否支持commonjs
		module.exports = factory();
	else if (typeof define === 'function' && define.amd) //是否支持amd
		define(factory);
	else
		global.MyVue = factory();
}(this, function() {
	let Observer = function(data) {
		this.data = data;
		this.walk(data);
	}
	Observer.prototype.walk = function(obj) {
		let val;
		for (let key in obj) { //递归遍历，查看对象所有属性
			if (obj.hasOwnProperty(key)) {
				val = obj[key];
				if (typeof val === 'object') {
					new Observer(val);
				}
				this.convert(key, val)
			}
		}
	}
	Observer.prototype.convert = function(key, val) {
		Object.defineProperty(this.data, key, {
			enumerable: true,
			configurable: true,
			get: function() {
				console.log('你访问了' + key);
				return val;
			},
			set: function(newVal) {
				console.log('你设置了新的值' + key + '=' + newVal);
				if (newVal === val) {
					console.log('值一样');
					return;
				}
				val = newVal;
				/**
				*我的看法如下：
				此问题与是否是引用类型无关；
				此问题本质上是闭包使得变量的值始终保存在内存中。
				详细解析：虽然 val 只是一个形参，但是其本质上是在函数 convert 的作用域内定义了一个局部变量。
				一般来说，此局部变量 val 在 convert 执行结束之后应该销毁才是。
				但是，由于在 convert 中又定义了函数getter 和 setter（函数套函数），
				且使用了变量 val。因此，形成闭包，使得 val 始终保留在内存中。换句话说，每一次执行 convert 函数，
				就会多一个 val 变量存储在内存中，
				且这些 val 的值各不相同。因此，当你想设置某个 key 的值得时候，
				只需要通过 setter 把 newVal 赋值给对应的 val；当你想读取 key 的值得时候，
				通过 getter 返回对应的 val 变量就是 data.key 的实际值了。
				*/
				// 数据属性包含四个特性：[[Configurable]]，[
				// 	[Enumerable]
				// ], [
				// 	[Writable]
				// ], [
				// 	[Value]
				// ], 我们直接通过字面量形式声明一个对象
				// var person = {
				// 	name: "Nill"
				// }
				// 通过person.name //Nill 访问对象属性时，其实直接读取的是[[Value]]上的值，同理，通过person.name = "Nike" 设置对象属性时，其实是直接[[Value]]被设置为了指定的值。
				// 访问器属性也有四个特性: [
				// 	[Configurable]
				// ]，[
				// 	[Enumerable]
				// ], [
				// 	[Get]
				// ], [
				// 	[Set]
				// ]。 不同于数据属性，[[Get]] 是用于读取对象属性的函数，[[Set]] 是用于设置对象属性的函数。 在JavaScript中我们使用Object.defineProperty来定义访问器属性：
				// Object.defineProperty(person, "name", {
				// 	get: function() {
				// 		return this.name;
				// 	},
				// 	set: function(newVal) {
				// 		this.name = newVal;
				// 	}
				// });
				// 此时我们再执行person.name // Nill ,现在就调用的是get函数了。同理person.name = "Nike"调用的是set函数。set和get都不是必须的。两者都不存在的时，当然按数据属性处理。当只指定get时，表示属性不能写，只能读。此时尝试去写入时会抛出错误。当只指定set时，表示属性只能写，不能读。此时尝试读取，严格模式下会报错，非严格模式下会返回undefined。注释掉get中的返回语句就相当于属性只写。
				console.log(key + '现在为' + this[key]);
			}
		})
	}
	return Observer;
}))