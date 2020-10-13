$(function () {
        //0.自定义滚动条
        $(".content_list").mCustomScrollbar();
        //传歌曲,并创建歌曲对象
        var $audio = $("audio");
        var player = new Player($audio);

        //传歌曲进度条的三个信息,并创建对象
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        var progress = Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        //传音量进度条
        //传进度条的三个信息,并创建对象
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        var voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
        voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value);
        });

        var lyric;

        //1.加载json文件中保存的歌曲列表
        //使用ajax可以加载本地或网络文件和数据
        //需要解决一下ajax跨域访问本地文件的问题,部署在服务器上即可
        getPlayerList();
        function getPlayerList() {
            $.ajax({
                url:"./source/musiclist.json",
                dataType:"json",
                success:function (data) {
                    //这个还没用上
                    //控制上一首下一首边界用的,获取总长
                    player.musicList = data;
                    //3.1遍历获取到的数据，创建每一条音乐,再把创建的加入到ul列表中
                    //获取ul
                    var $music = $(".content_list ul");
                    $.each(data,function (index,ele) {
                        //生成li
                        var $item = createMusicItem(index,ele);
                        //把li放到ul里
                        $music.append($item);
                    });
                    //初始化第0首歌曲的其他信息
                    initMusicInfo(data[0]);
                    //初始化歌词信息
                    initMusicLyric(data[0]);
                },
                error:function (e) {
                    console.log(e);
                }
            });
        }
        //2.初始化歌曲信息
        function initMusicInfo(music) {
            //获取对应的元素
            //右侧歌曲信息
            var $musicImage = $(".song_info_pic img");
            var $musicName = $(".song_info_name a");
            var $musicSinger = $(".song_info_singer a");
            var $musicAlbum = $(".song_info_album a");

            //底部进度条信息
            var $musicProgressName = $(".music_progress_name");
            var $musicProgressTime = $(".music_progress_time");
            var $musicBg = $(".mask_bg");

            //给获取到的元素赋值
            $musicImage.attr("src",music.cover);
            $musicName.text(music.name);
            $musicSinger.text(music.singer);
            $musicAlbum.text(music.album);
            $musicProgressName.text(music.name+" / "+music.singer);
            $musicProgressTime.text("00:00 / "+music.time);
            $musicBg.css("background","url('"+music.cover+"')");
        }
        //3.初始化歌词信息
        function initMusicLyric(music) {
            lyric = new Lyric(music.link_lrc);
            //获取歌词列表的html容器
            var $lyricContainer = $(".song_lyric");
            //清空上一首音乐的歌词
            $lyricContainer.html("");
            lyric.loadLyric(function () {
                //创建歌词列表
                $.each(lyric.lyrics,function (index,ele) {
                    var $item = $("<li>"+ele+"</li>");
                    $lyricContainer.append($item);
                });
            });
        }
        //3.初始化事件监听
        initEvents();
        function initEvents() {
            //1.监听歌曲的移入移除事件
            //动态创建的元素添加事件只能用事件委托
            $(".content_list").delegate(".list_music","mouseenter",function () {
                $(this).find(".list_menu").stop().fadeIn(100);
                //显示删除图标
                $(this).find(".list_time a").stop().fadeIn(100);
                //隐藏时长
                $(this).find(".list_time span").stop().fadeOut(100);
            })
            $(".content_list").delegate(".list_music","mouseleave",function () {
                //隐藏子菜单
                $(this).find(".list_menu").stop().fadeOut(100);
                //隐藏删除图标
                $(this).find(".list_time a").stop().fadeOut(100);
                //显示时长
                $(this).find(".list_time span").stop().fadeIn(100);
            })
            //这下面是静态页添加hover效果使用,改成动态生成的时候没效果

            // $(".list_music").hover(function () {
            //     //显示子菜单
            //     $(this).find(".list_menu").stop().fadeIn(100);
            //     //显示删除图标
            //     $(this).find(".list_time a").stop().fadeIn(100);
            //     //隐藏时长
            //     $(this).find(".list_time span").stop().fadeOut(100);
            // },function () {
            //     //隐藏子菜单
            //     $(this).find(".list_menu").stop().fadeOut(100);
            //     //隐藏删除图标
            //     $(this).find(".list_time a").stop().fadeOut(100);
            //     //显示时长
            //     $(this).find(".list_time span").stop().fadeIn(100);
            //
            // })

            //2.监听复选框的点击事件,添加一个类即可
            //动态添加复选框效果添加事件委托
            $(".content_list").delegate(".list_check","click",function () {
                $(this).toggleClass("list_checked");
            })
            //静态添加复选框效果
            // $(".list_check").click(function () {
            //     $(this).toggleClass("list_checked");
            // })

            //3.添加子菜单播放按钮的监听
            var $musicPlay = $(".music_play");
            $(".content_list").delegate(".list_menu_play","click",function () {
                //切换播放的图标
                $(this).toggleClass("list_menu_play2");
                //复原其他播放图标
                //找到该行其他兄弟节点移除暂停图标的类
                $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2")
                //底部播放按钮同步
                if($(this).attr("class").indexOf("list_menu_play2") != -1){
                    //当前子菜单的播放按钮是播放状态
                    $musicPlay.addClass("music_play2");
                    //让文字高亮
                    $(this).parents(".list_music").find("div").css("color","#fff");
                    //排他
                    $(this).parents(".list_music").siblings().find("div").css("color","rgba(255,255,255,0.5)");
                }else{
                    //当前子菜单的播放按钮不是播放状态
                    $musicPlay.removeClass("music_play2");
                    //不让文字高亮
                    $(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");
                }

                //切换序号变为一张gif图
                $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
                //排他
                $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");

                //播放音乐
                player.playMusic($(this).parents(".list_music").get(0).index,$(this).parents(".list_music").get(0).music);

                //切换歌曲信息
                initMusicInfo($(this).parents(".list_music").get(0).music);
                //切换歌词信息
                initMusicLyric($(this).parents(".list_music").get(0).music);
                //重制一下margin
                $(".song_lyric").css({
                    marginTop:0
                });
            });

            //4.监听底部控制区域播放按钮的点击
            $musicPlay.click(function () {
                //判断有没有播放过音乐
                if(player.currentIndex == -1){
                    //没有播放过音乐
                    $(".list_music").eq(0).find(".list_menu_play").trigger("click");
                }else{
                    //已经播放过音乐
                    //这段很奇妙,底下播放暂停按钮状态切换实质还是上面子菜单按钮状态变化它也变化
                    $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
                }
            });

            //5.监听底部控制区域上一首按钮的点击
            $(".music_pre").click(function () {
                $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
            });

            //6.监听底部控制区域下一首按钮的点击
            $(".music_next").click(function () {
                $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
            });

            //7.监听删除按钮的点击
            $(".content_list").delegate(".list_menu_del","click",function () {
                //找到被点击的音乐
                var $item = $(this).parents(".list_music");
                $item.remove();
                player.deleteMusic($item.get(0).index);

                //判断当前删除的音乐是否是正在播放的
                if($item.get(0).index == player.currentIndex){
                   //如果是则播放下一首,相当于点击下一首按钮
                    $(".music_next").trigger("click");
                }
                //重新排序
                $(".list_music").each(function (index,ele) {
                    //把最新的index更新旧index
                    ele.index = index;
                    $(ele).find(".list_number").text(index+1);
                })
            });

            //8.监听歌曲播放进度时间
            player.musicTimeUpdate(function (currentTime,duration,timeStr) {
                //同步时间
                $(".music_progress_time").text(timeStr);
                //同步进度条
                //计算播放比例修改前景宽度和原点位置
                var value = currentTime / duration * 100;
                progress.setProgress(value);


                //实现歌词同步
                var index = lyric.currentIndex(currentTime);
                var $item = $(".song_lyric li").eq(index);
                $item.addClass("cur");
                //排他
                $item.siblings().removeClass("cur");
                if(index<=2){
                    return;
                }
                //歌词滚动
                $(".song_lyric").css({
                    marginTop:(-index + 2) * 30
                });

                //当播放完了一首歌之后,自动播放下一首
                if(currentTime == duration){
                    //播放下一首
                    $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
                    //重制一下margin
                    $(".song_lyric").css({
                        marginTop:0
                    });
                }
            });

            //9.监听声音按钮的点击
            $(".music_voice_icon").click(function () {
                //声音图标切换
                $(this).toggleClass("music_voice_icon2");
                //声音切换
                //有这个类
                if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                    //变为没有声音
                    player.musicVoiceSeekTo(0);
                }else{
                    //变为有声音
                    player.musicVoiceSeekTo(1);
                }
            });
        }




        //10.定义一个创建每个数组元素成为歌曲信息的函数
        //也就是创建li的函数
        function createMusicItem(index,music) {
            var $item = $("<li class=\"list_music\">\n" +
                "                            <div class=\"list_check\"><i></i></div>\n" +
                "                            <div class=\"list_number\">"+(index+1)+"</div>\n" +
                "                            <div class=\"list_name\">"+music.name+"" +
                "                                <div class=\"list_menu\">\n" +
                "                                    <a href=\"javascript:\" title=\"播放\" class='list_menu_play'></a>\n" +
                "                                    <a href=\"javascript:\" title=\"添加\"></a>\n" +
                "                                    <a href=\"javascript:\" title=\"分享\"></a>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                            <div class=\"list_singer\">"+music.singer+"</div>\n" +
                "                            <div class=\"list_time\">\n" +
                "                                <span>"+music.time+"</span>\n" +
                "                                <a href=\"javascript:\" title=\"删除\" class='list_menu_del'></a>\n" +
                "                            </div>\n" +
                "                        </li>");
            $item.get(0).index = index;
            $item.get(0).music = music;
            return $item;
        }
})