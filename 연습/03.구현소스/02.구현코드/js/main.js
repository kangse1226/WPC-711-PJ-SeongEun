
//  highlight 페이지 //
// 1. Swiper 함수//
const swiper = new Swiper('.mySwiper', {
    // 2. Swiper 작동에 필요한 옵션들을 설정합니다.
    slidesPerView: '2', // 슬라이드 개수를 자동으로 설정합니다. (부분적으로 보이게 할 때 유용)
    spaceBetween: 30,      // 슬라이드 사이 간격을 30px로 설정합니다.
    loop: true,            // 무한 루프 활성화 

    // 페이지네이션 (점들) 활성화
    pagination: {
        el: '.swiper-pagination',
        clickable: true, // 점을 클릭해서 이동 가능
    },

    // 네비게이션 버튼 (화살표) 활성화
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


//  페이지 //
// 1. Swiper 함수 //
const swiper2 = new Swipe2('.mySwiper2', {
    // 2. Swiper 작동에 필요한 옵션들을 설정합니다.
    slidesPerView: '2', // 슬라이드 개수를 자동으로 설정합니다. (부분적으로 보이게 할 때 유용)
    spaceBetween: 30,      // 슬라이드 사이 간격을 30px로 설정합니다.
    loop: true,            // 무한 루프 활성화 

    // 페이지네이션 (점들) 활성화
    pagination: {
        el: '.swiper2-pagination',
        clickable: true, // 점을 클릭해서 이동 가능
    },

    // 네비게이션 버튼 (화살표) 활성화
    navigation: {
        nextEl: '.swiper2-button-next',
        prevEl: '.swiper2-button-prev',
    },
});