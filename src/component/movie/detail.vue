<template>
    <div class="m_detail">
        <h3 class="clust"><mu-icon @click="$router.go(-1)" value="arrow_back" color="#fff"></mu-icon>{{detail.nm}}</h3>
        <div class="infod" >
            <div class="coverI" :style="{'background-image':coverImg}"></div>
            <div class="lef">
                <img :src="detail.img.replace('/w.h/','/148.208/')" alt="">
            </div>
            <div class="rig">
                <p class="name">{{detail.nm}}</p>
                <p class="enm">{{detail.enm}}</p>
                <p class="sc">
                    <span>{{detail.sc}}</span>
                    <template v-if="detail.snum>10000">
                    （{{(detail.snum/10000).toFixed(1)}}万人评）
                    </template>
                    <template v-else>
                        （detail.snum）人评
                    </template>
                </p>
                <p>{{detail.cat}}
                    <span v-if="detail.version.indexOf('imax')!=-1&&detail.version.indexOf('v3d')!=-1">3D IMAX</span>
                    <span v-else-if="detail.version.indexOf('v3d')!=-1">3D</span>
                </p>
                <p>{{detail.src}}/{{detail.dur}}分钟</p>
                <p>{{detail.pubDesc}}</p>
            </div>
        </div>
        <div class="jkpt">
            <button class="cinemaNear">查看附近影院</button>
            <div class="content" :class="{active:spread}" @click="spread=!spread">{{detail.dra}}<i></i></div>
        </div>
        <div class="line"></div>
        <div class="actor">
            <h3 class="media">媒体库</h3>
            <div class="swicr">
                <ul class="wrapper" ref="coverM">
                    <li class="video" @click="playVideo" v-if="detail.videoImg">
                        <img :src="detail.videoImg.replace('/w.h/','/')+'@250w_140h_1e_1c'" alt="" style="width:125px">
                    </li>
                    <li v-for="(item,i) in detail.photos" :key="i">
                        <img :src="item.replace('/w.h/','/')+'@180w_140h_1e_1c'" alt="">
                    </li>
                </ul>
            </div>
            <div></div>
        </div>
        <div class="video1" v-show="showVideo">
            <video :src="detail.videourl" controls ref="video" @click.stop></video>
            <mu-icon value="close" color="#fff" @click="closeVideo"></mu-icon>
        </div>
        <div class="line"></div>
        <div class="common">
            <h3 class="media">热门评论</h3>
            <div class="content6">
                <li v-for="(item,i) in commList" :key="i">
                    <div class="tipss">
                        <img :src="item.avatarurl" alt="">
                        <span style="color:#448aff">{{item.nickName}}</span>
                        <span>{{item.time}}</span>
                    </div>
                    <p>{{item.content}}</p>
                </li>
                <p class="watchMo" @click="getMoreComm">查看更多热评</p>
            </div>
        </div>
        <!-- <div class="danmu">
            <li v-for="(item,i) in leafList" :key="i">{{item.content}}</li>
        </div> -->
    </div>
</template>

<script>
    export default {
        data(){
            return {
                detail:{img:'',videoImg:'',version:''},
                coverImg:'',
                spread:false,
                showVideo:false,
                commList:[],
                page:1
            }
        },
        methods:{
            playVideo(){
                this.showVideo = true;
                this.$refs.video.play();
            },
            closeVideo(){
                this.$refs.video.pause();
                this.showVideo = false;
            },
            getDetail(){
                this.$http.get('/maoyan/ajax/detailmovie?movieId='+this.$route.query.movieId).then((data)=>{
                    let res = data.data;
                    this.detail = res.detailMovie;
                    this.coverImg = `url(${this.detail.img.replace('/w.h/','/148.208/')})`;
                    let leng = res.detailMovie.photos.length*102+137+'px';
                    this.$refs.coverM.style.width = leng;
                    this.iscroll.refresh();
                })
            },
            getCommonList(){
                this.$http.get('/maoyan/comments.json?movieid='+this.$route.query.movieId+'&limit=5&offset=0').then((data)=>{
                    let res = data.data;
                    this.totalComm = res.data.CommentResponseModel.total;
                    this.commList = res.data.CommentResponseModel.cmts;
                })
            },
            getMoreComm(){
                this.$http.get('/maoyan/comments.json?movieid='+this.$route.query.movieId+'&limit=5&offset='+this.page*5).then((data)=>{
                    let res = data.data;
                    this.commList = this.commList.concat(res.data.CommentResponseModel.cmts);
                    this.page++;
                })
            },
            makeDanmu(){//弹幕制造，本次没用到
                let style = document.createElement('style');
                style.type="text/css";
                document.head.appendChild(style);
                let width = window.innerWidth;
                let from  = `from {visibility:visible;-webkit-transform:translateX(${width}px);}`;
                let to = `{visibility:visible;-webkit-transform:translateX(-100%);}`;
                style.innerHTML = `@-webkit-keyframes danmu{${from} ${to}}`;
            },
            getIScroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.swicr',{
                    scrollX:true,
                    click:true,
                    mouseWheel:true,
                    eventPassthrough:true
                });
            },
        },
        mounted(){
            this.getIScroll();
            this.getDetail();
            this.getCommonList();
        }
    }
