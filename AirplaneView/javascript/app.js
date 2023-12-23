// import config from '../Config/config';

const apiKey = '8292bc0f34msh9c332479f6a0823p14a994jsnb22418fc602f'; // Replace with your RapidAPI key
const baseUrl = 'https://timetable-lookup.p.rapidapi.com/TimeTable/';

async function searchFlights() {
    const currentLocation = document.getElementById("currentLocation").value;
    const destination = document.getElementById("destination").value;

    // Get and format the date input
    const dateInput = document.getElementById("date").value;
    const date = formatDate(dateInput);

    const url = `${baseUrl}${currentLocation}/${destination}/${date}/`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        parseAndDisplayFlights(result);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

// Function to format the date as YYYYMMDD
function formatDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    return `${year}${month}${day}`;
}


function parseAndDisplayFlights(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const responseFields = xmlDoc.querySelector('FLSResponseFields');
    const flightDetails = xmlDoc.querySelectorAll('FlightDetails');

    const flightsList = document.getElementById("flightsList");
    flightsList.innerHTML = '';

    if (flightDetails.length === 0) {
        flightsList.innerHTML = '<p>No flights found.</p>';
    } else {
        const originName = responseFields.getAttribute('FLSOriginName');
        const destinationName = responseFields.getAttribute('FLSDestinationName');
        const startDate = responseFields.getAttribute('FLSStartDate');

        // Display general information about the flights
        flightsList.innerHTML += `<p>Showing flights from ${originName} to ${destinationName} on ${startDate}</p>`;

        const ul = document.createElement('ul');

        for (let i = 0; i < Math.min(10, flightDetails.length); i++) {
            const flight = flightDetails[i];
            const flightNumber = flight.querySelector('FlightLegDetails').getAttribute('FlightNumber');
            const departureTime = flight.getAttribute('FLSDepartureDateTime');
            const arrivalTime = flight.getAttribute('FLSArrivalDateTime');
            const flightType = flight.getAttribute('FLSFlightType');
            const airline = flight.querySelector('MarketingAirline').getAttribute('CompanyShortName');
            const equipmentType = flight.querySelector('Equipment').getAttribute('AirEquipType');

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Flight ${i + 1}:</strong>
                <br>Flight Number: ${flightNumber}
                <br>Departure Time: ${departureTime}
                <br>Arrival Time: ${arrivalTime}
                <br>Flight Type: ${flightType}
                <br>Airline: ${airline}
                <br>Equipment Type: ${equipmentType}
            `;
            ul.appendChild(li);
        }

        flightsList.appendChild(ul);

        // Check if there are more than 10 flights and show pagination
        if (flightDetails.length > 10) {
            // Implement pagination logic here
        }
    }
}
