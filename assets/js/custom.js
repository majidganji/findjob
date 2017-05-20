$(document).ready(function(){
    var owl = $(".owl-carousel");
    owl.owlCarousel({
        items: 1,
        loop: true,
        autoplay:true
    });

    tinymce.init({
        selector: '.tinymce',
        height: 350,
        menubar: false,
        plugins: [
            'advlist autolink lists  charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code'
        ],
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent ',
        content_css: '//www.tinymce.com/css/codepen.min.css',
        language: 'fa_IR',
        directionality: 'rtl'
    });
    var active = window.location.pathname;
    $('.nav.navbar-nav li a[href$="'+ active +'"]').parent().addClass('active');

});