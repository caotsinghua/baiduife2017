$(function(){
	const api="https://api.imjad.cn/cloudmusic/";
	let mySongList=[];//我的歌单

	let player=function(el,song){//播放器
		this.el=el;
		this.audio=document.getElementById("music");
		this.song=song;
		this.now=0;//现在播放位置
		this.duration=this.audio.duration;//歌曲长度 秒
		// this.volume=0;//音量大小
		this.showLyric=false;//是否显示歌词
		this.ispause-false;
	}
	let song=function(song){//当前歌曲
		this.id=song.id;
		this.src=song.src;//歌曲地址
		this.name=song.name;//歌曲名
		this.singer=song.singer;//歌手名
		this.poster=song.poster;
		this.islove=false;//是否喜欢
		this.isadd=false;//是否添加到歌单
	}
	//播放器方法
	//控制器
	player.prototype.init=function(){
		this.el.find('.music-name').text(this.song.name)
		this.el.find('.singer-name').text(this.song.singer)
		this.el.find('.time').text(this.now)
		this.el.find('#music').attr('src', this.song.src);
		this.el.find('.poster-img').attr('src', this.song.poster);
		$(".poster").addClass("playing");
	}
	player.prototype.newSong=function(songid){
		let songInfo=new song(getSong(songid));
		this.song=songInfo;
		this.init();
		let timer=this.songPlaying();
	}
	player.prototype.togglePause=function(){//暂停/播放
		function changePause(ispause){
			if(ispause){
				$("#pause").removeClass("am-icon-pause")
				$("#pause").addClass("am-icon-play")
				$(".poster").removeClass("playing");
			}else{
				$("#pause").removeClass("am-icon-play")
				$("#pause").addClass("am-icon-pause")
				$(".poster").addClass("playing");
			}
		}
		if(this.ispause){
			this.audio.play();
			this.ispause=false;
			
		}else{
			this.audio.pause(); 
			this.ispause=true;
			
		}
		changePause(this.ispause)
		
	}
	player.prototype.prev=function(){//上一曲
		let current=this.song.id;
		mySongList.forEach((item,index)=>{
			if(item.id==current){
				if(index>0){
					this.newSong(mySongList[index-1].id);
					return;
				}else{
					alert("已经是第一首了")
					return;
				}
				
			}
		})
		return;
	}
	player.prototype.next=function(){//下一曲
		let current=this.song.id;
		mySongList.forEach((item,index)=>{
			if(item.id==current){
				if(index<mySongList.length-1){
					this.newSong(mySongList[index+1].id);
					return;
				}else{
				alert("已经是最后一首了")
				return;
			}
				
			}
		})
		return;
	}
	player.prototype.setVolume=function(vol){//设置音量
		this.audio.attr('volume', vol);
	}
	//其他

	//获取歌曲
	function getSong(ID){
		let songInfo={
		};
		$.ajax({
			type:"GET",
			url:api,
			async:false,
			data:{type:'detail',id:ID},
			success:function(res){
				songInfo.name=res.songs[0].name;
				songInfo.id=res.songs[0].id;
				songInfo.poster=res.songs[0].al.picUrl;
				songInfo.singer=res.songs[0].ar[0].name;
			},
			error:function(xhr){
				songInfo=0;
			}
		})
		$.ajax({
			type:"GET",
			url:api,
			async:false,
			data:{id:ID},
			success:function(res){
				songInfo.src=res.data[0].url;
			},
			error:function(xhr){
				songInfo=0;
			}
		})
		return songInfo;
	}
	function searchSong(name){
		let songs;
		$.ajax({
			type:"GET",
			url:api,
			async:false,
			crossDomain:true,
			data:{type:'search',s:name},
			success:function(res){
				songs=res.result.songs;
			},
			error:function(xhr){
				songs=0;
			}
		})
		return songs;
	}
	function renderList(list){
		let head="<tr>\
						<th>歌名</th>\
						<th>歌手</th>\
						<th>操作</th>\
				    </tr>";
		list.forEach(item=>{
			let tr='<tr class="song-li">\
						<td>'+item.name+'</td>\
						<td>'+item.ar[0].name+'</td>\
						<td><button class="am-btn">播放</button></td>\
				    </tr>';
			head+=tr;
		})
		mySongList=list;
		$("#songList").html(head);
		$("#songList").children('.song-li').each(function(index, el) {
			$(el).find(".am-btn").click(function(event) {
				musicPlayer.newSong(mySongList[index].id);
			});
		});//渲染列表
	}

	player.prototype.songPlaying=function(){//渲染进度
		let timer=setInterval(()=>{
			let time=this.now;
			let minutes=parseInt(time/60);
			let seconds=parseInt(time-minutes*60);
			document.querySelector(".time").innerHTML=minutes+":"+seconds;
			document.querySelector(".progress-inner").style.width=this.load+"%";
			if(this.load==100){
				this.next();
			}
		},500);
		return timer;
	}
	
	function bindFunctions(){
		$("#pause").click(function(){//暂停
			musicPlayer.togglePause();
		})
		$("#prev").click(function(){//上一曲
			musicPlayer.prev();
		})
		$("#next").click(function(){//下一曲
			musicPlayer.next();
		})
		$("#search-btn").click(function(){
			let name=$("#search-name").val();
			let songs=searchSong(name);
			renderList(songs);//渲染表格
		})//绑定事件

	}

	let musicPlayer=new player($("#musicPlayer"));
	Object.defineProperty(musicPlayer,"now",{
		get:function(){
			return this.audio.currentTime;
		},
		set:function(value){			
			this.audio.currentTime=value;
		}//获取当前时间
	})
	Object.defineProperty(musicPlayer,"load",{
		get:function(){
			return this.audio.currentTime/this.audio.duration*100;
		},
		set:function(value){
			this.load=value;
		}//获取当前进度
	})
	bindFunctions();
})