var paused = true;
var active = true;
var ticker = 0;
var progress = 0;
var interval, workout, rest, tick;

$(function() {
  var pauseIcon = '<i class="fas fa-pause"></i>';
  var pauseCircle = '<i class="fas fa-pause-circle"></i>';
  var playIcon = '<i class="fas fa-play-circle"></i>';

  function start() {
    $("#input-params").hide();
    $("#control-bar").show();
    $("#timer").show();
  };

  function runtime() {
    var span = active ? interval : rest;
    if (progress == workout) {
      sound("finish");
      updateDisplay();
      return;
    }
    if (ticker == span) {
      if (!active) { progress++; }
      sound("signal");
      updateDisplay();
      ticker = 0;
      active = !active;
    }
    if (span-ticker <= 5) {
      sound("countdown");
    }
    updateDisplay();
    ticker++;
    tick = setTimeout(runtime, 1000);
  };

  function run() {
    interval = $("#input-interval").val();
    workout = $("#input-workout").val();
    rest = $("#input-rest").val();
    if (paused) {
      paused = false;
      runtime();
    } else {
      clearTimeout(tick);
      paused = true;
      updateDisplay();
    }
  };

  function updateDisplay(){
    var timer = active ? $("#timer-active") : $("#timer-rest");
    var span = active ? interval : rest;
    if (span-ticker > 9) {
      timer.html(":"+(span-ticker).toString());
    } else {
      timer.html(":0"+(span-ticker).toString());
    }
    if (!active) {
      $("#timer-active").html("REST");
      timer.show();
    } else {
      $("#timer-rest").hide();
    }
    if (paused) {
      $("#button-pause").html(playIcon);
      $("#timer-active").html(pauseIcon);
      $("#timer-rest").hide();
    } else {
      $("#button-pause").html(pauseCircle);
    }
  };

  function sound(key) {
    var file = "src/";
    switch(key) {
      case "countdown":
        file += "beep.mp3";
        break;
      case "signal":
        file += "ding.mp3";
        break;
      case "finish":
        file += "done.mp3";
      default:
        break;
    }
    new Audio(file).play();
  };

  function reset() {
    clearTimeout(tick);
    ticker = 0;
    progress = 0;
    paused = true;
    active = true;
    $("#input-params").show();
    $("#control-bar").hide();
    $("#timer").hide();
    return;
  };

  $("#button-start").click(function() {
    start();
    run();
  });
  $("#button-reset").click(function() { reset() });
  $("#button-pause").click(function() { run() });
  $('body').keyup(function(e) {
    if (e.keyCode == 32 && ticker > 0) { run(); } // pressed space
    if (e.keyCode == 13 && progress == 0) { // pressed enter
      start();
      run();
    }
  });
});
