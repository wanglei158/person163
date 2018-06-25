<template>
    <div class="home">
        <router-view class="view" :style="{height:curH}"></router-view>
        <m-play :class="{active:closed}" @close="close" @open="open" @conn="conn" />
        <div @click="open"><mu-circular-progress @click="open" class="demo-circular-progress" :max="10000" mode="determinate" :value="curV" color="secondary" :stroke-width="4" :size="36"></mu-circular-progress></div>
        <btmnav/>
    </div>
</template>

<script>
    import Player from '../component/music/player';
    import btmnav from '../component/btm_nav'
    import  { mapGetters } from 'vuex';
    export default{
        data(){
            return {
                closed:true,
                msg:'nihao',
                curH:'',
                curV:0
            }
        },
        components:{
            btmnav,
            'm-play':Player,
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        methods:{
            conn(val){
                this.curV = val;
            },
            close(boo){
                this.closed = true;
            },
            open(){
                this.closed = false;
            }
        },
        mounted(){
            this.curH = window.innerHeight - 56 +'px';
        }
    }
</script>
<style scoped>
    .home{
        display: flex;
        flex-direction:column;
    }
    .view{
        flex:1;
        overflow-y: hidden;
    }
    .musicPlayer{
        position: fixed;
        width:100%;
        z-index:99;
        top:0;
        left:0;
        background: #ccc;
        transition: all 0.64s;
        padding: 15px;
    }
    .musicPlayer.active{
        transform: translate(200%);
    }
    .mu-circular-progress{
        transform: rotate(-90deg);
        position: fixed;
        bottom:56px;
        background:#999;
        right:0;
    }
</style>

