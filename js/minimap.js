/*! The MIT License (MIT)

 Copyright (c) 2014 Prince John Wesley <princejohnwesley@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 **/

(function($, undefined) {

    "use strict";
    $.fn.minimap = function(options) {
        var minimap = this;
        var $window = $(window);
        var fn = function() {};
        var shown = true;

        var defaults = {
            heightRatio : 0.6,
            widthRatio : 0.05,
            offsetHeightRatio : 0.035,
            offsetWidthRatio : 0.035,
            position : "right",
            touch: true,
            smoothScroll: true,
            smoothScrollDelay: 200,
            onPreviewChange: fn
        };
        var settings = $.extend({}, defaults, options);
        var position = ["right", "left"];

        var validateProps = function(prop, value) {

            switch(prop) {
                case 'heightRatio':
                    var heightRatio = value;
                    if(!$.isNumeric(heightRatio) || heightRatio <= 0.0 || heightRatio > 1.0)
                        throw "Invalid heightRatio: " + heightRatio;
                    break;
                case 'widthRatio':
                    var widthRatio = value;
                    if(!$.isNumeric(widthRatio) || widthRatio <= 0.0 || widthRatio > 0.5)
                        throw "Invalid widthRatio: " + widthRatio;
                    break;
                case 'offsetHeightRatio':
                    var offsetHeightRatio = value;
                    if(!$.isNumeric(offsetHeightRatio) || offsetHeightRatio < 0.0 || offsetHeightRatio > 0.9)
                        throw "Invalid offsetHeightRatio: " + offsetHeightRatio;
                    break;
                case 'offsetWidthRatio':
                    var offsetWidthRatio = value;
                    if(!$.isNumeric(offsetWidthRatio) || offsetWidthRatio < 0.0 || offsetWidthRatio > 0.9)
                        throw "Invalid offsetWidthRatio: " + offsetWidthRatio;
                    break;
                case 'position':
                    var p = value.toLowerCase();
                    var pos = position.indexOf(p);
                    if(pos === -1) throw "Invalid position: " + settings.position;
                    settings.position = p;
                    break;
                case 'smoothScrollDelay':
                    var smoothScrollDelay = value;
                    if(((smoothScrollDelay | 0 ) !== smoothScrollDelay) || smoothScrollDelay < 4)
                        throw "Invalid smoothScrollDelay(in ms): " + smoothScrollDelay;
                    break;
                case 'touch':
                case 'smoothScroll':
                    break;
                case 'onPreviewChange':
                    var fn = value;
                    if(!fn || !$.isFunction(fn))
                        throw "Invalid onPreviewChange: " + value;
                    break;
                default:
                    throw "Invalid validation property: " + prop;
            }
        };

        //validate inputs
        for(var prop in settings) validateProps(prop, settings[prop]);

        var miniElement = minimap.clone();

        miniElement.find('.minimap.noselect').remove();
        miniElement.find('.miniregion').remove();
        miniElement.addClass('minimap noselect');
        // remove events & customized cursors
        miniElement.children().each(function() {$(this).css({'pointer-events': 'none'});});

        var region = $('<div class="miniregion"> </div>');

        $($('body')[0]).append(region);
        $($('body')[0]).append(miniElement);

        var scale = function() {
            return {
                //x: ($window.width() / minimap.width()) * settings.widthRatio,
                x: settings.widthRatio,
                //y: ($window.height(() / minimap.width()) * settings.widthRatio,
                y: settings.heightRatio
            };
        };

        var onResizeHandler = function(e) {
            if(!shown) return;

            var s = scale();
            var sc = 'scale(' + s.x + ','+ s.y + ')';
            //var sc = 'scale(0,'+ s.y + ')';
            //var sc = 'scale(' + s.x + ')';
            var offsetTop = $window.height() * settings.offsetHeightRatio;

            var offsetLeftRight = $window.width() * settings.offsetWidthRatio;

            console.log(minimap.height());
            console.log(s.y);
            console.log(offsetTop);

            var leftRight = minimap.width() * (s.x - 1) / 2  + offsetLeftRight;

            var width = $window.width() * (1/s.x) * settings.widthRatio;
            var height = $window.height() * (1/s.y) * settings.heightRatio;

            var css = {
                '-webkit-transform': sc,
                '-moz-transform': sc,
                '-ms-transform': sc,
                '-o-transform': sc,
                'transform': sc,
                'top' : '30px',
                'width' : width,
                'height' : 0,
                'margin' : '0px',
                'padding' : '0px'
            };
            css[settings.position] = leftRight;

            miniElement.css(css);

            var regionTop = minimap.offset().top * s.y;
            var cssRegion = {
                width : miniElement.width() * s.x,
                height : $window.height() * s.y,
                margin : '0px',
                top : $window.scrollTop() * s.y + offsetTop - regionTop + 'px'
            };
            cssRegion[settings.position] = offsetLeftRight + 'px';
            region.css(cssRegion);

            settings.onPreviewChange(miniElement, s);
        };

        var onScrollHandler = function(e) {
            /*if(!shown) return;

            var s = scale();
            var offsetTop = $window.height() * settings.offsetHeightRatio;
            var top = minimap.offset().top * s.y;
            var pos = ($window.scrollTop()) * s.y;
            var regionHeight = region.outerHeight(true);
            var bottom = minimap.outerHeight(true) * s.y + top;// - regionHeight;

            if(pos + regionHeight + offsetTop < top || pos >  bottom) {
                region.css({
                    display: 'none'
                });
            } else {
                region.css({
                    top : pos + offsetTop - top + 'px',
                    display : 'block'
                });
            }*/
        };

        var scrollTop = function(e) {
            /*if(!shown) return;

            var s = scale();
            var offsetTop = $window.height() * settings.offsetHeightRatio;
            var top = minimap.offset().top * s.y;
            var target = (e.clientY  - offsetTop + top) / s.y;

            if(e.type === 'click' && settings.smoothScroll) {
                var current = $window.scrollTop();
                var maxTarget = minimap.outerHeight(true);
                target = Math.max(target, Math.min(target, maxTarget));
                var direction = target > current;
                var delay = settings.smoothScrollDelay;
                var distance = Math.abs(current - target);
                var r = delay / distance;
                var unitScroll = 1;
                var unitDelay = 4;
                if(r >= 4) {
                    unitDelay = parseInt(unitScroll);
                } else if(r >= 1) {
                    unitScroll = parseInt(r) * 4;
                } else {
                    unitScroll = (4 / r);
                }

                var next = current;
                var count = parseInt(distance / unitScroll);
                onSmoothScroll = true;

                // linear translate
                var smoothScroll = function() {
                    next = next + (direction ? unitScroll : -unitScroll);
                    if(--count <= 0) {
                        clearInterval(timer);
                        onSmoothScroll = false;
                        next = target;
                    }
                    $window.scrollTop(next);
                };
                var timer = window.setInterval(smoothScroll, unitDelay);
            } else {
                $window.scrollTop(target);
            }
            e.stopPropagation();*/
        };

        var mousedown = false;
        var onSmoothScroll = false;
        var onMouseupHandler = function(e) {
            mousedown = false;
        };

        var onMousemoveHandler = function(e) {
            if(!mousedown || onSmoothScroll) return;
            scrollTop(e);
        };

        var onClickHandler = function(e) {
            scrollTop(e);
            mousedown= false;
        };

        var onMousedownHandler = function(e) {
            mousedown = true;
        };

        onResizeHandler();
        $window.on('resize', onResizeHandler);
        $window.on('scroll', onScrollHandler);

        $(region).on('mousedown', onMousedownHandler);
        $(region).on('mouseup', onMouseupHandler);
        $(region).on('mousemove', onMousemoveHandler);
        $(region).on('click', onClickHandler);

        $(miniElement).on('mousedown', onMousedownHandler);
        $(miniElement).on('mouseup', onMouseupHandler);
        $(miniElement).on('mousemove', onMousemoveHandler);
        $(miniElement).on('click', onClickHandler);

        var lastTouchType = '';
        var touchHandler = function(e) {
            var touches = e.changedTouches;

            // Ignore multi-touch
            if (touches.length > 1) return;

            var touch = touches[0];
            var events = ["touchstart", "touchmove", "touchend"];
            var mouseEvents = ["mousedown", "mousemove", "mouseup"];
            var ev = events.indexOf(e.type);

            if (ev === -1) return;

            var type = mouseEvents[ev];
            if (e.type === events[2] && lastTouchType === events[0]) {
                type = "click";
            }


            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                touch.screenX, touch.screenY,
                touch.clientX, touch.clientY, false,
                false, false, false, 0, null);
            touch.target.dispatchEvent(simulatedEvent);
            e.preventDefault();
            lastTouchType = e.type;
        };

        if (settings.touch) {

            document.addEventListener("touchstart", touchHandler, true);
            document.addEventListener("touchmove", touchHandler, true);
            document.addEventListener("touchend", touchHandler, true);
            document.addEventListener("touchcancel", touchHandler, true);

        }

        var setPosition = function(pos) {
            var oldValue = settings.position;
            validateProps('position', pos);
            if(oldValue !== settings.position) {
                var css = {};
                css[oldValue] = '';
                onResizeHandler();
                region.css(css);
                miniElement.css(css);
            }
        };

        var setProperty = function(propName, redraw) {
            return function(value) {
                validateProps(propName, value);
                settings[propName] = value;
                if(redraw) onResizeHandler();
            };
        };

        var show = function() {
            if(shown) return;
            miniElement.show();
            region.show();
            shown = true;
            onResizeHandler();
        };

        var hide = function() {
            if(!shown) return;
            miniElement.hide();
            region.hide();
            shown = false;
        };

        var toggle = function() {
            miniElement.toggle();
            region.toggle();
            shown = !shown;
            if(shown) onResizeHandler();
        };

        return $.extend({}, this, {
            "setPosition": setPosition,
            "setHeightRatio": setProperty('heightRatio', true),
            "setWidthRatio": setProperty('widthRatio', true),
            "setOffsetHeightRatio": setProperty('offsetHeightRatio', true),
            "setOffsetWidthRatio": setProperty('offsetWidthRatio', true),
            "setSmoothScroll" : setProperty('smoothScroll'),
            "setSmoothScrollDelay" : setProperty('smoothScrollDelay'),
            "show" : show,
            "hide" : hide,
            "toggle" : toggle
        });

    };
}(jQuery));