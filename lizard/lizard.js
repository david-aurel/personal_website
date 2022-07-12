window.onload = () => {
  /* DOM references */
  var lizardHeadImg = document.getElementById("lizard-head");
  var lizardBodyImg = document.getElementById("lizard-body");

  /* updates the DOM */
  function update(updateParams) {
    var cursorLocation = updateParams.cursorLocation;
    var lizardLocation = updateParams.lizardLocation;

    var angleToCursor = getAngleFromPoints({
      p2: cursorLocation,
      p1: lizardLocation
    });
    var lizardBodyRotation = 60;
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

  /* calculates the angle between lizard head and cursor */
  function getAngleFromPoints(getAngleFromPointsParameters) {
    var p1 = getAngleFromPointsParameters.p1;
    var p2 = getAngleFromPointsParameters.p2;

    var atan = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    var rotated = atan + 90;
    var unsigned = rotated < 0 ? rotated + 360 : rotated;
    return Math.round(unsigned);
  }

  var fps = 12; // how many times to fire the event per second
  var wait = false;
  window.addEventListener("mousemove", function (e) {
    if (!wait) {
      /* throttled */
      var cursorLocation = { x: e.clientX, y: e.clientY };
      var lizardBoundingClientRect = lizardBodyImg.getBoundingClientRect();
      var lizardLocation = {
        x: lizardBoundingClientRect.left + lizardBoundingClientRect.width / 4,
        y: lizardBoundingClientRect.top + lizardBoundingClientRect.height / 2
      };
      update({
        cursorLocation: cursorLocation,
        lizardLocation: lizardLocation
      });
      /* -------- */
      wait = true;
      setTimeout(function () {
        wait = false;
      }, 1000 / fps);
    }
  });
};
