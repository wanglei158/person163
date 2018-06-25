<template>
    <div>
        <mu-drawer :open.sync="open"  :left="true" width="100%">
            <mu-icon value="reply" class="backy" @click="open=false"></mu-icon>
            <div class="containert">
                <div class="ptitt">定位城市</div>
                <div class="ptitt2" style="padding-bottom:12px"><span>杭州</span></div>
                <div class="ptitt">热门城市</div>
                <div class="ptitt2 kl">
                    <span v-for="(item,i) in hotcities" :key="i" @click="selectCi(item)">{{item.name}}</span>
                </div>
            </div>
        </mu-drawer>
    </div>
</template>

<script>
    export default {
        props:['city'],
        data(){
            return {
                open:false,
                hotcities:[
                    {
                        name:'上海',
                        cityid:10
                    },
                    {
                        name:'北京',
                        cityid:1
                    },
                    {
                        name:'广州',
                        cityid:20
                    },
                    {
                        name:'深圳',
                        cityid:30
                    },
                    {
                        name:'武汉',
                        cityid:57
                    },
                    {
                        name:'天津',
                        cityid:40
                    },
                    {
                        name:'西安',
                        cityid:42
                    },
                    {
                        name:'南京',
                        cityid:55
                    },
                    {
                        name:'杭州',
                        cityid:50
                    },
                    {
                        name:'成都',
                        cityid:59
                    },
                    {
                        name:'重庆',
                        cityid:45
                    }
                ]
            }
        },
        methods:{
            onBus(){
                this.$bus.on('openCites',this.getOpen)
            },
            getOpen(){
                this.open = true;
            },
            selectCi(it){
                document.cookie = 'ci='+it.cityid+'%2C'+encodeURI(it.name);
                document.cookie = 'selectci=false';
                this.$bus.emit('selCity');
                this.open = false;
            }
        },
        mounted(){
            this.onBus();
        },
        beforeDestroy(){
            this.$bus.off('openCites',this.openCites);
        }
    }
</script>

.<style lang="scss">
    .mu-drawer{
        background: #ebebeb;
        .ptitt{
            margin-left: 15px;
            font-size:14px;
            line-height: 30px;
        }
        .ptitt2{
            width:96%;
            background:#f5f5f5;
            padding-top:12px;
            span{
                margin-left:15px;
                display: block;
                width:96px;
                line-height: 32px;
                height: 32px;
                text-align: center;
                border: 1px solid #e6e6e6;
                border-radius: 3px;
                background: #fff;
                
            }
        }
        .kl{
            flex-wrap: wrap;
            display: flex;
            span{
                margin-bottom: 12px;
            }
        }
        .backy{
            padding:6px 15px;
        }
    }
</style>

