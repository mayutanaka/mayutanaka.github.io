var subnavs = ['skills', 'education', 'experience', 'extracurriculars'];
var previous;

$(document).ready(function(){
    $(function() {
      $('body').removeClass('fade-out');
    });
    // $('.page-fade').fadeIn();
    var validModal = document.body.contains(document.getElementById("construction"));
    if (validModal) {
      $('#construction').modal('show');
    }

    subnavs.forEach(function(current) {
      $("#nav-"+current).click(function() {
        if(previous) { document.getElementById("nav-"+previous).classList.remove("sub-select") }
        document.getElementById("nav-"+current).classList.add("sub-select");
        previous = current;
      });
    });

    var thisPage = document.URL.split('/');
    if (thisPage[thisPage.length-1]=='about-me.html') {
      $('#bio-carousel').carousel('pause');
    }

//https://css-tricks.com/snippets/jquery/smooth-scrolling/
    // Select all links with hashes
    $('a[href*="#"]')
      // Remove links that don't actually link to anything
      .not('[href="#"]')
      .not('[href="#0"]')
      .click(function(event) {
        // On-page links
        if (
          location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
          &&
          location.hostname == this.hostname
        ) {
          // Figure out element to scroll to
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          // Does a scroll target exist?
          if (target.length) {
            // Only prevent default if animation is actually gonna happen
            event.preventDefault();
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 1000, function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) { // Checking if the target was focused
                return false;
              } else {
                $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              };
            });
          }
        }
      });
});
