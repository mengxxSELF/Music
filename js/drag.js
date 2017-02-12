/* 本drag 针对于本次歌曲拖动条  es6 + jq
 *
  * 只涉及横向拖动 不做纵向处理
  * */

class Drag{
    constructor(opt){
        this.ele=opt.ele[0];
        this.x=this.l=null;

        this.Move = this.move.bind(this);

        $(this.ele).on('mousedown',this.down.bind(this));
    }
    down(e){
        this.x=e.clientX;
        this.l= this.ele.offsetLeft;
        console.log(this.x,'down',this);
        var _this =this;
        $(document).on('mousemove', this.ele , function () {
            console.log('ffff')
        });
        //$(this.ele).on('mouseup',Up);
    }
    move(e){
        var pos= e.clientX-this.x+this.l+'px';
        $(this.ele).css('left',pos);
        console.log(pos,'move')
    };
    up(){
        //$(this.ele).on('mousemove',this.move.bind(this));
        //$(this.ele).off('mouseup',this.up.bind(this));

        // up 事件发生后  计算位置 -》播放时间


    };

}
