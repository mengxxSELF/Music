/* */
// 字体设置
~function () {
    /* 根据不同设别宽度求出对应的字体大小 设置给根字节 */
    var windowWidth = $(window).width(), //document.documentElement.clientWidth
        designWidth=640, //设计稿宽度
        htmlFont=100;
    var nowFont= windowWidth*htmlFont/designWidth;
    document.documentElement.style.fontSize=nowFont+'px';
}();
// 对中间板块 Main 的设置
~function(){
    var $header = $('header'),
        $main= $('.main'),
        $footer=$('footer'),
        htmlFont=100;
    var windowHeight = $(window).height(); //document.documentElement.clientWidth
        $main.css('height',(windowHeight-$header.height()-$footer.height()-0.58*htmlFont)+'px')
}();

// 获取数据 渲染DOM
var music = (function () {
    // 开始渲染页面
    var musicCb = $.Callbacks();
    // 订阅
    // 歌词渲染
    musicCb.add(function (data) {
        var str='';
        for(var i=0;i<data.length;i++){
            var cur = data[i];
            str+='<p data-minute="'+cur.minute+'" data-second="'+cur.second+'" >'+cur.cont+'</p>';
        };
        $('.lyric').html(str);
    });

    // 时间补位函数
    function changeTime(date){
        var m = Math.floor(date/60);
        var s = Math.floor(date%60);

        m = m<10?'0'+m:m;
        s = s<10?'0'+s:s;
        return m+':'+s;
    }
    var oAudio = $('audio')[0],
        timer=null, //定时器
        musicDuration=null; // 音乐总时间
    // 歌曲信息
    musicCb.add(function () {
        $('audio').on('canplay', function () {
            this.play();//加载完毕 自动播放
            $('.play').hide().next().show();
            // 最大时间
            musicDuration=this.duration;
            $('.duration').html( changeTime(musicDuration) )

            // 处理音乐加速播放
            $('.timeLine span').addClass('on'); // 显示拖拽按钮
            new Drag({
                ele:$('.timeLine span b')
            });

            timer = setInterval(playMusic,1000);
            $('.btn').click(function () {
                if(oAudio.paused){
                    oAudio.play();
                    $('.play').hide().next().show();
                    timer = setInterval(playMusic,1000);
                }else{
                    oAudio.pause();
                    $('.play').show().next().hide();
                    clearInterval(timer);
                }
            })
        })
    });

    // 开启定时器 操作进度条 文字变色
    // timer = setInterval(playMusic,1000);
    function playMusic() {

        var currentTime = oAudio.currentTime,
            currentT = changeTime(currentTime),
            minute= currentT.split(':')[0],
            second= currentT.split(':')[1];
        $('.current').html(currentT); // 变化当前时间
        // 变化进度条  宽度是父级的百分比
        $('.timeLine span').css('width',currentTime/musicDuration*100+'%');
        // 文字变色 通过属性过滤 查找
        $('.lyric p').filter('[data-minute="'+minute+'"]').filter('[data-second="'+second+'"]').addClass('on').siblings().removeClass('on');

        //处理播放完毕
        if(oAudio.ended){
            clearInterval(timer);
            $('.play').show().next().hide();
            $('.lyric').animate({top:0},1000);
            $('.timeLine span::after').css('opacity',0);

            return;
        }

        // 歌词上移
        var index = $('.lyric p.on').index();// 当前显示文字的索引
        if(index>3){
            $('.lyric').animate({top:(index-2)*-0.84+'rem'},1000);
        };

    }




    return {
        init: function () {
            // ajax 获取数据
            $.get('lyric.json', function (res) {
                var data = res.lyric;
                //处理data
                data = data.replace(/&#(\d{2});/g, function ($0,$1) {
                    // 根据$1 处理 $0
                    var val=$0;
                    switch ($1){ // switch 是严格匹配 这里需要处理
                        case '32':
                            val=' ';
                            break;
                        case '40':
                            val='(';
                            break;
                        case '41':
                            val=')';
                            break;
                        case '45':
                            val='-';
                            break;
                    }
                    return val;
                });

                // 正则处理时间
                var getAry=[];
                var reg = /\[(\d+)&#58;(\d+)&#46;(?:\d+)\]([^&#]+)(?:&#10;)/g;
                data.replace(reg, function ($0, $1, $2, $3) {
                    getAry.push({
                        minute:$1,
                        second:$2,
                        cont:$3
                    })
                });
                musicCb.fire(getAry); // 发布
            },'json')
        }
    }
})();
music.init();








