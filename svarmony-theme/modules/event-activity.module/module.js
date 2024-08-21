const activeFade = (index) => {
    $('.event__activity-listing-img').removeClass('active');
    $('.event__activity-listing-img').eq(index).addClass('active');

    $('.event__activity-item').removeClass('active');
    $('.event__activity-item').eq(index).addClass('active');
}
$('.event__activity-item').on('mouseenter', function (e) {
    e.preventDefault();
    let index = $(this).index();
    activeFade(index)
})
activeFade(0);