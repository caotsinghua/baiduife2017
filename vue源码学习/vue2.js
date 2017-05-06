'use strict';
!(function(global,factory){
	if(typeof exports==='object'&&typeof module !=='undefined')//是否支持commonjs
		module.exports=factory();
	else if(typeof define==='function'&&define.amd)//是否支持amd
		define(factory);
	else
		global.MyVue=factory();
}(this,function(){
	let Observer=function(data){
		this.data=data;
		this.watch(data);
		this.eventBus=new Event();
	}
	Observer.prototype.watch=function(data){
		let val;
		for(let key in data){
			if(data.hasOwnProperty(key)){
				val=data[key];
				if(typeof val==='object'){
					new Observer(val);
				}
				this.addSetterAndGetter(key,val);
			}
		}
	}
	Observer.prototype.addSetterAndGetter=function(key,val){
		let _this=this;
		Object.defineProperty(this.data,key,{
			enumerable:true,
			configurable:true,
			set:function(newVal){
				if(newVal==val){
					console.log('两次设置的值一样')
					return;
				}
				val=newVal;
				_this.eventBus.emit(key,val,newVal);//触发事件
				if(typeof newVal==='object'){//设置值为对象，对这个对象进行监听
					new Observer(val)
				}
				
			},
			get:function(){
				console.log('你访问了'+key+' :'+val);
				return val;
			}
		})
	}

	let Event=function(){//事件触发器
		this.events={}
	}
	Event.prototype.on=function(attr,cb){
		//将事件名称为attr加如事件的属性，并添加回调函数
		if(this.events[attr]){
			this.events[attr].push(cb)
		}else{
			this.events[attr]=[cb];
		}
	}

	Event.prototype.off=function(attr){
		for(let key in this.events){
			if(this.events.hasOwnProperty(key)&&key===attr){
				//删除events的指定事件名称的属性
				delete this.events[key]
			}
		}
	}
	Event.prototype.emit=function(attr,...arg){
		//attr为监听的事件名称，arg为回调函数的参数
		this.events[attr]&&this.events[attr].forEach(item=>{
			item(...arg);
			//依次触发该事件下的函数
		})
	}
	Observer.prototype.$watch=function(attr,callback){//添加watch触发器
		this.eventBus.on(attr,callback);
		// 当使用a.$watch('key',function(){
		// 
		// })
	}
	return Observer;
}))
