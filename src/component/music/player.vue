<template>
    <div class="musicPlayer" :style="{height:curH}">
        <div class="tainer">
            <div class="tite">{{name}}</div>
            <mu-icon value="arrow_back" @click="close" color="#fff" left></mu-icon>
            <audio :src="playURI" autoplay  ref="audio" @timeupdate="getCurtime"></audio>
            <div class="container" id="lrccontain"></div>
        </div>
        <img :src="poster" alt="" class="poster">
        <div class="controler">
            <div class="aslide">
                <span>{{currentTime}}</span>
                <mu-slider 
                class="demo-slider" 
                @change ="CtCurrentTime"
                :max="10000"
                v-model="currentTime1"></mu-slider>
                <span>{{allTime}}</span>
            </div>
            <div class="handle">
                <mu-icon :value="pauseOrstart" @click="pause" color="#ccc" left></mu-icon>
                <mu-icon value="add_circle_outline" color="#ccc" @click="addP"></mu-icon>
            </div>
        </div>
        <!-- 添加单歌单列表 -->
        <div class="plusPanelq" v-show="!panel_hide">
            <div class="plusPanel">
                <p class="yut">添加到歌单<span @click="panel_hide=true">X</span></p>
                <div class="list">
                    <ul class="wrapper" ref="tbh">
                        <li v-for="(item,i) in playList" @click="addListen(item)" :key="i" v-if="!item.subscribed">
                            <img :src="item.coverImgUrl" alt="">
                            <div class="injo">
                                <p v-if="i==0">喜欢的音乐</p>
                                <p v-else>{{item.name}}</p>
                                <p>{{item.trackCount}}首</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return{
                curH:'',
                playURI:'',
                currentSongId:null,
                poster:'',
                name:'',
                pauseOrstart:'pause_circle_outline',
                currentTime:'00:00',
                currentTime1:0,
                allTime:'',
                isEnd:false,//是否播放完毕，
                lyricObj:'',//歌词,
                timeC:[],
                tempArr:[],
                timer3:null,
                playList:[],//歌单列表,
                panel_hide:true,
            }
        },
        computed:{
            ...mapGetters(['getMorder']),
        },
        methods:{
            addP(){
                this.getMorder.then((data)=>{
                    this.playList = data.playlist;
                    this.panel_hide = false;
                    let num = 0;
                    data.playlist.map((item)=>{
                        if(!item.subscribed){
                            num++;
                        }
                    });
                    this.$refs.tbh.style.height = num*52+'px';
                    setTimeout(()=>{
                        this.iscroll.refresh();
                    },500)
                });
                
            },
            addListen(it){
                if(!this.songId) return;
                this.$http.get('/api/playlist/tracks?op=add&pid='+it.id+'&tracks='+this.songId).then((data)=>{
                    let res = data.data;
                    console.log(res);
                    if(res.code==200){
                        this.$toast.top('收藏成功');
                        this.panel_hide = true;
                    }else{
                        this.$toast.top(res.code);
                    }
                })
            },
            pause(){//暂停播放
                let cd = this.$refs.audio.paused;
                if(cd){
                    this.$refs.audio.play();
                    this.pauseOrstart = 'pause_circle_outline';
                }else{
                    this.$refs.audio.pause();
                    this.pauseOrstart = 'play_circle_outline';
                }
            },
            close(){
                this.$emit('close',false);
            },
            onBus(){
                this.$bus.on('openPlay',this.getSongId)
            },
            getSongId(data){
                this.songId = data.id;
                if(this.currentSongId==data.id) return ;
                this.currentSongId = data.id;
                this.name = data.name;
                this.$http.get('/api/music/url?id='+data.id).then((data)=>{//调取歌曲播放地址
                    let res = data.data;
                    if(res.data[0].url==null){
                        alert('由于版权保护，您所在的地区暂时无法使用');
                        return;
                    }
                    this.$emit('open');
                    this.playURI = res.data[0].url;
                });
                this.$refs.audio.load();
                this.$http.get('/api/album?id='+data.albumId).then((data)=>{//获取音乐封面
                    let res = data.data;
                    this.poster = res.album.picUrl;
                });
                this.$http.get('/api/lyric?id='+data.id).then((data)=>{
                    let res = data.data;
                    this.lyricObj = this.parseLyric(res.lrc.lyric);
                    
                });
            },
            getCurtime(){
                let obj = this.$refs.audio;
                let duration = obj.duration;
                if(!isNaN(duration)){
                    this.allTime = this.resloveTime(duration);
                }
                let currTime = obj.currentTime;
                this.currentTime = this.resloveTime(currTime);
                this.currentTime1 = parseInt((currTime/duration)*100*100);
                this.$emit('conn',this.currentTime1);
                if(obj.ended){
                    this.pauseOrstart = 'stop';
                    this.timeC = new Array();
                }
            },
            resloveTime(sec){
                let min = parseInt(sec/60)<10?'0'+parseInt(sec/60):parseInt(sec/60);
                let sec1 = parseInt(sec%60)<10?'0'+parseInt(sec%60):parseInt(sec%60);
                return min+':'+sec1;
            },
            CtCurrentTime(value){
                let rate = value/10000;
                let obj = this.$refs.audio;
                obj.currentTime = obj.duration*rate;
            },
            matchLyc(sec){//匹配歌词
                let curLrc = this.lyricObj[sec];
                let arr = this.timeC;
                if(curLrc!=undefined&&curLrc!=''&&curLrc!=this.timeC[arr.length-1]){
                    this.timeC.push(curLrc);
                }
            },
            parseLyric(lrc) {
                var lyrics = lrc.split("\n");
                var lrcObj = {};
                for(var i=0;i<lyrics.length;i++){
                    var lyric = decodeURIComponent(lyrics[i]);
                    var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                    var timeRegExpArr = lyric.match(timeReg);
                    if(!timeRegExpArr)continue;
                    var clause = lyric.replace(timeReg,'');
                    for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                        var t = timeRegExpArr[k];
                        var min = Number(String(t.match(/\[\d*/i)).slice(1)), sec = Number(String(t.match(/\:\d*/i)).slice(1));
                        var time = min * 60 + sec;
                        lrcObj[time] = clause;
                    }
                }
                clearInterval(this.timer3);
                this.tempArr = [];
                document.getElementById('lrccontain').scrollTop = 0;
                for(var i in lrcObj){
                    if(lrcObj[i]!=''){
                        this.tempArr.push({offset:i,text:lrcObj[i]});
                    }
                }
                this.jkl(this.tempArr);
                return lrcObj;
            },
            jkl(arr){
                var dom = document.getElementById('lrccontain');
                var str = '';
                for (var i = 0; i < arr.length; i++) {
                    str +=`<p>${arr[i].text}</p>`
                };
                dom.innerHTML = str;
                this._go(0);
            },
            _go(_lineno){
                let arr = this.tempArr;
                let __eul = document.getElementById('lrccontain');
                var _time;
                if (_lineno === 0) {
                    _time = arr[_lineno].offset;
                } else {
                    _time = arr[_lineno].offset - arr[_lineno-1].offset;
                }
                this.timer3 = setTimeout(this._go.bind(window,_lineno+1), _time*1000);
                let _ep = __eul.children[_lineno];
                try{
                    if (_lineno > 0) {
                        __eul.children[_lineno-2].setAttribute("class", "");
                    }
                    let _ep2 = __eul.children[_lineno-1];
                    _ep2.setAttribute("class", "z-crt");
                }catch(e){

                }
                
                var __freq = 30; // 滚动频率（ms）
                var __fraction = 2/5;
                

                var _scrollTop;
                if (_ep.offsetTop < __eul.clientHeight*.4){
                    _scrollTop = 0;
                } else if (_ep.offsetTop > (__eul.scrollHeight - __eul.clientHeight*(1-.4))){
                    _scrollTop = __eul.scrollHeight - __eul.clientHeight;
                    __eul.scrollTop = _scrollTop;
                } else {
                    _scrollTop = _ep.offsetTop - __eul.clientHeight*.4;
                    __eul.scrollTop = _scrollTop;
                }
            },
            __scroll(_crt, _dst, _step){
                let __eul = document.getElementById('lrccontain');
                if(Math.abs(_crt - _dst) < _step){
                    return;
                }
                if(_crt < _dst){
                    __eul.scrollTop += _step;
                    _crt += _step;
                } else {
                    __eul.scrollTop -= _step;
                    _crt -= _step;
                }
                setTimeout(this.__scroll.bind(window, _crt, _dst, _step), 30);
            },
            getIscroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.list',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true,
                });
            },
        },
        mounted(){
            this.getIscroll();
            this.curH = window.innerHeight+'px';
            this.onBus();
        },
        beforeDestroy(){
            this.$bus.off('openPlay',this.getSongId);
            clearInterval(this.timer3);
        }
    }
