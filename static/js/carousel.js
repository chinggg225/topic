window.addEventListener("load", function() {
    var arr = [
       {   // 1
            width: 450,
            top: 60,
             left: 0,
             opacity: 40,
             zIndex: 2
         },
        {   // 2
            width: 550,
            top: 30,
            left: 100,
          opacity: 70,
           zIndex: 3
       },
        {   // 3  中間圖片
            width: 650,
            top: 0,
            left: 200,
            opacity: 100,
            zIndex: 4
        },
        {   // 4
            width: 550,
            top: 30,
            left: 400,
           opacity: 70,
            zIndex: 3
        },
        {   // 5
            width: 450,
            top: 60,
            left: 600,
            opacity: 40,
            zIndex: 2
        }
    ];
    var slider = document.querySelector(".slider");
    var lis = slider.querySelectorAll("li");
    var arrow_l = slider.querySelector(".arrow-l");
    var arrow_r = slider.querySelector(".arrow-r");

    // 滑鼠移入移出箭頭顯示隱藏
    slider.addEventListener("mouseover", function() {
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
    });
    slider.addEventListener("mouseout", function() {
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
    });
    
    var flag = true; // flag節流閥 為了解決點擊過快而產生bug
    move(); // 先呼叫一下，為了剛打開瀏覽器時渲染頁面

    // 點擊左右箭頭輪播圖片
    arrow_r.addEventListener("click", function() {
        if(flag) {
            flag = false; // 關閉節流閥 等到影片結束了才能繼續執行點擊操作
            arr.unshift(arr.pop());  // 將陣列最后邊的元素洗掉，添加到最前邊
            move();  // 輪播圖片
        }
    });
    arrow_l.addEventListener("click", function() {
        if(flag) {
           flag = false;
            arr.push(arr.shift());  // 將陣列最前邊的元素洗掉，添加到最后邊
            move();
        }
    });

    // 讓每個圖片執行影片
    function move() {
        for(var i = 0; i < lis.length; i++) {
            animate(lis[i], arr[i], function() {
                flag = true;  // 回呼函式，當影片執行完 再把節流閥打開
            });
        }
    }
    // 影片函式
    function animate(obj, json, callback) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function() {
            var bool = true;
           for(var attr in json) {
               var icur = 0;
                if(attr == 'opacity') {
                   icur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
                } else {
                    icur = parseInt(getStyle(obj, attr));
                }
                var speed = (json[attr] - icur) / 10;
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                if(icur != json[attr]) {
                    bool = false;
                }
                if(attr == 'opacity') {
                    obj.style.filter = 'alpha(opacity = '+ (icur + speed) +')';
                   obj.style.opacity = (icur + speed) / 100;
               } else if(attr == 'zIndex') {
                   obj.style.zIndex = json[attr];
               } else {
                   obj.style[attr] = icur + speed + 'px';
               }
          }
           if(bool) {
               clearInterval(obj.timer);
               callback && callback();
           }
       },15);
   }
  // 獲取屬性函式 
   function getStyle(obj, attr) {
      if(obj.currentStyle){   //IE瀏覽器
           return obj.currentStyle[attr];
       }else{    //chrome、firefox等瀏覽器
          return getComputedStyle(obj,null)[attr];
       }
   }
});