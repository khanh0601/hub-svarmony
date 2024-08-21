// // We need to keep track of the last loaded page.
// // We'll declare the variable to start at page 2,
// // because the first load of posts will be of the second page
// let currPage = 1;

// // We also need to make sure that we have a variable
// // telling us if the last page we loaded was empty
// let blogOutOfPosts = false;

// let eventsUpcoming = $(".event-listing__upcoming-list");
// let eventsUpcomingBtn = $('.event-listing__upcoming-btn');
// let totalPage = eventsUpcomingBtn.attr('data-total-page');
// const updateBtnLoad = () => {
//     currPage += 1;
//     if (currPage <= totalPage) {
//         eventsUpcomingBtn.attr('href', `${eventsUpcomingBtn.attr('data-href-default')}/page/${currPage}`)
//     }
//     else {
//         eventsUpcomingBtn.remove();
//     }
// };
// updateBtnLoad();
// eventsUpcomingBtn.on('click', function (e) {
//     e.preventDefault();
//     let ajaxURL = $(this).attr('href');
//     $.get(ajaxURL, function (data) {
//         let page = $(data);
//         let events = page.find('.event-listing__upcoming-list .event__card');
//         if(events.length == 0) {
//             blogOutOfPosts = true;
//             return;
//         }
//         events.each(function() {
//             let eventPost = $(this);
//             gsap.set(eventPost, { y: 30, autoAlpha: 0 });
//             eventsUpcoming.append(eventPost);
//         });

//         gsap.to(events, { y: 0, autoAlpha: 1, ease: 'power2.out', stagger: .08, duration: 1 });
//         setTimeout(function(){
//             updateBtnLoad();
//         }, 100);
//     });
// })


// let eventsPast = $('.event-listing__past-list');
// $.get($('.event-listing__past-list').attr('data-href'), function (data) {
//     let page = $(data);
//     let events = page.find('.event-listing__upcoming-list .event__card');
//     events.each(function() {
//         let eventPost = $(this);
//         eventsPast.append(eventPost);
//     });
// });