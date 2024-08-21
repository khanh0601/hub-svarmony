$('[data-popup]').on('click', function (e) {
    let popup = {
        wrapper: $(this).closest('[data-popup="parent"]').find('.popup-wrapper'),
        inner: $(this).closest('[data-popup="parent"]').find('.popup-inner'),
        content: $(this).closest('[data-popup="parent"]').find('.popup-inner-content'),
    }
    if ($(this).attr('data-popup') === 'open') {
        e.preventDefault();
        popup.content.scrollTop(0);
        gsap.set(popup.inner, { y: 0 });
        gsap.from(popup.inner, { y: 5 });
        popup.wrapper.addClass('active');
        requestAnimationFrame(() => $('.header').addClass('force'));
    }
    else if ($(this).attr('data-popup') === 'close') {
        e.preventDefault();
        if (!popup.wrapper.hasClass('active')) return;
        gsap.set(popup.inner, { y: 0 });
        gsap.to(popup.inner, { y: 5 });
        setTimeout(() => {
            popup.wrapper.removeClass('active');
            $('.header').removeClass('force');
        }, 200)
    }
    else return;
})

const childrenSelect = (parent) => {
    return (child) => $(parent).find(child);
}

$('.agenda_popup-timeline-item').each((_, item) => {
    const parent = childrenSelect(item);
    const DOM = {
        accordion: parent('.accordion'),
        accordionTitle: parent('.accordion-title'),
        accordionContent: parent('.accordion-content')
    }
    parent(DOM.accordionContent).hide();
    function activeAccordion(index) {
        DOM.accordionContent.eq(index).slideToggle(800);
        DOM.accordion.eq(index).toggleClass("active");

        DOM.accordionContent.not(DOM.accordionContent.eq(index)).slideUp(800);
        DOM.accordion.not(DOM.accordion.eq(index)).removeClass("active");
    };

    DOM.accordionTitle.on("click", function () {
        let index = $(this).parent().index();
        activeAccordion(index - 1);
    })
});