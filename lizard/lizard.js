var lizardRotation = -90;

window.onload = () => {
  var lizard = {
    headImg: document.getElementById("lizard-head"),
    bodyImg: document.getElementById("lizard-body"),
    headLocation: document.getElementById("lizard-head-location"),
    offsetRotation: lizardRotation
  };

  window.addEventListener("mousemove", function (event) {
    throttled(() => update({ event, lizard }));
  });
  window.addEventListener("touchstart", function (event) {
    update({ event, lizard });
  });
  window.addEventListener("touchmove", function (event) {
    throttled(() => update({ event, lizard }));
  });
};

/* updates the DOM */
function update(triggerUpdateParameters) {
  var event = triggerUpdateParameters.event;
  var lizard = triggerUpdateParameters.lizard;

  var cursorLocation =
    event.touches !== undefined
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : {
          x: event.clientX,
          y: event.clientY
        };
  var lizardBoundingClientRect = lizard.headLocation.getBoundingClientRect();
  var lizardLocation = {
    x: lizardBoundingClientRect.left,
    y: lizardBoundingClientRect.top
  };

  /* by "shifting" the point between 0deg and 360deg to the back of the
  lizard, we maintain a smooth css transform animation */
  var distributedOffsetRotation =
    lizard.offsetRotation > 180
      ? lizard.offsetRotation - 360
      : lizard.offsetRotation;

  var angleToCursor =
    getAngleFromPoints({
      p2: cursorLocation,
      p1: lizardLocation
    }) - distributedOffsetRotation;

  var distributedAngle =
    angleToCursor > 180 ? angleToCursor - 360 : angleToCursor;

  var isFacingLeft = distributedAngle < 0;
  var cantTurnNeckAnyMore = distributedAngle > 170 || distributedAngle < -140;
  if (cantTurnNeckAnyMore) return;

  lizard.headImg.style.transform =
    "rotate(" +
    distributedAngle +
    "deg) " +
    (isFacingLeft ? "scaleX(-1)" : "scaleX(1)");
}

/* calculates the angle between lizard head and cursor */
function getAngleFromPoints(getAngleFromPointsParameters) {
  var p1 = getAngleFromPointsParameters.p1;
  var p2 = getAngleFromPointsParameters.p2;

  var atan = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  var rotated = atan + 90;
  var unsigned = rotated < 0 ? rotated + 360 : rotated;
  return Math.round(unsigned);
}

/* Throttle callback */
var fps = 12; // how many times to fire the event per second
var wait = false;
function throttled(callback) {
  if (!wait) {
    callback();
    wait = true;
    setTimeout(function () {
      wait = false;
    }, 1000 / fps);
  }
}