</script>

<style lang="scss">
    .watchMo{
        text-align: center;
        line-height: 36px;
        color:orange;
    }
    .danmu{
        position: fixed;
        display: flex;
        flex-wrap: wrap;
        height:120px;
        top:0;
        left:0;
        visibility: hidden;
        animation: danmu 5s linear 0s 1;
        li{
            width: 240px;
            height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .video1{
        position: fixed;
        display: flex;
        flex-direction: column;
        width:100%;
        height:100%;
        background: rgba(0, 0, 0, .5);
        top:0;
        left:0;
        z-index: 2;
        i{
            flex:0.1;
            text-align: center;
        }
    }
    .close{
        display:block;
        height:12px;
        width:12px;
        position: absolute;
        top:36px;
        left:12px;
        font-style: normal;
        color:#fff;
        opacity: 0.6;
        z-index: 2;
    }
    video{
        display:block;
        width:100%;
    }
    .line{
        height:8px;
        background: #f4f4f4;
    }
    .clust{
        line-height: 48px;
        background:#2196f3;
        color:#fff;
        font-weight: 500;
        font-size:16px;
        text-align: center;
        position: relative;
        i{
            position: absolute;
            left:12px;
            top:0;
            line-height: 48px;
        }
    }
    .infod{
        height:188px;
        padding:15px;
        box-sizing: border-box;
        display: flex;
        
        position: relative;
        &:before{
            content:"";
            position: absolute;
            width:100%;
            height:100%;
            z-index:-1;
            background-color:#333;
            top:0;
            left:0;
        }
        .coverI{
            position: absolute;
            width:100%;
            height: 100%;
            filter: blur(1.2rem);
            background-size:cover;
            left:0;
            top:0;
            opacity: 0.55;
            z-index:-1;
        }
        .lef{
            width:110px;
            height: 158px;
            margin-right:6px;
            img{
                display: block;
                width:100%;
                height:100%;
            }
            
        }
        .rig {
            color:#fff;
            .name{
                font-size:20px;
                line-height: 32px;
            }
            .enm{
                font-size:12px;
                opacity: .8;
                line-height: 22px;
            }
            .sc{
                span{
                    font-size:18px;
                    color:#fc0;
                    opacity: 1;
                }
                opacity: .8;
            }
            p{
                width:206px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                font-size:12px;
                opacity:.8;
                line-height: 24px;
            }
        }
    }
    .jkpt{
        padding: 12px 0; 
        button{
            display: block;
            width:325px;
            margin: 0 auto;
            height:36px;
            border-radius:6px;
            background:#2196f3;
            color:#fff;
            font-size:14px;
        }
        .content{
            margin: 12px 24px 0;
            line-height: 19px;
            color:#555;
            height:76px;
            overflow:hidden;
            position: relative;
            i{
                display: block;
                width:100%;
                background: #fff;
                height:16px;
                position: absolute;
                bottom:0;
                left:0;
            }
            i:after{
                content:"";
                display: block;
                width:12px;
                height:12px;
                border-right: 2px solid #aaa;
                border-top:2px solid #aaa;
                margin:0 auto;
                transform: rotate(135deg) ;
            }
            &.active{
                height:auto;
                padding-bottom:16px;
            }
            &.active i:after{
                transform: translate(0,6px) rotate(-45deg) ;
            }
        }
    }
    .media{
        color:#666;
        margin:10px 15px;
        font-size:15px;
    }
    .actor{
        width:100%;
        position: relative;
        overflow: hidden;
        margin-bottom:12px;
        img{
            display: inline-block;
            width:90px;
            min-height: 70px;
        }
        li{
            margin-left:12px;
            height:70px;
            overflow: hidden;
            position: relative;
        }
        .wrapper{
            display: flex;
            flex-wrap: nowrap;

        }
        .video:after{
            content: "";
            width:20px;
            height:20px;
            position: absolute;
            background: url(/static/img/play.png) no-repeat;
            background-size:cover;
            right:12px;
            bottom:6px;
        }
    }
    .content6{
        img{
            width:30px;
            height:30px;
            border-radius:50%;
            background: #ccc;
            margin-right:4px; 
        }
        .tipss{
            display: flex;
            line-height: 30px;
            margin-bottom: 6px;
            span{
                margin-right: 4px;
            }
        }
        li{
            padding:12px 15px 12px 0;
            margin-left:15px;
            position: relative;
        }
        li:after{
            content: '';
            display: block;
            width:100%;
            height: 1px;
            background:#d7d7d7;
            transform: scale(1,.5);
            position: absolute;
            bottom:0;
            left:0;
        }
    }
</style>

