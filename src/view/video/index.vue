<template>
    <div class="video">
        <v-head />
        <router-view :style="{height:curH}"></router-view>
        <v-aside />
    </div>
</template>
 
 <script>
    import Cities from '../../component/movie/citylist';
    import Head from '../../component/movie/head';
    import Body from '../../component/movie/list';
     export default {
        data(){
            return {
                curH:null
            }
        },
        components:{
            'v-head':Head,
            'v-aside':Cities
        },
        mounted(){
            this.curH = window.innerHeight - 104 +'px';
        }
     }
 </script>


 
