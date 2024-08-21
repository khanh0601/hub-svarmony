$('.header__ellipsis').on('click', function (e) {
    $('.header').toggleClass('open-nav');
    setTimeout(() => {
        $('.header__link-wrap').each((_, item) => {
            if (!$(item).hasClass('slide-down')) return;

            let listChild = $(item).find('.header__link-child');
            // listChild.slideUp({ start: $(item).removeClass('slide-down') })
        })
    }, 350)
})

$(window).on('click', (e) => {
    if (!$('.header__menu:hover').length)
        if (!$('.header__ellipsis:hover').length) {
            $('.header').removeClass('open-nav');
            setTimeout(() => {
                $('.header__link-wrap').each((_, item) => {
                    if (!$(item).hasClass('slide-down')) return;

                    let listChild = $(item).find('.header__link-child');
                    // listChild.slideUp({ start: $(item).removeClass('slide-down') })
                })
            }, 350);
        }
})

// if ($(window).width() < 991) {
//     $('.header__link-child').slideUp();
//     $('.header__link-wrap').on('click', function () {
//         let listChild = $(this).find('.header__link-child');
//         let dropdownIc = $(this).find('.header__link-ic');
//         listChild?.slideToggle({ start: dropdownIc && $(this).toggleClass('slide-down') });
//     })
// }
