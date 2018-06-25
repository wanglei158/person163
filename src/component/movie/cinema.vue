<template>
    <div class="nearBy">
        <span class="lopk">nihao</span>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    export default {
        data(){
            return {
                cityList:[]
            }
        },
        computed:{
            ...mapGetters(['getCurrPosition'])
        },
        methods:{
            getCityList(){
                this.$http.get('/static/json/cityApi.json').then((data)=>{
                    let res = data.data;
                    this.cityList = res.data;
                    console.log(res.data);
                })
            }
        },
        mounted(){
            this.getCityList();
        }
        
    }
</script>

<style lang="scss">
 .lopk{
     position:sticky;
     top:20px;
     background:orange;
 }
</style>


