// Sources-
// Calendar: https://www.w3schools.com/howto/howto_css_calendar.asp
// Better Calendar: https://www.geeksforgeeks.org/how-to-create-a-dynamic-calendar-in-html-css-javascript/
// Dates: https://stackoverflow.com/questions/32540044/display-current-date-in-dd-mm-yyyy-format

// Function to generate a range of 
// years for the year select input

// Initialize Firebase (replace with your Firebase configuration)
function generate_year_range(start, end) {
    let years = "";
    for (let year = start; year <= end; year++) {
        years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
}

// Initialize date-related letiables
var today = new Date();
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();
var selectYear = document.getElementById("year");
var selectMonth = document.getElementById("month");

var createYear = generate_year_range(1970, 2050);

document.getElementById("year").innerHTML = createYear;

let calendar = document.getElementById("calendar");

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let days = [
    "Sun", "Mon", "Tue", "Wed",
    "Thu", "Fri", "Sat"];

$dataHead = "<tr>";
for (dhead in days) {
    $dataHead += "<th data-days='" +
        days[dhead] + "'>" +
        days[dhead] + "</th>";
}
$dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

// Function to navigate to the next month
function next() {
    currentYear = currentMonth === 11 ?
        currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

// Function to navigate to the previous month
function previous() {
    currentYear = currentMonth === 0 ?
        currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ?
        11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

// Function to jump to a specific month and year
function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

// Function to display the calendar
function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month_name", months[month]);
                cell.className = "date-picker";
                cell.innerHTML = "<span>" + date + "</span";

                if (
                    date === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    cell.className = "date-picker selected";
                }

                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }

    displayReminders();
}

// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Initialize Firebase App
// Fetch events for the specific month and year
async function fetchEventsForMonth(month, year) {
    const startDate = new Date(year, month, 1); // First day of the month
    const endDate = new Date(year, month + 1, 0); // Last day of the month

    try {
        const snapshot = await db.collection("events")
            .where("date", ">=", startDate)
            .where("date", "<=", endDate)
            .get();

        let events = [];
        snapshot.forEach(doc => {
            events.push(doc.data());
        });

        return events; // Return the fetched events
    } catch (error) {
        console.error("Error fetching events: ", error);
        return [];
    }
}

// Function to display the calendar with Firebase data
async function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    let date = 1;
    const events = await fetchEventsForMonth(month, year); // Get events from Firebase

    // Create an object with the dates as keys and event data as values
    const eventsByDate = {};
    events.forEach(event => {
        const eventDate = event.date.toDate(); // Assuming the event date is a Firestore Timestamp object
        const day = eventDate.getDate();
        if (!eventsByDate[day]) {
            eventsByDate[day] = [];
        }
        eventsByDate[day].push(event);
    });

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month_name", months[month]);
                cell.className = "date-picker";
                cell.innerHTML = "<span>" + date + "</span>";

                if (eventsByDate[date]) {
                    // Add an indicator if there are events on this day
                    cell.classList.add("has-events");
                    const eventDetails = eventsByDate[date].map(event => `<div class="event">${event.title}</div>`).join('');
                    cell.innerHTML += `<div class="events-container">${eventDetails}</div>`;
                }

                if (
                    date === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    cell.className = "date-picker selected";
                }

                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
}

// Fetch the number of days in the month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Call the showCalendar function initially to display the calendar
showCalendar(currentMonth, currentYear);