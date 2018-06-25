<template>
    <div class="book">
        <header>
            <mu-row justify-content="center">
                <mu-avatar :size="56">
                    <img :src="info.profile.avatarUrl">
                </mu-avatar>
                <div class="i_nfo">
                    <h4>{{info.profile.nickname}}&emsp;<span>Lv.{{info.level}}</span></h4>
                    <p>累计听歌：{{info.listenSongs}}首</p>
                </div>
                <div class="l_but">
                    <button @click="GetSign"><template v-if="info.mobileSign">已</template>签到</button>
                </div>
            </mu-row>
        </header>
        <ul class="minelist">
            <router-link to="#">
                <mu-icon value="redeem" color="#2196f3"></mu-icon><br>
                我的订阅
            </router-link>
            <router-link to="#">
                <mu-icon value="pregnant_woman" color="#2196f3"></mu-icon><br>
                我的歌手
            </router-link>
            <router-link :to="{path:'/order'}">
                <mu-icon value="assignment" color="#2196f3"></mu-icon><br>
                我的歌单
            </router-link>
        </ul>
        <button class="quit" @click="userQuit">退出登录</button>
    </div>
</template>


<script>
    import { mapGetters ,mapActions } from 'vuex';
    export default {
        data(){
            return{
                info:{profile:{avatarUrl:''}},
                
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            
        },
        methods:{
            userQuit(){
                localStorage.removeItem('userId');
                this.$router.push({path:'/login'});
            },
            GetSign(){//签到接口
                if(this.info.mobileSign) return;
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
        },
        mounted(){
            this.getUserInfo.then((data)=>{
                this.info = data;
            })
        }
    }
</script>

<style lang="scss">
    header{
        height:120px;
        background: currentColor;
        padding:32px 15px 0;
        .row{
            justify-content: flex-start;
        }
        .i_nfo{
            text-align: left;
            color:#fff;
            font-size:16px;
            padding-left:12px;
            width:200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            h4 span{
                color:#f4511e;
            }
            p{
                font-size:12px;
                margin-top:6px;
            }
        }
        .l_but{
            flex:1;
            button{
                display: block;
                float:right;
                color:#fff;
                width:72px;
                height: 27px;
                background:#ffab40;
                border-radius:14px;
            }
        }
    }
    .minelist{
        padding:15px 0;
        display: flex;
        justify-content: space-around;
        text-align: center;
        a{
            color:#333;
        }
        
    }
    .quit{
        margin:0 auto;
        margin-top:240px;
        display: block;
        width:240px;
        color:#666;
        background: inherit;
        height: 36px;
        border:1px solid #d7d7d7;
        border-radius:3px;
    }
</style>

