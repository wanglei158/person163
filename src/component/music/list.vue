<template>
    <div class="songlist">
        <div class="wrapper1" ref="tank1">
            <div class="tip">June</div>
            <div class="tank">
                <li v-for="(item,i) in songList" :key="i">
                    <div class="seniority">{{i+1}}</div>
                    <div  class="info" @click="playMusic(item)" :class="{valid:item.fee==0}">
                        <p>{{item.name}}</p>
                        <p><template v-for="(ite) in item.artists">{{ite.name}}  </template></p>
                        <span class="u-hmsprt sgich_ply" ></span>
                    </div>
                </li>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default{
        data(){
            return {
                songList:[],
            }
        },
        watch:{
            
        },
        computed:{
            ...mapGetters(['getRecommonSong','getPersonalized'])
        },
        methods:{
            ISrefresh(){
              let dom = this.$refs.tank1;
              dom.style.height = this.songList.length*56 + 33 +'px';
              this.iscroll.refresh();
            },
            playMusic(it){
                this.$bus.emit('openPlay',{id:it.id,albumId:it.album.id,name:it.name});
            },
            getMusic(){
                let id = this.$route.params.id;
                if(id==1){
                    this.getRecommonSong.then((data)=>{
                        if(data.code==200){
                            this.songList = data.recommend;
                            this.ISrefresh();
                        }else{
                            // this.$router.push({path:'/login'});
                        }
                    })
                }
                if(id==2){
                    this.getPersonalized.then((data)=>{
                        if(data.code==200){
                            let arr = data.result;
                            let temp = [];
                            arr.map((item)=>{
                                temp.push(item.song);
                            })
                            this.songList = temp;
                            this.ISrefresh();
                        }else{
                            // this.$router.push('/login');
                        }
                    })
                }
            },
            onBus(){
                this.$bus.on('changelistM',this.getMusic);
            },
            getIscroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.songlist',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true, 
                });
            }
        },
        mounted(){
            this.getIscroll();
            this.getMusic();
            this.onBus();
        },
        beforeDestroy(){
            this.$bus.off('changelistM',this.getMusic);
            this.iscroll.destroy();
        }
    }
</script>
<style scoped>
    .tip{
        padding:6px 12px;
    }
    .tank{
        overflow: hidden;
    }
    .tank li{
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
    
</style>
