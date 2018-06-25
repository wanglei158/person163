<template>
    <div class="dialog_s"  v-if="show">
        <div id="dialog">
            <p>{{msg}}?</p> 
            <button @click="getCancel">取消</button>
            <button @click="getComm">确定</button>
        </div>
    </div>
</template>

<script>
    export default {
        props:['msg','show'],
        methods:{
            getComm(){
                this.$emit('confirm');
            },
            getCancel(){
                this.$emit('cancel');
            }
        }
    }
</script>

<style lang="scss">
    .dialog_s{
        position: fixed;
        width:100%;
        height:100%;
        top:0;
        left:0;
        background:rgba(0,0,0,.6);
        z-index:999;
    }
    #dialog{
        width:76%;
        position: fixed;
        background:#fff;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        text-align: center;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        border-radius:6px;
        p{
            width:100%;
            font-size:16px;
            line-height: 56px;
            position: relative;
            color:#343434;
            &:after{
                content:"";
                position: absolute;
                bottom:0;
                left:0;
                height:1px;
                width:100%;
                transform: scale(1,.5);
                background: #d7d7d7;
            }
        }
        button{
            width:50%;
            height:48px;
            background: inherit;
            position: relative;
            &:nth-child(2):after{
                content: "";
                position: absolute;
                right:0;
                top:0;
                height:100%;
                width:1px;
                background:#d7d7d7;
                transform: scale(.5,1);
            }
        }
        button:nth-of-type(1){
            color:#999;
        }  
        button:nth-of-type(2){
            color:#2196f3;
        }       
    }
</style>

