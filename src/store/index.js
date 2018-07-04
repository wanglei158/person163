/*index.js*/
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
var userId = null;
if(localStorage.getItem('userId')!=null){
	userId = localStorage.getItem('userId');
}else{
	location.href = '/#/login';
}

export const  store = new Vuex.Store({
	state:{
		userId:userId,
		hideMcontroll:true,
		cityID:null,
		cityName:''
	},
	getters:{
		refresh:()=>{
			let promise = new Promise((reslove)=>{
				axios.get('/api/login/refresh').then((data)=>{
					reslove(data.data);
				})
			});
			return promise;
		},
		gethideMcontroll:(state)=>{
			return state.hideMcontroll;
		},
		getMorder:(state)=>{//获取用户歌单
			let promise = new Promise((reslove)=>{
				axios.get('/api/user/playlist?uid='+state.userId).then((data)=>{
					reslove(data.data);
				})
			});
			return promise;
		},
        getUserInfo:(state)=>{//获取网易云用户信息
			if(state.userId==null){
				return false;
			}
			let promise = new Promise((reslove,reject)=>{
				axios.get(`/api/user/detail?uid=${state.userId}`).then((data)=>{
					reslove (data.data);
				})
			});
			return promise;
		},
		getRecommonSong:()=>{//获取每日推荐歌曲
			let promise = new Promise((reslove,reject)=>{
				axios.get('/api/recommend/songs').then((data)=>{
					reslove (data.data);
				})
			});
			return promise;
		},
		getPersonalized:()=>{//新歌
			let promise = new Promise((reslove,reject)=>{
				axios.get('/api/personalized/newsong').then((data)=>{
					reslove (data.data);
				})
			});
			return promise;
		},
		getSearchHot:()=>{//搜索热词获取
			let promise = new Promise((reslove,reject)=>{
				axios.get('/api/search/hot').then((data)=>{
					reslove (data.data);
				})
			});
			return promise;
		},
		getCurrPosition:()=>{//获取当前城市定位
			let promise = new Promise((reslove)=>{
				geolocation.getLocation((data)=>{
					reslove(data);
				})
			});
			return promise;
		},
		getCityID:(state)=>{
			return state.cityID;
		},
		getCityName:(state)=>{
			return state.cityName||'杭州';
		}
	},
	mutations:{
        setUserId:(state,payload)=>{
            state.userId = payload;
		},
		sethideMcontroll:(state,payload)=>{
			state.hideMcontroll = payload;
		},
		setCity:(state,payload)=>{
			state.cityID = payload.cityid;
			state.cityName = payload.cityname;
		}
	},
	actions:{
        setUserId:({commit},payload)=>{
            commit('setUserId',payload);
		},
		sethideMcontroll:({commit},payload)=>{
            commit('sethideMcontroll',payload);
		},
		setCity:({commit},payload)=>{
            commit('setCity',payload);
        },
	}
})