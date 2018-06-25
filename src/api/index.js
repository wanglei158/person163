let axios = require('axios');
let domain = 'ting?format=json&calback=&from=webapp_music&method=';
let api = {
    getSong:(type)=>{//type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
        let promise = new Promise((reslove)=>{
            axios.get(`${domain}baidu.ting.billboard.billList&type=${type}&size=10&offset=0`).then((res)=>{
                reslove(res.data.song_list);
            });
        })
        return promise;
    },
    play:(songid)=>{
        let promise = new Promise((reslove)=>{
            axios.get(`${domain}baidu.ting.song.play&songid=${songid}`).then((res)=>{
                reslove(res.data);
            }) 
        });
        return promise;
    },
    search:(query)=>{
        return `${domain}baidu.ting.search.catalogSug&query=${query}`;
    },
    getLrc:(songid)=>{
        return `${domain}baidu.ting.song.lry&songid=${songid}`
    },
    introList:()=>{

    },
    getAuthorInfo:(authorid)=>{
        return `${domain}method=baidu.ting.artist.getInfo&tinguid=${authorid}`
    },
    getSongByAuthor:(authorid)=>{
        return `${domain}baidu.ting.artist.getSongList&tinguid=${authorid}&limits=6&use_cluster=1&order=2`
    }
}

module.exports = api;