// flatpickr-korea.js

(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    global.flatpickr = global.flatpickr || {};
    global.flatpickr.l10ns = global.flatpickr.l10ns || {};
    global.flatpickr.l10ns.ko = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  return {
    weekdays: {
      shorthand: ["일", "월", "화", "수", "목", "금", "토"],
      longhand: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    },
    months: {
      shorthand: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      longhand: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    },
    rangeSeparator: " ~ ",
    weekAbbreviation: "주",
    scrollTitle: "스크롤하여 증가",
    toggleTitle: "클릭하여 전환",
    ordinal: function () {
      return "일";
    },
    firstDayOfWeek: 1,
    time_24hr: true,
  };
});

// ✅ 접근성 속성 추가 함수
function addAccessibilityAttributes(instance) {
  const dayCells = instance.calendarContainer.querySelectorAll(".flatpickr-day");
  dayCells.forEach(day => {
    if (!day.classList.contains("nextMonthDay") && !day.classList.contains("prevMonthDay")) {
      day.setAttribute("role", "button");
      day.setAttribute("tabindex", "0");
    }
  });
}

// ✅ 연도 드롭다운 업데이트 함수 (id 중복 방지 포함)
// function updateYearDropdown(instance) {
//   const $yearInput = $(instance.yearElements[0]);
//   const $existingSelect = $yearInput.siblings(".year-select-dropdown");

//   if ($existingSelect.length === 0) return;

//   const selectedYear = instance.currentYear;
//   const currentYear = new Date().getFullYear();

//   const uniqueId = "year-select-" + (instance.element.name || Date.now());

//   const $newSelect = $("<select>")
//     .addClass("year-select-dropdown")
//     .attr("id", uniqueId); // ✅ 고유한 ID 부여

//   for (let y = currentYear - 50; y <= currentYear + 10; y++) {
//     $newSelect.append($("<option>", {
//       value: y,
//       text: y
//     }));
//   }

//   $newSelect.val(selectedYear);

//   $newSelect.on("change", function () {
//     instance.currentYear = parseInt(this.value);
//     instance.redraw();
//   });

//   $existingSelect.replaceWith($newSelect);
// }

function updateYearText(instance) {
  const $container = $(instance.calendarContainer);
  const $yearDisplay = $container.find(".year-display-text");
  if ($yearDisplay.length) {
    $yearDisplay.text(instance.currentYear);
  }
}

// ✅ 접근성 설정 대기 및 네비게이션 버튼 aria 설정
const waitForCalendar = setInterval(() => {
  const calendar = document.querySelector(".flatpickr-calendar");
  if (calendar) {
    calendar.setAttribute("role", "dialog");
    calendar.setAttribute("aria-modal", "true");
    calendar.setAttribute("aria-label", "날짜 선택기");
    calendar.setAttribute("tabindex", "0");

    const nextBtn = calendar.querySelector(".flatpickr-next-month");
    const prevBtn = calendar.querySelector(".flatpickr-prev-month");
    if (prevBtn) {
      prevBtn.setAttribute("aria-label", "이전 달");
      prevBtn.setAttribute("role", "button");
      prevBtn.setAttribute("tabindex", "0");
    }
    if (nextBtn) {
      nextBtn.setAttribute("aria-label", "다음 달");
      nextBtn.setAttribute("role", "button");
      nextBtn.setAttribute("tabindex", "0");
    }

    clearInterval(waitForCalendar);
  }
}, 100);



  
//   (function (global, factory) {
//   if (typeof module === "object" && typeof module.exports === "object") {
//     module.exports = factory();
//   } else {
//     global.flatpickr = global.flatpickr || {};
//     global.flatpickr.l10ns = global.flatpickr.l10ns || {};
//     global.flatpickr.l10ns.ko = factory();
//   }
// })(typeof window !== "undefined" ? window : this, function () { 

//   // 반환값: 로케일 데이터와 접근성 함수 같이 반환
//   return {
    
//     weekdays: {
//       shorthand: ["일", "월", "화", "수", "목", "금", "토"],
//       longhand: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
//     },
//     months: {
//       shorthand: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
//       longhand: [
//         "1",
//         "2",
//         "3",
//         "4",
//         "5",
//         "6",
//         "7",
//         "8",
//         "9",
//         "10",
//         "11",
//         "12",
//       ],
//     },
//     rangeSeparator: " ~ ",
//     weekAbbreviation: "주",
//     scrollTitle: "스크롤하여 증가",
//     toggleTitle: "클릭하여 전환",
//     ordinal: function () {
//       return "일";
//     },
//     firstDayOfWeek: 1,
//     time_24hr: true,
//   };
  
// });

// function addAccessibilityAttributes(instance) {
//     const dayCells = instance.calendarContainer.querySelectorAll(".flatpickr-day");
//     dayCells.forEach(day => {
//       if (
//         !day.classList.contains("nextMonthDay") &&
//         !day.classList.contains("prevMonthDay")
//       ) {
//         day.setAttribute("role", "button");
//         day.setAttribute("tabindex", "0");
//       }
//     });
//   }

//   // ✅ 전역 연도 드롭다운 업데이트 함수
//   function updateYearDropdown(instance) {
//     const $yearInput = $(instance.yearElements[0]);
//     const $existingSelect = $yearInput.siblings(".year-select-dropdown");

//     if ($existingSelect.length === 0) return;

//     const selectedYear = instance.currentYear;
//     const $newSelect = $("<select>").addClass("year-select-dropdown");
//     const currentYear = new Date().getFullYear();

//     for (let y = currentYear - 50; y <= currentYear + 10; y++) {
//       $newSelect.append($("<option>", {
//         value: y,
//         text: y
//       }));
//     }

//     $newSelect.val(selectedYear);

//     $newSelect.on("change", function () {
//       instance.currentYear = parseInt(this.value);
//       instance.redraw();
//     });

//     $existingSelect.replaceWith($newSelect);
//   }

//   // ✅ 접근성 속성 대기 후 설정
//   const waitForCalendar = setInterval(() => {
//     const calendar = document.querySelector(".flatpickr-calendar");
//     if (calendar) {
//       calendar.setAttribute("role", "dialog");
//       calendar.setAttribute("aria-modal", "true");
//       calendar.setAttribute("aria-label", "날짜 선택기");
//       calendar.setAttribute("tabindex", "0");

//       const nextBtn = calendar.querySelector(".flatpickr-next-month");
//       const prevBtn = calendar.querySelector(".flatpickr-prev-month");
//       if (prevBtn) {
//         prevBtn.setAttribute("aria-label", "이전 달");
//         prevBtn.setAttribute("role", "button");
//         prevBtn.setAttribute("tabindex", "0");
//       }
//       if (nextBtn) {
//         nextBtn.setAttribute("aria-label", "다음 달");
//         nextBtn.setAttribute("role", "button");
//         nextBtn.setAttribute("tabindex", "0");
//       }

//       clearInterval(waitForCalendar);
//     }
//   }, 100);