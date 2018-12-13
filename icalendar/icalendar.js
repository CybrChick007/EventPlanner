
// https://stackoverflow.com/a/2117523
// to be replaced by something else
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function stringify(data) {
	
	lines = [];
	lines.push("BEGIN:VCALENDAR");
	lines.push("VERSION:2.0");
	lines.push("CALSCALE:GREGORIAN");
	lines.push("PRODID:EventZ icalendar.js");
	
	now = new Date();
	
	for (let event of data.events) {
		lines.push("BEGIN:VEVENT");
		lines.push("UID:" + generateUUID());
		lines.push("DTSTAMP:" + now.getFullYear()
		                      + now.getMonth()
							  + now.getDate()
							  + "T" + now.getHours()
							  + now.getMinutes()
							  + now.getSeconds());
		for (let key in event) {
			lines.push(key.toUpperCase() + ":" + event[key]);
		}
		lines.push("END:VEVENT");
	}
	lines.push("END:VCALENDAR");
	return lines.join("\n");
}

exports.stringify = stringify;