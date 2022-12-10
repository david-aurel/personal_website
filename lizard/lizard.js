var lizardPage = "#projects";
var lizardIsActive = false
var lizardRotation = 0;
var maxSpriteFrame = 19;
var spriteWidth = 150;
var spriteHeight = 220;
var spriteColumns = 5;
var movementSpeed = 2; /* lower number => faster */
var walkingSpeed = 3; /* lower number => faster */

window.onload = function () {
  var page = document.querySelector(lizardPage)
  var lizardButton = document.getElementById("lizard-button")
  var lizard = {
    headImg: document.getElementById("lizard-head"),
    headLocation: document.getElementById("lizard-head-location"),
    outerContainer: document.getElementById("lizard-outer-container"),
    innerContainer: document.getElementById("lizard-inner-container"),
    offsetRotation: lizardRotation
  };
  var canvasNode = document.getElementById("lizard-body-canvas");
  var canvas = {
    context: canvasNode.getContext("2d"),
    width: canvasNode.width,
    heigth: canvasNode.height,
    sprite: document.getElementById("lizard-sprite"),
    spriteHeight,
    spriteWidth,
    spriteColumns,
    lizardHeadImg: lizard.headImg,
    lizardFallbackImg: document.getElementById("lizard-fallback")
  };
  var lizardInitialLocation = getLocation(lizard.outerContainer, page);

  initiateCanvas(canvas);

  var listeners = {
    click: function (event) {
      walkToLocation({
        event,
        lizard,
        lizardInitialLocation,
        canvas,
        page
      });
    },
    mouseMove: function (event) {
      throttled(function () {
        rotateHead({ event, lizard, page });
      });
    },
    touchstart: function (event) {
      throttled(function () {
        rotateHead({ event, lizard, page });
      });
    },
    touchend: function (event) {
      walkToLocation({
        event,
        lizard,
        lizardInitialLocation,
        canvas,
        page,
      });
    },
    touchmove: function (event) {
      throttled(function () {
        rotateHead({ event, lizard, page });
      });
    },
    lizardButton: {
      element: lizardButton,
      click: function () {
        lizardIsActive = !lizardIsActive
        lizardButton.innerHTML = lizardIsActive ? "turn lizard off" : "turn lizard on"
      }
    }
  };

  /* only make the lizard interactive when on the lizard page*/
  var eventListenersActive = false;
  if (window.location.hash === lizardPage || window.location.hash === "") {
    eventListenersActive = true;
    addEventListeners(listeners);
  }
  window.addEventListener("hashchange", function () {
    if (window.location.hash === lizardPage && !eventListenersActive) {
      eventListenersActive = true;
      addEventListeners(listeners);
    }
    if (window.location.hash !== lizardPage && eventListenersActive) {
      eventListenersActive = false;
      removeEventListeners(listeners);
    }
  });
};

