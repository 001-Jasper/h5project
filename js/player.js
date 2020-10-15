(function (window) {
    //不记得就看80集视频有详解
    //每个函数都有个原型
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype={
        constructor: Player,
        musicList:[],
        init:function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex: -1,
        playMusic:function (index,music) {
            //判断是否是同一首音乐
            if(this.currentIndex == index){
                //同一首音乐切换状态
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
                return 1;
            }else{
                //不是同一首
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
                return 0;
            }
        },
        preIndex:function () {
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex:function () {
            var index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        deleteMusic:function (index) {
            //删除对应的音乐数据
            this.musicList.splice(index,1);

            //判断当前删除的是否是正在播放音乐前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex -1;
            }
        },
        musicTimeUpdate:function (callBack) {
            //保留一下player的this
            var $this = this;
            this.$audio.on("timeupdate",function () {
                //这里获取的时间是秒
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                //把秒转换成需要格式的字符串
                var timeStr = $this.formatData(currentTime,duration);
                callBack(currentTime,duration,timeStr);
            });
        },
        formatData:function (currentTime,duration) {
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if(endMin < 10){
                endMin = "0" + endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }

            var startMin = parseInt(currentTime / 60);
            var stratSec = parseInt(currentTime % 60);
            if(startMin < 10){
                startMin = "0" + startMin;
            }
            if(stratSec < 10){
                stratSec = "0" + stratSec;
            }
            return startMin + ":" + stratSec + " / " +endMin+":"+endSec;
        },
        musicSeekTo:function (value) {
            if(isNaN(value)){
                return;
            }
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function (value) {
            if(isNaN(value)){
                return;
            }
            if(value <0 || value >1){
                return;
            }
            //0~1范围
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);
