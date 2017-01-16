/* ��drag ����ڱ��θ����϶���  es6 + jq
 *
  * ֻ�漰�����϶� ����������
  * */

class Drag{
    constructor(opt){
        this.ele=opt.ele;
        this.x=this.l=null;
        $(this.ele).on('mousedown',this.down.bind(this));
        $(this.ele).on('mousemove',this.move.bind(this));
        $(this.ele).on('mouseup',this.up.bind(this));
    }
    down(e){
        this.x=e.clientX;
        this.l= this.ele.offsetLeft;
        console.log(this.x)
    }
    move(e){
        var pos= e.clientX-this.x+this.l+'px';
        $(this.ele).css('left',pos);
    };
    up(e){
        $(this.ele).off('mouseup',this.up.bind(this));
    };

}
