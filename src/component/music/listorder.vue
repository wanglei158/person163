<template>
    <div  class="m_order" >
        <div style="position:relative;z-index:22;background:#fff;padding:15px 0 6px;">
            <div class="create" @click="openAlert=true">
                <input type="text" placeholder="请输入歌单名" v-model="newOrder">
                <button @click="creatNewOrder">新建</button>
            </div>
        </div>
        <div class="tankl" :style="{height:cvbh}">
            <div class="wrapper" ref="klu" >
                <h3 style="font-size:16px;margin-left:4.75%">自己创建的</h3>
                <div class="container3">
                    <li v-for="(item,i) in morders" :key="i" v-if="!item.subscribed">
                        <img :src="item.coverImgUrl" alt="">
                        <p>{{item.name}}</p>
                        <p style="color:#999">{{item.trackCount}}首</p>
                    </li>
                </div>
                <h3 style="font-size:16px;margin-left:4.75%">收藏</h3>
                <div class="container3">
                    <li v-for="(item,i) in morders" :key="i" v-if="item.subscribed">
                        <img :src="item.coverImgUrl" alt="">
                        <span class="opt">
                            <mu-icon value="delete_outline" @click="deleteList(item)"></mu-icon>
                        </span>
                        <p>{{item.name}}</p>
                        <p style="color:#999">{{item.trackCount}}首</p>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        data(){
            return {
                morders:[],
                openAlert:false,
                newOrder:'',
                cvbh:''
            }
        },
        computed:{
            ...mapGetters(['getMorder','refresh']),
        },
        methods:{
            ...mapActions(['sethideMcontroll']),
            deleteList(it){
                this.$http.get('/api/playlist/subscribe?t=2&id='+it.id).then((data)=>{
                    let res = data.data;
                    if(res.code==200){
                        this.$toast.top('取消收藏成功');
                    }
                })
            },
            getIscroll(){
                let IScroll = require('iscroll');
                this.iscroll = new IScroll('.tankl',{
                    scrollY:true,
                    click:true,
                    mouseWheel:true,
                });
            },
            creatNewOrder(){
                this.$http.get('/api/playlist/create?name='+this.newOrder).then((data)=>{
                    let res = data.data;
                    if(res.code==200){
                        this.$toast.top('创建成功');
                        this.getOrder();
                    }else{
                        this.$toast.top(res.code);
                    }
                })
            },
            getOrder(){
                this.getMorder.then((data)=>{
                    this.morders = data.playlist;
                    setTimeout(()=>{
                        let dom = this.$refs.klu;
                        let hei = this.$refs.klu.offsetHeight;
                       dom.style.height = hei+'px';
                       this.iscroll.refresh();
                    },500)
                });
                
            }
        },
        mounted(){
            this.getIscroll();
            this.getOrder();
            this.sethideMcontroll(false);
            this.cvbh = window.innerHeight - 47+'px';
        },
        beforeDestroy(){
            this.sethideMcontroll(true);
        }
    }
</script>


<style lang="scss" scoped>
    .m_order{
        .container3{
            display: flex;
            padding: 15px 0;
            flex-wrap: wrap;
        }
        li{
            width:27%;
            margin-bottom: 12px;
            position: relative;
            margin-left:4.72%;
        }
        img{
            width:100%;
            display: block;
        }
        p{
            font-size:12px;
            width:100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .create{
        width:64%;
        margin:0 auto;
        color:#333;
        font-size: 12px;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
        border:1px solid #d7d7d7;
        button{
            background:#2196f3;
            color:#fff;
            padding:0 12px;
        }
        input{
            text-indent:6px;
        }
    }
    .create .material-icons{
        position: relative;
        top:4px;
    }
    .dialog .mu-dialog-body {
        padding:0;
    }
    .opt{
        opacity: 0.6;
        color:#666;
        position: absolute;
        right:3px;
        top:72px;
    }
</style>
