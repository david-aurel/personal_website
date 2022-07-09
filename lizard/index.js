window.onload = () => {
  /* DOM references */
  var lizardImg = document.getElementById("lizard-head");
  var lizardImgRadius = lizardImg.offsetWidth / 2;
  var lizardBodyImg = document.getElementById("lizard-body");
  var lizardFallback = document.getElementById("lizard-fallback");

  function deactivateFallback() {
    /* mouse, touchpad ... */
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
      lizardFallback.style.display = "none";
      lizardBodyImg.style.display = "inline-block";
      lizardImg.style.display = "inline-block";
    } else {
      return;
    }
  }
  deactivateFallback();

  /* updates the DOM */
  function update(updateParams) {
    var cursorLocation = updateParams.cursorLocation;
    var lizardLocation = updateParams.lizardLocation;

    var closestPointFromLizardCircumferenceToCursor =
      getCircumferenceIntersection({
        p1: cursorLocation,
        p2: lizardLocation,
        r: lizardImgRadius
      });
    var angleToCursor = getAngleFromPoints({
      p2: cursorLocation,
      p1: closestPointFromLizardCircumferenceToCursor
    });
    var isFacingLeft = angleToCursor > 235;
    var cantTurnNeckAnyMore = angleToCursor > 350 || angleToCursor < 120;
    if (cantTurnNeckAnyMore) return;
    lizardImg.style.transform =
      "rotate(" +
      angleToCursor +
      "deg) " +
      (isFacingLeft ? "scaleX(1)" : "scaleX(-1)");
  }

  /* gets closest point to cursor on lizard head circumference */
  function getCircumferenceIntersection(getCircumferenceIntersectionParamters) {
    var p1 = getCircumferenceIntersectionParamters.p1;
    var p2 = getCircumferenceIntersectionParamters.p2;
    var r = getCircumferenceIntersectionParamters.r;

    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var mag = Math.hypot(dx, dy);
    return {
      x: p2.x - (r * dx) / mag,
      y: p2.y - (r * dy) / mag
    };
  }

  /* calculates the angle between lizard head and cursor */
  function getAngleFromPoints(getAngleFromPointsParameters) {
    var p1 = getAngleFromPointsParameters.p1;
    var p2 = getAngleFromPointsParameters.p2;

    var atan = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    var rotated = atan + 90;
    var unsigned = rotated < 0 ? rotated + 360 : rotated;
    return unsigned;
  }

  var fps = 12; // how many times to fire the event per second
  var wait = false;
  window.addEventListener("mousemove", function (e) {
    if (!wait) {
      /* throttled */
      var cursorLocation = { x: e.clientX, y: e.clientY };
      var lizardLocation = {
        x: lizardImg.getBoundingClientRect().left + lizardImg.offsetWidth / 4,
        y: lizardImg.getBoundingClientRect().top + lizardImg.offsetHeight
      };
      update({
        cursorLocation: cursorLocation,
        lizardLocation: lizardLocation
      });
      /*---------------*/
      wait = true;
      setTimeout(function () {
        wait = false;
      }, 1000 / fps);
    }
  });
};
