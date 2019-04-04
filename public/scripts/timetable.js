/**
 * Provides functionality for `timetable.html`.
 * @module public/scripts/timetable
 */

const host = window.location.href.replace(/\/[^\/]+$/, "");

/**
 * Gets the URL of the generated ical file on the server.
 */
function getCalendarURL() {
  return host + "/timetables/" + currentUser.user.userID + ".ics";
}

document.getElementById("googlecalendar").addEventListener("click", function () {
  if (window.location.hostname == "localhost") {
    alert("Feature does not work on localhost. Please download the calendar instead.");
    return;
  }
  window.location.href = "https://calendar.google.com/render?cid=" + getCalendarURL();
});

document.getElementById("downloadfile").addEventListener("click", function () {
  let link = document.createElement("a");
  link.download = "EventZ-timetable.ics";
  link.href = getCalendarURL();
  document.body.appendChild(link);
  link.click();
  link.remove();
});
