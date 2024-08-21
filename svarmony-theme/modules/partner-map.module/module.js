const swiper = {
    setup: (parent, options = {}) => {
        return new Swiper(parent('.swiper').get(), {
            slidesPerView: options.onView || 1,
            spaceBetween: options.spacing || 0,
            allowTouchMove: options.touchMove || false,
            navigation: options.nav ? ({
                nextEl: parent('.next').get(),
                prevEl: parent('.prev').get(),
                disabledClass: "disabled"
            }) : false,
            ...options,
            on: options.on
        })
    },
    initClassName: (parent) => {
        parent('[data-swiper]').each((_, item) => {
            if ($(item).attr('data-swiper') == 'swiper')
                $(item).addClass('swiper')
            else
                $(item).addClass(`swiper-${$(item).attr('data-swiper')}`)
        })
    }
}

// $('.partner__listing-item').on('click', function () {
//     let index = $(this).index();
//     $('.partner__map-pointer').removeClass('active');
//     $('.partner__map-pointer').eq(index).addClass('active');
// })

$('[data-popup]').on('click', function (e) {
    let popup = {
        wrapper: $(this).closest('[data-popup="parent"]').find('.popup-wrapper'),
        inner: $(this).closest('[data-popup="parent"]').find('.popup-inner'),
        content: $(this).closest('[data-popup="parent"]').find('.popup-inner-content'),
    }
    if ($(this).attr('data-popup') === 'open') {
        e.preventDefault();
        popup.wrapper.addClass('active');
        requestAnimationFrame(() => $('.header').addClass('force'));
    }
    else if ($(this).attr('data-popup') === 'close') {
        e.preventDefault();
        if (!popup.wrapper.hasClass('active')) return;
        gsap.to(popup.inner, { y: 10 });
        setTimeout(() => {
            popup.wrapper.removeClass('active');
            $('.header').removeClass('force');
            popup.content.scrollTop(0);
            if ($(window).width() <= 767) {
                $('.partner__popup-content-row').removeClass('active');
                $('.partner__popup-content-row-content').slideUp();
            }
        }, 300)
    }
    else return;
})
$(window).on('click', (e) => {
    if (!$('.popup-inner:hover').length)
        if (!$('[data-popup="open"]:hover').length) {
            gsap.to('.popup-inner', { y: 10 });
            setTimeout(() => {
                $('.popup-wrapper').removeClass('active');
                $('.header').removeClass('force');
                $('.popup-inner-content').scrollTop(0);
                if ($(window).width() <= 767) {
                    $('.partner__popup-content-row').removeClass('active');
                    $('.partner__popup-content-row-content').slideUp();
                }
            }, 600)
        }
})

$('[data-popup="open"]').on('click', function (e) {
    let rootAttr = 'data-popup-content';
    let index = $(this).attr('data-popup-index');
    let contentWrap = $('.partner__listing-item').eq(index);

    // $('.partner__map-pointer').removeClass('active');
    // $('.partner__map-pointer').eq(index).addClass('active');

    [...contentWrap.find(`[${rootAttr}]`)].forEach((item) => {
        let replacer = $(item).attr(rootAttr);
        if (replacer.includes('thumbnail')) {
            $(`.partner__popup-content [${rootAttr}="${replacer}"] img`).attr('src', $(item).text());
        }
        else if (replacer.includes('logo')) {
            $(`.partner__popup-header [${rootAttr}="${replacer}"] img`).attr('src', $(item).find('img').attr('src'));
        }
        else if (replacer.includes('website')) {
            $(`.partner__popup-header [${rootAttr}="${replacer}"]`).attr('href', $(item).attr('href') || '#');
        }
        else {
            $(`.partner__popup-header [${rootAttr}="${replacer}"]`).html($(item).html())
            $(`.partner__popup-content [${rootAttr}="${replacer}"]`).html($(item).html())
        }
    })
});

$('.popup-inner-content').on("scroll", function () {
    const offset = $('.popup-inner-content').scrollTop();
    if (offset > 100) $(".popup-wrapper").addClass("on-scroll");
    else $(".popup-wrapper").removeClass("on-scroll");
});

const childrenSelect = (parent) => {
    return (child) => $(parent).find(child);
}
const popupAccordion = () => {
    console.log("active")
    const parent = childrenSelect('.partner__popup-content');
    const DOM = {
        accordion: parent('.partner__popup-content-row'),
        accordionTitle: parent('.partner__popup-content-row-title'),
        accordionContent: parent('.partner__popup-content-row-content')
    }
    parent(DOM.accordionContent).hide();
    function activeAccordion(index) {
        DOM.accordionContent.eq(index).slideToggle("slow");
        DOM.accordion.eq(index).toggleClass("active");

        DOM.accordionContent.not(DOM.accordionContent.eq(index)).slideUp("slow");
        DOM.accordion.not(DOM.accordion.eq(index)).removeClass("active");
    };

    DOM.accordionTitle.on("click", function () {
        let index = $(this).parent().parent().index();
        activeAccordion(index);
    })
}

