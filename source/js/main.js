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
    $("#headNavbarContent").on('show.bs.collapse', function () {
        $("body").addClass("fixed-top");
    })
    $("#headNavbarContent").on('hidden.bs.collapse', function () {
        $("body").removeClass("fixed-top");
    })
    var navigationItems = $("[data-operate='SmoothScroll']");
    navigationItems.on("click", function (event) {
        event.preventDefault();
        smoothScroll($(this).attr("href"));
        if ($(".collapse-header").hasClass("show")) {
            $(".navbar-toggler").click();
        }
    });
}

function scrollOpacity() {
    $(window).scroll(function () {
        if ($(window).scrollTop() > $("#HOME").height() / 2) {
            $("#ABOUT").css("opacity", "1").addClass("fadeIn");
        };
        if ($(window).scrollTop() > $("#ABOUT").offset().top + $("#ABOUT").height() / 1.5) {
            $("#WORKS").css("opacity", "1").addClass("fadeIn");
        };
        if ($(window).scrollTop() > $("#WORKS").offset().top) {
            $(".footer").css("opacity", "1").addClass("fadeIn");
        };
    })
}