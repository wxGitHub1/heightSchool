import axios from "axios";

var weatherInfoList = [
    {
        name:"yu",
        imgUrl: require("./imgs/zhongyu.png")
    },{
        name:"yun",
        imgUrl: require("./imgs/yun.png")
    },{
        name:"xue",
        imgUrl: require("./imgs/daxue.png")
    },{
        name:"lei",
        imgUrl: require("./imgs/leizhenyu.png")
    },{
        name:"shachen",
        imgUrl: require("./imgs/shachenbao.png")
    },{
        name:"wu",
        imgUrl: require("./imgs/mai.png")
    },{
        name:"bingbao",
        imgUrl: require("./imgs/yun.png")
    },{
        name:"yin",
        imgUrl: require("./imgs/yin.png")
    },{
        name:"qing",
        imgUrl: require("./imgs/qing.png")
    },
    
]

var getWeather = (callback) => {
    axios
        .get("https://www.tianqiapi.com/api/")
        .then(data => {

            // console.log(data.data);
            let todayTianqi = data.data.data[0];
            let city = data.data.city;

            var weatherObj  = {}
            weatherInfoList.forEach(weather => {
                if(weather.name == todayTianqi.wea_img){
                    weatherObj.city = city
                    weatherObj.imgUrl = weather.imgUrl
                    weatherObj.tianqi = todayTianqi
                    callback(weatherObj)  
                    return;
                }
            })
            callback(weatherObj)
        })
}

export default {
    getWeather
}