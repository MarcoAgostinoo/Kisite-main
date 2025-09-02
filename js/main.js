
// Script para remover .html da URL em produção
if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    const currentPath = window.location.pathname;
    if (currentPath.endsWith(".html")) {
        const newPath = currentPath.replace(/\.html$/, "");
        // Redireciona para a URL limpa, substituindo o histórico para não criar entradas duplicadas
        window.history.replaceState({}, document.title, newPath);
    }
}
//explicação do código acima:
// window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1": Esta condição verifica se o site não está sendo executado localmente. Assim, o script só atuará quando o site estiver no GitHub Pages (ou em outro domínio).
// currentPath.endsWith(".html"): Verifica se a URL atual termina com .html.
// currentPath.replace(/\.html$/, ""): Remove a extensão .html do final da string.
// window.history.replaceState({}, document.title, newPath);: Esta é a parte crucial. Ela altera a URL na barra de endereço do navegador sem recarregar a página. O usuário verá a URL limpa, mas a página continua sendo a mesma (o arquivo .html foi carregado inicialmente).

   // NOVO CÓDIGO: Lazy Loading para os GIFs do Carrossel
    $(document).ready(function() {
        $('#carousel').on('slide.bs.carousel', function (event) {
            // event.relatedTarget é o slide que está prestes a ser exibido
            var nextSlide = $(event.relatedTarget);
            
            // Encontra a imagem dentro do próximo slide que precisa ser carregada
            var lazyGif = nextSlide.find('img.lazy-gif[data-src]');

            // Se encontrou uma imagem com o atributo 'data-src'
            if (lazyGif.length > 0) {
                // Pega o caminho do GIF
                var gifSrc = lazyGif.data('src');
                
                // Define o atributo 'src', o que faz o navegador começar a baixar o GIF
                lazyGif.attr('src', gifSrc);

                // Remove o atributo 'data-src' e a classe para não carregar novamente
                lazyGif.removeAttr('data-src').removeClass('lazy-gif');
            }
        });
    });

(function ($) {
    "use strict";

    // Initiate the wowjs
    new WOW().init();


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "73px");
        } else {
            $('.nav-bar').removeClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "0");
        }
    });


    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonial Slider
    $('.testimonial-slider').slick({
        infinite: true,
        autoplay: true,
        arrows: false,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.testimonial-slider-nav'
    });
    $('.testimonial-slider-nav').slick({
        arrows: false,
        dots: false,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: '22px',
        slidesToShow: 3,
        asNavFor: '.testimonial-slider'
    });
    $('.testimonial .slider-nav').css({ "position": "relative", "height": "160px" });


    // Blogs carousel
    $(".related-slider").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('filter-active');
        $(this).addClass('filter-active');

        portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });

})(jQuery);

/*	gallery */
$(document).ready(function () {

    $(".filter-button").click(function () {
        var value = $(this).attr('data-filter');

        if (value == "all") {
            $('.filter').show('1000');
        }
        else {
            $(".filter").not('.' + value).hide('3000');
            $('.filter').filter('.' + value).show('3000');

        }

        if ($(".filter-button").removeClass("active")) {
            $(this).removeClass("active");
        }
        $(this).addClass("active");
    });
});
/*	end gallery */

$(document).ready(function () {
    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });
});



