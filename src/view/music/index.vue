<template>
    <div>
        <m-head />
        <router-view :kkk="curH" class="view"  :style="{height:curH}"></router-view>
    </div>
</template>

<script>
    import head1 from '../../component/music/head';
    import {mapGetters} from 'vuex';
    export default {
        data(){
            return{
                curH:null,
            }
        },
        computed:{
            ...mapGetters(['gethideMcontroll']),
        },
        methods:{
            
        },
        components:{
            'm-head':head1
        },
        mounted(){
            this.curH = window.innerHeight - 104 +'px';
        }
    }
</script>

<style scoped>
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
    .view{
        overflow-y: hidden;
    }
    .mu-circular-progress{
        transform: rotate(-90deg);
        position: fixed;
        bottom:56px;
        background:#999;
        right:0;
    }
</style>

