if ($(window).width() < 767) {
    $('.event-listing__hero-filter').slideUp(()  => $('.event-listing__hero-filter').css('opacity', '1'));
    $('.event-listing__hero-filter--wrap').on('click', function () {
        $('.event-listing__hero-filter').slideToggle();
        $('.event-listing__hero-filter--wrap').toggleClass('active');
    })
}