import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)


import Home from '../view/home.vue';
import Login from '../view/login';
import Music from '../view/music';
import Mlist from '../component/music/list';
import Msearch from '../component/music/search';
import MPlayer from '../component/music/player';
import Morder from '../component/music/listorder';

import Video from '../view/video';
import VList from '../component/movie/list';
import Vdetail from '../component/movie/detail';
import Vcinema from '../component/movie/cinema';

import Mine from '../view/mine';


export default new VueRouter({
    routes:[
        {
            path:'/login',
            name:'',
            component:Login
        },
        {
            path:'/',
            name:'',
            redirect:'/music',
            component:Home,
            children:[
                {
                    path:'/music',
                    name:'',
                    redirect:'/music/list/1',
                    component:Music,
                    children:[
                        {
                            path:'/music/list/:id',
                            name:'',
                            component:Mlist
                        },
                        {
                            path:'/music/search',
                            name:'',
                            component:Msearch
                        },
                    ]
                },
                {
                    path:'/movie',
                    name:'',
                    component:Video,
                    redirect:'/movie/list/1',
                    children:[
                        {
                            path:'/movie/list/:type',
                            name:'',
                            component:VList
                        }
                    ]
                },
                {
                    path:'/mine',
                    name:'',
                    component:Mine
                }
            ]
        },
        {
            path:'/moviedetail',
            name:'',
            component:Vdetail
        },
        {
            path:'/cinema',
            name:'',
            component:Vcinema
        },
        {
            path:'/order',
            name:'',
            component:Morder
        }
    ]
})