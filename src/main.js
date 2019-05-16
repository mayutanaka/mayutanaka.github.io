$(document).ready(function(){
    $('.page-fade').fadeIn();
    var validModal = document.body.contains(document.getElementById("construction"));
    if (validModal) {
      $('#construction').modal('show');
    }
});
