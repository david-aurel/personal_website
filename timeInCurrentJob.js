var textNode = document.getElementById("about-me-experiences-current-job-time");

var currentJobStart = new Date("2021-02-01");

var timeElapsedInMilliseconds = new Date() - currentJobStart;

var timeElapsed = convertMilliseconds(timeElapsedInMilliseconds);

var monthTextFormatted = "";
switch (timeElapsed.month) {
  case 0: {
    break;
  }
  case 1: {
    monthTextFormatted = timeElapsed.month + " mo";
    break;
  }
  default: {
    monthTextFormatted = timeElapsed.month + " mos";
    break;
  }
}

var yearTextFormatted = "";
switch (timeElapsed.year) {
  case 0: {
    break;
  }
  case 1: {
    yearTextFormatted = timeElapsed.year + " yr";
    break;
  }
  default: {
    yearTextFormatted = timeElapsed.year + " yrs";
    break;
  }
}

textNode.innerText +=
  " · " +
  yearTextFormatted +
  (monthTextFormatted ? " " + monthTextFormatted : "");

function convertMilliseconds(time) {
  var month = Math.floor(
    time / 2592000000 // 2592000000 = 1000 (seconds) * 60 (minutes) * 60 (hours) * 24 (days) * 30 (months)
  );

  var year = Math.floor(month / 12);

  month = (month % 12) + 1; // +1 for the current month

  if (month === 12) {
    year += 1;
    month = 0;
  }

  return { year, month };
}
