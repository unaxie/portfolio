function smoothScroll(target) {
    $('body, html').animate(
        { 'scrollTop': $(target).offset().top },
        600
    );
}

function goTop() {
    $('[data-role="pinTop"]').on('click', function () {
        smoothScroll($('body'));
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#backToTop').fadeIn("fast");
        } else {
            $('#backToTop').stop().fadeOut("fast");
        }
    });
}

function operateSideNav() {
    var navigationItems = $("[data-operate='SmoothScroll']");
    // updateNavigation();
    // $(window).on('scroll', function () {
    //     updateNavigation();
    // });

    navigationItems.on("click", function (event) {
        event.preventDefault();
        smoothScroll($(this).attr("href"));
        if ($(".collapse-header").hasClass("show")) {
            $(".navbar-toggler").click();
        }
    });
}

// function navMainControl() {
//     var windowWidth = $(document).width();
//     var navMainLg = '[attr-operate="nav-main-lg"]';
//     var navMainSm = '[attr-operate="nav-main-sm"]';
//     if (windowWidth >= 992) {
//         $(navMainLg + ':first-child>.nav-content').click();
//     } else {
//         $(navMainSm + '>.nav-content').on('click', function (e) {
//             e.preventDefault();
//             $(this).toggleClass('active').parents('.nav-main-sm').toggleClass('active')
//                 .siblings('.nav-main-sm').removeClass('active').children('.nav-content').removeClass('active');
//             $(this).children().children().children('i.fas').toggleClass('fa-minus').toggleClass('fa-plus');
//             $(navMainSm + '>.nav-content').not('.active').children().children().children('i.fas').addClass('fa-plus').removeClass('fa-minus');
//         });
//         $(navMainSm + ':first-child>.nav-content').click();
//     }
// }

// function navbarHeaderControl() {
//     $('.navbar-header>button.navbar-toggler').on('click', function () {
//         if ($(this).attr('aria-expanded') === 'true') {
//             $('body').removeClass('fixed-top');
//         } else {
//             $('body').addClass('fixed-top');
//         }
//     })
// }

// function navbarHeaderOperate() {
//     var navbarSm = '[attr-operate="navbar-sm"]';
//     var navMainSm = '[attr-operate="nav-main-sm"]';
//     $(navbarSm + '>.nav-link').on('click', function (e) {
//         e.preventDefault();
//         $('.navbar-header>button.navbar-toggler').click();
//         $('body').removeClass('fixed-top');
//         var thisTarget = $(this).attr('data-target');
//         if ($(thisTarget).hasClass('show')) {
//             smoothScroll($(thisTarget));
//         } else {
//             $(navMainSm + '>.nav-content' + '[data-target="' + thisTarget + '"]').click();
//             smoothScroll($(thisTarget));
//         }
//     })
// }