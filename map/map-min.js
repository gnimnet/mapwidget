/*
* This JavaScript for Pettia Map Widget
* Version:0.4.2
* Author:Ming
* Date:2010-07
*/
(function(i){function q(a){var b=document.createElement("div");if(typeof a!=="undefined")b.id=a;b.innerHTML='<div class="map-layer map-layer-img"></div><div class="map-layer map-layer-mask"></div><div class="map-layer map-layer-effect"><div class="map-zoom" style="display:none;"><div class="map-common-con"><div class="map-zoom-square map-zoom-tl"></div><div class="map-zoom-square map-zoom-tr"></div><div class="map-zoom-square map-zoom-bl"></div><div class="map-zoom-square map-zoom-br"></div></div></div><div class="map-tip"></div></div><div class="map-layer map-layer-info"><div class="map-layer-child"><div class="map-common-con"></div></div></div><div class="map-tools" style="display:none;"><div class="map-tools-box"></div><div class="map-tools-con"></div></div>';
b.className="map-con";this.dom=b;this.nodes={$cLayers:null,$img:i(this.dom).find(".map-layer-img"),$mask:i(this.dom).find(".map-layer-mask"),$zoom:i(this.dom).find(".map-zoom"),$tip:i(this.dom).find(".map-tip"),$info:i(this.dom).find(".map-layer-info"),$infoPos:i(this.dom).find(".map-layer-info .map-layer-child"),$infoCon:i(this.dom).find(".map-layer-info .map-common-con"),$tools:i(this.dom).find(".map-tools")};i(this.dom).find(".map-layer-mask").fadeTo(0,0.1);i(this.dom).find(".map-tools-box").fadeTo(0,
0.7);this.zoomListener=this.dragListener=this.clickListener=this.loaded=this.info=this.data=null;this._init()}function u(a,b,c){var d=a.info.nowLayer,e=c*a.data.sizeA[d].x+b;if(a.loaded[d].flag[e]||e>=a.data.sizeA[d].x*a.data.sizeA[d].y||b>=a.data.sizeA[d].x||c>a.data.sizeA[d].y)d=e=null;else{var f=a.data.sizeB[d].w*b,h=a.data.sizeB[d].h*c,g=document.createElement("img"),j=a.data.dataM[d].url[e];g.src=j;g.className="map-img map-img-"+d+"-"+b+"-"+c;i(g).error(function(){this.src=this.src});i(g).css({left:f+
"px",top:h+"px",width:a.data.sizeB[d].w+"px",height:a.data.sizeB[d].h+"px"}).appendTo(a.nodes.$cLayers[d]);if(a.nodes.$cLayers[d].find(".map-img-"+d+"-"+b+"-"+c).length>0)a.loaded[d].flag[e]=true;d=e=f=h=g=j=null}}function k(a){return i(a.dom).width()}function l(a){return i(a.dom).height()}function n(a,b,c,d){var e=a.info.nowLayer,f=a.data.sizeM[e].w-k(a),h=a.data.sizeM[e].h-l(a);b=b<0?0:f<=0?0:b>f?f:b;c=c<0?0:h<=0?0:c>h?h:c;if(typeof d=="undefined"){a.nodes.$cLayers[e].stop(true).css({opacity:"1",
left:-b+"px",top:-c+"px"});a.nodes.$infoPos.stop(true).css({opacity:"1",left:-b+"px",top:-c+"px"})}else{a.nodes.$cLayers[e].stop(true).animate({opacity:"1",left:-b+"px",top:-c+"px"},d);a.nodes.$infoPos.stop(true).animate({opacity:"1",left:-b+"px",top:-c+"px"},d)}a.info.location={x:b,y:c};o(a)}function o(a){var b=a.info.nowLayer,c=a.info.location.x,d=a.info.location.y,e=c+k(a),f=d+l(a),h=a.data.sizeB[b].w;b=a.data.sizeB[b].h;c=parseInt(c/h);d=parseInt(d/b);e=parseInt(e/h);f=parseInt(f/b);for(h=c;h<=
e;h++)for(b=d;b<=f;b++)u(a,h,b)}function r(a,b,c){if(!a.zoom.doing){var d=a.info.nowLayer;if(d>=a.data.sizeL-1)d=null;else{a.zoom.doing=true;var e=parseFloat(a.info.location.x+b)/parseFloat(a.data.sizeM[d].w),f=parseFloat(a.info.location.y+c)/parseFloat(a.data.sizeM[d].h);e=e*a.data.sizeM[d+1].w-b;f=f*a.data.sizeM[d+1].h-c;a.info.nowLayer=d+1;var h=a.data.sizeM[d+1].w-k(a),g=a.data.sizeM[d+1].h-l(a);e=e<0?0:h<=0?0:e>h?h:e;f=f<0?0:g<=0?0:f>g?g:f;a.nodes.$cLayers[d+1].stop(true).css({left:-e+"px",top:-f+
"px"}).fadeIn(300);a.nodes.$cLayers[d].stop(true).fadeOut(300);a.info.location={x:e,y:f};o(a);a.nodes.$infoPos.stop(true).css({left:-e+"px",top:-f+"px"});e=a.nodes.$infoCon.find(".map-info");var j;for(f=0;f<e.length;f++){g=i(e[f]);h=parseFloat(g.attr("x"))*a.data.sizeM[d+1].w;j=parseFloat(g.attr("y"))*a.data.sizeM[d+1].h;h=m(g,h,j,g.attr("s"));g.stop(true).css({opacity:"1",left:h.x+"px",top:h.y+"px"})}a.nodes.$infoCon.hide().fadeIn(300);b=b-25;c=c-20;a.nodes.$zoom.css({opacity:"1",left:b+"px",top:c+
"px",width:"50px",height:"40px"}).removeClass("map-zoom-small").show();setTimeout(function(){a.nodes.$zoom.animate({opacity:"1",left:"-=25px",top:"-=20px",width:"100px",height:"80px"},200,function(){setTimeout(function(){a.nodes.$zoom.hide();a.zoom.doing=false;a.zoomListener&&a.zoomListener(a,1)},100)})},100);d=b=c=e=f=h=j=g=h=h=g=e=f=e=f=e=f=null}}}function s(a,b,c){if(!a.zoom.doing){var d=a.info.nowLayer;if(d<=0)d=null;else{a.zoom.doing=true;var e=parseFloat(a.info.location.x+b)/parseFloat(a.data.sizeM[d].w),
f=parseFloat(a.info.location.y+c)/parseFloat(a.data.sizeM[d].h);e=e*a.data.sizeM[d-1].w-b;f=f*a.data.sizeM[d-1].h-c;a.info.nowLayer=d-1;var h=a.data.sizeM[d-1].w-k(a),g=a.data.sizeM[d-1].h-l(a);e=e<0?0:h<=0?0:e>h?h:e;f=f<0?0:g<=0?0:f>g?g:f;a.nodes.$cLayers[d-1].stop(true).css({left:-e+"px",top:-f+"px"}).fadeIn(300);a.nodes.$cLayers[d].stop(true).fadeOut(300);a.info.location={x:e,y:f};o(a);a.nodes.$infoPos.stop(true).css({left:-e+"px",top:-f+"px"});e=a.nodes.$infoCon.find(".map-info");var j;for(f=
0;f<e.length;f++){g=i(e[f]);h=parseFloat(g.attr("x"))*a.data.sizeM[d-1].w;j=parseFloat(g.attr("y"))*a.data.sizeM[d-1].h;h=m(g,h,j,g.attr("s"));g.stop(true).css({opacity:"1",left:h.x+"px",top:h.y+"px"})}a.nodes.$infoCon.hide().fadeIn(300);b=b-50;c=c-40;a.nodes.$zoom.css({opacity:"1",left:b+"px",top:c+"px",width:"100px",height:"80px"}).addClass("map-zoom-small").show();setTimeout(function(){a.nodes.$zoom.animate({opacity:"1",left:"+=25px",top:"+=20px",width:"50px",height:"40px"},200,function(){setTimeout(function(){a.nodes.$zoom.hide();
a.zoom.doing=false;a.zoomListener&&a.zoomListener(a,-1)},50)})},50);d=b=c=e=f=h=j=g=h=h=g=e=f=e=f=e=f=null}}}function m(a,b,c,d){var e=i(a).width();a=i(a).height();var f=b,h=c;d=d.split("|");var g;for(g=0;g<d.length;g++){if(d[g]=="l"||d[g]=="left")f=b;if(d[g]=="r"||d[g]=="right")f=b-e;if(d[g]=="t"||d[g]=="top")h=c;if(d[g]=="b"||d[g]=="bottom")h=c-a;if(d[g]=="c"||d[g]=="center"){f=b-e/2;h=c-a/2}}return{x:f,y:h}}window.Map=q;var t={_init:function(){function a(b){if(b.currentTarget==b.target){b.preventDefault();
var c,d;if(b.offsetX){c=b.offsetX;d=b.offsetY}else{c=b.layerX;d=b.layerY}var e=0;if(b.wheelDelta)e=b.wheelDelta/120;if(b.detail)e=-b.detail/3;e>0&&r(b.data,c,d);e<0&&s(b.data,c,d)}}this.drag={doing:false};this.nodes.$info.bind("mouseup mouseleave",this,function(b){var c=b.data;if(c.drag.doing){c.drag.doing=false;i(c.dom).removeClass("map-draging");if(c.dragListener){var d=b.clientX-c.drag.start.x,e=b.clientY-c.drag.start.y;d!=0&&e!=0&&c.dragListener(c,d,e)}if(c.drag.start.x==b.clientX&&c.drag.start.y==
b.clientY&&b.currentTarget==b.target){if(b.offsetX){d=b.offsetX;b=b.offsetY}else{d=b.layerX;b=b.layerY}d+=c.info.location.x;b+=c.info.location.y;c.clickListener&&c.clickListener(c,d,b)}}}).bind("mousedown",this,function(b){if(b.currentTarget==b.target){b.preventDefault();var c=b.data;c.drag.doing=true;c.drag.start={x:b.clientX,y:b.clientY};c.drag.old={x:c.info.location.x,y:c.info.location.y};c.drag.d={x:c.info.location.x+b.clientX,y:c.info.location.y+b.clientY}}}).bind("mousemove",this,function(b){if(b.currentTarget==
b.target){b.preventDefault();var c=b.data;if(c.drag.doing){i(c.dom).addClass("map-draging");n(c,c.drag.d.x-b.clientX,c.drag.d.y-b.clientY)}}});this.zoom={doing:false};this.nodes.$info.bind("mousewheel",this,a).bind("DOMMouseScroll",this,a)},loadFromUrl:function(a,b){this.nodes.$tip.html("Map Loading...");i.ajax({url:a,context:this,success:function(c){var d,e=eval("("+c+")");this.data=e;this.nodes.$img.empty();this.nodes.$infoCon.empty();this.nodes.$cLayers=[];for(c=0;c<e.sizeL;c++){d=document.createElement("div");
this.nodes.$cLayers[c]=i(d).addClass("map-layer-child").css({width:e.sizeM[c].w+"px",height:e.sizeM[c].h+"px"}).appendTo(this.nodes.$img).hide()}this.loaded=[];var f;for(c=0;c<e.sizeL;c++){this.loaded[c]={flag:[]};f=e.sizeA[c].x*e.sizeA[c].y;for(d=0;d<f;d++)this.loaded[c].flag[d]=false}this.info={};this.info.nowLayer=e.viewD.l;this.info.location={x:0,y:0};this.nodes.$cLayers[e.viewD.l].show();this.moveTo(e.viewD.x,e.viewD.y);e.copyright?this.nodes.$tip.html(e.copyright):this.nodes.$tip.html("&copy;2010 Pettia");
i(this.dom).stop(true).css({opacity:"1"}).hide().fadeIn(500);b(true)},error:function(){this.nodes.$tip.html("Map Load Failed...");b(false)}})},moveTo:function(a,b,c){if(a>0&&a<1&&b>0&&b<1){a*=this.data.sizeM[this.info.nowLayer].w;b*=this.data.sizeM[this.info.nowLayer].h}a=a-k(this)/2;b=b-l(this)/2;n(this,a,b,c)},moveFor:function(a,b,c){if(a>0&&a<1&&b>0&&b<1){a=this.info.location.x+a*k(this);b=this.info.location.y+b*l(this)}else{a=this.info.location.x+a;b=this.info.location.y+b}n(this,a,b,c)},setClickListener:function(a){this.clickListener=
a},setDragListener:function(a){this.dragListener=a},setZoomListener:function(a){this.zoomListener=a},addInfo:function(a,b,c,d,e){if(a>0&&a<1&&b>0&&b<1){a*=this.data.sizeM[this.info.nowLayer].w;b*=this.data.sizeM[this.info.nowLayer].h}a=a;b=b;var f=parseFloat(a)/parseFloat(this.data.sizeM[this.info.nowLayer].w),h=parseFloat(b)/parseFloat(this.data.sizeM[this.info.nowLayer].h),g=document.createElement("div");if(typeof e!="undefined")g.id=e;g.className="map-info";e=m(g,a,b,c);g=i(g);g.location={x:a,
y:b};g.attr("x",f).attr("y",h).attr("s",c).append(d).appendTo(this.nodes.$infoCon).hide().css({left:e.x+"px",top:e.y+"px"}).fadeIn(500);g.isInfo=true;return g},clearInfos:function(){this.nodes.$infoCon.empty()},addTool:function(a,b){var c=document.createElement("div"),d=this.nodes.$tools.show().find(".map-tools-con"),e=this.nodes.$tools.show().find(".map-tools-box");if(typeof b!="undefined")c.id=b;c.className="map-tool";c=i(c);c.append(a).appendTo(d).hide().fadeIn(500);e.css({width:d.width()+"px",
height:d.height()+"px"});c.isTool=true;return c},clearTools:function(){this.nodes.$tools.hide().find(".map-tools-con").empty();this.nodes.$tools.hide().find(".map-tools-box").css({width:"0px",height:"0px"})},zoomMap:function(a){var b=k(this)/2,c=l(this)/2;a>0?r(this,b,c):s(this,b,c)},infoMoveTo:function(a,b,c,d,e){if(a.isInfo==true){if(b>0&&b<1&&c>0&&c<1){b*=this.data.sizeM[this.info.nowLayer].w;c*=this.data.sizeM[this.info.nowLayer].h}var f=parseFloat(b)/parseFloat(this.data.sizeM[this.info.nowLayer].w),
h=parseFloat(c)/parseFloat(this.data.sizeM[this.info.nowLayer].h);if(f>1||f<0||h>1||h<0)return false;a.location={x:b,y:c};a.attr("x",f).attr("y",h);b=m(a,b,c,a.attr("s"));if(typeof e=="undefined")a.stop(true).css({left:b.x+"px",top:b.y+"px"});else d?a.stop(true).css({opacity:"1",left:b.x+"px",top:b.y+"px"}).hide().fadeIn(e):a.stop(true).animate({opacity:"1",left:b.x+"px",top:b.y+"px"},e);return true}},infoMoveFor:function(a,b,c,d,e){if(a.isInfo==true){if(b>0&&b<1&&c>0&&c<1){b*=k(this);c*=l(this)}return this.infoMoveTo(a,
a.location.x+b,a.location.y+c,d,e)}},width:function(){return this.data.sizeM[this.info.nowLayer].w},height:function(){return this.data.sizeM[this.info.nowLayer].h},getViewInfo:function(){return{x:this.info.location.x,y:this.info.location.y,w:k(this),h:l(this)}},maskTo:function(a,b){typeof b=="undefined"?this.nodes.$mask.fadeTo(0,a):this.nodes.$mask.fadeTo(b,a)},render:function(a){i(this.dom).appendTo(a)}};for(p in t)q.prototype[p]=t[p]})(jQuery);