</script>

<style >
    .tainer{
        position: relative;
        height:360px;
        overflow: hidden;
    }
    .container{
        position: absolute;
        width:100%;
        bottom:0;
        height: 84%;
        color:#9e9e9e;
        overflow-y: hidden;
    }
    .container p{
        text-align: center;
        line-height: 28px;
        transition:0.5s all ;
    }
    .container p.z-crt{
        color:#2196f3;
    }
    .tite{
        line-height: 24px;
        text-align: center;
        color:#e00c0c;
    }
    .poster{
        position: absolute;
        top:0;
        left:0;
        width:100%;
        z-index:-1;
        /* filter: blur(2px); */
    }
    .controler{
        position: absolute;
        bottom: 36px;
        width: 90%;
    }
    .controler .handle{
        background: rgba(0,0,0,.6);
        padding: 0 12px;
    }
    .aslide{
        display: flex;
        justify-content: space-between;
    }
    .mu-slider{
        width:72%;
    }
    .controler .material-icons{
        line-height: inherit;
    }
    .mu-circular-progress{
        transform: rotate(-90deg);
    }
    .plusPanel{
        width:90%;
        margin:0 auto;
        background:#fff;
        position: absolute;
        top:120px;
        left:5%;
        min-height: 240px;
    }
    .plusPanel li{
        display: flex;
        padding:6px 15px;
        position: relative;
    }
    .plusPanel li:first-child:after{
        content: '';
        position: absolute;
        width:100%;
        height:1px;
        background:#d7d7d7;
        transform: scale(1,.5);
        bottom:0;
        left:0;
    }
    .plusPanel img{
        width:40px;
        height:40px;
    }
    .injo{
        margin-left:6px;
        font-size:12px;
    }
    .yut{
        color:#fff;
        line-height: 36px;
        padding:0 15px;
        background:#2d2d2d;
        display: flex;
        justify-content: space-between;
    }
    .plusPanelq{
        width:100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        background: rgba(0,0,0,.1);
    }
    .plusPanelq .list{
        height:278px;
        position: relative;
        overflow: hidden;
    }
    .mu-icon.favo{
        color:#ec407a;
    }
</style>

