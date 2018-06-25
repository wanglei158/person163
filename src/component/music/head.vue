<template>
    <div id="head1">
        <mu-tabs :value="active2" @change="tabchange" v-if="gethideMcontroll">
            <mu-tab value="1" >新歌推荐</mu-tab>
            <mu-tab value="2" >热歌榜</mu-tab>
            <mu-tab value="3" >搜索</mu-tab>
        </mu-tabs>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        data(){
            return {
                open:false,
                active2:'1',
                open:false,
                userI:{profile:{avatarUrl:''}},
            }
        },
        computed:{
            ...mapGetters(['getUserInfo','gethideMcontroll']),
        },
        watch:{
            $route(to,from){
                this.getInit();
            }
        },
        methods:{
            GetSign(){//签到接口
                this.$http.get('/api/daily_signin').then((data)=>{
                    console.log(data.data);
                    let res = data.data;
                    if(res.code==200){
                        this.$toast.top('签到成功')
                    }else{
                        this.$toast.top(res.msg);
                    }
                })
            },
            tabchange(value){
                if(value!=3){
                    this.$router.push({path:'/music/list/'+value});
                    this.$bus.emit('changelistM');
                }else{
                    this.$router.push({path:'/music/search'});
                }
                this.active2 = value;
            },
            getInit(){
                let obj = this.$route;
                if(obj.path.indexOf('/music/list/')!=-1){
                    let index = obj.params.id;
                    this.active2 = index;
                }else if(obj.path.indexOf('/music/search')!=-1){
                    this.active2 = '3';
                }
            }
        },
        mounted(){
            this.getUserInfo.then((data)=>{
                this.userI = data;
            });
            this.getInit();
        }
    }
</script>


<style  scoped>
    #head1{
        background: #039be5;
    }
    .head1{
        width:1000px;
        margin:0 auto;
        height: 56px;
        line-height: 56px;
        display: flex;
        justify-content: space-around;
        color:#fff;
        font-size:18px;
    }
    .item1{
        font-family: 'Times New Roman",Georgia,Serif'
    }
    .item3 img{
        width:40px;
    }
    .png{
        margin-top:8px;
        width:40px;
        height:40px;
        border-radius: 50%;
        overflow: hidden;
        background: url(/static/img/nima.png) no-repeat;
        background-size: cover;

    }
    .material-icons{
        line-height: inherit;
    }
    .mu-tabs{
        background:teal;
    }
    .mu-list .material-icons{
        font-size:13px;
    }
</style>

