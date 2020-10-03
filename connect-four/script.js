window.addEventListener("load", function () {
  var resetButton = $(".reset"),
    currentPlayer = "player1",
    holes = $(".hole"),
    col = $(".column"),
    victory = false,
    p1Score = 0,
    p2Score = 0;

  //column selection for mouse
  col.on("click", function (e) {
    gameMove(e);
  });

  //column selection for keyboard
  function keydownEvents() {
    $(document).on("keydown", function (e) {
      if (!victory) {
        // if no hole has it, add selected class to first hole
        if (!holes.is(".select")) {
          if (e.which === 39) {
            col
              .eq(0)
              .children()
              .children()
              .children()
              .not(".player1")
              .not(".player2")
              .last()
              .addClass("select");
          }
          if (e.which === 37) {
            col
              .last()
              .children()
              .children()
              .children()
              .not(".player1")
              .not(".player2")
              .last()
              .addClass("select");
          }
        } else {
          if (e.which === 39) {
            $(".select")
              .removeClass("select")
              .parent()
              .parent()
              .parent()
              .next()
              .children()
              .children()
              .children()
              .not(".player1")
              .not(".player2")
              .last()
              .addClass("select");
          }
          if (e.which === 37) {
            $(".select")
              .removeClass("select")
              .parent()
              .parent()
              .parent()
              .prev()
              .children()
              .children()
              .children()
              .not(".player1")
              .not(".player2")
              .last()
              .addClass("select");
          }
        }
        if (e.which === 13) {
          gameMove(e, "enter");
        }
        if (e.which === 82) {
          reset();
        }
      }
      if (e.which === 82) {
        reset();
      }
    });
  }
  keydownEvents();

  // select for mouse
  function select() {
    col.on("mouseenter click", function () {
      var element = $(this),
        currentHolesArr = element
          .children()
          .children()
          .children()
          .not(".player1")
          .not(".player2")
          .last();

      setTimeout(function () {
        currentHolesArr.addClass("select");
      }, 1);
    });
    col.on("mouseleave click", function () {
      var element = $(this),
        currentHolesArr = element.children().children().children();

      currentHolesArr.removeClass("select");
    });
  }
  select();

  // reset button listener
  resetButton.on("click", function () {
    reset();
  });

  // main game function
  function gameMove(e, enter) {
    var col;
    if (!enter) {
      col = $(e.currentTarget);
    } else {
      col = $(".select").parent().parent().parent();
    }

    var slotsInCol = col.children(),
      holesInCol = slotsInCol.children().children();

    for (var i = holesInCol.length - 1; i >= 0; i--) {
      if (
        !holesInCol.eq(i).hasClass("player1") &&
        !holesInCol.eq(i).hasClass("player2")
      ) {
        holesInCol.eq(i).addClass(currentPlayer);
        holesInCol.eq(i).removeClass("select");
        holesInCol
          .eq(i)
          .parent()
          .parent()
          .prev()
          .children()
          .children()
          .addClass("select");
        break;
      }
    }
    if (i == -1) {
      return;
    }

    var slotsInRow = $(".row" + i),
      holesInRow = slotsInRow.children().children();

    // get winning array
    var currentItemCoord = col.index() - i;
    var currentItemCoord2 = col.index() + i;
    var winArr1 = getWinningArray(currentItemCoord, currentItemCoord2)[0];
    var winArr2 = getWinningArray(currentItemCoord, currentItemCoord2)[1];

    if (
      checkForVictory(holesInCol) ||
      checkForVictory(holesInRow) ||
      checkForVictory(winArr1) ||
      checkForVictory(winArr2)
    ) {
      if (currentPlayer == "player1") {
        p1Score++;
      } else {
        p2Score++;
      }
      $(".score1").html(p1Score);
      $(".score2").html(p2Score);
    } else if (holes.not(".player1").not(".player2").length === 0) {
      alert("its a tie");
    }

    switchPlayers();
  }

  // check for Victory function
  function checkForVictory(slots) {
    var count = 0,
      winningPieces = [];
    //loop through the slots and check how many have the class
    for (var i = 0; i < slots.length; i++) {
      if (slots.eq(i).hasClass(currentPlayer)) {
        count++;
        winningPieces.push(slots.eq(i));
        if (count == 4) {
          winningPieces.forEach(function (item) {
            item.addClass("win");
          });
          $(".player1:not(.win").addClass("lose");
          $(".player2:not(.win").addClass("lose");
          $(".column").off("click");
          holes.not(".player1").not(".player2").css({ opacity: 0.3 });
          col.off();
          victory = true;
          return true;
        }
      } else {
        count = 0;
        winningPieces = [];
      }
    }
  }

  //calculate diagonal winning array
  function getWinningArray(currentItemCoord, currentItemCoord2) {
    //check each item for its coordinates
    var winArr1 = $(),
      winArr2 = $();
    for (let i = 0; i < holes.length; i++) {
      let row = holes.eq(i).parent().parent().index();
      let col = holes.eq(i).parent().parent().parent().index();

      //put all the item with the corresponding coordinates in an array and return it
      if (col - row == currentItemCoord) {
        winArr1 = winArr1.add(holes.eq(i));
      }
      if (col + row == currentItemCoord2) {
        winArr2 = winArr2.add(holes.eq(i));
      }
    }
    return [winArr1, winArr2];
  }

  // switch players function
  function switchPlayers() {
    if (currentPlayer == "player1") {
      currentPlayer = "player2";
      $(".playerDisplay").removeClass("player1");
      $(".playerDisplay").addClass("player2");
    } else {
      currentPlayer = "player1";
      $(".playerDisplay").removeClass("player2");
      $(".playerDisplay").addClass("player1");
    }
  }

  // reset function
  function reset() {
    victory = false;
    for (var i = 0; i < holes.length; i++) {
      holes.css({ opacity: 1 });
      holes.eq(i).removeClass("player1 player2 win lose");
    }
    holes.removeClass("select");

    //reset display current player
    $(".column").off();
    $(".column").on("click", function (e) {
      gameMove(e);
    });
    $(document).off("keydown");
    keydownEvents();
    select();
    resetButton.blur();
    switchPlayers();
    switchPlayers();
  }
});
