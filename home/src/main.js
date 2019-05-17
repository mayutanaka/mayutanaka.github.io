var subnavs = ['skills', 'education', 'experience', 'extracurriculars'];
var previous;

$(document).ready(function(){
    $('.page-fade').fadeIn();
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
});
