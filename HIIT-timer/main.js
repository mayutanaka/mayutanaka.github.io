var paused = true;
var active = true;
var ticker = 0;
var progress = 0;
var interval, workout, rest, tick;

$(function() {
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
  }

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
      $("#button-pause").html("RESUME");
      $("#timer-active").html("PAUSED");
      $("#timer-rest").hide();
    } else {
      $("#button-pause").html("PAUSE");
    }
  };

  function sound(key) {
    switch(key) {
      case "countdown":
        new Audio('beep.mp3').play();
        break;
      case "signal":
        new Audio('ding.mp3').play();
        break;
      case "finish":
        new Audio('done.mp3').play();
      default:
        break;
    }
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
    return;
  });
  $("#button-reset").click(function() {
    reset();
    return;
  });
  $("#button-pause").click(function() {
    run();
    return;
  });

});
