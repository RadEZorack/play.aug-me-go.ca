

// const gameObjects = window.gameObjects;
// const blockMeshInstanceIDKeys = window.blockMeshInstanceIDKeys;

///////////////////// JOYSTICKS //////////////////
// let window.leftJoystick = undefined;
// let window.leftJoystickBoundingBox = undefined;
// let window.leftJoystickSymbol = undefined;
// let window.leftJoystickSymbolBoundingBox = undefined;
// let window.leftJoystickXPercent = 0;
// let window.leftJoystickYPercent = 0;

// let window.rightJoystick = undefined;
// let window.rightJoystickBoundingBox = undefined;
// let window.rightJoystickSymbol = undefined;
// let window.rightJoystickSymbolBoundingBox = undefined;
// let window.rightJoystickXPercent = 0;
// let window.rightJoystickYPercent = 0;

// let window.middleJoystick = undefined;
// let window.middleJoystickBoundingBox = undefined;
// let window.middleJoystickSymbol = undefined;
// let window.middleJoystickSymbolBoundingBox = undefined;
// let window.middleJoystickXPercent = 0;
// let window.middleJoystickYPercent = 0;

// let window.middle2Joystick = undefined;
// let window.middle2JoystickBoundingBox = undefined;
// let window.middle2JoystickSymbol = undefined;
// let window.middle2JoystickSymbolBoundingBox = undefined;
// let window.middle2JoystickXPercent = 0;
// let window.middle2JoystickYPercent = 0;

// let window.middleItemTouch = undefined;

function updateJoystickSymbols() {
  window.leftJoystickSymbolTop =
    window.leftJoystickBoundingBox.top +
    window.leftJoystickBoundingBox.height / 2 -
    window.leftJoystickSymbolBoundingBox.height / 2;
  window.leftJoystickSymbolTop -=
    (window.leftJoystickYPercent *
      (window.leftJoystickBoundingBox.height -
        window.leftJoystickSymbolBoundingBox.height)) /
    2;

  window.leftJoystickSymbolLeft =
    window.leftJoystickBoundingBox.left +
    window.leftJoystickBoundingBox.width / 2 -
    window.leftJoystickSymbolBoundingBox.width / 2;
  window.leftJoystickSymbolLeft +=
    (window.leftJoystickXPercent *
      (window.leftJoystickBoundingBox.width -
        window.leftJoystickSymbolBoundingBox.width)) /
    2;

  $("#leftJoystickSymbol").css({
    top: window.leftJoystickSymbolTop,
    left: window.leftJoystickSymbolLeft,
    position: "absolute"
  });

  window.rightJoystickSymbolTop =
    window.rightJoystickBoundingBox.top +
    window.rightJoystickBoundingBox.height / 2 -
    window.rightJoystickSymbolBoundingBox.height / 2;
  window.rightJoystickSymbolTop -=
    (window.rightJoystickYPercent *
      (window.rightJoystickBoundingBox.height -
        window.rightJoystickSymbolBoundingBox.height)) /
    2;

  window.rightJoystickSymbolLeft =
    window.rightJoystickBoundingBox.left +
    window.rightJoystickBoundingBox.width / 2 -
    window.rightJoystickSymbolBoundingBox.width / 2;
  window.rightJoystickSymbolLeft +=
    (window.rightJoystickXPercent *
      (window.rightJoystickBoundingBox.width -
        window.rightJoystickSymbolBoundingBox.width)) /
    2;

  $("#rightJoystickSymbol").css({
    top: window.rightJoystickSymbolTop,
    left: window.rightJoystickSymbolLeft,
    position: "absolute"
  });

  window.middleJoystickSymbolTop =
    window.middleJoystickBoundingBox.top +
    window.middleJoystickBoundingBox.height / 2 -
    window.middleJoystickSymbolBoundingBox.height / 2;
  window.middleJoystickSymbolTop -=
    (window.middleJoystickYPercent *
      (window.middleJoystickBoundingBox.height -
        window.middleJoystickSymbolBoundingBox.height)) /
    2;

  window.middleJoystickSymbolLeft =
    window.middleJoystickBoundingBox.left +
    window.middleJoystickBoundingBox.width / 2 -
    window.middleJoystickSymbolBoundingBox.width / 2;
  // window.middleJoystickSymbolLeft += window.middleJoystickXPercent * (window.middleJoystickBoundingBox.width -  window.middleJoystickSymbolBoundingBox.width) / 2

  $("#middleJoystickSymbol").css({
    top: window.middleJoystickSymbolTop,
    left: window.middleJoystickSymbolLeft,
    position: "absolute"
  });

  window.middle2JoystickSymbolTop =
    window.middle2JoystickBoundingBox.top +
    window.middle2JoystickBoundingBox.height / 2 -
    window.middle2JoystickSymbolBoundingBox.height / 2;
  // window.middle2JoystickSymbolTop -= window.middle2JoystickYPercent * (window.middle2JoystickBoundingBox.height -  window.middle2JoystickSymbolBoundingBox.height) / 2

  window.middle2JoystickSymbolLeft =
    window.middle2JoystickBoundingBox.left +
    window.middle2JoystickBoundingBox.width / 2 -
    window.middle2JoystickSymbolBoundingBox.width / 2;
  window.middle2JoystickSymbolLeft +=
    (window.middle2JoystickXPercent *
      (window.middle2JoystickBoundingBox.width -
        window.middle2JoystickSymbolBoundingBox.width)) /
    2;

  $("#middle2JoystickSymbol").css({
    top: window.middle2JoystickSymbolTop,
    left: window.middle2JoystickSymbolLeft,
    position: "absolute"
  });
}

