<template>
    <div class="btm_nav" color="teal">
        <mu-bottom-nav :value="active2" @change="navtab">
            <mu-bottom-nav-item title="音乐" icon="music_note" value="/music" ></mu-bottom-nav-item>
            <mu-bottom-nav-item title="电影" icon="movie" value="/movie"></mu-bottom-nav-item>
            <mu-bottom-nav-item title="我的" icon="account_circle" value="/mine" ></mu-bottom-nav-item>
        </mu-bottom-nav>
    </div>
</template>

<script>
    
    export default{
        data(){
            return {
                active2:'/music'
            }
        },
        methods:{
            navtab(val){
                this.active2 = val;
                this.$router.push({path:val});
            },
            initAC(){
                let str = this.$route.path;
                if(str.indexOf('/music')!=-1){
                    this.active2 = '/music';
                }
                if(str.indexOf('/movie')!=-1){
                    this.active2 = '/movie';
                }
                if(str.indexOf('/mine')!=-1){
                    this.active2 = '/mine';
                }
            }
        },
        mounted(){
            this.initAC();
        }
    }
</script>


<style scoped>
    .btm_nav{
        width:100%;
        position: fixed;
        bottom: 0;
    }
    .mu-bottom-nav{
        background:#eee;
    }
</style>


