icalendar = require("./icalendar")

console.log(icalendar.stringify(
{
	name: "test",
	events: [
		{
			summary: "A test event.",
			location: "Nowhere.",
			dtstart: "20181213",
			dtend: "20181214",
		},
		{
			summary: "A second test event.",
			location: "Everywhere!",
			dtstart: "20181214",
			dtend: "20181215",
		},
	]
}
));