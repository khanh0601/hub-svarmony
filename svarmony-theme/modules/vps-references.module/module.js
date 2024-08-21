let swiper =new Swiper('.vps-solution-swiper',{
    slidesPerView: 1,
    navigation: {
        nextEl: ".vps-solution-control-next",
        prevEl: ".vps-solution-control-prev",
      },
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      on: {
        slideChange: function () {
          $(".vps-solution-control-txt-number-current").text(
            this.realIndex + 1
          );
        },
    }
})
let total = $('.vps-solution-swiper .swiper-slide').length;
$('.vps-solution-control-txt-number-total').text(total)