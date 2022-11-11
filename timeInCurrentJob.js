var textNode = document.getElementById("about-me-experiences-current-job-time");

var currentJobStart = new Date("2021-02-01");

var timeElapsedInMilliseconds = new Date() - currentJobStart;

var timeElapsed = convertMillisecondsToYearsAndMonths(
  timeElapsedInMilliseconds
);

var monthsTextFormatted = "";
switch (timeElapsed.months) {
  case 0: {
    break;
  }
  case 1: {
    monthsTextFormatted = timeElapsed.months + " mo";
    break;
  }
  default: {
    monthsTextFormatted = timeElapsed.months + " mos";
    break;
  }
}

var yearsTextFormatted = "";
switch (timeElapsed.years) {
  case 0: {
    break;
  }
  case 1: {
    yearsTextFormatted = timeElapsed.years + " yr";
    break;
  }
  default: {
    yearsTextFormatted = timeElapsed.years + " yrs";
    break;
  }
}

textNode.innerText +=
  " · " +
  yearsTextFormatted +
  (monthsTextFormatted ? " " + monthsTextFormatted : "");

function convertMillisecondsToYearsAndMonths(time) {
  var months = Math.floor(
    time / 2592000000 // 2592000000 = 1000 (=>seconds) * 60 (=>minutes) * 60 (=>hours) * 24 (=>days) * 30 (=>months)
  );

  var years = Math.floor(months / 12);

  months = (months % 12) + 1; // +1 for the current month

  if (months === 12) {
    years += 1;
    months = 0;
  }

  return { years, months };
}
