/*!
 * Publishing UI Components
 * © 2025 BLUEWEBD™. All rights reserved.
 * Licensed under the MIT License.
 * https://opensource.org/licenses/MIT
 */

var COMPONENT_UI = (function (cp, $) {

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
        /* 포커스링 */
        cp.userIsTabbing = {
            init: function () {
                this.tabbingCheck();
            },

            tabbingCheck: function () {
                var self = this;

                function enableTabbingMode() {
                    $('body').addClass('user-is-tabbing');
                }

                function disableTabbingMode() {
                    $('body').removeClass('user-is-tabbing');
                }

                function handleFirstTab(e) {
                    if (e.key === 'Tab') {
                        enableTabbingMode();
                        $(window).off('keydown', handleFirstTab);
                        $(window).on('mousedown touchstart', disableOnce);
                    }
                }

                function disableOnce() {
                    disableTabbingMode();
                    $(window).off('mousedown touchstart', disableOnce);
                    $(window).on('keydown', handleFirstTab);
                }

                // 키보드 탐지
                $(window).on('keydown', handleFirstTab);

                // 모바일 보이스오버/톡백 대응: 포커스 이동 감지 (fallback)
                $(window).on('focusin', function (e) {
                    // 터치스크린 기반 스크린리더 접근일 경우
                    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
                        enableTabbingMode();
                    }
                });
            }
        };
    /* COMMON UI */
    cp.btnFn = {
        init: function () {
            this.btnStatus();
        },
        btnStatus: function (callback) {
            $(".btn").each(function () {
                const _this = $(this);
                const _btnUseChk = _this.attr("btn-active");
                const _loadingCont = $('<div class="loadingData"><i></i><i></i><i></i></div>');

                if (_btnUseChk === false || _btnUseChk === "false") {
                    _this.addClass("disabled").removeClass("loading").find(".loadingData").remove();
                } else if (_btnUseChk === "loading") {
                    _this.addClass("loading").removeClass("disabled").append(_loadingCont);
                } else {
                    _this.removeClass("disabled loading").find(".loadingData").remove();
                }
            });

            // 콜백 함수를 호출하여 btn-active의 상태를 변경
            if (callback && typeof callback === "function") {
                callback();
            }
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
                return '<caption class="processedCaption"><strong>' + title + '</strong><p>' + text + ' 로 구성된 표' + '</p></caption>';
            },
        },
        cp.formStatus = {
            init: function () {
                // 초기 상태 업데이트만 수행
                $('.field input').each(function () {
                    cp.formStatus.updateFieldStatus($(this));
                });

                // label 클릭 차단 (readonly or disabled 상태)
                $(document).on('click', 'label', function (e) {
                    var $label = $(this);
                    if ($label.hasClass('_readonly') || $label.hasClass('_disabled')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    }
                });
            },

            updateFieldStatus: function ($input) {
                var $label = $input.closest('label');
                if (!$label.length) return;

                // 기존 상태 클래스 제거 (field-status, _disabled, _readonly, _status-*)
                $label.removeClass(function (index, className) {
                    return (className.match(/(^|\s)(field-status-\S+|_disabled|_readonly|_status-\S+)/g) || []).join(' ');
                });

                if ($input.is(':disabled')) {
                    $label.addClass('_disabled');
                }
                if ($input.is('[readonly]')) {
                    $label.addClass('_readonly');
                }

                var status = $input.attr('field-status');
                if (status) {
                    $label.addClass('_status-' + status);
                }
            },

            setDisabled: function ($input, disabled) {
                if (disabled) {
                    $input.attr('disabled', 'disabled');
                } else {
                    $input.removeAttr('disabled');
                }
                cp.formStatus.updateFieldStatus($input);
            },
            // 콜백실행ex : COMPONENT_UI.formStatus.setDisabled($('#변경될INPUT'), false);

            setReadonly: function ($input, readonly) {
                if (readonly) {
                    $input.attr('readonly', 'readonly');
                } else {
                    $input.removeAttr('readonly');
                }
                cp.formStatus.updateFieldStatus($input);
            },
            // 콜백실행ex : COMPONENT_UI.formStatus.setReadonly($('#변경될INPUT'), false);

            setFieldStatus: function ($input, status) {
                if (status) {
                    $input.attr('field-status', status);
                } else {
                    $input.removeAttr('field-status');
                }
                cp.formStatus.updateFieldStatus($input);
            }
            // 콜백실행ex : COMPONENT_UI.formStatus.setFieldStatus($('#변경될INPUT'), false);
        },
        cp.form = {
            constEl: {
                inputDiv: $("._input"),
                inputSelector: "._input > input:not([type='radio']):not([type='checkbox']):not(.exp input)",
                inputExpSelector: ".exp input",
                clearSelector: "._input-clear",
                labelDiv: $("._label")
            },

            init: function () {
                this.input(this.inputSetting.bind(this));
                this.inpClearBtn(this.clearBtnCallback);
                this.secureTxt();
                this.inpReadonly();
                this.lbPlaceHolder();
                this.inputRange(this.inputRangeCallback);
                this.inputRangeDouble(this.inputRangeDoubleCallback);
            },

            inputSetting: function () {
                const inputSelector = this.constEl.inputSelector;

                $(inputSelector).each(function () {
                    const parentInput = $(this).closest('._input'),
                        labelElOut = parentInput.parent().siblings("label"),
                        labelElIn = parentInput.siblings("label");

                    // 현재 input의 id를 가져옵니다.
                    let inputId = parentInput.parent().find('._input:first-of-type input').attr('id');

                    // id가 없을 경우 임의의 id 생성
                    if (!inputId) {
                        inputId = 'input_' + Math.random().toString(36).substr(2, 9); // 랜덤 id 생성
                        $(this).parent().parent().find('._input:first-of-type input').attr('id', inputId); // 생성한 id를 input에 설정
                    }

                    // data-target을 설정
                    parentInput.parent().find('._input:first-of-type').attr('data-target', inputId);

                    // label의 for 속성 및 data-name 설정
                    labelElOut.attr({ 'for': inputId, 'data-name': inputId });
                    labelElIn.attr({ 'for': inputId });

                    // placeholder 값을 title 속성으로 설정
                    var placeholderValue = $(this).attr('placeholder');
                    $(this).attr('title', placeholderValue);
                });

                // data-name이 정의된 경우 해당 값을 for에 적용
                $(inputSelector).each(function () {
                    const parentInput = $(this).closest('._input');
                    const dataName = parentInput.attr('data-name');

                    if (dataName) {
                        parentInput.attr('id', dataName); // data-name 값을 id로 설정
                        parentInput.parent().siblings("label").attr('for', dataName);
                    }
                });

                // 콜백 실행
                if (typeof this.inputSettingCallback === "function") {
                    this.inputSettingCallback();
                }
            },

            // _label 붙은 input타입 스크립트
            lbPlaceHolder: function (callback) {
                const labelDiv = this.constEl.labelDiv.find(".field-label:not(._address)");

                // 문서 클릭 핸들러 (한 번만 등록)
                $(document).off("click.lbPlaceHolder").on("click.lbPlaceHolder", function (e) {
                    labelDiv.each(function () {
                        const $fieldLabel = $(this),
                            $fieldBox = $fieldLabel.parents(".field"),
                            $fieldOutline = $fieldLabel.parents(".field-outline"),
                            $fieldInputs = $fieldBox.find("input");

                        if (!$(e.target).closest($fieldBox).length && $fieldInputs.val().trim() === "") {
                            $fieldLabel.removeClass('_is-active');
                            $fieldOutline.removeClass('_hasValue _is-active');
                            $fieldLabel.attr("aria-pressed", "false");
                        }
                    });
                });

                labelDiv.each(function () {
                    const $fieldLabel = $(this),
                        $fieldBox = $fieldLabel.parents(".field"),
                        $fieldOutline = $fieldLabel.parents(".field-outline"),
                        $fieldInputs = $fieldBox.find("input");

                    $fieldLabel.attr({
                        "tabindex": "0",
                        "role": "button",
                        "aria-pressed": "false",
                        "aria-label": $fieldLabel.text()
                    });

                    function hasValue() {
                        if ($fieldLabel.hasClass('_is-active')) {
                            $fieldOutline.addClass('_hasValue');
                            $fieldLabel.attr("aria-pressed", "true");
                        } else {
                            $fieldOutline.removeClass('_hasValue');
                            $fieldLabel.attr("aria-pressed", "false");
                        }
                    }

                    function handleLabelClick() {
                        $fieldLabel.addClass('_is-active');
                        $fieldOutline.addClass('_is-active');
                        hasValue();

                        const targetOffset = $fieldLabel.offset().top - 120,
                            docH = $(document).height(),
                            winH = $(window).height();

                        if (docH - targetOffset < winH) {
                            $(".containerWrap").addClass("scroll-space");
                        }
                        $("html, body").animate({ scrollTop: targetOffset }, 500);

                        if (typeof callback === 'function') {
                            callback();
                        }
                    }

                    function handleFocusOut() {
                        if ($fieldInputs.val().trim() === "") {
                            $fieldLabel.removeClass('_is-active');
                            hasValue();
                        }
                    }

                    function handleFocusIn() {
                        $fieldLabel.addClass('_is-active');
                        $fieldOutline.addClass('_is-active');
                        hasValue();
                    }

                    function handleKeydown(e) {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleLabelClick();
                        }
                    }

                    // 기존 핸들러 제거 후 재등록
                    $fieldLabel.off(".lbPlaceHolder")
                        .on("click.lbPlaceHolder", handleLabelClick)
                        .on("keydown.lbPlaceHolder", handleKeydown);

                    $fieldInputs.off(".lbPlaceHolder")
                        .on("focusout.lbPlaceHolder", handleFocusOut)
                        .on("focusin.lbPlaceHolder", handleFocusIn);
                });
            },

            input: function (callback) {
                const inputSelector = this.constEl.inputSelector,
                    clearSelector = this.constEl.clearSelector;

                $(inputSelector).each(function () {
                    const $inputTxt = $(this);
                    if ($inputTxt.prop("readonly") || $inputTxt.prop("disabled")) {
                        return;
                    }

                    function activateClearBtn() {
                        const $clearBtn = $inputTxt.parent().find(clearSelector);

                        if ($inputTxt.val()) {
                            $inputTxt.parent().addClass("_hasClear");
                            $clearBtn.addClass("_active");
                            if ($inputTxt.hasClass('_money')) {
                                $inputTxt.addClass('_is-active');
                            }
                        } else {
                            $inputTxt.parent().removeClass('_hasClear');
                            $clearBtn.removeClass("_active");
                            $inputTxt.removeClass('_is-active');
                        }
                    }

                    $inputTxt
                        .on("keyup input", function () {
                            activateClearBtn();
                        })
                        .on("focusin", function () {
                            // 다른 input에서 _hasClear 모두 제거
                            $("._input").removeClass("_hasClear");

                            // 현재 input 값 있으면 _hasClear 추가
                            if ($inputTxt.val()) {
                                $inputTxt.parent().addClass("_hasClear");
                                $inputTxt.parent().find(clearSelector).addClass("_active");
                            }

                            // 상위에 _is-active 클래스 토글(원본 유지)
                            $inputTxt.parent().parent().addClass("_is-active");
                        })
                        .on("blur focusout", function () {
                            // 포커스 이동시 버튼 포커스 확인 후 _hasClear 유지 또는 제거
                            const $inputParent = $inputTxt.parent();
                            setTimeout(() => {
                                const focusedElem = document.activeElement;
                                if (!$(focusedElem).closest($inputParent).length) {
                                    $inputParent.removeClass('_hasClear');
                                    $inputParent.find(clearSelector).removeClass('_active');

                                    if (!$inputTxt.val()) {
                                        $inputTxt.removeClass('_is-active').parents(".field-outline").removeClass("_is-active");
                                    }
                                }
                            }, 100);
                        });
                });

                // 콜백 실행
                if (typeof callback === "function") {
                    callback();
                }
            },

            inpClearBtn: function (callback) {
                const inputSelector = this.constEl.inputSelector,
                    clearSelector = this.constEl.clearSelector;

                $('body').on("mousedown touchstart keydown", clearSelector, function (e) {
                    if (e.type === "keydown" && e.which !== 13) return;
                    e.preventDefault();
                    const clearBtn = $(this),
                        inputTxt = clearBtn.siblings(inputSelector);

                    setTimeout(() => {
                        if ($('html').hasClass("ios") || $('html').hasClass("ios_old")) {
                            inputTxt.val('').trigger('input').focus();
                            inputTxt.parent().attr({ "contenteditable": "true" }).focus();

                            setTimeout(() => inputTxt.focus(), 100);

                            inputTxt.parent().removeClass('_hasClear').removeAttr('contenteditable');
                        } else {
                            inputTxt.val('').focus();

                            setTimeout(() => inputTxt.focus(), 100);

                            inputTxt.parent().removeClass('_hasClear');
                        }
                    }, 100);
                });

                /* 
                $(clearSelector).on("focus", function () {
                    $(this).addClass("_active");
                }).on("blur", function () {
                    $(this).removeClass("_active");
                });
                */

                // IME 입력 완료시 input 이벤트 강제 트리거 - IOS 한글버그 대응
                $("input").on("compositionstart compositionupdate compositionend input", function (event) {
                    var $input = $(this);
                    if (event.type === 'compositionend') {
                        $input.trigger("input");
                    }
                });


                // 콜백 실행
                if (typeof callback === "function") {
                    callback();
                }
            },

            // 비밀번호 특수문자 모양
            secureTxt: function (callbacks = {}) {
                $('._secureTxt').each(function () {
                    const secureField = $(this);
                    const inputField = secureField.find("input");
                    const secureTypeRaw = secureField.attr("secure-type");
                    const secureType = (!secureTypeRaw || secureTypeRaw === "next") ? "next" : secureTypeRaw;
                    const secureLine = parseInt(secureField.attr("data-secureLine")) || 0;
                    const length = parseInt(secureField.attr("data-length")) || 0;
                    const isNumField = secureField.hasClass("_num");

                    // maxlength 계산 (data-length - data-secureLine) 양수일 때만 적용
                    if (length && secureLine && (length - secureLine) > 0) {
                        inputField.attr("maxlength", length - secureLine);
                    } else {
                        inputField.removeAttr("maxlength");
                    }

                    const createIcons = () => {
                        secureField.find("i").remove();

                        if (secureType === "prev") {
                            let iTag = "";
                            for (let i = 0; i < length; i++) {
                                if (i < secureLine) {
                                    iTag += '<i class="_pwTxt" aria-hidden="true"></i>';
                                } else {
                                    iTag += '<i class="_line" aria-hidden="true"></i>';
                                }
                            }
                            secureField.append(iTag);

                        } else if (secureType === "normal") {
                            let iTag = "";
                            for (let i = 0; i < length; i++) {
                                iTag += '<i class="_pwTxt" aria-hidden="true"></i>';
                            }
                            secureField.append(iTag);

                        } else { // next 타입 - _line 앞, _pwTxt 뒤
                            let iTag = "";
                            const lineCount = length - secureLine; // 앞에 위치할 _line 개수
                            const fixedCount = secureLine;         // 뒤에 고정될 _pwTxt 개수

                            for (let i = 0; i < lineCount; i++) {
                                iTag += '<i class="_line" aria-hidden="true"></i>';
                            }
                            for (let i = 0; i < fixedCount; i++) {
                                iTag += '<i class="_pwTxt" aria-hidden="true"></i>';
                            }
                            secureField.append(iTag);
                        }
                    };

                    const setIconStyles = () => {
                        let left = 10;
                        let space = 13;

                        secureField.find("i").each(function () {
                            const $icon = $(this);
                            $icon.width($icon.height());
                            $icon.css("left", `${left}px`);
                            left += space;
                            space = 16;
                        });

                        if (secureType === "prev" || secureType === "next") {
                            const fixedIcons = secureField.find("i._pwTxt");
                            const paddingLeft = fixedIcons.length ? (fixedIcons.last().position().left + fixedIcons.last().outerWidth()) : 0;
                            inputField.css("padding-left", `${paddingLeft}px`);
                        }
                    };

                    const updateIcons = (value) => {
                        if (secureType === "normal") {
                            const icons = secureField.find("i");
                            const newLength = value.length;
                            const currentLength = icons.length;
                            const diff = newLength - currentLength;

                            if (diff > 0) {
                                for (let i = 0; i < diff; i++) {
                                    secureField.append('<i class="_pwTxt" aria-hidden="true"></i>');
                                }
                            } else if (diff < 0) {
                                icons.slice(newLength).remove();
                            }

                            setIconStyles();

                        } else if (secureType === "prev") {
                            const activeLines = secureField.find("i._line").removeClass("_is-active").css({ opacity: ".5" });

                            for (let i = 0; i < value.length && i < activeLines.length; i++) {
                                activeLines.eq(i).addClass("_is-active").css({ opacity: "" });
                            }

                            if (isNumField) {
                                const show = !value;
                                secureField.find("i._line, i._is-active").toggle(show);
                            }

                        } else { // next 타입
                            const lineIcons = secureField.find("i._line").removeClass("_is-active").css({ opacity: ".5" });
                            const fixedIcons = secureField.find("i._pwTxt");

                            // value 길이만큼 _line 순서대로 _is-active 추가
                            for (let i = 0; i < value.length && i < lineIcons.length; i++) {
                                lineIcons.eq(i).addClass("_is-active").css({ opacity: "" });
                            }

                            // 뒤의 고정 _pwTxt는 항상 _is-active 상태 유지
                            fixedIcons.addClass("_is-active").css({ opacity: "" });

                            if (isNumField) {
                                const show = !value;
                                secureField.find("i").toggle(show);
                            }
                        }
                    };

                    const handleFocus = () => {
                        const value = inputField.val();
                        updateIcons(value);
                        callbacks.onFocus?.(secureField);
                    };

                    const handleChange = () => {
                        const value = inputField.val();

                        if (secureType === "normal") {
                            updateIcons(value);
                            inputField.attr("type", value ? "password" : "text");
                        } else {
                            updateIcons(value);
                        }

                        callbacks.onChange?.(secureField, value);
                    };

                    const handleKeyUp = (event) => {
                        if (secureType !== "normal" && event.keyCode === 8) {
                            secureField.find("i._line").eq(event.target.value.length).removeClass("_is-active");
                        }
                        callbacks.onKeyUp?.(secureField, event);
                    };

                    const handleBlur = () => {
                        if (!inputField.val()) {
                            if (secureType === "normal") {
                                secureField.find("i").remove();
                                inputField.attr("type", "text");
                            } else {
                                secureField.find("i._line").removeClass("_is-active").css({ opacity: "" });
                                secureField.find("i._pwTxt").removeClass("_is-active");
                            }
                        }
                    };

                    // 초기화
                    createIcons();
                    setIconStyles();

                    if (isNumField && secureType !== "normal") {
                        inputField.attr("type", "tel");
                    } else if (secureType === "normal") {
                        inputField.attr("type", "text");
                    }

                    // 이벤트 바인딩
                    inputField.on("focus", handleFocus)
                        .on("input", handleChange)
                        .on("keyup", handleKeyUp)
                        .on("blur", handleBlur);
                });
            },

            // readonly일 경우
            inpReadonly: function (callback) {
                $("input, select").each(function () {
                    const $el = $(this),
                        tag = this.tagName.toLowerCase(),
                        isReadonly = $el.prop("readonly") || $el.attr("aria-readonly") === "true",
                        isDisabled = $el.prop("disabled") || $el.attr("aria-disabled") === "true";

                    let status = null;

                    if (tag === "input") {
                        if (isReadonly) {
                            $el.parent().addClass("_readonly");
                            status = "readonly";
                        } else if (isDisabled) {
                            $el.parent().addClass("_disabled");
                            status = "disabled";
                        }
                    } else if (tag === "select" && $el.hasClass("select-sys")) {
                        if (isReadonly) {
                            $el.parent().parent().addClass("_readonly");
                            status = "readonly";
                        } else if (isDisabled) {
                            $el.parent().parent().addClass("_disabled");
                            status = "disabled";
                        }
                    }

                    // 콜백이 함수라면 실행
                    if (typeof callback === "function" && status) {
                        callback($el, status);
                    }
                });
            },

            // input:range
            inputRange: function (callback) {
                const rangeSelector = $('.range-slider');

                rangeSelector.each(function () {
                    const rangeInput = $(this).find('._range');
                    const rangeValue = $(this).find('._value');
                    const rangeInfo = $(this).find('.range-info');

                    rangeValue.each(function () {
                        const defaultvalue = rangeInput.attr('value');
                        const rangeValueText = rangeValue.attr('range-value'); // Get the range-value text
                        const innerValue = rangeValue.attr('inner-value') === "true"; // Check for inner-value attribute

                        // Set the initial value of the span
                        if (!rangeValueText) {
                            // If no range-value, set the span to the default input value
                            rangeValue.text(defaultvalue);
                        } else {
                            // Update span text based on inner-value
                            rangeValue.text(innerValue ? `${rangeValueText} (${defaultvalue})` : rangeValueText);
                        }

                        rangeInfo.css({
                            'left': defaultvalue + '%',
                            'margin-left': `-${rangeInfo.outerWidth() / 2}px`
                        });
                        rangeInput.css('background', `linear-gradient(to right, #333 ${defaultvalue}%, #ccc ${defaultvalue}%)`);
                    });

                    rangeInput.on('input', function () {
                        const rangeInputValue = Math.floor(this.value);
                        const newValue = Number(($(this).val() - $(this).attr('min')) * 100 / ($(this).attr('max') - $(this).attr('min')));
                        const newPosition = 8 - (newValue * 0.16);

                        rangeInput.attr('value', rangeInputValue);
                        const rangeValueText = rangeValue.attr('range-value'); // Get the range-value text
                        const innerValue = rangeValue.attr('inner-value') === "true"; // Check for inner-value attribute

                        // console.log("newValue:", newValue, "newPosition:", newPosition);

                        // Update span text based on the presence of range-value
                        if (!rangeValueText) {
                            // If no range-value, set the span to the current input value
                            rangeValue.text(rangeInputValue);
                        } else {
                            // Update span text based on inner-value
                            rangeValue.text(innerValue ? `${rangeValueText} (${rangeInputValue})` : rangeValueText);
                        }

                        rangeInfo.css({
                            'left': `calc(${newValue}% + (${newPosition}px))`,
                            'margin-left': `-${rangeInfo.outerWidth() / 2}px`
                        });

                        if (rangeInputValue == $(this).attr('min')) {
                            rangeInfo.addClass('left').removeClass('gap');
                        } else if (newValue <= $(this).attr('arrow-min')) {
                            rangeInfo.addClass('left gap');
                        } else if (rangeInputValue >= $(this).attr('max')) {
                            rangeInfo.addClass('right').removeClass('gap');
                        } else if (newValue >= $(this).attr('arrow-max')) {
                            rangeInfo.addClass('right gap');
                        } else {
                            rangeInfo.removeClass('left');
                            rangeInfo.removeClass('right');
                        }
                        rangeInput.css('background', `linear-gradient(to right, #333 ${newValue}%, #ccc ${newValue}%)`);

                        // Callback function
                        if (typeof callback === "function") {
                            callback(rangeInputValue);
                        }
                    });
                });
            },

            // input:doublerange
            inputRangeDouble: function (callback) {
                const doubRangeBg = $(".slider-container .double-slider");
                const doubleInputRange = $(".range-slider.double .field-input input[type=range]");
                const dobuleInputNum = $(".range-slider.double .field-input input[type=number]");
                const minInfo = $('.doublerange-info.min');
                const minInfoValue = $('.doublerange-info ._value-min');
                const maxInfo = $('.doublerange-info.max');
                const maxInfoValue = $('.doublerange-info ._value-max');

                let doubleGap = 500; // 최소 간격

                function updateRangeInfo(value, infoElement, infoValueElement, isMin) {
                    const rangeMessage = infoValueElement.attr('range-value');
                    const innerValue = infoValueElement.attr('inner-value') === 'true';
                    const arrowMin = infoValueElement.attr('arrow-min');
                    const arrowMax = infoValueElement.attr('arrow-max');

                    if (rangeMessage && innerValue) {
                        infoValueElement.text(`${rangeMessage}(${value})`);
                    } else if (rangeMessage) {
                        infoValueElement.text(rangeMessage);
                    } else {
                        infoValueElement.text(value);
                    }

                    const sliderMaxValue = Number(doubleInputRange.eq(0).attr('max'));
                    const percentage = (value / sliderMaxValue) * 100;
                    const pixelPercentage = (percentage / 100) * window.innerWidth;
                    const elementWidth = infoElement.outerWidth() / 2;
                    const parentWidth = infoElement.parent(".field-input").width();

                    if (isMin) {
                        infoElement.css({
                            'left': pixelPercentage < elementWidth ? `${percentage * 0}%` : `${percentage}%`,
                            'margin-left': pixelPercentage < elementWidth ? `0` : `-${elementWidth}px`
                        });

                        if (arrowMin !== undefined) {
                            const arrowMinNum = Number(arrowMin);
                            if (percentage <= arrowMinNum) {
                                infoElement.addClass("left gap").removeClass("right");
                            } else {
                                infoElement.removeClass("left right gap");
                            }
                        } else {
                            // arrow-min 없으면 기존 최소값 기준
                            if (value === Number(doubleInputRange.eq(0).attr("min"))) {
                                infoElement.addClass("left").removeClass("right gap");
                            } else {
                                infoElement.removeClass("left right gap");
                            }
                        }
                    } else {
                        infoElement.css({
                            'right': (parentWidth - (elementWidth / 2)) < pixelPercentage ? `${elementWidth}px` : `${100 - percentage}%`,
                            'margin-right': (parentWidth + infoElement.outerWidth()) < pixelPercentage ? `0` : `-${elementWidth}px`
                        });

                        if (arrowMax !== undefined) {
                            const arrowMaxNum = Number(arrowMax);
                            if (percentage >= arrowMaxNum) {
                                infoElement.addClass("right gap").removeClass("left");
                            } else {
                                infoElement.removeClass("left right gap");
                            }
                        } else {
                            // arrow-max 없으면 기존 최대값 기준
                            if (value === Number(doubleInputRange.eq(1).attr("max"))) {
                                infoElement.addClass("right").removeClass("left gap");
                            } else {
                                infoElement.removeClass("left right gap");
                            }
                        }
                    }
                }


                function rangeInputWidth() {
                    let minVal = parseInt(doubleInputRange.eq(0).val());
                    let maxVal = parseInt(doubleInputRange.eq(1).val());
                    let diff = maxVal - minVal;

                    if (diff < doubleGap) {
                        if ($(this).hasClass("min-range")) {
                            doubleInputRange.eq(0).val(maxVal - doubleGap);
                        } else {
                            doubleInputRange.eq(1).val(minVal + doubleGap);
                        }
                    } else {
                        dobuleInputNum.eq(0).val(minVal);
                        dobuleInputNum.eq(1).val(maxVal);

                        updateRangeInfo(minVal, minInfo, minInfoValue, true);
                        updateRangeInfo(maxVal, maxInfo, maxInfoValue, false);

                        doubRangeBg.css("left", `${(minVal / doubleInputRange.eq(0).attr("max")) * 100}%`);
                        doubRangeBg.css("right", `${100 - (maxVal / doubleInputRange.eq(1).attr("max")) * 100}%`);
                    }

                    if (typeof callback === "function") {
                        callback(minVal, maxVal);
                    }
                }

                rangeInputWidth();

                dobuleInputNum.on("input", function () {
                    let minp = parseInt(dobuleInputNum.eq(0).val());
                    let maxp = parseInt(dobuleInputNum.eq(1).val());
                    let diff = maxp - minp;

                    if (diff >= doubleGap && maxp <= doubleInputRange.eq(1).attr("max")) {
                        if ($(this).hasClass("min-input")) {
                            doubleInputRange.eq(0).val(minp);
                            let value1 = doubleInputRange.eq(0).attr("max");
                            doubRangeBg.css("left", `${(minp / value1) * 100}%`);
                            updateRangeInfo(minp, minInfo, minInfoValue, true);
                        } else {
                            doubleInputRange.eq(1).val(maxp);
                            let value2 = doubleInputRange.eq(1).attr("max");
                            doubRangeBg.css("right", `${100 - (maxp / value2) * 100}%`);
                            updateRangeInfo(maxp, maxInfo, maxInfoValue, false);
                        }
                    }
                });

                doubleInputRange.on("input", function () {
                    let minVal = parseInt(doubleInputRange.eq(0).val());
                    let maxVal = parseInt(doubleInputRange.eq(1).val());

                    if (minVal >= maxVal - doubleGap) {
                        if ($(this).hasClass("min-range")) {
                            doubleInputRange.eq(0).val(maxVal - doubleGap);
                        } else {
                            doubleInputRange.eq(1).val(minVal + doubleGap);
                        }
                    }
                    rangeInputWidth();
                });
            }


        },

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
                const self = this;
                // dimmedEl = this.constEl.dimmedEl;
                const target = $btn.attr('data-modal');
                const $modal = $('.modalPop[modal-target="' + target + '"]');
                var $modalWrap = $modal.find("> .modalWrap");

                $modal.addClass('_is-active').attr({ 'aria-hidden': 'false' });

                // $modal.addClass('_is-active').attr({ 'aria-hidden': 'false' });
                $modalWrap.attr({ 'role': 'dialog', 'aria-modal': 'true' })
                    .find('a, *[role="button"], button, h1, h2, h3, h4, h5, h6').first().each(function () {
                        if ($(this).is('h1, h2, h3, h4, h5, h6')) {
                            $(this).attr('tabindex', '0');
                        }
                    });

                if ($(".ico-tooltip._is-active").length) {
                    // cp.toolTip.closeTip() 호출
                    cp.toolTip.closeTip();
                }
                // $modal 안에 .ico-tooltip 요소가 존재하는지 확인
                if ($modal.find(".ico-tooltip").length) {
                    // _inModal 클래스 추가
                    $modal.find('.ico-tooltip').addClass('_inModal');
                    cp.toolTip.openTip();
                }

                setTimeout(function () {
                    $modalWrap.find(".ico-his-prev").focus()
                    var firstFocusable;

                    // .modal-header가 있을 경우
                    if ($modalWrap.find('.modal-header').length) {
                        firstFocusable = $modalWrap.find('.modal-header').find('a.ico-his-prev, a.ico ico-pop-close, a, *[role="button"], button').first();
                    } else {
                        // .modal-header가 없을 경우
                        firstFocusable = $modalWrap.find('a.ico-his-prev, a.ico ico-pop-close, a, *[role="button"], button').first();
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
                $(document).on('click', '.btn-close-pop', function (e) {
                    e.preventDefault();
                    console.log('btn-close-pop clicked:', this, e);
                    const $modal = $(this).closest('.modalPop');
                    const $modalWrap = $modal.find("> .modalWrap");

                    // 툴팁 정리
                    if ($('.ico-tooltip').hasClass('_inModal')) {
                        cp.toolTip.closeTip();
                    }

                    // 모달 닫기 처리
                    if ($modal.hasClass("_scroll")) {
                        $modal.removeClass('_is-active');
                        $modalWrap.css({
                            'max-height': '', 'height': '', 'transition': ''
                        }).find(" > .modal-container").css({
                            'height': ''
                        }).removeAttr("tabindex");
                    } else {
                        $modal.removeClass('_is-active');
                    }

                    self.isOpen = false;

                    // 접근성 속성 제거 (aria-modal 먼저)
                    $modalWrap.attr({ 'aria-modal': 'false' }).removeAttr('tabindex')
                        .find('a, button, h1, h2, h3, h4, h5, h6').first().removeAttr('tabindex');

                    // 포커스 복원
                    if ($("._modalBtn").hasClass("_rtFocus2")) {
                        setTimeout(function () {
                            $('._rtFocus2').focus().removeClass('_rtFocus2');
                            $modal.attr({ 'aria-hidden': 'true' }); // 이후에 aria-hidden 처리
                        }, 300);
                    } else {
                        self.rtFocus(); // 이 안에서 _rtFocus로 이동
                        setTimeout(function () {
                            $modal.attr({ 'aria-hidden': 'true' }); // 포커스 이동 후 처리
                        }, 310); // rtFocus와 타이밍 맞춤
                    }

                    // 바디 스크롤 복구
                    if ($(".modalPop._is-active").length === 0) {
                        $('body').removeClass('no-scroll');
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
        };

    cp.tab = {
        constEl: {
            tab: '.tab > a'
        },
        init() {
            this.tabSetting();
            this.tabClick();
            this.scrollEventHandler();
            this.tabSticky();
        },
        tabSetting: function () {
            /**
             * 탭 초기 설정
             * @contentsIdx 클릭한 탭의 index와 같은 index의 content
             */
            const self = this;

            $('.tab-moving .tab-list-wrap').append($('<span class="highlight"></span>'));
            $('.tab-scroll .tab-contents').scrollTop();

            // 접근성
            $('.tab').children('a').attr('aria-selected', 'false');
            $('.tab._is-active').children('a').attr('aria-selected', 'true');
            $('.tab').attr('roll', 'tab');
            $('.tab-list').attr('roll', 'tablist');
            $('.tab-contents').attr('roll', 'tabpanel');

            $(document).ready(function () {
                $('.tab-wrap').each(function () {
                    var $tabWrap = $(this);

                    $tabWrap.find('.tab').each(function (index) {
                        var tabId = $tabWrap.attr('id') + '_' + 'tab' + (index + 1);
                        $(this).attr('aria-controls', tabId);
                    });

                    $tabWrap.find('.tab-contents').each(function (index) {
                        var panelId = $tabWrap.attr('id') + '_' + 'tab' + (index + 1);
                        $(this).attr('id', panelId);
                    });

                    $tabWrap.find('.highlight').each(function () {
                        self.moveHighLight($tabWrap);
                    });
                })
            })

            // resize 체크
            let resizeTimeout;
            $(window).on('resize', function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    $('.tab-wrap').each(function () {
                        var $tabWrap = $(this);

                        $tabWrap.find('.highlight').each(function () {
                            self.moveHighLight($tabWrap);
                        });
                    });
                }, 200);
            });

            $('.tab-scroll .tab-contents-wrap').on('scroll', self.scrollEventHandler);

        },
        tabSel: function ($this, $tabWrap) {
            /**
             * 가로/세로 탭 선택 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * @next 가로/세로 형식으로 바뀌는 컨텐츠 wrapper
             * sel-h-v 클래스 있는 tab 메뉴에서 data-type에 따라 $next highlight 초기화
             */

            if ($tabWrap.hasClass('sel-h-v')) {
                const $next = $tabWrap.next('.tab-wrap'); //실제 tabWrap
                const $activeTab = $next.find('._is-active');
                const newHeight = $next.find('.tab').outerHeight();
                const newWidth = $next.find('.tab').outerWidth();
                const nextHighlight = $next.find('.highlight');
                const newTop = $activeTab.position().top;

                if ($this.attr('data-type') === 'vertical') {
                    //탭메뉴 세로 버전일때
                    $next.addClass('tab-vertical').find('.tab-list').attr('aria-orientation', 'vertical');

                    nextHighlight.css({
                        left: '',
                        width: '',
                        top: newTop + 'px',
                        height: newHeight + 'px'
                    });
                } else {
                    //탭메뉴 가로 버전일때
                    $next.removeClass('tab-vertical').find('.tab-list').removeAttr('aria-orientation');

                    nextHighlight.css({
                        top: '',
                        height: '',
                        width: newWidth + 'px'
                    });
                }

                /* 탭활성화 초기화 */
                // $next.find('.tab, .tab-contents').removeClass('_is-active').eq(0).addClass('_is-active');
                // 초기 탭과 콘텐츠 활성화
                $tabs.removeClass('_is-active');
                $contents.removeClass('_is-active');
                $firstTab.addClass('_is-active');
                $firstContent.addClass('_is-active');

                // 콘텐츠 wrapper 높이 갱신
                const $contentWrap = $next.find('.tab-contents-wrap');
                if ($contentWrap.length) {
                    const contentHeight = $firstContent.outerHeight(true);
                    $contentWrap.css('height', contentHeight + 'px');
                }
            }
        },
        moveHighLight: function ($tabWrap, $this, callback) {
            /**
             * 선택된 탭 highlight action 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * tab-moving 클래스 있는 tab 메뉴에서 tab-vertical 클래스에 따라 highlight 스타일 변화
             */

            if ($tabWrap.hasClass('tab-moving') && $tabWrap.hasClass('tab-vertical')) {
                // 세로 버전일때
                $this = $tabWrap.find('._is-active, .active');
                const $tabLstWrap = $tabWrap.find('.tab-list-wrap');
                const num = $tabLstWrap.offset().top;
                const elemTop = Math.ceil($this.offset().top);
                const scrollTop = $tabLstWrap.scrollTop();
                const thisElem = Math.ceil($this.outerHeight());
                const centerScroll = elemTop + scrollTop - num - $tabLstWrap.height() / 2 + thisElem / 2;

                const $highLight = $tabWrap.find('.highlight');
                const newHeight = $this.outerHeight();

                $highLight.css('left', '');
                $highLight.css('width', '');

                $highLight.stop().animate({
                    height: newHeight,
                    top: elemTop - num + scrollTop
                });
                $tabLstWrap.stop().animate({
                    scrollTop: centerScroll
                }, 500);
            } else if ($tabWrap.hasClass('tab-moving') && !$tabWrap.hasClass('tab-vertical')) {
                // 가로 버전일때
                const $tabLstWrap = $tabWrap.find('.tab-list-wrap');
                const $this = $tabLstWrap.find('._is-active, .active');
                const num = $tabLstWrap.offset().left;
                const elemLeft = Math.ceil($this.offset().left);
                const scrollLeft = $tabLstWrap.scrollLeft();
                const thisElem = Math.ceil($this.outerWidth());
                const centerScroll = elemLeft + scrollLeft - num - $tabLstWrap.width() / 2 + thisElem / 2;

                const $highLight = $tabWrap.find('.highlight');
                const newWidth = Math.floor($this.outerWidth());

                $highLight.css({
                    top: '',
                    height: ''
                }).stop().animate({
                    width: newWidth,
                    left: elemLeft - num + scrollLeft
                });

                $tabLstWrap.stop().animate({
                    scrollLeft: centerScroll
                }, 500);
            }
            if (callback && typeof callback === 'function') {
                callback($tabWrap, $this);
            }
        },
        tabSticky: function () {
            /**
             * tab sticky 이벤트
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * window 스크롤 시 해당 content와 tab 활성화
             */
            const self = this;
            const $tabWrap = $('.tab-sticky');
            let isTabClick; // 중복 호출 방지를 위한 플래그 변수

            // ✅ 마지막 콘텐츠가 화면보다 작을 경우에만 _last 클래스 추가
            function checkLastContH() {
                const $lastContent = $('.tab-sticky .tab-contents').last();
                const windowHeight = $(window).height();
                const contentHeight = $lastContent.outerHeight(true);

                if (contentHeight < windowHeight) {
                    $lastContent.addClass('_last');
                } else {
                    $lastContent.removeClass('_last');
                }
            }

            // 최초 실행
            checkLastContH();

            // 리사이즈 대응
            $(window).on('resize', checkLastContH);

            $(window).on('scroll', function () {
                if (!isTabClick) {
                    isTabClick = true;

                    const scrollY = $(this).scrollTop();
                    const windowHeight = $(this).height();

                    // 먼저 _last가 있는 경우 우선 처리
                    const $lastContent = $(".tab-sticky .tab-contents._last");
                    if ($lastContent.length) {
                        const contentTop = $lastContent.offset().top;

                        if ((scrollY + windowHeight) >= (contentTop + 100)) {
                            const targetId = $lastContent.attr("id");
                            const targetTab = $('.tab[aria-controls="' + targetId + '"]');

                            targetTab.closest('li').addClass("_is-active").siblings().removeClass("_is-active");
                            targetTab.closest('ul').find('.tab a').attr('aria-selected', 'false');
                            targetTab.find('a').attr('aria-selected', 'true');
                            $lastContent.addClass("_is-active").siblings().removeClass("_is-active");

                            if (typeof self.moveHighLight === "function") {
                                self.moveHighLight($tabWrap, targetTab);
                            }

                            isTabClick = false;
                            return; // _last가 처리되었으면 일반 콘텐츠는 스킵
                        }
                    }

                    // 일반 콘텐츠 처리
                    $(".tab-sticky .tab-contents").each(function () {
                        const contentTop = $(this).offset().top;
                        const contentBottom = contentTop + $(this).outerHeight();
                        const tabHeight = $('.tab').outerHeight() + 2;

                        if (!$('html, body').is(':animated')) {
                            if (window.scrollY >= contentTop - tabHeight && window.scrollY <= contentBottom) {
                                const targetId = $(this).attr("id");
                                const targetTab = $('.tab[aria-controls="' + targetId + '"]');

                                targetTab.closest('li').addClass("_is-active").siblings().removeClass("_is-active");
                                targetTab.siblings().find('.tab').children('a').attr('aria-selected', 'false');
                                targetTab.children('a').attr('aria-selected', 'true');
                                $(this).addClass("_is-active").siblings().removeClass("_is-active");

                                self.moveHighLight($tabWrap, targetTab);
                            }
                        }

                        setTimeout(function () {
                            isTabClick = false;
                        }, 10);
                    });

                    // 플래그 해제
                    setTimeout(function () {
                        isTabClick = false;
                    }, 10);
                }
            });
        },

        scrollEventHandler: function () {
            /**
             * tab scroll 이벤트
             * @thisWrap 스크롤 중인 컨텐츠 상위 wrapper
             * 스크롤시 해당 content와 tab 활성화
             */
            const $thisWrap = $(this);

            $thisWrap.children('.tab-contents').each(function () {
                const panelTop = $(this).position().top;
                const $tabWrap = $(this).closest('.tab-scroll');

                if (panelTop <= -20 && panelTop > -$thisWrap.height() / 2) {
                    const tabId = $(this).attr('id');

                    $tabWrap.find('.tab').removeClass('_is-active');
                    $tabWrap.find('.tab').children('a').attr('aria-selected', 'false');
                    $tabWrap.find('.tab[aria-controls="' + tabId + '"]').addClass('_is-active');
                    $tabWrap.find('.tab[aria-controls="' + tabId + '"]').children('a').attr('aria-selected', 'true');
                    $(this).siblings().removeClass('_is-active');
                    $(this).addClass('_is-active');

                    const $this = $tabWrap.find('.tab[aria-controls="' + tabId + '"]');
                    cp.tab.moveHighLight($tabWrap, $this);
                }
            });
        },
        tabClick: function () {
            /**
             * 선택된 탭 _is-active 함수
             * @this 클릭한 탭 버튼
             * @tabWrap 클릭한 탭의 wrapper
             * @contentsIdx 클릭한 탭의 index와 같은 index의 content
             */
            const self = this;

            $(document).on('click', this.constEl.tab, function (e) {
                e.preventDefault();

                const $this = $(this).parent('.tab');
                const $index = $this.index();
                const $tabWrap = $this.closest('.tab-wrap');
                const $contentsWrap = $tabWrap.children('.tab-contents-wrap');
                const $contents = $contentsWrap.children('.tab-contents');
                const $contentsIdx = $contentsWrap.children('.tab-contents').eq($index);

                const tabAttr = function () {
                    // 탭 클릭시 활성화
                    $this.siblings('.tab').removeClass('_is-active');
                    $this.siblings('.tab').children('a').attr('aria-selected', 'false');
                    $this.addClass('_is-active');
                    $this.children('a').attr('aria-selected', 'true');
                    $contents.removeClass('_is-active');
                    $contentsIdx.addClass('_is-active');
                    $contents.removeAttr('tabindex');
                    $contentsIdx.attr('tabindex', '0');
                };

                if ($tabWrap.attr('data-roll') === 'tab' && $tabWrap.hasClass('tab-scroll')) {
                    // tab-scroll 일 경우
                    tabAttr();
                    self.moveHighLight($tabWrap, $this, function () {
                        $('.tab-scroll .tab-contents-wrap').off('scroll', self.scrollEventHandler);

                        const $targetHref = $('#' + $this.attr('aria-controls'));
                        const $targetWrap = $targetHref.parent('.tab-contents-wrap');
                        const location = $targetHref.position().top;

                        $targetWrap.stop().animate({
                            scrollTop: $targetWrap.scrollTop() + location
                        }, 300);

                        setTimeout(function () {
                            $('.tab-scroll .tab-contents-wrap').on('scroll', self.scrollEventHandler);
                        }, 400);
                    });
                } else if ($tabWrap.attr('data-roll') === 'tab' && $tabWrap.hasClass('tab-sticky')) {
                    // tab-sticky 일 경우
                    isTabClick = false;
                    if (!isTabClick) {
                        isTabClick = true;

                        tabAttr();
                        self.moveHighLight($tabWrap, $this, function () {
                            const target = $this.attr('aria-controls');
                            const $target = $('#' + target);
                            const tabHeight = $this.outerHeight();
                            const targetTop = $target.offset().top - tabHeight;

                            $('html,body').stop().animate({
                                scrollTop: targetTop
                            }, 600, 'swing', function () {
                                isTabClick = false; // 스크롤 이동 끝난 후 false 부여
                            });
                        });
                    }
                } else if ($tabWrap.attr('data-roll') === 'tab' && $tabWrap.hasClass('tab-filter')) {
                    // tab-filter 일 경우
                    tabAttr();
                    const $anchor = $this.children('a');
                    const filterValue = $anchor.attr('category-filter');

                    self.moveHighLight($tabWrap, $this, function () {
                        self.tabFilter($tabWrap, filterValue);
                    });
                } else if ($tabWrap.attr('data-roll') === 'tab') {
                    // 일반 탭 (기본)
                    tabAttr();
                    $contentsIdx.removeAttr('hidden');
                    self.moveHighLight($tabWrap, $this);
                }

                let newTop = 0;
                self.tabSel($this, $tabWrap);
            });
        },
        tabFilter: function ($tabWrap, filterValue, callback) {
            const $list = $tabWrap.find('.segmented-filter');
            if (filterValue === 'all') {
                $list.find('[category-value]').show();
            } else {
                $list.find('[category-value]').each(function () {
                    const $item = $(this);
                    $item.toggle($item.attr('category-value') === filterValue);
                });
            }
            // 콜백 함수가 있으면 실행
            if (callback && typeof callback === 'function') {
                callback();
            }
        },

    };

    cp.swiper8 = {
        init: function () {
            this.swiperSetting();
        },
        swiperSetting: function () {
            $('div.swiper-wrap').each(function () {
                var $this = $(this);
                var swiperType = $this.attr('swiper-type'); // swiper-type 값 가져오기

                if (swiperType === "tab") {
                    cp.swiper8.initTabSwiper($this);
                } else if (!swiperType || swiperType === "visual") {
                    cp.swiper8.initVisualSwiper($this);
                }
            });
        },

        // 탭 스와이퍼 초기화
        initTabSwiper: function ($wrap) {
            const self = this;
            var tabNavSwiper = new Swiper($wrap.find('.swiper-container[swiper-tab]')[0], {
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
                a11y: true,
                keyboard: {
                    enabled: true,
                },
            });

            var tabContentSwiper = new Swiper($wrap.find('.swiper-container[swiper-target]')[0], {
                slidesPerView: 1,
                loop: $wrap.attr('swiper-loop') === "true",
                a11y: true,
                keyboard: {
                    enabled: true,
                },
                on: {
                    slideChange: function () {
                        var realIndex = this.realIndex;
                        cp.swiper8.updateActiveTab(realIndex, $wrap);
                        tabNavSwiper.slideTo(realIndex);
                    },
                },
            });

            // swiperControl에 스와이퍼들을 전달
            cp.swiper8.swiperControl(tabNavSwiper, tabContentSwiper, $wrap);
        },

        swiperControl: function (tabNavSwiper, tabContentSwiper, $wrap) {
            // 탭 클릭 이벤트 설정
            $('.tab-nav .swiper-slide', $wrap).on('click', function () {
                var index = $(this).data('slide-index');
                if (tabContentSwiper) { // tabContentSwiper가 정의되어 있는지 확인
                    tabContentSwiper.slideToLoop(index);
                    cp.swiper8.updateActiveTab(index, $wrap);
                }
            });
        },

        // 비주얼 스와이퍼 초기화
        initVisualSwiper: function ($wrap) {
            var slidesPerView = parseFloat($wrap.attr('swiper-view')) || 1;
            var swiperEffect = $wrap.attr('swiper-effect') || null;
            var slidesSpace = parseInt($wrap.attr('swiper-space')) || 0;
            var pagination = $wrap.attr('swiper-paging') === "true";
            var autoplay = $wrap.attr('swiper-play') === "auto";
            var autoplayStop = $wrap.attr('swiper-play') === "stop";
            var hasArrows = $wrap.attr('swiper-arrow') === "true";
            var speed = parseInt($wrap.attr('swiper-speed')) || 3000;
            var autoBtn = $wrap.attr('auto-btn') === "both";
            var autoH = $wrap.attr('auto-height') === "true";

            // 슬라이드 수 설정
            if (slidesPerView === 1 || !slidesPerView) {
                slidesPerView = 1;
            }

            // 슬라이드 뷰 설정
            if (swiperEffect === 'preview') {
                slidesPerView = 1.2;
            } else if (swiperEffect === 'coverflow') {
                slidesPerView = 1.4;
            }

            // pagination 추가
            if (pagination && $wrap.find('.swiper-pagination').length === 0) {
                $wrap.append('<div class="swiper-pagination"></div>');
            }

            // autoplayStop일 때 createPlayPauseControls2가 생성되도록 수정
            if (pagination && autoplay && $wrap.find('.swiper-pagination').length > 0) {
                setTimeout(function () {
                    cp.swiper8.createPlayPauseControls($wrap.find('.swiper-pagination'));
                }, 300);
            } else if (autoplayStop && !pagination) {
                cp.swiper8.createPlayPauseControls2($wrap);
                setTimeout(function () {
                    $wrap.find('.playbtn .stop').addClass("_is-active");
                }, 300);
            }

            // 화살표 버튼 추가
            if (hasArrows && $wrap.find('.swiper-button-next').length === 0 && $wrap.find('.swiper-button-prev').length === 0) {
                $wrap.append('<div class="swiper-button-next" aria-label="다음 슬라이드"></div>');
                $wrap.append('<div class="swiper-button-prev" aria-label="이전 슬라이드"></div>');
            }

            // swiperOptions 설정
            var swiperOptions = {
                slidesPerView: slidesPerView,
                spaceBetween: slidesSpace,
                loop: $wrap.attr('swiper-loop') === "true",
                a11y: true,
                keyboard: {
                    enabled: true,
                },
                pagination: pagination ? {
                    el: $wrap.find('.swiper-pagination')[0],
                    clickable: true,
                } : false,
                navigation: hasArrows ? {
                    nextEl: $wrap.find('.swiper-button-next')[0],
                    prevEl: $wrap.find('.swiper-button-prev')[0],
                } : false,
                centeredSlides: (swiperEffect === 'coverflow'),
                autoHeight: autoH,
            };

            // coverflow 효과일 때 추가 옵션 설정
            if (swiperEffect === 'coverflow') {
                swiperOptions.effect = 'coverflow';
                swiperOptions.coverflowEffect = {
                    rotate: 10,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    scale: 0.8,
                    slideShadows: true,
                };
                swiperOptions.centeredSlides = true;
                swiperOptions.grabCursor = true;
            }

            // autoplay 설정
            if (autoplay) {
                swiperOptions.autoplay = {
                    delay: speed,
                    disableOnInteraction: false,
                };
                // autoplay 버튼 추가
                if (!pagination) {
                    if (autoBtn) {
                        cp.swiper8.createPlayPauseControls2($wrap);
                    } else {
                        cp.swiper8.createPlayPauseControls($wrap);
                    }

                }
            }

            // Swiper 인스턴스 생성
            var visualSwiper = new Swiper($wrap.find('.swiper-container[swiper-name]')[0], swiperOptions);

            // autoplay 관련 버튼 이벤트 핸들링
            if (autoplay && !autoBtn) {
                $wrap.on('click', '.playbtn a', function (e) {
                    e.preventDefault();
                    var $btn = $(this);

                    if ($btn.hasClass("play")) {
                        visualSwiper.autoplay.stop();
                        $btn.removeClass("play").addClass("stop _is-active")
                            .attr("aria-label", "정지").find(" > span").text("정지");
                    } else if ($btn.hasClass("stop")) {
                        visualSwiper.autoplay.start();
                        $btn.removeClass("stop").addClass("play _is-active")
                            .attr("aria-label", "재생").find(" > span").text("재생");
                    }
                });
            } else if (autoplay && autoBtn) {
                $wrap.on('click', '.playbtn a', function (e) {
                    e.preventDefault();
                    var $btn = $(this);

                    if ($btn.hasClass("play")) {
                        visualSwiper.autoplay.start();
                        $(".btn-autoplay").removeClass("_is-active");
                        $btn.addClass("_is-active");
                    } else if ($btn.hasClass("stop")) {
                        visualSwiper.autoplay.stop();
                        $(".btn-autoplay").removeClass("_is-active");
                        $btn.addClass("_is-active");
                    }
                });
            } else // autoplayStop일 때 play/stop 버튼 동작 처리
                if (autoplayStop) {
                    $wrap.on('click', '.playbtn a', function (e) {
                        e.preventDefault();
                        var $btn = $(this);

                        // play 버튼 클릭 시 autoplay 시작
                        if ($btn.hasClass("play")) {
                            visualSwiper.params.autoplay.delay = speed;
                            visualSwiper.autoplay.start();
                            $(".btn-autoplay").removeClass("_is-active");
                            $btn.addClass("_is-active");
                        }
                        // stop 버튼 클릭 시 autoplay 중지
                        else if ($btn.hasClass("stop")) {
                            visualSwiper.autoplay.stop();
                            $(".btn-autoplay").removeClass("_is-active");
                            $btn.addClass("_is-active");
                        }
                    });
                }
        },


        updateActiveTab: function (index, $wrap) {
            $('.tab-nav .swiper-slide', $wrap).removeClass('active');
            $('.tab-nav .swiper-slide[data-slide-index="' + index + '"]', $wrap).addClass('active');
        },

        // autoplay 에서 버튼 하나로만 변경될때
        createPlayPauseControls: function ($wrap) {
            var playPauseHTML = `
                <div class="playbtn">
                  <a href="#none" class="btn-autoplay play" aria-label="재생">
                    <i class="ico-playbtn" aria-hidden="true"></i>
                    <span class="hide">재생</span>
                  </a>
                </div>
            `;
            $wrap.append(playPauseHTML);
        },
        // autoplay 에서 버튼 2개가 모두 보일때 변경될때
        createPlayPauseControls2: function ($wrap) {
            var playPauseHTML = `
                <div class="playbtn">
                  <a href="#none" class="btn-autoplay play" aria-label="재생">
                    <i class="ico-playbtn" aria-hidden="true"></i>
                    <span class="hide">재생</span>
                  </a>
                  <a href="#none" class="btn-autoplay stop" aria-label="정지">
                    <i class="ico-playbtn" aria-hidden="true"></i>
                    <span class="hide">정지</span>
                  </a>
                </div>
            `;
            $wrap.append(playPauseHTML);
        },
    };

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

    /* 라디오버튼 클릭시 show hide */
    cp.radio ={
        init: function(){
            this.radioShowHide();
        },

        radioShowHide: function(){
            $('input[type="radio"][data-show]').on('change', function () {
                const showKey = $(this).data('show');

                // Show/hide elements
                $('[data-appear]').hide().attr('aria-hidden', 'true');
                $('[data-appear="' + showKey + '"]').show().attr('aria-hidden', 'false');

                // Disable all checkboxes(라디오버튼 클릭 시 체크박스 상태처리)
                $('[data-disabled]').attr('disabled', true).each(function () {
                    $('label[for="' + this.id + '"]').addClass('_disabled');
                });

                // Enable selected checkboxes(라디오버튼 클릭 시 체크박스 상태처리)
                $('[data-disabled="' + showKey + '"]').removeAttr('disabled').each(function () {
                    $('label[for="' + this.id + '"]').removeClass('_disabled');
                });
            });

            // 페이지 로드시 기본 라디오 체크 반영
            $('input[type="radio"][data-show]:checked').trigger('change');

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

    //셀렉트 선택 시 인풋의 디자인이 변경
    cp.selectBoxOptionShow = {
        init: function(){
            this.optionShow();
        },
        optionShow: function(){
            $('.option-group').each(function () {
                const $group = $(this);

                // select 요소 이벤트
                $group.find('select.select-sys').on('change', function () {
                    const selectedOption = $(this).find('option:selected');
                    const icoType = selectedOption.attr('ico-type'); // 예: ico-chk 또는 ico-rdo

                    // _ico가 붙은 .field 요소들
                    $group.find('.field._ico').each(function () {
                        const $field = $(this);

                        // 기존 ico-로 시작하는 클래스 제거
                        const currentClasses = $field.attr('class').split(' ');
                        const filteredClasses = currentClasses.filter(c => !c.startsWith('ico-'));
                        $field.attr('class', filteredClasses.join(' '));

                        // 새 ico-type 클래스 추가
                        if (icoType) {
                            $field.addClass(icoType);
                        }
                    });
                });
            });
        },
    },


    cp.init = function () {
        cp.uaCheck.init();
        cp.userIsTabbing.init();
        cp.tblCaption.init(); // table caption
        cp.formStatus.init();
        cp.form.init();
        cp.modalPop.init();
        cp.tab.init();
        cp.swiper8.init();
        cp.nav.init();
        cp.radio.init();
        cp.allCheck.init();
        cp.selectBoxOptionShow.init();
    };

    cp.init();
    return cp;
}(window.COMPONENT_UI || {}, jQuery));