const transformMapToCenterPoint = (index) => {
    const DOM = {
        pointers: $('.partner__map-pointer'),
        partners: $('.partner__listing-item')
    }
    let currPointer = DOM.pointers.eq(index);
    let currPartner = DOM.partners.eq(index);

    const container = $('.partner__map');
    const map = $('.partner__map-img img');

    const containerWidth = container.width();
    const containerHeight = container.height();

    const mapWidth = map.width();
    const mapHeight = map.height();

    const pointX = (parseFloat(currPointer.attr('data-x')) / 100) * mapWidth;
    const pointY = (parseFloat(currPointer.attr('data-y')) / 100) * mapHeight;

    const translateX = containerWidth / 2 - pointX;
    const translateY = containerHeight / 2 - pointY;
    let scaleMap = $(window).width < 768 ? 1.2 : 2;
    gsap
        .timeline()
        .to([map, '.partner__map-locations'], { scale: scaleMap * .5, duration: 0.4 })
        .to([map, '.partner__map-locations'], { x: translateX, y: (translateY + 20), scale: scaleMap, ease: 'expo.out', duration: 1.2,
            transformOrigin: `${currPointer.attr('data-x')}% ${currPointer.attr('data-y')}%`,
            onStart: () => {
               
                DOM.partners.removeClass('active');
                DOM.pointers.removeClass('active');
                currPointer.addClass('active');
                currPartner.addClass('active');
            }
        })
}

const scrollToPartner = () => {
    let currIndex = 0;
    const onUpdateProgress = (snaps, progress) => {
        for (let i = 0; i < snaps.length - 1; i++) {
            const startPoint = snaps[i];
            const endPoint = snaps[i + 1];
            if (startPoint <= progress && progress < endPoint) {
                if (currIndex !== i) {
                    currIndex = i;
                    transformMapToCenterPoint(currIndex);
                }
                break;
            }
        }
    }

    let mainDistance = $('.partner__listing-inner').outerHeight() - $('.partner__listing-item').last().outerHeight();

    const snapRatio = () => {
        let result = 0;

        return $('.partner__listing-item').get().reduce((acc, cur) => {
            let itemHeight = $(cur).outerHeight()
            result = result + itemHeight
            return acc.concat( parseFloat(result).toFixed(5));
        }, ['0'])
    }
    let listingHeight = $('.partner__listing').height() / 3

    transformMapToCenterPoint(0);

    let triggerPartnerSub = 15 + $(".partner__hero-sub").eq(1).height() * 3
    $('.sc-partner').height(mainDistance * 2)

    let tl = gsap.timeline()
    .to('.partner__hero-sub', {
        scrollTrigger: {
            trigger: '.sc-partner',
            start: `top+=15px top`,
            end: `top+=${triggerPartnerSub}px top`,
            scrub: true,
            // markers: true,
            onUpdate: () => {
                listingHeight = $('.partner__listing').height() / 3
            }
        },
        height: 0, ease: 'none'
    })
    .to('.partner__listing-inner', { 
        scrollTrigger: {
            trigger: '.sc-partner',
            start: `top+=${triggerPartnerSub}px top`,
            end: 'bottom bottom',
            scrub: true,
            // markers: true,
            onUpdate: (trigger) => {
                onUpdateProgress(snapRatio(), trigger.progress * mainDistance + listingHeight);
            }
        },
        y: -mainDistance, ease: 'none'
    })
}

const swiperPartner = () => {
    let parent = childrenSelect('.partner__hero')
    swiper.initClassName(parent);
    swiper.setup(parent, {
        onView: "auto",
        touchMove: true,
        on: {
            slideChange: (slide) => {
                let index = slide.realIndex;
                transformMapToCenterPoint(index);
             
            },
        
            init: () => {
                requestAnimationFrame(() => transformMapToCenterPoint(0));
            }
        }
    })
}

if ($(window).width() <= 767) {
    popupAccordion();
    swiperPartner();
}
else {
    scrollToPartner();
}
let firstScroll=false;
if ($(window).width() > 767) {
    $(window).on('scroll',function(){
        if(!firstScroll){
            transformMapToCenterPoint(0);
            if($('.partner__map-img .img-default').hasClass('dp-map-bg-init')){
                $('.partner__map-img .dp-map-bg-init').removeClass('dp-map-bg-init');
                $('.partner__map-img .dp-map-location-init').removeClass('dp-map-location-init');
            }
            firstScroll=true;
        }
    
    })
}
else{
const offsetElement=$('.partner__listing').offset().top+80;
console.log(offsetElement)
 $(window).on('scroll',function(){
    let scrollTop = $(window).scrollTop()+$(window).height();
    console.log(scrollTop)
        if(!firstScroll && scrollTop >= offsetElement){
            transformMapToCenterPoint(0);
            if($('.partner__map-img .img-default').hasClass('dp-map-bg-init')){
                $('.partner__map-img .dp-map-bg-init').removeClass('dp-map-bg-init');
                $('.partner__map-img .dp-map-location-init').removeClass('dp-map-location-init');
            }
            firstScroll=true;
        }
    
    })
}