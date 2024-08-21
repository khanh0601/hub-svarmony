const script = () => {
  let lenis = new Lenis({});
  function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf);

  gsap.fromTo('.grid-line--wrap.ver .grid-line', { top: -50 }, { top: 0, repeat: -1, duration: 4, ease: 'none' });
  if ($(window).width() <= 476) {
    $('.work-listing-filter-main').css('top', $('.event-header__container').height());
    $('.work-listing-filter-main').slideUp('fast', () => $('.work-listing-filter-main').addClass('ready'));

    $('.work-listing-popup-open').on('click', function (e) {
      if (!$('.work-listing-filter-main').hasClass('ready')) return;
        requestAnimationFrame(() => {
            if (!$('.work-listing-filter-main').hasClass('active')) {
              $('.work-listing-filter-main').slideDown("slow");
              $('.popup-overlay').addClass('active');
              $('.work-listing-filter-main').addClass('active');
              lenis.stop();
            }
        })
    })

    $('.work-listing-popup-close').on('click', function (e) {
      if ($('.work-listing-filter-main').hasClass('active')) {
          $('.work-listing-filter-main').slideUp("slow");
          $('.popup-overlay').removeClass('active');
          $('.work-listing-filter-main').removeClass('active');
          lenis.start();
      }
    })

    $(window).on('click', (e) => {
        if (!$('.work-listing-filter-main:hover').length)
            $('.work-listing-filter-main').slideUp("slow");
            $('.popup-overlay').removeClass('active');
            $('.work-listing-filter-main').removeClass('active');
            lenis.start();
    })
  }
  const partnerScroll = () => {
    const DOM = {
      pointers: $('.partner__map-pointer'),
      partners: $('.partner__listing-item')
    }
    let currIndex = 0;

    const transformMapToCenterPoint = (index) => {
      let currPointer = DOM.pointers.eq(index);
      let currPartner = DOM.partners.eq(index);

      const container = $('.partner__map');
      const map = $('.partner__map-img');
      const containerRect = map.get(0).getBoundingClientRect();

      const containerWidth = container.width();
      const containerHeight = container.height();
      const mapWidth = map.width();
      const mapHeight = map.height();

      const pointX = (parseFloat(currPointer.attr('data-x')) / 100) * mapWidth;
      const pointY = (parseFloat(currPointer.attr('data-y')) / 100) * mapHeight;

      const translateX = containerWidth / 2 - pointX;
      const translateY = containerHeight / 2 - pointY;

      gsap
        .timeline()
        // .to(map, { x: translateX, y: translateY, ease: 'expo.out' })
        .to(map, { x: translateX, y: translateY, ease: 'expo.out', onComplete: () => {
            DOM.partners.removeClass('active');
            DOM.pointers.removeClass('active');
            currPointer.addClass('active');
            currPartner.addClass('active');
          }
        })
    }
    transformMapToCenterPoint(0);
    lenis.on('scroll', (inst) => {
        for (let i = 0; i < DOM.partners.length; i++) {
            let top = DOM.partners.eq(i).get(0).getBoundingClientRect().top;
            if (top > 0 && top < ($(window).height() * .6)) {
                  transformMapToCenterPoint(i);
            }
        }
    })
  }
  // partnerScroll();

  // Gets all instances of video modules that have "Video type" set to "Embed"
  const oembedContainers = document.getElementsByClassName('oembed_container');
  const embedContainers = document.getElementsByClassName('embed_container');
  const hubspotVidContainers = document.getElementsByClassName('hubspotvideo_container');

  // Function for "Embed type" of "Embed URL"
  function loadOEmbed(container) {
    const embedContainer = container;
    const iframeWrapper = embedContainer.querySelector('.iframe_wrapper');
    const customThumbnail = embedContainer.querySelector('.oembed_custom-thumbnail');
    const url = iframeWrapper.dataset.embedUrl;

    if (url) {
      function setIframe(data) {
        let {
          maxHeight,
          maxWidth,
          height,
          width,
        } = iframeWrapper.dataset;
        maxHeight = maxHeight !== undefined && !maxHeight ? data.height : maxHeight;
        maxWidth = maxWidth !== undefined && !maxWidth ? data.width : maxWidth;
        height = height !== undefined && !height ? data.height : height;
        width = width !== undefined && !width ? data.width : width;
        const el = document.createElement('div');
        el.innerHTML = data.html;
        const iframe = el.firstChild;
        iframe.setAttribute("class", "oembed_container_iframe");
        iframe.setAttribute("title", data.title);
        if (customThumbnail) {
          customThumbnail.onclick = function() {
            const iframeSrc = new URL(iframe.src);
            iframeSrc.searchParams.append('autoplay', 1);
            iframe.src = iframeSrc.toString();
            this.classList.add('hide');
            // this.setAttribute('class', 'oembed_custom-thumbnail--hide');
            iframeWrapper.appendChild(iframe);
          };
        } else {
          iframeWrapper.appendChild(iframe);
        }
        if (maxHeight) {
          const maxHeightStr = maxHeight.toString(10) + "rem";
          embedContainer.style.maxHeight = maxHeightStr;
          iframe.style.maxHeight = maxHeightStr;
          if (customThumbnail) {
            customThumbnail.style.maxHeight = maxHeightStr;
          }
        }
        if (maxWidth) {
          const maxWidthStr = maxWidth.toString(10) + "rem";
          embedContainer.style.maxWidth = maxWidthStr;
          iframe.style.maxWidth = maxWidthStr;
          if (customThumbnail) {
            customThumbnail.style.maxWidth = maxWidthStr;
          }
        }
        if (height) {
          const heightStr = height.toString(10) + "rem";
          embedContainer.style.height = heightStr;
          iframe.style.height = heightStr;
          if (customThumbnail) {
            customThumbnail.style.height = heightStr;
          }
        }
        if (width) {
          const widthStr = width.toString(10) + "rem";
          embedContainer.style.width = widthStr;
          iframe.style.width = widthStr;
          if (customThumbnail) {
            customThumbnail.style.width = widthStr;
          }
        }
      }
      const embedResponse = {
        html: iframeWrapper.dataset.embedResponseHtml,
        width: iframeWrapper.dataset.embedResponseWidth,
        height: iframeWrapper.dataset.embedResponseHeight
      };
      if (embedResponse.html) {
        setIframe(embedResponse);
        return;
      }

      const request = new XMLHttpRequest();
      const requestUrl = "/_hcms/oembed?url=" + encodeURIComponent(url) + "&autoplay=0";
      request.open('GET', requestUrl, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          setIframe(data);
        } else {
          console.error('Server reached, error retrieving results.');
        }
      };
      request.onerror = function() {
        console.error('Could not reach the server.');
      };
      request.send();

    }
  }

  // Function for "Embed type" of "Embed code"
  function loadEmbed(container) {
    const embedContainer = container;
    const iframe = embedContainer.querySelector('.iframe_wrapper iframe');

    const maxHeight = iframe.getAttribute('height');
    const maxWidth = iframe.getAttribute('width');

    if (maxHeight !== null ) {
      const heightStr = maxHeight.toString(10) + "rem";
      embedContainer.style.maxHeight = heightStr;
    } else {
      iframe.style.height = '100%';
    }

    if (maxWidth !== null) {
      const widthStr = maxWidth.toString(10) + "rem";
      embedContainer.style.maxWidth = widthStr;
    } else {
      iframe.style.width = '100%';
    }
  }

  function loadHubspotVid(container) {
    const customThumbnail = container.querySelector('.oembed_custom-thumbnail');
    if (customThumbnail) {
      let requestId;
      const loop = (time) => {
          requestId = undefined;

          hideThumbnail();
          start();
          if ($('[data-hsv-status]').attr('data-hsv-status') === 'playing') {
              stop();
          }
      }
      const start = () => {
            if (!requestId) {
                requestId = window.requestAnimationFrame(loop);
            }
      }
      const stop = () => {
        if (requestId) {
          window.cancelAnimationFrame(requestId);
          requestId = undefined;
        }
      }
      const hideThumbnail = () => {
          if ($('[data-hsv-status]').length !== 0) {
            if ($('[data-hsv-status]').attr('data-hsv-status') === 'playing') {
              customThumbnail.classList.add('hide');
            }
          }
      }

      const observerVid = new IntersectionObserver(
          ([e]) => {
              if (e.isIntersecting) {
                  start();
                  observerVid.unobserve(e.target);
              }
        });
        observerVid.observe(container);
    }
  }

  // Check to only run oembed script if video module with "Embed type" of "Embed URL" is present
  if (oembedContainers.length !== 0) {
    Array.prototype.forEach.call(oembedContainers, function(el) {
      loadOEmbed(el);
    });
  }

  // Check to only run embed script if video module with "Embed type" of "Embed code" is present
  if (embedContainers.length !== 0) {
    Array.prototype.forEach.call(embedContainers, function(el) {
      loadEmbed(el);
    });
  }

  if (hubspotVidContainers.length !== 0) {
    Array.prototype.forEach.call(hubspotVidContainers, function(el) {
      loadHubspotVid(el);
    });
  }
}
window.onload = script;