function controlsOnWindowResize() {
  window.leftJoystick = document.getElementById("leftJoystick");
  window.leftJoystickBoundingBox = window.leftJoystick.getBoundingClientRect();
  window.leftJoystickSymbol = document.getElementById("leftJoystickSymbol");
  window.leftJoystickSymbolBoundingBox = window.leftJoystickSymbol.getBoundingClientRect();
  window.leftJoystickXPercent = 0;
  window.leftJoystickYPercent = 0;

  window.rightJoystick = document.getElementById("rightJoystick");
  window.rightJoystickBoundingBox = window.rightJoystick.getBoundingClientRect();
  window.rightJoystickSymbol = document.getElementById("rightJoystickSymbol");
  window.rightJoystickSymbolBoundingBox = window.rightJoystickSymbol.getBoundingClientRect();
  window.rightJoystickXPercent = 0;
  window.rightJoystickYPercent = 0;

  window.middleJoystick = document.getElementById("middleJoystick");
  window.middleJoystickBoundingBox = window.middleJoystick.getBoundingClientRect();
  window.middleJoystickSymbol = document.getElementById("middleJoystickSymbol");
  window.middleJoystickSymbolBoundingBox = window.middleJoystickSymbol.getBoundingClientRect();
  window.middleJoystickXPercent = 0;
  window.middleJoystickYPercent = 0;

  window.middle2Joystick = document.getElementById("middle2Joystick");
  window.middle2JoystickBoundingBox = window.middle2Joystick.getBoundingClientRect();
  window.middle2JoystickSymbol = document.getElementById(
    "middle2JoystickSymbol"
  );
  window.middle2JoystickSymbolBoundingBox = window.middle2JoystickSymbol.getBoundingClientRect();
  window.middle2JoystickXPercent = 0;
  window.middle2JoystickYPercent = 0;

  updateJoystickSymbols();
}

