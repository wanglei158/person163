<template>
    <div class="option">
        <div class="l">
            <div class="city-entry" @click="getCites">
                <span class="city-name">{{getCityName}}</span><i class="city-entry-arrow"></i>
            </div>
        </div>
        <div class="c">
            <mu-tabs :value.sync="active1" @change="taps" inverse color="secondary" text-color="rgba(0, 0, 0, .54)"  center>
                <mu-tab value="1">正在热映</mu-tab>
                <mu-tab value="2">即将上映</mu-tab>
            </mu-tabs>
        </div>
        <div class="r">
            <mu-icon value="search"></mu-icon>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        data(){
            return {
                active1:'1',
                curCity:'杭州',//定位城市
            }
        },
        computed:{
            ...mapGetters(['getCityName'])
        },
        methods:{
            getCites(){
                this.$bus.emit('openCites');  
            },
            taps(value){
                this.active1 = value;
                this.$bus.emit('swithcM',value);
                this.$router.push({path:'/movie/list/'+value});
            }
        },
        mounted(){
            let type = this.$route.params.type;
            this.active1 = type;
        }
    }
</script>

<style scoped>
    .option{
        display: flex;
        justify-content: space-between;
        background:teal;
        align-items: center;
    }
    .l,.r{
        width:24%;
    }
    .r{
        line-height: inherit;
        text-align: right;
        margin-right:15px;
    }
    .r .material-icons{
        line-height: inherit;
        color:rgba(255, 255, 255, 0.7);
    }
    .c{
        width:50%;
    }
    .mu-tabs{
        background:teal;
    }
    .city-entry {
        padding-left: 15px;
        font-size: 15px;
        color: rgba(255, 255, 255, 0.7);
        display: -webkit-box;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
    }
    .city-entry .city-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70px;
        max-width: 19.2vw;
    }
    .city-entry-arrow {
        width: 0;
        height: 0;
        border: 4px solid #b0b0b0;
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        display: inline-block;
        margin-left: 4px;
        margin-top: 5px;
    }
</style>



