<template>
    <div class="container1">
        <ul class="wrapper" ref="tank" >
            <li v-for="(item,i) in mlist" :key="i" @click="toDetail(item.id)">
                <div class="ing">
                    <img :src="item.img.replace('/w.h/','/128.180/')" alt="">
                </div>
                <div class="info">
                    <p class="name"><span>{{item.nm}}</span><span class="version" :class="{v3d:item.version.indexOf('v3d')!=-1,imax:item.version.indexOf('imax')!=-1}"></span></p>
                    <p v-if="item.sc!=0">
                        <mu-icon v-for="i in parseInt(item.sc/2)" :key="i" value="star" color="orange" :size="16"></mu-icon>
                        <mu-icon value="star_half" v-if="(item.sc%2>0.9)" color="orange" :size="16"></mu-icon>
                        {{item.sc}}
                    </p>
                    <p v-else class="actor1"><span class="wish" style="letter-spacing:1px;">{{item.wish}}</span>人想看</p>
                    <p class="actor1">{{item.star}}</p>
                    <p class="showInfo">{{item.showInfo}}</p>
                    <button class="opt">看看</button>
                </div>
            </li>
            <b class="loading" v-if="!loadOver">正在加载中...</b>
            <b class="loading" v-else>已经到底了</b>
        </ul>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    export default{
        data(){
            return {
                mlist:[],
                allMids:[],
                curPage:1,
                loadOver:false,
                loading:false
            }
        },
        computed:{
            ...mapGetters(['getPlayingMovie','getPre']),
        },
        methods:{
            ...mapActions(['setCity']),
            toDetail(id){
                this.$router.push({path:'/moviedetail',query:{movieId:id}});
            },
            onBus(){
                this.$bus.on('swithcM',this.getSw);
                this.$bus.on('selCity',this.repeatReq);
            },
            repeatReq(){
                let type = this.$route.params.type;
                if(type==1){
                    this.gg1();
                }else{
                    this.gg2();
                }
            },
            getSw(data){
                this.loadOver = false;
                this.curPage = 1;
                if(data==1){
                    this.gg1();
                }else{
                    this.gg2();
                }
            },
            gg1(){
                this.$http.get('/maoyan/ajax/movieOnInfoList').then((res)=>{
                    let data = res.data;
                    this.mlist = data.movieList;
                    this.allMids = data.movieIds;
                    this.scrollRefresh();
                    this.getCity();
                })
            },
            gg2(){
                this.$http.get('/maoyan/ajax/comingList?ci=50&token=&limit=10').then((res)=>{
                    let data = res.data;
                    this.mlist = data.coming;
                    this.allMids = data.movieIds;
                    this.scrollRefresh();
                    this.getCity();
                })
            },
            scrollRefresh(){
                let dom = this.$refs.tank;
                if(!dom) return ;
                dom.style.height = this.mlist.length*114 + 21+ 'px';
                this.iscroll.refresh();
            },
            getIScroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.container1',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true, 
                });
                let _self = this;
                this.iscroll.on('scrollEnd',function(){
                    if(this.y<this.maxScrollY+26){
                        _self.getMore1();
                    }
                    
                })
            },
            getMore1(){
                if(this.loadOver) return;
                if(this.loading) return;
                let page = this.curPage;
                let str = this.allMids.slice(page*12,(page+1)*12);
                this.loading = true;
                this.$http.get('/maoyan/ajax/moreComingList?token=&movieIds='+str).then((res)=>{
                    let data = res.data;
                    this.mlist = this.mlist.concat(data.coming);
                    this.scrollRefresh();
                    this.loading = false;
                    if(data.coming.length<12){
                        this.loadOver = true;
                        return;
                    }
                    this.curPage +=1;
                })
            },
            getCity(){//后端在第一次请求的时候设置cookie存放城市，
                let city  = this.getCookie('ci');
                if(!city) return ;
                let arr = city.split('%2C');
                let cityid = arr[0].split('=')[1];
                this.setCity({cityid:cityid,cityname:decodeURI(arr[1])});
            },
            getCookie:function(name){
                if(document.cookie.length>0){
                    let arr = document.cookie.split(';');
                    for(let i=0;i<arr.length;i++){
                        if(arr[i].indexOf(name+'=')!=-1&&arr[i].indexOf('tci')==-1){
                            return arr[i].replace(' ','');
                            break;
                        }
                    }
                }
            },
        },
        mounted(){
            this.getIScroll();
            this.onBus();
            if(this.$route.params.type==2){
                this.gg2();
                return ;
            }
            this.gg1();
        },
        beforeDestroy(){
            this.$bus.off('swithcM',this.getSw);
            this.$bus.off('selCity',this.repeatReq);
        }
    }
</script>

