<template>
    <div class="musicPlayer" :style="{height:curH}">
        <div class="tainer">
            <div class="tite">{{name}}</div>
            <mu-icon value="arrow_back" @click="close" color="#fff" left></mu-icon>
            <audio :src="playURI"  ref="audio" @timeupdate="getCurtime"></audio>
            <div id="image-round">
                <mu-icon :value="playing?'pause_circle_outline':'play_circle_outline'"  @click="playing=!playing" color="#fff"></mu-icon>
                <div class="round-image" >
                    <div class="son"  :style="{backgroundImage:poster}"></div>
                </div>
            </div>
        </div>
        <div class="lrc-Ontent">
            <div class="wrapper1q">
                <p :class="{active:targetIdx==i}" v-for="(item,i) in tempArr" :key="i">{{item.text}}</p>
            </div>
            <p v-if="nolyric">暂无歌词</p>
        </div>
        <div class="poster">
            <div class="album-cover" :style="{backgroundImage:poster}"></div>
            <div class="cover-mask"></div>
        </div>
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
                poster:'url(http://s3.music.126.net/m/s/img/disc-ip6.png)',
                name:'',
                currentTime:'00:00',
                currentTime1:0,
                allTime:'',
                isEnd:false,//是否播放完毕，
                lyricObj:'',//歌词,
                timeC:[],
                tempArr:[],
                targetIdx:null,//定位当前高亮歌词的行 的下标,
                nolyric:false,//判断当前歌曲是否有歌词,
                playing:false
            }
        },
        computed:{
            ...mapGetters(['getMorder']),
        },
        watch:{
            playing(newV){
                let domRound = document.querySelector('.son');
                let fround = document.querySelector('.round-image');
                this.$nextTick(()=>{
                    if(newV){
                        domRound.classList.add('animate');
                        this.$refs.audio.play();
                    }else{
                        var iTranfrom = getComputedStyle(domRound).transform;
                        var cTranfrom = getComputedStyle(fround).transform;
                        fround.style.transform = cTranfrom=='none'?iTranfrom:iTranfrom.concat(cTranfrom);
                        domRound.classList.remove('animate');
                        this.$refs.audio.pause();
                    }
                })
                
            }
        },
        methods:{
            pause(){//暂停播放
                let cd = this.$refs.audio.paused;
                let domRound = document.querySelector('.son');
                let fround = document.querySelector('.round-image');
                if(cd){
                    this.$refs.audio.play();
                    this.pauseOrstart = 'pause_circle_outline';
                    domRound.classList.add('animate');
                }else{
                    this.$refs.audio.pause();
                    this.pauseOrstart = 'play_circle_outline';
                    var iTranfrom = getComputedStyle(domRound).transform;
                    var cTranfrom = getComputedStyle(fround).transform;
                    fround.style.transform = cTranfrom=='none'?iTranfrom:iTranfrom.concat(cTranfrom);
                    domRound.classList.remove('animate');
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
                this.playing = false;
                this.$http.get('/api/album?id='+data.albumId).then((data)=>{//获取音乐封面
                    let res = data.data;
                    this.poster = 'url('+res.album.picUrl+')';
                });
                this.$http.get('/api/lyric?id='+data.id).then((data)=>{
                    let res = data.data;
                    if(res.nolyric){
                        this.nolyric = true;
                        return ;
                    }
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
                if(obj.ended){//播放完毕
                    this.playing = false;
                }
                if(!this.nolyric)this.matchLine(currTime.toFixed(0));
            },
            matchLine(num){
                let conDom = document.getElementsByClassName('wrapper1q')[0];
                let oparr = conDom.children;
                let tarCon = this.tempArr;
                for(let i=0,l=tarCon.length;i<l;i++){
                    if(tarCon[i].offset == num){
                        this.targetIdx = i;
                        if(i>6){
                            this.iscroll.scrollToElement(oparr[i-5]);
                        }else if(i<6){
                            this.iscroll.scrollToElement(oparr[0]);
                        }
                        break;
                    }
                }
            },
            resloveTime(sec){//转化成时分秒
                let min = parseInt(sec/60)<10?'0'+parseInt(sec/60):parseInt(sec/60);
                let sec1 = parseInt(sec%60)<10?'0'+parseInt(sec%60):parseInt(sec%60);
                return min+':'+sec1;
            },
            CtCurrentTime(value){//时间轴 与时分秒转换比例
                let rate = value/10000;
                let obj = this.$refs.audio;
                obj.currentTime = obj.duration*rate;
            },
            parseLyric(lrc) {//解析歌词成对象
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
                this.tempArr = [];
                for(var i in lrcObj){
                    if(lrcObj[i]!=''){
                        this.tempArr.push({offset:i,text:lrcObj[i]});
                    }
                }
                this.$nextTick(()=>{
                    let tDom = document.getElementsByClassName('wrapper1q')[0];
                    tDom.style.height = tDom.clientHeight+120+'px';//多撑开120px;
                    this.iscroll.refresh();
                })
                return lrcObj;
            },
            getIscroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.lrc-Ontent',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true, 
                });
            }
        },
        mounted(){
            this.getIscroll();
            this.curH = window.innerHeight+'px';
            this.onBus();
        },
        beforeDestroy(){
            this.$bus.off('openPlay',this.getSongId);
        }
    }
</script>

<style lang="scss">
    .tainer{
        position: relative;
        overflow: hidden;
        #image-round{
            margin: 0 auto;
            margin-top: 36px;
            width:188px;
            height:188px;
            position: relative;
            text-align: center;
            i{
                position: relative;
                z-index: 2;
                font-size:56px;
                top:50%;
                transform: translate(0,-50%);
            }
        }
        .round-image{
            position: absolute;
            left: 0;
            top:0;
            width:100%;
            height:100%;
        }
        .son{
            width:100%;
            height:100%;
            border-radius:50%;
            background-size:cover;
        }
        .animate{
            animation: rotate 24s linear infinite;
        }
    }
    @keyframes rotate {
        from{
            transform: rotate(0deg);
        }
        to{
            transform: rotate(360deg);
        }
    }
    .lrc-Ontent{
        color:rgba(255, 255, 255, 0.6);
        text-align: center;
        font-size:12px;
        line-height: 26px;
        height: 200px;
        overflow: hidden;
        margin-top:12px;
        p{
            transition: 0.2s all;
        }
        p.active{
            transform:translateZ(4px);
            font-size:18px;
            color:#fff;
        }
    }
    .tite{
        line-height: 24px;
        text-align: center;
        color:rgba(255,255,255,.8);
    }
    .poster{
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:-1;
        .album-cover{
            position: absolute;
            top:0;
            left:0;
            z-index:1;
            width:100%;
            height:100%;
            background-size:cover;
            background-position:center;
            filter: blur(1.2rem);
        }
        .cover-mask{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 3;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.4);
        }
    }
    .controler{
        position: absolute;
        bottom: 0;
        width: 90%;
    }
    .aslide{
        display: flex;
        color:rgba(255, 255, 255, .72);
        justify-content: space-between;
        &>span{
            padding-top:2px;
        }
        .mu-slider-fill, .mu-slider-track{
            height:1px;
        }
        .mu-slider-thumb{
            width:6px;
            height:6px;
            background-color:#fff; 
        }
        .mu-slider-fill{
            background-color:#fff; 
        }
        .mu-slider-track{
            background-color: rgba(255,255,255,.2);
        }
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

