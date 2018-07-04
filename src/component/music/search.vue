<template>
    <div class="search">
        <form action="">
            <mu-icon value="search" color="#d7d7d7"></mu-icon>
            <input type="search" v-model="keyWord" placeholder="/专辑/歌手/歌单 ">
            <mu-icon value="clear" color="#d7d7d7" @click="clearX"></mu-icon>
        </form>
        <div id="kjl">
            <div class="title">搜索热词</div>
            <div class="tank">
                <li v-for="(item,i) in hotList" @click="searchS(item.first)" :key="i">{{item.first}}</li>
            </div>

            <div class="localList" v-show="history.length">
                <div class="title">搜索历史<mu-icon value="delete" :size="21" color="#666" @click="rmLocalAll"></mu-icon></div>
                <div class="panelx">
                    <ul class="wrapper" ref="xiaolongxia">
                        <li v-for="(item,i) in history" :key="i">
                            <mu-icon value="schedule" color="#666" :size="18" style="margin-top:3px;"></mu-icon>
                            <span @click="searchS(item)">{{item}}</span>
                            <mu-icon value="highlight_off" color="#666" @click="rmlocal(item)"></mu-icon>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <template v-if="!lpl">
            <div class="tank1" :style="{height:curH}">
                <div class="wrapper2" ref="tank2">
                    <li v-for="(item,i) in songList" :key="i">
                        <div class="seniority">{{i+1}}</div>
                        <div  class="info" @click="playMusic(item)" >
                            <p>{{item.name}}</p>
                            <p><template v-for="(ite) in item.artists">{{ite.name}}  </template></p>
                            <span class="u-hmsprt sgich_ply" data-reactid="34"></span>
                        </div>
                    </li>
                </div>
            </div>
        </template>
        <m-dialog :msg="msg" :show="show" @confirm="confirm"  @cancel="close"/>
    </div>
</template>

<script>
    import {mapGetters } from 'vuex';
    import Dialog from '../../component/dialog.vue';
    export default {
        data(){
            return {
                lpl:true,
                hotList:[],
                keyWord:'',
                songList:[],
                curH:null,
                history:[],
                msg:'',
                show:false
            }
        },
        watch:{
            lpl(newV){
                if(newV){
                    document.getElementById('kjl').style.display = 'block';
                    console
                }else{
                    document.getElementById('kjl').style.display = 'none';
                }
            }
        },
        components:{
            'm-dialog':Dialog
        },
        computed:{
            ...mapGetters(['getSearchHot']),
        },
        methods:{
            rmLocalAll(){
                this.msg = '确定清空搜索历史么';
                this.show = true;
            },
            confirm(){
                this.history = [];
                localStorage.removeItem('uzi_l');
                this.show = false;
            },
            close(){
                this.show = false;
            },
            rmlocal(item){
                let arr = this.history;
                let idx = arr.indexOf(item);
                arr.splice(idx,1);
                localStorage.setItem('uzi_l',JSON.stringify(arr));
                setTimeout(()=>{
                    this.$refs.xiaolongxia.style.height = 44*arr.length+'px';
                    this.iscroll2.refresh();
                },200)
            },
            clearX(){
                this.lpl=true;
                this.keyWord='';
                this.getLocal();
            },
            ISrefresh(){
              let dom = this.$refs.tank2;
              dom.style.height = this.songList.length*56 +'px';
              this.iscroll.refresh();
            },
            playMusic(it){
                this.$bus.emit('openPlay',{id:it.id,albumId:it.album.id,name:it.name});
                this.$emit('open');
            },
            searchS(keyword){
                this.keyWord = keyword;
                let word = keyword;
                let local = JSON.parse(localStorage.getItem('uzi_l'))||[];
                let swit = true;
                local.map((item)=>{
                    if(item == keyword){
                        swit = false;
                    }
                })
                if(swit){
                    local.push(word);
                }
                localStorage.setItem('uzi_l',JSON.stringify(local));
                this.$http.get('/api/search?keywords= '+word).then((data)=>{
                    let res = data.data;
                    this.songList = res.result.songs;
                    this.lpl = false;
                    this.$nextTick(()=>{
                        this.getIscroll();
                        this.ISrefresh();
                    })
                })
            },
            getIscroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.tank1',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true, 
                });
            },
            getscroll(){
                let IScroll = require('iscroll');
                this.iscroll2 = new IScroll('.panelx',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true, 
                });
            },
            getLocal(){
                let arr = JSON.parse(localStorage.getItem('uzi_l'))||[];
                this.history =arr;
                if(arr.length!=0){
                    setTimeout(()=>{
                        this.$refs.xiaolongxia.style.height = 44*arr.length+'px';
                        this.iscroll2.refresh();
                    },200)
                }
            }
        },
        mounted(){
            this.getscroll();
            this.getSearchHot.then((data)=>{
                if(data.code!=200){
                    return;
                }
                this.hotList = data.result.hots;
            });
            let _self = this;
            window.onkeydown = function(ev){
                
                if(ev.keyCode==13){
                    ev.preventDefault();
                    _self.searchS(_self.keyWord);
                }
            }
            this.getLocal();
            this.curH = window.innerHeight - 164 +'px';
        }
    }
</script>

<style scoped>
    .mu-text-field {
        margin:0 auto;
    }
    .title{
        margin:0 15px;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
    }
    .tank{
        display: flex;
        flex-wrap: wrap;
        margin:0 15px 0 7px;
    }
    .tank li{
        margin-left:8px;
        margin-bottom: 12px;
        border:1px solid #d7d7d7;
        padding:3px 16px;
        border-radius:15px;
    }
    form{
        display:flex;
        margin:12px;
        border:1px solid #d7d7d7;
    }
    form input{
        text-indent: 6px;
        line-height: 36px;
        flex:1;
    }
    form .material-icons{
        line-height: inherit;
        margin:0 6px;
    }
    .tank1{
        overflow: hidden;
        position: relative;
    }
    .tank1 li{
        width:100%;
        float: right;
        display: flex;
        list-style: none;
        padding: 6px 0;
        height: 56px;
    }
    .seniority{
        width:40px;
        text-align: center;
        line-height: 40px;
        font-size:17px;
        color:#999;
    }
    .info{
        flex:1;
        position: relative;
        
    }
    .info:after{
        content:"";
        position:absolute;
        bottom:-6px;
        left:0;
        height:1px;
        width:100%;
        background:#d7d7d7d7;
        transform: scale(1,.5);
    }
    .info p{
        font-size:17px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
        width:300px;
    }
    .info p:nth-child(2){
        font-size:12px;
        color:#888;
    }
    .u-hmsprt{
        position: absolute;
        width:22px;
        height:22px;
        right:12px;
        top:11px;
        background: url(//s3.music.126.net/m/s/img/index_icon_2x.png?5207a28…) no-repeat;
        background-size: 166px 97px;
        background-position: -24px 0;
    }
    .localList li{
       padding: 10px 0;
       margin:0 15px;
       display: flex;
       justify-content: space-between;
       position: relative;
    }
    .localList li:after{
        content:"";
        position: absolute;
        left:0;
        bottom: 0;
        width:100%;
        background:#d7d7d7;
        height:1px;
        transform: scale(1,.5);

    }
    .localList li span{
        flex:1;
        line-height: 24px;
        text-indent:6px;
    }
    .panelx{
        height:276px;
        overflow: hidden;
        position: relative;
    }
</style>