<style lang="scss">
    .container1{
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        position: relative;
    }
    .container1 ul{
        width:100%;
    }
    .container1 li{
        height:114px;
        width:100%;
        box-sizing: border-box;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;

        .ing{
            margin-top:12px;
            width:64px;
            height:90px;
            overflow: hidden;
            img{
                display:block;
                width:100%;
            }
        }
        .info{
            position: relative;
            text-align: left;
            padding: 12px 0 12px 0;
            margin-left:12px;
            flex:1;
            &:after{
                content:"";
                position: absolute;
                width:100%;
                height:1px;
                background:#d7d7d7;
                transform: scale(1,.5);
                left:0;
                bottom:0;
            }
        }
        .name{
            display: flex;;
            font-size: 17px;
            color: #333;
            font-weight: 700;
            padding-right: 5px;
            flex-shrink: 1;
            margin-bottom: 6px;
            span:nth-child(1){
                max-width:155px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                margin-right:3px;
            }
            
        }
        .actor1,.showInfo{
            width:200px;
            font-size: 13px;
            color: #666;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .material-icons{
            position: relative;
            top:2px;
        }
        .wish{
            color:#faaf00;
            margin-right:4px;
        }
        .opt{
            outline:none;
            border:0;
            border-radius:3px;
            background:#2196f3;
            color:#fff;
            width:48px;
            height:28px;
            font-size:13px;
            position: absolute;
            right:12px;
            top:42px;
        }
        .version{
            background-size: contain;
            background-repeat: no-repeat;
            height: 14px;
            width: 17px;
            display: inline-block;
            margin-top: 5px;
            -webkit-box-flex: 0;
            flex: 0 0 auto;
            margin-right: 3px;
        }
        .version.v3d {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAYAAAAEN20fAAAAAXNSR0IArs4c6QAAA0VJREFUSA3tV1tIFGEU/mZ23F11vaTrZbNs1TIxawkSuyEWIRVU2ksEvRQFRU+91EvQmw9Rb1EQRARFVCC9iCRF201MKlRCMctN3RRb23VRd9e9TecfW2XWmdEedvOh8zJzzn/+c745t39+DkRH73evEcOBqwBXJ4qihckSTRzHjQGinROMF5tP2JycBCIU6BaBnEQ7V7LPAW4uxWgTWCT+FQgGTPJNGHiWDiWkyZVxdXyyakLrwxgGisjKoP9A4vMgxAvieYHnsHe9GdacNESiIhxuH14P/kKY3hlV5JtQSmsxYuLx6Vk4J/1wzQRj4iWfmkCyjAKaDlZidaYR/lAEOo6DXuDRWGXBpZZe+EhWU7wKDcQrUdeoFzffOZYFSBPIme1WCcStdgdefpsAT0CO2YrQuNmCQ5sK8ajrx7z/y619cHh8MOh45JsM2LY2G0dI5/rhKpxv7sHUbHheV+lFtVgpI6iksA9MTKPtiwuhiIjZcBSt/eOSHUuGQWaPRcwXjMDjD6HfNY0Hn5y49uorMgwCjm8tkukqMaoRYbk+9bhr0R6bJUuS9Y5PLVqLF3QOT2KIosTSd7tjKH5ZxqsCkWkRc7pmHTaY01Gam4ann8ekVMXrKPFObwC7rDnQU8qCkaiSiiRTTU38jnyTHuZ0vVQnzCjrpuXQzJ/aMBl0murLjkjTiwHJUG1pLi7Ulklfd+/DiKZxtphHhRuk2nL7Qpq6qhEppGI8t8OK3SXyv4M3NEMmqSCrqSuWIpNeh3JKp9PrX0oVqkC8gRD2lefhZHUxpWPBTgEBZPPFG9Bux9QUHmd3liCduuZJz+iCAZU31dT4Q1G09f/E/ooCXKmvgJ3mCKuRPWVm0N8VWvrm2jhml4H2UPjZwGPRrCrMRHZqCp4PuNAx5ImpqT5VgbAddzqHwdq4fmMetlgyJSMsLTfeDqL9u1tm9AABZsSOATbi2fx5Rh/y0emV6akxXMPd93OHhpoGyfU6DgUZRgRoaP3N+aFhctGSZkRi2kGaqiN0iCWSVIs1kU6VbK8cIHP3CyWMyZMxDBQR0Z48l2qeRDvPblo0r+S9qKafADnzzTDw0nWPblo0ox4mM03Ml+STfDMMvwErHhRiC0ymfAAAAABJRU5ErkJggg==)
        }
        .version.v3d.imax {
            width: 43px;
            background-image: url(data:image/png;base64,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)
        }
        
    }
    .loading{
        width:100%;
        display: block;
        text-align: center;
        color: orange;
        font-weight: 400;
    }
</style>