function initControls() {
  console.log("Init Controls");
  window.leftJoystick = document.getElementById("leftJoystick");
  window.leftJoystickBoundingBox = window.leftJoystick.getBoundingClientRect();
  console.log("leftJoystickBoundingBox", window.leftJoystickBoundingBox);
  window.leftJoystickSymbol = document.getElementById("leftJoystickSymbol");
  window.leftJoystickSymbolBoundingBox = window.leftJoystickSymbol.getBoundingClientRect();
  window.leftJoystickXPercent = 0;
  window.leftJoystickYPercent = 0;

  window.rightJoystick = document.getElementById("rightJoystick");
  window.rightJoystickBoundingBox = window.rightJoystick.getBoundingClientRect();
  window.rightJoystickSymbol = document.getElementById("rightJoystickSymbol");
  window.rightJoystickSymbolBoundingBox = window.rightJoystickSymbol.getBoundingClientRect();
  window.rightJoystickXPercent = 0;
  window.rightJoystickYPercent = 0;

  window.middleJoystick = document.getElementById("middleJoystick");
  window.middleJoystickBoundingBox = window.middleJoystick.getBoundingClientRect();
  window.middleJoystickSymbol = document.getElementById("middleJoystickSymbol");
  window.middleJoystickSymbolBoundingBox = window.middleJoystickSymbol.getBoundingClientRect();
  window.middleJoystickXPercent = 0;
  window.middleJoystickYPercent = 0;

  window.middle2Joystick = document.getElementById("middle2Joystick");
  window.middle2JoystickBoundingBox = window.middle2Joystick.getBoundingClientRect();
  window.middle2JoystickSymbol = document.getElementById(
    "middle2JoystickSymbol"
  );
  window.middle2JoystickSymbolBoundingBox = window.middle2JoystickSymbol.getBoundingClientRect();
  window.middle2JoystickXPercent = 0;
  window.middle2JoystickYPercent = 0;
  ////////////// LEFT JOYSTICK ///////////////
  window.leftJoystickTouch = undefined;
  function leftJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.leftJoystickTouch = event.targetTouches[0];
    } else {
      window.leftJoystickTouch = event;
    }
    // Place element where the finger is
    window.leftJoystickXPercent = Math.min(
      Math.max(
        (window.leftJoystickTouch.clientX -
          window.leftJoystickBoundingBox.left -
          window.leftJoystickBoundingBox.width / 2) /
          (window.leftJoystickBoundingBox.width / 2 -
            window.leftJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.leftJoystickYPercent = Math.min(
      Math.max(
        (window.leftJoystickBoundingBox.top +
          window.leftJoystickBoundingBox.height / 2 -
          window.leftJoystickTouch.clientY) /
          (window.leftJoystickBoundingBox.height / 2 -
            window.leftJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function leftJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.leftJoystickTouch = event.targetTouches[0];
    } else {
      window.leftJoystickTouch = event;
    }
    // Place element where the finger is
    window.leftJoystickXPercent = Math.min(
      Math.max(
        (window.leftJoystickTouch.clientX -
          window.leftJoystickBoundingBox.left -
          window.leftJoystickBoundingBox.width / 2) /
          (window.leftJoystickBoundingBox.width / 2 -
            window.leftJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.leftJoystickYPercent = Math.min(
      Math.max(
        (window.leftJoystickBoundingBox.top +
          window.leftJoystickBoundingBox.height / 2 -
          window.leftJoystickTouch.clientY) /
          (window.leftJoystickBoundingBox.height / 2 -
            window.leftJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function leftJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    window.leftJoystickXPercent = 0;
    window.leftJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events

  window.leftJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchstart(event);
    },
    false
  );

  window.leftJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchmove(event);
    },
    false
  );

  window.leftJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchend(event);
    },
    false
  );

  window.leftJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    leftJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      leftJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      leftJoystickTouchend(event);
    };
  };

  /////////////////// RIGHT JOYSTICK ////////////////
  window.rightJoystickTouch = undefined;
  function rightJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.rightJoystickTouch = event.targetTouches[0];
    } else {
      window.rightJoystickTouch = event;
    }
    // Place element where the finger is
    window.rightJoystickXPercent = Math.min(
      Math.max(
        (window.rightJoystickTouch.clientX -
          window.rightJoystickBoundingBox.left -
          window.rightJoystickBoundingBox.width / 2) /
          (window.rightJoystickBoundingBox.width / 2 -
            window.rightJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.rightJoystickYPercent = Math.min(
      Math.max(
        (window.rightJoystickBoundingBox.top +
          window.rightJoystickBoundingBox.height / 2 -
          window.rightJoystickTouch.clientY) /
          (window.rightJoystickBoundingBox.height / 2 -
            window.rightJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function rightJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.rightJoystickTouch = event.targetTouches[0];
    } else {
      window.rightJoystickTouch = event;
    }
    // Place element where the finger is
    window.rightJoystickXPercent = Math.min(
      Math.max(
        (window.rightJoystickTouch.clientX -
          window.rightJoystickBoundingBox.left -
          window.rightJoystickBoundingBox.width / 2) /
          (window.rightJoystickBoundingBox.width / 2 -
            window.rightJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.rightJoystickYPercent = Math.min(
      Math.max(
        (window.rightJoystickBoundingBox.top +
          window.rightJoystickBoundingBox.height / 2 -
          window.rightJoystickTouch.clientY) /
          (window.rightJoystickBoundingBox.height / 2 -
            window.rightJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function rightJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    window.rightJoystickXPercent = 0;
    window.rightJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  window.rightJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchstart(event);
    },
    false
  );

  window.rightJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchmove(event);
    },
    false
  );

  window.rightJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchend(event);
    },
    false
  );

  window.rightJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    rightJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      rightJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      rightJoystickTouchend(event);
    };
  };

  /////////////// MIDDLE JOYSTICK //////////////
  window.middleJoystickTouch = undefined;
  function middleJoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middleJoystickTouch = event.targetTouches[0];
    } else {
      window.middleJoystickTouch = event;
    }
    // Place element where the finger is
    window.middleJoystickXPercent = Math.min(
      Math.max(
        (window.middleJoystickTouch.clientX -
          window.middleJoystickBoundingBox.left -
          window.middleJoystickBoundingBox.width / 2) /
          (window.middleJoystickBoundingBox.width / 2 -
            window.middleJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.middleJoystickYPercent = Math.min(
      Math.max(
        (window.middleJoystickBoundingBox.top +
          window.middleJoystickBoundingBox.height / 2 -
          window.middleJoystickTouch.clientY) /
          (window.middleJoystickBoundingBox.height / 2 -
            window.middleJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middleJoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middleJoystickTouch = event.targetTouches[0];
    } else {
      window.middleJoystickTouch = event;
    }
    // Place element where the finger is
    window.middleJoystickXPercent = Math.min(
      Math.max(
        (window.middleJoystickTouch.clientX -
          window.middleJoystickBoundingBox.left -
          window.middleJoystickBoundingBox.width / 2) /
          (window.middleJoystickBoundingBox.width / 2 -
            window.middleJoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.middleJoystickYPercent = Math.min(
      Math.max(
        (window.middleJoystickBoundingBox.top +
          window.middleJoystickBoundingBox.height / 2 -
          window.middleJoystickTouch.clientY) /
          (window.middleJoystickBoundingBox.height / 2 -
            window.middleJoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middleJoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    window.middleJoystickXPercent = 0;
    window.middleJoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  window.middleJoystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchstart(event);
    },
    false
  );

  window.middleJoystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchmove(event);
    },
    false
  );

  window.middleJoystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchend(event);
    },
    false
  );

  window.middleJoystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    middleJoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      middleJoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      middleJoystickTouchend(event);
    };
  };

  //////// MIDDLE 2 //////////////////////
  /////////////// MIDDLE JOYSTICK //////////////
  window.middle2JoystickTouch = undefined;
  function middle2JoystickTouchstart(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middle2JoystickTouch = event.targetTouches[0];
    } else {
      window.middle2JoystickTouch = event;
    }
    // Place element where the finger is
    window.middle2JoystickXPercent = Math.min(
      Math.max(
        (window.middle2JoystickTouch.clientX -
          window.middle2JoystickBoundingBox.left -
          window.middle2JoystickBoundingBox.width / 2) /
          (window.middle2JoystickBoundingBox.width / 2 -
            window.middle2JoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.middle2JoystickYPercent = Math.min(
      Math.max(
        (window.middle2JoystickBoundingBox.top +
          window.middle2JoystickBoundingBox.height / 2 -
          window.middle2JoystickTouch.clientY) /
          (window.middle2JoystickBoundingBox.height / 2 -
            window.middle2JoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middle2JoystickTouchmove(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middle2JoystickTouch = event.targetTouches[0];
    } else {
      window.middle2JoystickTouch = event;
    }
    // Place element where the finger is
    window.middle2JoystickXPercent = Math.min(
      Math.max(
        (window.middle2JoystickTouch.clientX -
          window.middle2JoystickBoundingBox.left -
          window.middle2JoystickBoundingBox.width / 2) /
          (window.middle2JoystickBoundingBox.width / 2 -
            window.middle2JoystickSymbolBoundingBox.width / 2),
        -1
      ),
      1
    );
    window.middle2JoystickYPercent = Math.min(
      Math.max(
        (window.middle2JoystickBoundingBox.top +
          window.middle2JoystickBoundingBox.height / 2 -
          window.middle2JoystickTouch.clientY) /
          (window.middle2JoystickBoundingBox.height / 2 -
            window.middle2JoystickSymbolBoundingBox.height / 2),
        -1
      ),
      1
    );
    // update_sigmoids();
    updateJoystickSymbols();
  }

  function middle2JoystickTouchend(event) {
    event.preventDefault();
    event.stopPropagation();
    window.middle2JoystickXPercent = 0;
    window.middle2JoystickYPercent = 0;
    // update_sigmoids();
    updateJoystickSymbols();
  }

  // Events
  window.middle2Joystick.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchstart(event);
    },
    false
  );

  window.middle2Joystick.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchmove(event);
    },
    false
  );

  window.middle2Joystick.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchend(event);
    },
    false
  );

  window.middle2Joystick.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    middle2JoystickTouchstart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      middle2JoystickTouchmove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      middle2JoystickTouchend(event);
    };
  };

  //////// Main Item ///////
  window.middleItem = document.getElementById("middleItem");
  window.middleItemBoundingBox = window.middleItem.getBoundingClientRect();
  window.middleItemSymbol = document.getElementById("middleItemSymbol");
  window.middleItemSymbolBoundingBox = window.middleItemSymbol.getBoundingClientRect();

  window.middleItemSymbolLeft =
    window.middleItemBoundingBox.left +
    window.middleItemBoundingBox.width / 2 -
    window.middleItemSymbolBoundingBox.width / 2;
  window.middleItemSymbolTop =
    window.middleItemBoundingBox.top +
    window.middleItemBoundingBox.height / 2 -
    window.middleItemSymbolBoundingBox.height / 2;
  // update_sigmoids();
  $("#middleItemSymbol").css({
    top: window.middleItemSymbolTop,
    left: window.middleItemSymbolLeft,
    position: "absolute",
    color: "white"
  });

  window.middleItemTouchMoveXHR = undefined;

  function touchStart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middleItemTouch = event.targetTouches[0];
    } else {
      window.middleItemTouch = event;
    }

    // Place element where the finger is
    // $("#middleItemSymbol").css({'font-size': '33vw'});
    window.middleItemSymbol = document.getElementById("middleItemSymbol");
    window.middleItemSymbolBoundingBox = window.middleItemSymbol.getBoundingClientRect();
    window.middleItemSymbolLeft =
      window.middleItemTouch.clientX -
      window.middleItemSymbolBoundingBox.width / 2;
    window.middleItemSymbolTop =
      window.middleItemTouch.clientY -
      window.middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();
    $("#middleItemSymbol").css({
      top: window.middleItemSymbolTop,
      left: window.middleItemSymbolLeft,
      position: "absolute"
    });
    $("#ui").hide();
  }

  function touchMove(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.targetTouches && event.targetTouches.length == 1) {
      window.middleItemTouch = event.targetTouches[0];
    } else {
      window.middleItemTouch = event;
    }

    // pick();

    // Place element where the finger is
    // $("#middleItemSymbol").css({'font-size': '33vw'});
    window.middleItemSymbol = document.getElementById("middleItemSymbol");
    window.middleItemSymbolBoundingBox = window.middleItemSymbol.getBoundingClientRect();
    window.middleItemSymbolLeft =
      window.middleItemTouch.clientX -
      window.middleItemSymbolBoundingBox.width / 2;
    window.middleItemSymbolTop =
      window.middleItemTouch.clientY -
      window.middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();
    $("#middleItemSymbol").css({
      top: window.middleItemSymbolTop,
      left: window.middleItemSymbolLeft,
      position: "absolute"
    });
    $("#ui").hide();

    // if (window.middleItemTouchMoveXHR == undefined){
    //   window.middleItemTouchMoveXHR = setTimeout(function(){
    //     if (window.middleItemTouch != undefined){
    //       if(window.middleItemTouch.clientX >= window.middleItemBoundingBox.left &&
    //          window.middleItemTouch.clientX <= (window.middleItemBoundingBox.left + window.middleItemBoundingBox.width) &&
    //          window.middleItemTouch.clientY >= window.middleItemBoundingBox.top &&
    //          window.middleItemTouch.clientY <= (window.middleItemBoundingBox.top + window.middleItemBoundingBox.height)
    //         ){
    //         console.log("remove temp block")
    //         $("#middleItemSymbol").css({color: "white"});
    //         // Inside selector
    //         if (temporary_block_add != undefined){
    //           // Remove old temp
    //           temporary_block_add.old_material = temporary_block_add.material
    //           temporary_block_add.material = ""
    //           add_or_change_block(temporary_block_add)
    //           temporary_block_add = undefined
    //         }
    //       }else{
    //         $("#middleItemSymbol").css({color: "red"});
    //         block_place_event(window.middleItemTouch, preview=true)
    //       }
    //     }
    //     window.middleItemTouchMoveXHR = undefined;
    //   }, 50)
    // }
  }

  function touchEnd(event) {
    event.preventDefault();
    event.stopPropagation();
    // If there's exactly one finger inside this element
    // $("#middleItemSymbol").css({'font-size': 'xxx-large'});
    window.middleItemSymbol = document.getElementById("middleItemSymbol");
    window.middleItemSymbolBoundingBox = window.middleItemSymbol.getBoundingClientRect();
    window.middleItemSymbolLeft =
      window.middleItemBoundingBox.left +
      window.middleItemBoundingBox.width / 2 -
      window.middleItemSymbolBoundingBox.width / 2;
    window.middleItemSymbolTop =
      window.middleItemBoundingBox.top +
      window.middleItemBoundingBox.height / 2 -
      window.middleItemSymbolBoundingBox.height / 2;
    // update_sigmoids();

    if (window.middleItemTouch != undefined) {
      if (
        window.middleItemTouch.clientX >= window.middleItemBoundingBox.left &&
        window.middleItemTouch.clientX <=
          window.middleItemBoundingBox.left +
            window.middleItemBoundingBox.width &&
        window.middleItemTouch.clientY >= window.middleItemBoundingBox.top &&
        window.middleItemTouch.clientY <=
          window.middleItemBoundingBox.top + window.middleItemBoundingBox.height
      ) {
        console.log("remove temp block");
        $("#middleItemSymbol").css({ color: "white" });
        // Inside selector
        // if (temporary_block_add != undefined){
        //   // Remove old temp
        //   temporary_block_add.old_material = temporary_block_add.material
        //   temporary_block_add.material = ""
        //   add_or_change_block(temporary_block_add)
        //   temporary_block_add = undefined
        // }
      } else {
        console.log("add block");
        // block_place_event(window.middleItemTouch)
        // Temporary remove block for testing
        const data = selectedObject(window.middleItemTouch);
        if (data != undefined && data.object.uuid != undefined && data.instanceId != undefined){
          const index =
          window.triangleMeshInstanceIDKeys[data.object.uuid][data.instanceId];
          window.gameObjects.splice(index, 1);
          console.log(index, window.gameObjects)
        }
        redrawObjects();
      }
      window.middleItemTouch = undefined;
    }
    $("#middleItemSymbol").css({
      top: window.middleItemSymbolTop,
      left: window.middleItemSymbolLeft,
      position: "absolute",
      color: "white"
    });
    $("#ui").show();
  }

  window.middleItem.addEventListener(
    "touchstart",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchStart(event);
    },
    false
  );

  window.middleItem.addEventListener(
    "touchmove",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchMove(event);
    },
    false
  );

  window.middleItem.addEventListener(
    "touchend",
    function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchEnd(event);
    },
    false
  );

  window.middleItem.onmousedown = function(event) {
    event.preventDefault();
    event.stopPropagation();
    touchStart(event);

    document.body.onmousemove = function(event) {
      event.preventDefault();
      event.stopPropagation();
      touchMove(event);
    };

    document.body.onmouseup = function(event) {
      event.preventDefault();
      event.stopPropagation();
      document.body.onmousemove = undefined;
      document.body.onmouseup = undefined;
      touchEnd(event);
    };
  };

  updateJoystickSymbols();
}
