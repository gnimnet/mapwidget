/*
 * This JavaScript for Pettia Map Widget
 * Version:0.4.2
 * Author:Ming
 * Date:2010-07
 */

(function($) {
    /* Map Widget Constructor Function */
    function Map(DOMid) {
        //Make DOM structure
        var htmlStr =
		    '<div class="map-layer map-layer-img"></div>' +
		    '<div class="map-layer map-layer-mask"></div>' +
        /* ---------- layer effect DOMs(Begin) ---------- */
            '<div class="map-layer map-layer-effect">' +
        /* zoom effect DOMs  */
                '<div class="map-zoom" style="display:none;">' +
                    '<div class="map-common-con">' +
                        '<div class="map-zoom-square map-zoom-tl"></div>' +
                        '<div class="map-zoom-square map-zoom-tr"></div>' +
                        '<div class="map-zoom-square map-zoom-bl"></div>' +
                        '<div class="map-zoom-square map-zoom-br"></div>' +
                    '</div>' +
                '</div>' +
        /* zoom effect DOMs  */
                '<div class="map-tip"></div>' +
            '</div>' +
        /* ---------- layer effect DOMs(End) ---------- */
		    '<div class="map-layer map-layer-info"><div class="map-layer-child"><div class="map-common-con"></div></div></div>' +
		    '<div class="map-tools" style="display:none;"><div class="map-tools-box"></div><div class="map-tools-con"></div></div>';
        //Create DOM node
        var div = document.createElement('div');
        if (typeof DOMid !== 'undefined') div.id = DOMid;
        div.innerHTML = htmlStr;
        div.className = 'map-con';
        //init Map Widget data
        this.dom = div; //Map Block DOM
        this.nodes = {
            $cLayers: null, //map image child layers
            $img: $(this.dom).find('.map-layer-img'),
            $mask: $(this.dom).find('.map-layer-mask'),
            $zoom: $(this.dom).find('.map-zoom'),
            $tip: $(this.dom).find('.map-tip'),
            $info: $(this.dom).find('.map-layer-info'),
            $infoPos: $(this.dom).find('.map-layer-info .map-layer-child'),
            $infoCon: $(this.dom).find('.map-layer-info .map-common-con'),
            $tools: $(this.dom).find('.map-tools')
        }
        $(this.dom).find('.map-layer-mask').fadeTo(0, 0.1); //mask init opacity to 0.1
        $(this.dom).find('.map-tools-box').fadeTo(0, 0.7); //tools box init opacity to 0.7
        this.data = null; //no map data at begin
        this.info = null; //map current information
        this.loaded = null; //map image loaded flag
        this.clickListener = null; //map click listener(just only one function!)
        this.dragListener = null; //map drag listener(just only one function!)
        this.zoomListener = null; //map zoom listener(just only one function!)
        /* init mouse event for map */
        this._init();
    }
    window.Map = Map;
    /* Private Functions */
    function addMapImg(map, x, y) {/* add map image to map wedgit if not exist */
        var curLevel = map.info.nowLayer;
        var index = y * map.data.sizeA[curLevel].x + x;
        if (map.loaded[curLevel].flag[index] || index >= map.data.sizeA[curLevel].x * map.data.sizeA[curLevel].y
        || x >= map.data.sizeA[curLevel].x || y > map.data.sizeA[curLevel].y) {
            curLevel = index = null;
            return; //image already load or index not exist
        }
        var leftVal = map.data.sizeB[curLevel].w * x;
        var topVal = map.data.sizeB[curLevel].h * y;
        var img = document.createElement('img');
        var imgPath = map.data.dataM[curLevel].url[index];
        img.src = imgPath;
        img.className = 'map-img map-img-' + curLevel + '-' + x + '-' + y;
        $(img).error(function() { this.src = this.src; });
        $(img).css({ left: leftVal + 'px', top: topVal + 'px', width: map.data.sizeB[curLevel].w + 'px', height: map.data.sizeB[curLevel].h + 'px' })
            .appendTo(map.nodes.$cLayers[curLevel]);
        if (map.nodes.$cLayers[curLevel].find('.map-img-' + curLevel + '-' + x + '-' + y).length > 0)
            map.loaded[curLevel].flag[index] = true; //make sure image on map
        curLevel = index = leftVal = topVal = img = imgPath = null;
    }
    function getViewWidth(map) {/* get view width */
        return $(map.dom).width();
    }
    function getViewHeight(map) {/* get view height */
        return $(map.dom).height();
    }
    function setView(map, x, y, speed) {/* set view at postion(x,y) left|top */
        var curLevel = map.info.nowLayer;
        var maxX = map.data.sizeM[curLevel].w - getViewWidth(map);
        var maxY = map.data.sizeM[curLevel].h - getViewHeight(map);
        var setX = x < 0 ? 0 : (maxX <= 0 ? 0 : (x > maxX ? maxX : x));
        var setY = y < 0 ? 0 : (maxY <= 0 ? 0 : (y > maxY ? maxY : y));
        if (typeof (speed) == 'undefined') {
            map.nodes.$cLayers[curLevel].stop(true).css({ opacity: '1', left: -setX + 'px', top: -setY + 'px' });
            map.nodes.$infoPos.stop(true).css({ opacity: '1', left: -setX + 'px', top: -setY + 'px' });
        }
        else {
            map.nodes.$cLayers[curLevel].stop(true).animate({ opacity: '1', left: -setX + 'px', top: -setY + 'px' }, speed);
            map.nodes.$infoPos.stop(true).animate({ opacity: '1', left: -setX + 'px', top: -setY + 'px' }, speed);
        }
        map.info.location = { x: setX, y: setY };
        loadView(map);
        curLevel = maxX = maxY = setX = setY = null;
    }
    function loadView(map) {/* load current view image */
        //get map information
        var curLevel = map.info.nowLayer;
        var startX = map.info.location.x;
        var startY = map.info.location.y;
        var endX = startX + getViewWidth(map);
        var endY = startY + getViewHeight(map);
        var blockW = map.data.sizeB[curLevel].w;
        var blockH = map.data.sizeB[curLevel].h;
        //compute images render range
        var startIndexX = parseInt(startX / blockW);
        var startIndexY = parseInt(startY / blockH);
        var endIndexX = parseInt(endX / blockW);
        var endIndexY = parseInt(endY / blockH);
        //try to add map images
        var i, j;
        for (i = startIndexX; i <= endIndexX; i++) {
            for (j = startIndexY; j <= endIndexY; j++) {
                addMapImg(map, i, j);
            }
        }
        curLevel = startX = startY = endX = endY = blockW = blockH = null;
        startIndexX = startIndexY = endIndexX = endIndexY = i = j = null;
    }
    function zoomBig(map, x, y) {/* zoom map big(param is layer view x & y) */
        /* make sure can zoom  */
        if (map.zoom.doing) return;
        var curLevel = map.info.nowLayer;
        if (curLevel >= map.data.sizeL - 1) { curLevel = null; return; }
        map.zoom.doing = true;
        /* compute zoom postion */
        var percentX = parseFloat(map.info.location.x + x) / parseFloat(map.data.sizeM[curLevel].w);
        var percentY = parseFloat(map.info.location.y + y) / parseFloat(map.data.sizeM[curLevel].h);
        var newX = percentX * map.data.sizeM[curLevel + 1].w - x;
        var newY = percentY * map.data.sizeM[curLevel + 1].h - y;
        /* zoom to the bigger map layer */
        map.info.nowLayer = curLevel + 1;
        var maxX = map.data.sizeM[curLevel + 1].w - getViewWidth(map);
        var maxY = map.data.sizeM[curLevel + 1].h - getViewHeight(map);
        var setX = newX < 0 ? 0 : (maxX <= 0 ? 0 : (newX > maxX ? maxX : newX));
        var setY = newY < 0 ? 0 : (maxY <= 0 ? 0 : (newY > maxY ? maxY : newY));
        map.nodes.$cLayers[curLevel + 1].stop(true).css({ left: -setX + 'px', top: -setY + 'px' }).fadeIn(300);
        map.nodes.$cLayers[curLevel].stop(true).fadeOut(300);
        map.info.location = { x: setX, y: setY };
        loadView(map);
        /* reset info postion */
        map.nodes.$infoPos.stop(true).css({ left: -setX + 'px', top: -setY + 'px' });
        var infoNodes = map.nodes.$infoCon.find('.map-info');
        var i, infoX, infoY, infoNode, pos;
        for (i = 0; i < infoNodes.length; i++) {
            infoNode = $(infoNodes[i]);
            infoX = parseFloat(infoNode.attr('x')) * map.data.sizeM[curLevel + 1].w;
            infoY = parseFloat(infoNode.attr('y')) * map.data.sizeM[curLevel + 1].h;
            pos = computePos(infoNode, infoX, infoY, infoNode.attr('s'));
            infoNode.stop(true).css({ opacity: '1', left: pos.x + 'px', top: pos.y + 'px' });
        }
        map.nodes.$infoCon.hide().fadeIn(300);
        /* zoom square effect */
        var left = x - 25;
        var top = y - 20;
        map.nodes.$zoom.css({ opacity: '1', left: left + 'px', top: top + 'px', width: '50px', height: '40px' }).removeClass('map-zoom-small').show();
        setTimeout(function() {
            map.nodes.$zoom.animate({ opacity: '1', left: '-=25px', top: '-=20px', width: '100px', height: '80px' }, 200, function() {
                setTimeout(function() {
                    map.nodes.$zoom.hide();
                    map.zoom.doing = false;
                    if (map.zoomListener)
                        map.zoomListener(map, 1);
                }, 100);
            });
        }, 100);
        percentX = percentY = newX = newY = null;
        maxX = maxY = setX = setY = null;
        infoNodes = i = infoX = infoY = infoNode = pos = null;
        curLevel = left = top = null;
    }
    function zoomSmall(map, x, y) {/* zoom map small(param is layer view x & y) */
        /* make sure can zoom  */
        if (map.zoom.doing) return;
        var curLevel = map.info.nowLayer;
        if (curLevel <= 0) { curLevel = null; return; }
        map.zoom.doing = true;
        /* compute zoom postion */
        var percentX = parseFloat(map.info.location.x + x) / parseFloat(map.data.sizeM[curLevel].w);
        var percentY = parseFloat(map.info.location.y + y) / parseFloat(map.data.sizeM[curLevel].h);
        var newX = percentX * map.data.sizeM[curLevel - 1].w - x;
        var newY = percentY * map.data.sizeM[curLevel - 1].h - y;
        /* zoom to the bigger map layer */
        map.info.nowLayer = curLevel - 1;
        var maxX = map.data.sizeM[curLevel - 1].w - getViewWidth(map);
        var maxY = map.data.sizeM[curLevel - 1].h - getViewHeight(map);
        var setX = newX < 0 ? 0 : (maxX <= 0 ? 0 : (newX > maxX ? maxX : newX));
        var setY = newY < 0 ? 0 : (maxY <= 0 ? 0 : (newY > maxY ? maxY : newY));
        map.nodes.$cLayers[curLevel - 1].stop(true).css({ left: -setX + 'px', top: -setY + 'px' }).fadeIn(300);
        map.nodes.$cLayers[curLevel].stop(true).fadeOut(300);
        map.info.location = { x: setX, y: setY };
        loadView(map);
        /* reset info postion */
        map.nodes.$infoPos.stop(true).css({ left: -setX + 'px', top: -setY + 'px' });
        var infoNodes = map.nodes.$infoCon.find('.map-info');
        var i, infoX, infoY, infoNode, pos;
        for (i = 0; i < infoNodes.length; i++) {
            infoNode = $(infoNodes[i]);
            infoX = parseFloat(infoNode.attr('x')) * map.data.sizeM[curLevel - 1].w;
            infoY = parseFloat(infoNode.attr('y')) * map.data.sizeM[curLevel - 1].h;
            pos = computePos(infoNode, infoX, infoY, infoNode.attr('s'));
            infoNode.stop(true).css({ opacity: '1', left: pos.x + 'px', top: pos.y + 'px' });
        }
        map.nodes.$infoCon.hide().fadeIn(300);
        /* zoom square effect */
        var left = x - 50;
        var top = y - 40;
        map.nodes.$zoom.css({ opacity: '1', left: left + 'px', top: top + 'px', width: '100px', height: '80px' }).addClass('map-zoom-small').show();
        setTimeout(function() {
            map.nodes.$zoom.animate({ opacity: '1', left: '+=25px', top: '+=20px', width: '50px', height: '40px' }, 200, function() {
                setTimeout(function() {
                    map.nodes.$zoom.hide();
                    map.zoom.doing = false;
                    if (map.zoomListener)
                        map.zoomListener(map, -1);
                }, 50);
            });
        }, 50);
        percentX = percentY = newX = newY = null;
        maxX = maxY = setX = setY = null;
        infoNodes = i = infoX = infoY = infoNode = pos = null;
        curLevel = left = top = null;
    }
    function computePos(node, oldx, oldy, style) {/* compute element postion by style */
        var w = $(node).width();
        var h = $(node).height();
        var x = oldx;
        var y = oldy;
        var s = style.split('|');
        var i;
        for (i = 0; i < s.length; i++) {
            if (s[i] == 'l' || s[i] == 'left') {
                x = oldx;
            }
            if (s[i] == 'r' || s[i] == 'right') {
                x = oldx - w;
            }
            if (s[i] == 't' || s[i] == 'top') {
                y = oldy;
            }
            if (s[i] == 'b' || s[i] == 'bottom') {
                y = oldy - h;
            }
            if (s[i] == 'c' || s[i] == 'center') {
                x = oldx - w / 2;
                y = oldy - h / 2;
            }
        }
        w = h = s = i = null;
        return { x: x, y: y };
    }
    /* Widget Prototype */
    var core_prototype = {
        _init: function() {//private function for init map event
            /* init map mouse event drag */
            this.drag = { doing: false };
            function startDrag(event) {
                /* make sure event right and stop default wheel event */
                if (event.currentTarget != event.target) return; //if event is not on .map-layer-info
                event.preventDefault(); //stop default event for wheel
                /* start drag */
                var map = event.data;
                map.drag.doing = true;
                map.drag.start = { x: event.clientX, y: event.clientY };
                map.drag.old = { x: map.info.location.x, y: map.info.location.y };
                map.drag.d = { x: map.info.location.x + event.clientX, y: map.info.location.y + event.clientY };
                map = null;
            }
            function endDrag(event) {
                /* end drag */
                var map = event.data;
                if (map.drag.doing) {
                    map.drag.doing = false;
                    $(map.dom).removeClass('map-draging');
                    if (map.dragListener) {
                        var dx = event.clientX - map.drag.start.x;
                        var dy = event.clientY - map.drag.start.y;
                        if (dx != 0 && dy != 0)
                            map.dragListener(map, dx, dy);
                        dx = dy = null;
                    }
                    if (map.drag.start.x == event.clientX && map.drag.start.y == event.clientY && event.currentTarget == event.target) {
                        var x, y;
                        if (event.offsetX) {
                            x = event.offsetX;
                            y = event.offsetY;
                        }
                        else {
                            x = event.layerX;
                            y = event.layerY;
                        }
                        x += map.info.location.x;
                        y += map.info.location.y;
                        if (map.clickListener) {
                            map.clickListener(map, x, y);
                        }
                        x = y = null;
                    }
                }
                map = null;
            }
            function doDrag(event) {
                /* make sure event right and stop default wheel event */
                if (event.currentTarget != event.target) return; //if event is not on .map-layer-info
                event.preventDefault(); //stop default event for wheel
                /* do drag */
                var map = event.data;
                if (map.drag.doing) {
                    $(map.dom).addClass('map-draging');
                    setView(map, map.drag.d.x - event.clientX, map.drag.d.y - event.clientY);
                }
                map = null;
            }
            this.nodes.$info.bind('mouseup mouseleave', this, endDrag)
	            .bind('mousedown', this, startDrag)
	            .bind('mousemove', this, doDrag);
            /* init map mouse event wheel */
            this.zoom = { doing: false };
            function wheelFn(event) {
                /* make sure event right and stop default wheel event */
                if (event.currentTarget != event.target) return; //if event is not on .map-layer-info
                event.preventDefault(); //stop default event for wheel
                /* compute wheel value */
                var x, y;
                if (event.offsetX) {
                    x = event.offsetX;
                    y = event.offsetY;
                }
                else {
                    x = event.layerX;
                    y = event.layerY;
                }
                var detail = 0;
                if (event.wheelDelta)
                    detail = event.wheelDelta / 120;
                if (event.detail)
                    detail = -event.detail / 3;
                /* do something for wheel */
                if (detail > 0)
                    zoomBig(event.data, x, y);
                if (detail < 0)
                    zoomSmall(event.data, x, y);
                x = y = detail = null;
            }
            this.nodes.$info.bind('mousewheel', this, wheelFn) //For non-Mozilla
                .bind('DOMMouseScroll', this, wheelFn); //For Mozilla FireFox

        },
        loadFromUrl: function(dataUrl, callback) {//load map data form url
            this.nodes.$tip.html('Map Loading...');
            $.ajax({ url: dataUrl, context: this, success: function(data) {
                var i, j;
                var mapData = eval('(' + data + ')');
                this.data = mapData;
                /* Init Map */
                //clear old data and init new size
                this.nodes.$img.empty();
                this.nodes.$infoCon.empty();
                var cLayer;
                this.nodes.$cLayers = [];
                for (i = 0; i < mapData.sizeL; i++) {
                    cLayer = document.createElement('div');
                    this.nodes.$cLayers[i] = $(cLayer).addClass('map-layer-child')
                        .css({ width: mapData.sizeM[i].w + 'px', height: mapData.sizeM[i].h + 'px' })
                        .appendTo(this.nodes.$img).hide();
                }
                //init map images load flag array
                this.loaded = [];
                var count;
                for (i = 0; i < mapData.sizeL; i++) {
                    this.loaded[i] = { flag: [] };
                    count = mapData.sizeA[i].x * mapData.sizeA[i].y;
                    for (j = 0; j < count; j++) {
                        this.loaded[i].flag[j] = false;
                    }
                }
                //init map information and set to default view
                this.info = {};
                this.info.nowLayer = mapData.viewD.l;
                this.info.location = { x: 0, y: 0 };
                this.nodes.$cLayers[mapData.viewD.l].show();
                this.moveTo(mapData.viewD.x, mapData.viewD.y);
                //set copyright to tip
                if (mapData.copyright)
                    this.nodes.$tip.html(mapData.copyright);
                else
                    this.nodes.$tip.html('&copy;2010 Pettia');
                i = j = count = mapData = cLayer = null;
                $(this.dom).stop(true).css({ opacity: '1' }).hide().fadeIn(500);
                callback(true);
            }, error: function() {
                this.nodes.$tip.html('Map Load Failed...');
                callback(false);
            }
            });
        },
        moveTo: function(x, y, speed) {//center to (x,y) on view
            if (x > 0 && x < 1 && y > 0 && y < 1) {//make percent to px
                x = x * this.data.sizeM[this.info.nowLayer].w;
                y = y * this.data.sizeM[this.info.nowLayer].h;
            }
            var setX = x - getViewWidth(this) / 2;
            var setY = y - getViewHeight(this) / 2;
            setView(this, setX, setY, speed);
            setX = setY = null;
        },
        moveFor: function(x, y, speed) {//center to (x,y) on view
            if (x > 0 && x < 1 && y > 0 && y < 1) {//make percent moveFor
                x = this.info.location.x + x * getViewWidth(this);
                y = this.info.location.y + y * getViewHeight(this);
            }
            else {//make px moveFor
                x = this.info.location.x + x;
                y = this.info.location.y + y;
            }
            setView(this, x, y, speed);
        },
        setClickListener: function(fn) {//set map click listener(clear it use 'null')
            this.clickListener = fn;
        },
        setDragListener: function(fn) {//set map drag listener(clear it use 'null')
            this.dragListener = fn;
        },
        setZoomListener: function(fn) {//set map zoom listener(clear it use 'null')
            this.zoomListener = fn;
        },
        addInfo: function(x, y, posStyle, infoDOM, infoID) {//set an info postion to (x,y) on map
            if (x > 0 && x < 1 && y > 0 && y < 1) {//make percent to px
                x = x * this.data.sizeM[this.info.nowLayer].w;
                y = y * this.data.sizeM[this.info.nowLayer].h;
            }
            var setX = x;
            var setY = y;
            var percentX = parseFloat(setX) / parseFloat(this.data.sizeM[this.info.nowLayer].w);
            var percentY = parseFloat(setY) / parseFloat(this.data.sizeM[this.info.nowLayer].h);
            var infoNode = document.createElement('div');
            if (typeof (infoID) != 'undefined')
                infoNode.id = infoID;
            infoNode.className = 'map-info';
            var pos = computePos(infoNode, setX, setY, posStyle);
            var $infoObj = $(infoNode);
            $infoObj.location = { x: setX, y: setY }; //get location(none-style compute)
            $infoObj.attr('x', percentX).attr('y', percentY).attr('s', posStyle)
                .append(infoDOM).appendTo(this.nodes.$infoCon)
                .hide().css({ left: pos.x + 'px', top: pos.y + 'px' }).fadeIn(500);
            setX = setY = percentX = percentY = infoNode = pos = null;
            $infoObj.isInfo = true;
            return $infoObj;
        },
        clearInfos: function() {//clear map information points
            this.nodes.$infoCon.empty();
        },
        addTool: function(toolDOM, toolID) {//add a tool to map toolbox
            var toolNode = document.createElement('div');
            var $container = this.nodes.$tools.show().find('.map-tools-con');
            var $box = this.nodes.$tools.show().find('.map-tools-box');
            if (typeof (toolID) != 'undefined')
                toolNode.id = toolID;
            toolNode.className = 'map-tool';
            var $toolObj = $(toolNode)
            $toolObj.append(toolDOM).appendTo($container).hide().fadeIn(500);
            $box.css({ width: $container.width() + 'px', height: $container.height() + 'px' });
            $container = $box = null;
            $toolObj.isTool = true;
            return $toolObj;
        },
        clearTools: function() {//clear map toolbox
            this.nodes.$tools.hide().find('.map-tools-con').empty();
            this.nodes.$tools.hide().find('.map-tools-box').css({ width: '0px', height: '0px' });
        },
        zoomMap: function(d) {//zoom map (big or small)
            var x = getViewWidth(this) / 2;
            var y = getViewHeight(this) / 2;
            if (d > 0) {
                zoomBig(this, x, y);
            }
            else {
                zoomSmall(this, x, y);
            }
            x = y = null;
        },
        infoMoveTo: function($info, x, y, fade, speed) {//move an information point(absolute)
            if ($info.isInfo != true) return; //not info object,return
            if (x > 0 && x < 1 && y > 0 && y < 1) {//make percent to px
                x = x * this.data.sizeM[this.info.nowLayer].w;
                y = y * this.data.sizeM[this.info.nowLayer].h;
            }
            var percentX = parseFloat(x) / parseFloat(this.data.sizeM[this.info.nowLayer].w);
            var percentY = parseFloat(y) / parseFloat(this.data.sizeM[this.info.nowLayer].h);
            if (percentX > 1 || percentX < 0 || percentY > 1 || percentY < 0) {
                percentX = percentY = null;
                return false;
            }
            $info.location = { x: x, y: y }; //get location(none-style compute)
            $info.attr('x', percentX).attr('y', percentY);
            var pos = computePos($info, x, y, $info.attr('s'));
            if (typeof (speed) == 'undefined')
                $info.stop(true).css({ left: pos.x + 'px', top: pos.y + 'px' });
            else {
                if (fade) {
                    $info.stop(true).css({ opacity: '1', left: pos.x + 'px', top: pos.y + 'px' }).hide().fadeIn(speed);
                }
                else {
                    $info.stop(true).animate({ opacity: '1', left: pos.x + 'px', top: pos.y + 'px' }, speed);
                }
            }
            percentX = percentY = pos = null;
            return true;
        },
        infoMoveFor: function($info, x, y, fade, speed) {//move an information point(relative)
            if ($info.isInfo != true) return; //not info object,return
            if (x > 0 && x < 1 && y > 0 && y < 1) {//make percent to px
                x = x * getViewWidth(this);
                y = y * getViewHeight(this);
            }
            var setX = $info.location.x + x;
            var setY = $info.location.y + y;
            return this.infoMoveTo($info, setX, setY, fade, speed);
        },
        width: function() {//get current map width
            return this.data.sizeM[this.info.nowLayer].w;
        },
        height: function() {//get current map height
            return this.data.sizeM[this.info.nowLayer].h;
        },
        getViewInfo: function() {//get current map view info
            return { x: this.info.location.x, y: this.info.location.y, w: getViewWidth(this), h: getViewHeight(this) };
        },
        maskTo: function(val, speed) {//get current map view info
            if (typeof (speed) == 'undefined')
                this.nodes.$mask.fadeTo(0, val);
            else
                this.nodes.$mask.fadeTo(speed, val);
        },
        render: function(elm) {//append sns block
            $(this.dom).appendTo(elm);
        }
    }
    /* Register prototype to widget core */
    for (p in core_prototype) {
        Map.prototype[p] = core_prototype[p];
    }
})(jQuery);
