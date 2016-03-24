/**
 * Created by Paul on 2016/3/3.
 */

(function (global) {
    'use strict';
    //pScroll默认配置
    PScroll.defaults = {
        bottomScrollPx: 50,
        onScroll:function(){},
        times:1,
        throttleTime:400,
        loadingHtml:"正在加载",
        loadingHtmlId: "PScroll-loading"
    };
    function PScroll(selector, option,callback) {
        var _scrollContainer = document.querySelector(selector);
        var scrollEndCallback =  callback || function(){};

        option.bottomScrollPx = option.bottomScrollPx || PScroll.defaults.bottomScrollPx;
        option.onScroll = option.onScroll || PScroll.defaults.onScroll;
        option.times = option.startIndex ||  PScroll.defaults.times;
        option.throttleTime = option.throttleTime||  PScroll.defaults.throttleTime;
        option.loadingHtml = option.loadingHtml || PScroll.defaults.loadingHtml;
        option.loadingHtmlId = option.loadingHtmlId || PScroll.defaults.loadingHtmlId;

        this.scrollContainer = _scrollContainer;
        this.option = option;
        this.scrollEndCallback = scrollEndCallback;

        this.bindScroll(selector,option.onScroll);
    }

    var helpers = PScroll.helpers ={};
    helpers.append = function(html){
        var fragment = document.createDocumentFragment();
        var node = document.createElement("div");
        node.innerHTML = html;
        var childNodes=node.childNodes;
        for(var i=0;i<childNodes.length;i++){
            fragment.appendChild(childNodes[i]);
        }
        this.appendChild(fragment);
    };

    PScroll.prototype.bindScroll = function (selector,fn) {
        this["scrollEvent"][selector] =fn;

        var that = this;
        var resizeTimer =null;

        document.addEventListener("scroll", function (e) {

            if (resizeTimer) {
                clearTimeout(resizeTimer)
            }
            resizeTimer = setTimeout(function(){
                console.log("scroll event");

                var scrollTop = document.body.scrollTop;
                var scrollHeight = document.body.scrollHeight;
                var height = screen.height;

                if(scrollTop + height + that.option.bottomScrollPx >= scrollHeight){

                    that.showLoading(that.option.loadingHtml );
                    fn.call(that,that.option.times);
                    that.option.times++;
                }
            }, that.option.throttleTime);

        })
    };
    PScroll.prototype.scrollEvent = {};
    PScroll.prototype.load = function(html){
        this.hiddenLoading();
        helpers.append.call(this.scrollContainer,html);
        this.onScorllEnd(html);
    };
    PScroll.prototype.showLoading =function(html){
        var node = document.createElement("div");
        node.id = this.option.loadingHtmlId;
        node.innerHTML = html;
        helpers.append.call(this.scrollContainer,node.outerHTML);
    };
    PScroll.prototype.hiddenLoading =function(html){
        this.scrollContainer.removeChild(document.querySelector("#" +this.option.loadingHtmlId));
    };
    PScroll.prototype.onScorllEnd = function(html){
        this.scrollEndCallback(html);
    };

    global.PScroll = PScroll;
})(window);
