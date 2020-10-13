(function (window) {
    //不记得就看80集视频有详解
    //每个函数都有个原型
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype={
        constructor: Progress,
        isMove:false,
        init:function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        progressClick:function (callback) {
            //谁调用方法this就是谁
            var $this = this;//此时的this是progress
            //监听背景的点击
            this.$progressBar.click(function (event) {
                //获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                //获取点击的位置距离窗口最左边的距离
                var eventLeft = event.pageX;
                //设置前景的宽度
                $this.$progressLine.css("width",eventLeft-normalLeft);
                $this.$progressDot.css("left",eventLeft-normalLeft);
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $(this).width();
                callback(value);
            });
        },
        progressMove:function (callback) {
            var $this = this;
            //获取背景距离窗口默认左边的位置
            var normalLeft = $this.$progressBar.offset().left;
            var eventLeft;
            //1.监听鼠标的按下事件
            this.$progressBar.mousedown(function () {

                //2.监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    //拖拽的时候把变量设置为真
                    $this.isMove = true;
                    //获取点击的位置距离窗口最左边的距离
                    var eventLeft = event.pageX;
                    if(eventLeft-normalLeft<=0){
                        $this.$progressLine.css("width",0);
                        $this.$progressDot.css("left",0);
                    }else if(eventLeft-normalLeft>=$this.$progressBar.width()){
                        $this.$progressLine.css("width",$this.$progressBar.width());
                        $this.$progressDot.css("right",0);
                    }else{
                        $this.$progressLine.css("width",eventLeft-normalLeft);
                        $this.$progressDot.css("left",eventLeft-normalLeft);
                    }
                });
            });
            //3.监听鼠标的抬起事件
            $(document).mouseup(function (event) {

                //重新获取一下更新拖动后进度条位置
                $(document).off("mousemove");
                $this.isMove = false;

                //加了可脱离脱离导航栏用还是有bug
                // eventLeft2 = event.pageX
                // if(eventLeft2-normalLeft<0){
                //     //不修改位置
                // }else if(eventLeft2-normalLeft>=$this.$progressBar.width()){
                //     //也不修改位置
                // }else{
                //     eventLeft = eventLeft2;
                // }
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $this.$progressBar.width();
                callback(value);
            });
        },
        setProgress:function (value) {
            //判断拖动和歌曲update函数是否通识运行产生冲突
            if(this.isMove){
                return;
            }
            if(value < 0 || value > 100){
                return;
            }
            this.$progressLine.css({
                width:value+"%"
            });
            this.$progressDot.css({
                left:value+"%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);