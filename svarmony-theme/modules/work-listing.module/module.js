function handleSelect(formID, onSelect) {
    const fieldChildSelect = (parent) => {
        return (child) => child ? $(parent).find(child) : parent;
    }

    $.fn.hasAttr = function(name) {
        return this.attr(name) !== undefined;
    };

    const dropdownAction = {
        open: (parent) => {
            const selector = (child) => parent ? parent(child) : $(`${formID} ${child}`);
            selector().addClass('active');
            selector('.dropdown-list').addClass('active');
            selector('.dropdown-toggle').addClass('active');
            selector('.dropdown-select').slideDown();
        },
        close: (parent) => {
            const selector = (child) => parent ? parent(child) : $(`${formID} ${child}`);
            selector().removeClass('active');
            selector('.dropdown-list').removeClass('active');
            selector('.dropdown-toggle').removeClass('active');
            selector('.dropdown-select').slideUp();
        },
        toggle: (parent) => {
            parent().toggleClass('active');
            $(`${formID} .dropdown-field`).not(parent()).removeClass('active');

            parent('.dropdown-list').toggleClass('active');
            $(`${formID} .dropdown-list`).not(parent('.dropdown-list')).removeClass('active');

            parent('.dropdown-toggle').toggleClass('active');
            $(`${formID} .dropdown-toggle`).not(parent('.dropdown-toggle')).removeClass('active');

            parent('.dropdown-select').slideToggle();
            $(`${formID} .dropdown-select`).not(parent('.dropdown-select')).slideUp();
        }
    }

    //disable keydown in dropdown field
    $(`${formID} .text-field.dropdown-field`).keydown(function(e) {
        e.preventDefault();
        return false;
    });
    $(`${formID} .text-field.dropdown-field`).prop('readonly', true);

    // on click the input field and toggle the dropdown
    $(`${formID} .dropdown-toggle`).on('click', function (e) {
        let parent = fieldChildSelect($(this).parents('.dropdown-field'));
        dropdownAction.toggle(parent);
    })

    // close all dropdown when click outside [!important close]
    if ($(window).width() > 476) {
        $(window).on('click', (e) => {
            if (!$('.dropdown-toggle:hover').length)
                if (!$('.dropdown-select:hover').length)
                    dropdownAction.close();
        })
    }

    // handle when choose select dropdown option
    $(`${formID} .dropdown-link`).on('click', function(e) {
        // if ($(this).attr('href', '#')) {
        //     e.preventDefault();
        // }
        const parent = fieldChildSelect($(this).parents('.dropdown-field'));
        let selectType = parent('.dropdown-select').attr('data-select-type');
        let valText = $(this).text().trim();

        switch (selectType) {
            case 'single': {
                parent('.text-field.dropdown-field').val(valText);
                parent('.text-field.dropdown-field').css('width', `${valText.length + 1 * .3}ch`)
                // dropdownAction.close(parent);
                break;
            }
            default: break;
        }
    })
}

handleSelect('#work-filter');

let input = $('.text-field.dropdown-field');
input.each((_, item) => {
    let inputVal = $(item).val();
    let aspectFS = $(window).width() > 991 ? 1.5 : .5;
    requestAnimationFrame(() => {
        $(item).css('width', `${inputVal.length + 1 * aspectFS}ch`);
    })
})


