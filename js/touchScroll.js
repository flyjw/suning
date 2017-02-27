// JavaScript Document
document.addEventListener("touchmove",function(ev){
	ev.preventDefault();
},false);
function MScroll(objName,sDirection,bBar,bMove)
{
	if(typeof objName == "string" )
	{
		this.obj=document.getElementById(objName);
	}
	else if(typeof objName == "object")
	{
		this.obj=objName;
	}
	else
	{
		return;
	}
	if(typeof bMove=="undefined")
	{
		bMove=true;
	}
	var _this=this;
	this.oScroll=this.obj.children[0];
	this.sDirection=sDirection;
	this.resize();
	this.iScroll=0;
	this.iStart=0;
	this.iStartT=0;
	this.dis=0;
	this.lastDis=0;
	this.timer=0;
	this.bMove=bMove;
	this.iBack=0; //原值50
	if(bBar)
	{
		this.oBar=document.createElement("div");
		this.oBar.style.cssText="width:4px;height:20px;position:absolute;background:rgba(0,0,0,.6);border-radius:2px; opacity:0;transition:.5s opacity;";
		this.oBar.style.cssText+= sDirection=="x"?"left:0;bottom:0;":"right:0;top:0;";		
		this.obj.appendChild(this.oBar);
		this.scrollWrap=sDirection=="x"?this.obj.clientWidth:this.obj.clientHeight;
		this.scale=sDirection=="x"?this.oScroll.offsetWidth/this.obj.clientWidth:this.oScroll.offsetHeight/this.obj.clientHeight;
		sDirection=="x"?this.oBar.style.width=this.scrollWrap/this.scale+"px":this.oBar.style.height=this.scrollWrap/this.scale+"px";
	}
	this.oScroll.addEventListener("touchstart",function(e){	
		_this.fnStart(e);
	},false);
	this.oScroll.addEventListener("touchmove",function(e){
		_this.fnMove(e);
	},false);
	this.oScroll.addEventListener("touchend",function(e){
		_this.fnEnd(e);
	},false);
}
MScroll.prototype={
	fnStart:function(e)
	{
		if(this.onscrollstart)
		{
			this.onscrollstart();
		}
		this.iStart= this.sDirection=="x"? e.changedTouches[0].pageX: e.changedTouches[0].pageY;
		this.iStartT=this.iScroll;
		if(this.oBar)
		{
			this.oBar.style.opacity="1";
		}
	},	
	fnMove:function(e)
	{
		var _this=this;
		var iNow= this.sDirection=="x"? e.changedTouches[0].pageX: e.changedTouches[0].pageY;
		this.lastDis=this.dis;
		this.dis=iNow-this.iStart;
		this.iScroll=this.iStartT+this.dis;
		if(this.iScroll>this.iBack)
		{
			this.iScroll=this.iBack;
		}
		if(this.iScroll<-this.iMaxT-this.iBack)
		{
			this.iScroll=-this.iMaxT-this.iBack;
		}
		this.setCss();
	},
	fnEnd:function(e)
	{
		var iDis=(this.lastDis-this.dis)*3;
		var iDis2=this.iScroll-iDis;
		if(iDis2>0)
		{
			this.tweenMove(0-this.iScroll,'backOut');
		}
		else if(iDis2<-this.iMaxT)
		{
			this.tweenMove(-this.iMaxT-this.iScroll,'backOut');
		}
		else
		{
			this.tweenMove(iDis2-this.iScroll,'easeOut');
		}
		if(this.onscrollend)
		{
			this.onscrollend();
		}
	},
	tween:
	{
		easeOut: function(t, b, c, d){
			return -c *(t/=d)*(t-2) + b;
		},    
		backOut: function(t, b, c, d, s){
			if (typeof s == 'undefined') 
			{
				s = 3.70158;  //回缩的距离
			}
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}
	},
	tweenMove:function(iTarget,sType,fnBack)
	{
		var t=0;
		var d=30;
		var b=this.iScroll;
		var c=iTarget;
		var _this=this;
		clearInterval(this.timer);
		this.timer=setInterval(function(){
			t++;
			if(t>=d)
			{
				clearInterval(_this.timer);
				if(_this.oBar)
				{
					_this.oBar.style.opacity=0;
				}
				fnBack&&fnBack();
			}
			_this.iScroll=_this.tween[sType](t, b, c, d);
			_this.setCss();
		},20);
	},
	setCss:function()
	{
		this.iScroll=parseInt(this.iScroll);
		this.oScroll.style.WebkitTransform=this.oScroll.style.transform=(this.sDirection=="x"?"translate3d("+this.iScroll+"px,0px,0px)" :"translate3d(0px,"+this.iScroll+"px,0px)");
		this.oScroll.style.WebkitBackfaceVisibility=this.oScroll.style.setProperty( '-webkit-backface-visibility', 'hidden' );
		this.oScroll.style.WebkitTransformStyle=this.oScroll.style.webkitTransformStyle="preserve-3d";
		if(this.oBar)
		{
			this.oBar.style.WebkitTransform=this.oBar.style.transform=(this.sDirection=="x"?"translateX("+-this.iScroll/this.scale+"px)":"translateY("+-this.iScroll/this.scale+"px)");	
		}
		if(this.onscroll)
		{
			this.onscroll();
		}
	},
	resize:function()
	{
		this.iMaxT=this.sDirection=="x"?this.oScroll.offsetWidth-this.obj.clientWidth:this.oScroll.offsetHeight-this.obj.clientHeight;
		if(this.iMaxT<0)
		{
			this.iMaxT=0;
		}
		if(this.oBar)
		{
			this.scrollWrap=this.sDirection=="x"?this.obj.clientWidth:this.obj.clientHeight;
			this.scale=this.sDirection=="x"?this.oScroll.offsetWidth/this.obj.clientWidth:this.oScroll.offsetHeight/this.obj.clientHeight;
			this.sDirection=="x"?this.oBar.style.width=this.scrollWrap/this.scale+"px":this.oBar.style.height=this.scrollWrap/this.scale+"px";
		}
	}
};