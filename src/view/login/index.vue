<template>
    <div class="login" :style="{height:curH}">
        <mu-row gutter > 
            <mu-col desktop="25" class="tank"   width="75">
                <template v-if="isRegister">
                    <div class="form">
                        <mu-text-field 
                        icon="people" 
                        label="账号" 
                        errorColor="#d81b60" 
                        :errorText="acounterr" 
                        hintText="6~7位，多了你也记不住" 
                        labelFloat
                        @blur="checkacount(1)"
                        v-model="reForm.count"
                        />
                        <mu-text-field 
                        icon="email" 
                        label="邮箱" 
                        errorColor="#d81b60" 
                        :errorText="mailerr"  
                        hintText="请绑定邮箱" 
                        type="emial" 
                        labelFloat
                        @blur="checkemail"
                        v-model="reForm.mailbox"
                        /><br/>
                        <mu-text-field 
                        icon="send" 
                        label="密码" 
                        errorColor="#d81b60" 
                        :errorText="pwderr" 
                        hintText="6~12位字母和数字" 
                        type="password" 
                        labelFloat
                        v-model="reForm.pwd"
                        @blur="checkpwd(1)"
                        /><br/>
                        <mu-raised-button @click="register" label="来嘛" class="demo-raised-button" />
                    </div>
                    <div class="jfoo">
                        已有账号？<span class="tab" @click="isRegister=false">嘿嘿嘿</span>
                    </div>
                </template>
                <template  v-else> 
                    <div class="sigh">
                        <h3>Music</h3>
                        <!-- <p>let's heart travelling，everywhere</p>
                        此处应该有张图2 -->
                    </div>
                    <div class="form">
                        <mu-text-field 
                        icon="people"
                        :errorText="cellerr"
                        errorColor="#d81b60" 
                        @blur="checkCell"
                        hintText="请输入网易云音乐手机号" 
                        label="手机号"   
                        labelFloat
                        v-model="loForm.count"
                        />
                        <mu-text-field 
                        icon="send" 
                        errorColor="#d81b60" 
                        label="密码" 
                        hintText="6~12位字母和数字" 
                        type="password" 
                        labelFloat
                        v-model="loForm.pwd"
                        /><br/>
                        <mu-raised-button @click="login" label="浪一波" class="demo-raised-button" />
                    </div>
                    <div class="jfoo">
                        <!-- 没有账号？<span class="tab" @click="isRegister=true">客官来一个</span> -->
                    </div>
                </template>
            </mu-col>
        </mu-row>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    export default{
        data(){
            return {
                curH:'',
                curh2:'',
                isRegister:false,
                reForm:{
                    count:'wangni',
                    mailbox:'903148689@qq.com',
                    pwd:'qwe123',
                    acode:'',
                },
                loForm:{
                    count:'',
                    pwd:''
                },
                acounterr:'',
                mailerr:'',
                pwderr:'',
                cellerr:''
            }
        },
        computed:{
            
        },
        methods:{
            ...mapActions(['setUserId']),
            checkCell(){
                let reg = /^1[34578]\d{9}$/;
                if(this.loForm.count==''){
                    this.cellerr = '手机号不能为空';
                    return false;
                }
                if(reg.test(this.loForm.count)){
                    this.cellerr = '';
                    return true;
                }else{
                    this.cellerr = '手机号格式错误';
                    return false;
                }
            },
            login(){
                if(!this.checkCell()) return ;
                this.$http.get(`/api/login/cellphone?phone=${this.loForm.count}&password=${this.loForm.pwd}`).then((data)=>{
                    let res = data.data;
                    if(res.code==200){
                        this.$router.push({path:'/'});
                        localStorage.setItem('userId',encodeURI(res.account.id));
                        this.setUserId(res.account.id);
                    }else{
                        this.$toast.top(res.msg);
                    }
                })
            }
        },
        mounted(){
            this.curH = window.innerHeight+'px';
            this.curh2 = window.innerWidth*0.1+'px';
        }
    }
</script>

<style scoped>
    .row{
        justify-content: center;
    }
    .tank{
        margin-top:120px;
        padding-top: 30px;
        background: rgba(255, 255, 255, 0.4);
        position: relative;
    }
 .login{
    background: url(/static/img/loginbg.jpg) no-repeat center;
    background-size:cover;
    height:100%; 
 }
 
 
 .sigh{
     text-align:center;
 }
 .re.sigh{
     height: auto;
 }
 .sigh h3{
     font-size:24px;
     color:#039be5;
 }
 .sigh p{
     color:#81d4fa;
     font-size:18px;
 }
 .form{
     width:256px;
     margin:0 auto;
 }
.mu-raised-button{
    margin-top:27px;
    background:#0091ea;
    color:#fff;
    width:100%;
}
.jfoo{
    margin-top:36px;
    text-align: center;
    background:rgba(246, 246, 246, 0.1);
    line-height: 59px;
}
.tab{
    color:#0091ea;
    cursor:pointer;
}

</style>

