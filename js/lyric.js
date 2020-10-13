(function (window) {
    //不记得就看80集视频有详解
    //每个函数都有个原型
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype= {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times:[],//保存所有时间
        lyrics:[],//保存所有歌词
        index:-1,
        //歌词解析完才能创建歌词
        loadLyric:function (callback) {
            var $this = this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function (data) {
                    //console.log(data);
                    //歌词解析完
                    $this.parseLyric(data);
                    callback();
                },
                error:function (e) {
                    console.log(e);
                }
            });
        },

        //歌词解析
        parseLyric:function (data) {
            var $this = this;
            //一定要清空上一首歌曲歌词和时间数组的信息
            $this.times = [];
            $this.lyrics = [];
            //以换行符切割整体歌词
            var array = data.split("\n");
            // console.log(array);
            //匹配歌词前类似时间[00:00.92]的字符串
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            //遍历取出每一条歌词
            $.each(array,function (index,ele) {
                //处理歌词
                //以]切割取到的第一个元素就是歌词
                var lrc = ele.split("]")[1];
                //排除空字符串
                if(lrc.length == 1 || lrc.length == 0){
                    return true;
                }
                $this.lyrics.push(lrc);

                var res = timeReg.exec(ele);
                // console.log(res);
                if(res == null){
                    //相当于continue执行下一次循环
                    return true;
                }
                var timeStr = res[1];//00:00.92
                //因为currentTime是秒到时候不好比较
                //把这个获取的转换成秒
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                //保留两位小数,但会变成字符串类型
                var time = parseFloat(Number(min +sec).toFixed(2));
                //把时间存入数组
                $this.times.push(time);

            });

        },
        currentIndex:function (currentTime) {
            // console.log(currentTime);
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前面的一个元素
            }
            return this.index;//index用于歌词数组的下标
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);