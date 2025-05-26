var COMPONENT_UI = (function (cp, $){

    /* 브라우저 & 디바이스버전 체크 */
    cp.uaCheck = {
        init: function () {
            this.addChkClass();
        },
        browserCheck: function () {
            var user = window.navigator.userAgent.toLowerCase();
            var isIE = user.indexOf("trident") > -1 || user.indexOf("msie") > -1;

            if (isIE) {
                var ieVersion = this.getIEVersion();
                var browser = "ie";

                if (ieVersion > 0 && ieVersion <= 8) {
                    browser += " ie" + ieVersion;
                }
            } else {
                var browser = user.indexOf("edge") > -1 ? "edge"
                    : user.indexOf("edg/") > -1 ? "edge(chromium based)"
                        : user.indexOf("opr") > -1 ? "opera"
                            : user.indexOf("chrome") > -1 ? "chrome"
                                : user.indexOf("firefox") > -1 ? "firefox"
                                    : user.indexOf("safari") > -1 ? "safari"
                                        : user.indexOf("whale") > -1 ? "whale"
                                            : "other_browser";
            }

            return browser;
        },
        getIEVersion: function () {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            if (msie > 0) {
                return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
            }

            var trident = ua.indexOf("Trident/");
            if (trident > 0) {
                var rv = ua.indexOf("rv:");
                return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
            }

            var edge = ua.indexOf("Edge/");
            if (edge > 0) {
                return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
            }
            return -1;
        },
        mobileCheck: function () {
            var user = navigator.userAgent;
            var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            var versionAos = this.getAOSVersion();
            var versionIos = this.getIOSVersion();

            if (mobile) {
                mobile = user.match(/lg/i) != null ? "lg"
                    : user.match(/iphone|ipad|ipod/i) != null ? "ios"
                        : user.match(/iphone.*mini|ipad.*mini/i) != null ? "ios_mini"
                            : user.match(/android/i) != null ? "aos"
                                : "other_mobile";

                if (mobile === "aos") {
                    if (versionAos > 0 && versionAos <= 7) {
                        mobile += "_old";
                    }
                    console.log('AOS ver : ', versionAos);
                } else if (mobile === "ios") {
                    if (versionIos) {
                        var major = versionIos[0];
                        var minor = versionIos[1];
                        console.log('IOS ver : ', major + '.' + minor);
                        if (major < 15 || (major === 15 && minor <= 3)) {
                            mobile += "_old";
                        }
                    }
                }
            } else {
                mobile = this.browserCheck();
            }

            return mobile;
        },
        getAOSVersion: function () {
            var ua = navigator.userAgent;
            var match = ua.match(/Android\s([0-9]+(?:\.[0-9]+)*)/);
            return match ? match[1] : -1;
        },
        getIOSVersion: function () {
            var ua = navigator.userAgent;
            var match = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
            if (match) {
                return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3] || 0, 10)];
            }
            return null;
        },
        addChkClass: function () {
            var browser = this.browserCheck();
            var device = this.mobileCheck();

            $('html').addClass(browser).addClass(device);
        },
    },

    /* nav 버튼 클릭*/
    cp.nav = {
        init(){
            this.navBtn();
            this.navActive();
        },
        navBtn: function(){
            $('.nav-button').on('click', function(){
                $(this).toggleClass('open');
                $('.wrap').toggleClass('is-active');
            });

        },
        navActive: function(){
            const navItem = $('.nav-item');
            
            navItem.on('click', function(){
                navItem.removeClass('active');
                $(this).addClass('active');
            });
        },
    },

    cp.tblCaption = {
        init: function () {
            this.tblSetting();
            this.tblCellsUpdate();
        },
        tblSetting: function () {
            $('table').each(function () {
                $(this).removeAttr('summary');

                var hasHeader = $(this).find('th').length > 0;

                if (!hasHeader) {
                    $(this).find('caption').remove();
                } else {
                    cp.tblCaption.processCaption.call(this);
                }
            });
        },
        tblCellsUpdate: function () {
            var theadCells = $('thead th');
            var tbodyCells = $('tbody th, tfoot th');
            var tdCells = $('tbody td, tfoot td');

            function updateCells(cells, scopeType) {
                cells.each(function () {
                    $(this).removeAttr('scope');

                    if ($(this).is('th:not([scope])')) {
                        $(this).attr('scope', scopeType);
                    }
                    var colSpanGroup = $(this).attr('colspan');
                    if (colSpanGroup !== undefined && colSpanGroup > 1) {
                        $(this).attr('scope', 'colgroup');
                    }
                    var rowSpanGroup = $(this).attr('rowspan');
                    if (rowSpanGroup !== undefined && rowSpanGroup > 1) {
                        $(this).attr('scope', 'rowgroup');
                    }
                });
            }

            updateCells(theadCells, 'col');
            updateCells(tbodyCells, 'row');
            updateCells(tdCells, '');
        },
        processCaption: function () {
            var captionType = $(this).data('caption');
            var dataTblTit = $(this).data('tbl');
            var tblCaption = $(this).find('caption');

            if (tblCaption.hasClass("processedCaption") && captionType !== "innerTbl") {
                return;
            }

            if (captionType === 'basic') {
                // basic 타입인 경우
                tblCaption.remove();

                $(this).find('th').each(function () {
                    var thHTML = $(this).html();
                    $(this).replaceWith('<td>' + thHTML + '</td>');
                });
            } else if (captionType === 'keep') {
                // keep 타입인 경우 기존 caption 정보를 유지함
            } else {
                cp.tblCaption.handleRegularTbl.call(this);
            }
        },
        handleRegularTbl: function () {
            var tblCaption = $(this).find('caption');
            var currentCaptionTit = $(this).data('tbl') || tblCaption.text().trim();
            var tblColgroup = $(this).find('colgroup');
            var captionText = $(this).find('> thead > tr > th, > tbody > tr > th').map(function () {
                return $(this).text();
            }).get().join(', ');

            tblCaption.remove();

            if (tblColgroup.length > 0) {
                var captionHtml = cp.tblCaption.getCaptionHtml(currentCaptionTit, captionText);
                tblColgroup.before(captionHtml);
            } else {
                cp.tblCaption.insertCaption.call(this, tblCaption, cp.tblCaption.getCaptionHtml(currentCaptionTit, captionText));
            }
        },
        insertCaption: function (tblCaption, captionHtml) {
            var tableThead = $(this).find('thead');
            var tableTbody = $(this).find('tbody');

            if (tableThead.length > 0) {
                tableThead.before(captionHtml);
            } else {
                tableTbody.before(captionHtml);
            }
        },
        getCaptionHtml: function (title, text) {
            return '<caption class="processedCaption blind"><strong>' + title + '</strong><p>' + text + ' 로 구성된 표' + '</p></caption>';
        },
    },

    /* all-check */
    cp.allCheck = {
        init: function(){
            this.allCheck();
        },
        allCheck: function(){
            const checkAll = $('[check-type="all"]');
            const checkItem = $('[check-type="item"]');
            
            checkAll.on('click', function(){
                const thisCheckId = $(this).attr('check-id');
                const sameCheckIdItems = checkItem.filter(function() {
                    return $(this).attr('check-id') === thisCheckId;
                });

                const isChecked = $(this).prop('checked');
                sameCheckIdItems.prop('checked', isChecked);
            });

            checkItem.on('click', function(){
                const thisCheckId = $(this).attr('check-id');
                const relatedItems = checkItem.filter(function () {
                    return $(this).attr('check-id') === thisCheckId;
                });
                const relatedAll = checkAll.filter(function () {
                    return $(this).attr('check-id') === thisCheckId;
                });

                const allChecked = relatedItems.length === relatedItems.filter(':checked').length;
                relatedAll.prop('checked', allChecked);
            });
        },
    },

    /* 팝업 */
    cp.modalPop = {
        constEl: {
            btnModal: "._modalBtn", // 모달 버튼 선택자
            // dimmedEl: $('<div class="dimmed" aria-hidden="true"></div>') // dimmed 배경 요소
        },
        isOpen: false, // 모달 열림 상태를 관리하는 플래그
        init: function () {
            this.openPop(); // 모달 열기 이벤트 초기화
            this.closePop(); // 모달 닫기 이벤트 초기화
            $(".modalPop").attr({ 'aria-hidden': 'true' });
        },

        openPop: function () {
            const self = this,
                btnModal = this.constEl.btnModal;

            $('html, body').on('click', btnModal, function () {

                if (!self.isOpen) { // 모달이 열려 있지 않은 경우에만 실행
                    $(this).addClass('_rtFocus'); // 포커스 클래스 추가
                    self.showModal($(this)); // 모달 표시
                    self.layerFocusControl($(this)); // 포커스 제어
                }

                if ($(this).is(".modalPop._is-active ._modalBtn")) {
                    $(this).removeClass('_rtFocus').addClass('_rtFocus2');
                }
            });
        },

        showModal: function ($btn) {
            const self = this,
                dimmedEl = this.constEl.dimmedEl;
            const target = $btn.attr('data-modal');
            const $modal = $('.modalPop[modal-target="' + target + '"]');
            var $modalWrap = $modal.find("> .modalWrap");

            $modal.addClass('_is-active').attr({ 'aria-hidden': 'false' });
            $modalWrap.attr({ 'role': 'dialog', 'aria-modal': 'true' })
                .find('a, *[role="button"], button, h1, h2, h3, h4, h5, h6').first().each(function () {
                    if ($(this).is('h1, h2, h3, h4, h5, h6')) {
                        $(this).attr('tabindex', '0');
                    }
                });

            setTimeout(function () {
                $modalWrap.find(".ico-his-prev").focus()
                var firstFocusable;

                // .modal-header가 있을 경우
                if ($modalWrap.find('.modal-header').length) {
                    firstFocusable = $modalWrap.find('.modal-header').find('a.ico-his-prev, a, *[role="button"], button, h1, h2, h3, h4, h5, h6').first();
                } else {
                    // .modal-header가 없을 경우
                    firstFocusable = $modalWrap.find('a.ico-his-prev, a, *[role="button"], button, h1, h2, h3, h4, h5, h6').first();
                }

                if (firstFocusable.length) {
                    firstFocusable.focus();
                }
            }, 300);
            // dimmedEl.remove(); 
            // $('body').addClass('no-scroll').append(dimmedEl);
            $('body').addClass('no-scroll');

        },

        closePop: function () {
            const self = this;
            $('.modalPop').on('click', '.btn-close-pop', function () {
                console.log('닫기 버튼 클릭됨');
                var $modal = $(this).closest('.modalPop'); // 닫으려는 모달 선택
                var $modalWrap = $modal.find("> .modalWrap"); // 모달 래퍼 선택
                var modalWrapClass = $modal.attr('class'); // 모달 클래스 가져오기

                if ($modal.hasClass("_scroll")) {
                    $modal.removeClass('_is-active');
                    $modalWrap.css({
                        'max-height': '', 'height': '', 'transition': ''
                    }).find(" > .modal-container").css({
                        'height': ''
                    }).removeAttr("tabindex");
                    self.isOpen = false; // 모달 닫힘 상태로 변경
                } else {
                    $modal.removeClass('_is-active');
                    self.isOpen = false; // 모달 닫힘 상태로 변경
                }

                if ($("._modalBtn").hasClass("_rtFocus2")) {
                    setTimeout(function () {
                        $('._rtFocus2').focus();
                        $('._rtFocus2').removeClass('_rtFocus2');
                    }, 300);
                } else {
                    // 포커스 관리
                    self.rtFocus($(this));
                }

                $modal.attr({ 'aria-hidden': 'true' });
                $modalWrap.attr({ 'aria-modal': 'false' }).removeAttr('tabindex')
                    .find('a, button, h1, h2, h3, h4, h5, h6').first().removeAttr('tabindex');

                $(this).closest('.modalPop').prev().focus(); // 이전 요소에 포커스
                // $('.dimmed').remove(); // dimmed 요소 제거
                if ($(".modalPop._is-active").length === 0) {
                    $('body').removeClass('no-scroll'); // 스크롤 활성화
                }
            });
        },

        rtFocus: function () {
            setTimeout(function () {
                $('._rtFocus').focus();
                $('._rtFocus').removeClass('_rtFocus');
            }, 300);
        },

        // 탭으로 포커스 이동 시 팝업이 열린상태에서 팝업 내부해서만 돌도록 제어하는 함수
        layerFocusControl: function ($btn) {
            const target = $btn.attr('data-modal') || $btn.attr('data-select');
            const $modal = $('.modalPop[modal-target="' + target + '"], .modalPop[select-target="' + target + '"]');
            var $modalWrap = $modal.find("> .modalWrap");

            var $firstEl = $modalWrap.find('a, button, h1, h2, h3, h4, h5, h6, input, textarea, select, [tabindex]:not([tabindex="-1"])').first();
            var $lastEl = $modalWrap.find('a, button, h1, h2, h3, h4, h5, h6, input, textarea, select, [tabindex]:not([tabindex="-1"])').last();

            $modalWrap.on("keydown", function (e) {
                if (e.keyCode == 9) {
                    if (e.shiftKey) { // shift + tab
                        if ($(e.target).is($firstEl)) {
                            $lastEl.focus();
                            e.preventDefault();
                        }
                    } else { // tab
                        if ($(e.target).is($lastEl)) {
                            $firstEl.focus();
                            e.preventDefault();
                        }
                    }
                }
            });
        },
    },

    /* 라디오버튼 클릭시 show hide */
    cp.radio ={
        init: function(){
            this.radioShowHide();
        },

        radioShowHide: function(){
            $('input[type="radio"][data-show]').on('change', function () {
                const showKey = $(this).data('show');

                $('[data-appear]').hide().attr('aria-hidden', 'true');
                $('[data-appear="' + showKey + '"]').show().attr('aria-hidden', 'false');

                $('[data-disabled]').attr('disabled', 'true');
                $('[data-disabled="' + showKey + '"]').removeAttr('disabled');
            });

            // 페이지 로드시 기본 라디오 체크 반영
            $('input[type="radio"][data-show]:checked').trigger('change');
        },
    },

    cp.pagination ={
        init: function () {
            this.paginationActive();
        },

        paginationActive: function(){
            const paginationItem = $('.page-link');

            $('.pagination .page-link').on('click', function(){
                paginationItem.removeClass('active');
                $(this).addClass('active');
            });
        },
    },

    cp.init = function () {
        cp.uaCheck.init();
        cp.nav.init();
        cp.tblCaption.init();
        cp.allCheck.init();
        cp.modalPop.init();
        cp.radio.init();
        cp.pagination.init();
    };

  cp.init();
  return cp;
}(window.COMPONENT_UI || {}, jQuery));

