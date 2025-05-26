var GUIDE_UI = (function (cp, $) {
    cp.load = {
        init: function () {
            this.pageLoad();
            this.setUIreload();
        },

        pageLoad: function(){
            $('#header').load('header.html');
            $('#nav').load('nav.html');
        },
        setUIreload:function() {
            setTimeout(() => {
                GUIDE_UI.navMenu.init();
                COMPONENT_UI.init();
            }, "200");
        },
    };    

    cp.navMenu = {
        callback: null, // 외부에서 설정할 콜백

        init: function () {
            this.menuActive();
        },

        menuActive: function () {
            var $menus = $('.nav-item');
            var self = this;

            // 초기화: 모든 메뉴에서 _is-active 제거
            $menus.removeClass('_is-active');

            // sessionStorage 값으로 메뉴 활성화
            var activeMenu = sessionStorage.getItem('activeMenu');
            if (activeMenu) {
            $menus.each(function () {
                if ($(this).data('menu') === activeMenu) {
                $(this).addClass('_is-active');
                }
            });
            }

            // 클릭 이벤트 등록
            $menus.on('click', function () {
                self.setActiveMenu($(this), $menus);
            });
        },

        /**
         * 메뉴 활성화 및 콜백 실행
         */
        setActiveMenu: function ($clickedMenu, $allMenus) {
            var menuKey = $clickedMenu.data('menu');

            // 저장
            sessionStorage.setItem('activeMenu', menuKey);

            // 클래스 적용
            $allMenus.removeClass('_is-active');
            $clickedMenu.addClass('_is-active');

            // 콜백 실행 (있다면)
            if (typeof this.callback === 'function') {
            this.callback(menuKey, $clickedMenu);
            }
        }
    };

    cp.init = function () {
        cp.load.init();
        cp.navMenu.init();
    };
    cp.init();


  return cp;
}(window.GUIDE_UI || {}, jQuery));
