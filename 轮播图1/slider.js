'use strict'
let slider=(function(global){
	let sliderWrap=document.querySelector('.slider'),
		sliderItems=document.querySelectorAll('.slider .slider-item'),
		controlsWrap=document.querySelector('.controls-wrap');

	let itemWidth=sliderWrap.clientWidth;//获取轮播宽度
	let config={
		duration:2000,
		autoplay:false,
		type:'fade'
	};
	let constructor=function(obj1,obj2,config1){
		sliderWrap=obj1;
		controlsWrap=obj2;
		obj1.childNodes.forEach(item=>{
			if(item.nodeType!=1){
				obj1.removeChild(item);
			}
		})
		sliderItems.obj1.childNodes;
		this.config=config1;//构造函数
	}
	constructor.prototype.prev=function(){//向前切换

	}
	constructor.prototype.next=function(){//向后切换
		
	}
	function createControls(wrap){//添加控制器
		let len=sliderItems.length;
		let controls=document.createElement('ul');
		controls.setAttribute('class','controls');
		for(let i=0;i<len;i++){
			let item=document.createElement('li');
			item.setAttribute('class','control-circle');
			controls.appendChild(item);
		}
		controls.firstChild.classList.add('control-circle-active');
		wrap.appendChild(controls);
		return controls;
	}
	function changeControl(index){
		controlItems.forEach(item=>{
			item.classList.remove('control-circle-active')
		})
		controlItems[index].classList.add('control-circle-active');//控制器切换
	}
	let controlItems=createControls(controlsWrap).childNodes;
	function normal(){//普通模式
		function show(i=0){
			sliderItems.forEach((item,index)=>{
				sliderItems[index].style.display='none'
			})
			sliderItems[i].style.display='block';	
		}
		show();
		let move=function(index){
			show(index);
			changeControl(index);
		}
		controlItems.forEach((item,index)=>{
			item.addEventListener('click',function(){
				move(index)
			})
		})
	}
	function slide(){//滑动模式
		function move(index){
			if(index<0){
				index=controlItems.length-1;
			}
			if(index>controlItems.length-1){
				index=0;
			}
			sliderWrap.style.left=(-parseInt(index)*itemWidth)+'px';
			changeControl(index);
			return index;
		}	
		controlItems.forEach((item,index)=>{
			item.addEventListener('click',function(){
				move(index);
			})
		})
		function auto(){
			let index=0;
			let timer=setInterval(function(){
				if(index<0){
				index=controlItems.length-1;
				}
				if(index>controlItems.length-1){
					index=0;
				}
				move(index);
				index++;
			},config.duration)
		}
		auto();
	}
	slide();
	return constructor;
}(this));