/* updates the DOM */
function rotateHead(triggerUpdateParameters) {
  var event = triggerUpdateParameters.event;
  var lizard = triggerUpdateParameters.lizard;
  var page = triggerUpdateParameters.page

  var cursorLocation = getCursorLocation(event, page);
  var lizardLocation = getLocation(lizard.headLocation, page);

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

var timeOutId;
var intervalId;
var frame = 0;
/* Updates the DOM */
function walkToLocation(walkToLocationParameters) {
  if (!lizardIsActive) return
  var event = walkToLocationParameters.event;
  var lizard = walkToLocationParameters.lizard;
  var lizardInitialLocation = walkToLocationParameters.lizardInitialLocation;
  var canvas = walkToLocationParameters.canvas;
  var page = walkToLocationParameters.page

  var cursorLocation = getCursorLocation(event, page);
  var lizardLocation = getLocation(lizard.headLocation, page);

  var angleToCursor = getAngleFromPoints({
    p2: cursorLocation,
    p1: lizardLocation
  });

  /* Given an angle, calculates how much to offset the rectangle
    that represents the lizard so that it always seem to travels
    the least distance.
    This is what happens when you suck at math
  */
  var offsetWidth = 0;
  var offsetHeight = 0;
  var lizardWidth = lizard.outerContainer.offsetWidth;
  var lizardHeight = lizard.outerContainer.offsetHeight;
  if (angleToCursor > 315 && angleToCursor < 360) {
    /* cursor is on top/left of lizard */
    var normalizeValue = 315;
    var normalized = angleToCursor - normalizeValue;
    offsetWidth = (lizardWidth / 2) * (normalized / 45);
    offsetHeight = 0;
  } else if (angleToCursor < 45) {
    /* cursor is on top/right of lizard */
    offsetWidth = (lizardWidth / 2) * (angleToCursor / 45) + lizardWidth / 2;
    offsetHeight = 0;
  } else if (angleToCursor > 45 && angleToCursor < 135) {
    /* cursor is right to lizard */
    var normalizeValue = 45;
    var normalized = angleToCursor - normalizeValue;
    offsetWidth = lizardWidth;
    offsetHeight = lizardHeight * (normalized / 90);
  } else if (angleToCursor > 135 && angleToCursor < 225) {
    /* cursor is below lizard */
    var normalizeValue = 135;
    var normalized = angleToCursor - normalizeValue;
    offsetWidth = lizardHeight * (1 - normalized / 90);
    offsetHeight = lizardHeight;
  } else if (angleToCursor > 225 && angleToCursor < 315) {
    /* cursor is left to lizard */
    var normalizeValue = 225;
    var normalized = angleToCursor - normalizeValue;
    offsetWidth = 0;
    offsetHeight = lizardHeight * (1 - normalized / 90);
  }

  lizard.outerContainer.style.transform =
    "translate(" +
    Math.round(
      cursorLocation.x -
      lizardLocation.x +
      lizardLocation.x -
      lizardInitialLocation.x -
      offsetWidth
    ) +
    "px" +
    ", " +
    Math.round(
      cursorLocation.y -
      lizardLocation.y +
      lizardLocation.y -
      lizardInitialLocation.y -
      offsetHeight
    ) +
    "px)";

  var distance = Math.hypot(
    lizardLocation.x - cursorLocation.x,
    lizardLocation.y - cursorLocation.y
  );
  const transitionTime = distance * walkingSpeed;
  lizard.outerContainer.style.transition =
    "transform " + transitionTime + "ms linear";

  /* if the lizard is already walking, cancel the timeout
    that would stop the walking */
  if (timeOutId) {
    clearTimeout(timeOutId);
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    frame++;
    if (frame === maxSpriteFrame) frame = 0;
    walkingAnimationFrame(canvas);
  }, movementSpeed * 10);

  timeOutId = setTimeout(function () {
    clearInterval(intervalId);
  }, transitionTime);

  var transformStyle = lizard.innerContainer.style.transform;
  var currentRotation = transformStyle
    ? parseInt(transformStyle.match(/(\d+)/gi))
    : 0;

  var differenceRaw = ((angleToCursor - currentRotation + 180) % 360) - 180;
  var difference = differenceRaw < -180 ? differenceRaw + 360 : differenceRaw;
  lizard.innerContainer.style.transform =
    "rotate(" + (currentRotation + difference) + "deg)";
  lizard.offsetRotation = angleToCursor;
  rotateHead({ event, lizard, page });
}

function getCursorLocation(event, page) {
  switch (event.type) {
    case "touchend": {
      const lastTouch = event.changedTouches[event.changedTouches.length - 1];
      return {
        x: lastTouch.clientX + page.scrollLeft,
        y: lastTouch.clientY + page.scrollTop
      };
    }
    case "touchmove": {
      return { x: event.touches[0].clientX + page.scrollLeft, y: event.touches[0].clientY + page.scrollTop };
    }
    default: {
      return {
        x: event.pageX + page.scrollLeft,
        y: event.pageY + page.scrollTop,
      };
    }
  }
}

function getLocation(node, page) {
  var nodeClientRect = node.getBoundingClientRect();
  return {
    x: nodeClientRect.left + page.scrollLeft,
    y: nodeClientRect.top + page.scrollTop
  };
}

/* calculates the angle between lizard and cursor */
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

function initiateCanvas(canvas) {
  if (!canvas.context) return;

  canvas.lizardHeadImg.style.display = "initial";

  canvas.lizardFallbackImg.style.display = "none";

  canvas.context.drawImage(
    canvas.sprite,
    0,
    0,
    canvas.spriteWidth,
    canvas.spriteHeight,
    0,
    0,
    canvas.width,
    canvas.heigth
  );
}

function walkingAnimationFrame(canvas) {
  if (!canvas.context) return;

  let column = frame % canvas.spriteColumns;
  let row = Math.floor(frame / canvas.spriteColumns);

  canvas.context.clearRect(0, 0, canvas.width, canvas.heigth);
  canvas.context.drawImage(
    canvas.sprite,
    column * canvas.spriteWidth,
    row * canvas.spriteHeight,
    canvas.spriteWidth,
    canvas.spriteHeight,
    0,
    0,
    canvas.width,
    canvas.heigth
  );
}

function addEventListeners(listeners) {
  window.addEventListener("click", listeners.click);
  window.addEventListener("mousemove", listeners.mouseMove);
  window.addEventListener("touchstart", listeners.touchstart);
  window.addEventListener("touchend", listeners.touchend);
  window.addEventListener("touchmove", listeners.touchmove);
  listeners.lizardButton.element.addEventListener("click", listeners.lizardButton.click)
}
function removeEventListeners(listeners) {
  window.removeEventListener("click", listeners.click);
  window.removeEventListener("mousemove", listeners.mouseMove);
  window.removeEventListener("touchstart", listeners.touchstart);
  window.removeEventListener("touchend", listeners.touchend);
  window.removeEventListener("touchmove", listeners.touchmove);
  listeners.lizardButton.element.removeEventListener("click", listeners.lizardButton.click)
}
