/* calculates the angle between lizard head and cursor */
function getAngleFromPoints(getAngleFromPointsParameters) {
  var p1 = getAngleFromPointsParameters.p1;
  var p2 = getAngleFromPointsParameters.p2;

  var atan = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  var rotated = atan + 90;
  var unsigned = rotated < 0 ? rotated + 360 : rotated;
  return Math.round(unsigned);
}
/* updates the DOM */
function update(triggerUpdateParameters) {
  var event = triggerUpdateParameters.event;
  var lizardHeadImg = triggerUpdateParameters.lizardHeadImg;
  var lizardBodyImg = triggerUpdateParameters.lizardBodyImg;
  var lizardBodyRotation = triggerUpdateParameters.lizardBodyRotation;

  var cursorLocation =
    event.touches !== undefined
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : {
          x: event.clientX,
          y: event.clientY
        };
  var lizardBoundingClientRect = lizardBodyImg.getBoundingClientRect();
  var lizardLocation = {
    x: lizardBoundingClientRect.left + lizardBoundingClientRect.width / 4,
    y: lizardBoundingClientRect.top + lizardBoundingClientRect.height / 2
  };

  var angleToCursor = getAngleFromPoints({
    p2: cursorLocation,
    p1: lizardLocation
  });
  var lizardHeadRotationRelativeToPage = lizardBodyRotation + angleToCursor;
  var isFacingLeft = angleToCursor > 235;
  var cantTurnNeckAnyMore = angleToCursor > 350 || angleToCursor < 120;
  if (cantTurnNeckAnyMore) return;

  lizardHeadImg.style.transform =
    "rotate(" +
    lizardHeadRotationRelativeToPage +
    "deg) " +
    (isFacingLeft ? "scaleX(1)" : "scaleX(-1)");
}

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

window.onload = () => {
  /* DOM references */
  var lizardHeadImg = document.getElementById("lizard-head");
  var lizardBodyImg = document.getElementById("lizard-body");

  var lizardBodyRotation = 60;

  window.addEventListener("mousemove", function (event) {
    throttled(() =>
      update({ event, lizardHeadImg, lizardBodyImg, lizardBodyRotation })
    );
  });
  window.addEventListener("touchstart", function (event) {
    udpate({ event, lizardHeadImg, lizardBodyImg, lizardBodyRotation });
  });
  window.addEventListener("touchmove", function (event) {
    throttled(() =>
      update({ event, lizardHeadImg, lizardBodyImg, lizardBodyRotation })
    );
  });
};
