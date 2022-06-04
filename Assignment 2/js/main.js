/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Fevin Patel    Student ID: 143156206    Date: 2022-06-03
*
********************************************************************************/ 

let tripData = [];
let currentTrip = {};
let page = 1;
let perPage = 10;
let map = null;

const tableRows = _.template(`<% _.forEach(tripData, function(trips) { %>
                            <tr data-id=<%= trips._id %>>
                                <td><%= trips.bikeid %></td>
                                <td><%= trips["start station name"] %></td>
                                <td><%= trips["end station name"] %></td>
                                <td><%= (trips.tripduration/ 60).toFixed(2) %></td>
                            </tr>
                          <% }); %>`);

const tripModalTemplate = _.template(`
                                      <strong>Start Location: </strong> <%- currentTrip["start station name"] %><br>
                                      <strong>End Location: </strong> <%- currentTrip["end station name"] %><br>
                                      <strong>Duration: </strong> <%- (currentTrip.tripduration/ 60).toFixed(2) %>
                                      `);


let loadTripData = () => {
    fetch(`https://calm-lake-13149.herokuapp.com/api/trips?page=${page}&perPage=${perPage}`)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            console.log(data);
            tripData = data;
            let tRowData = tableRows({ 'trip': tripData });
            $("#trips-table tbody").html(tRowData);
            $("#current-page").html(page);
        })
}


//Load the data into the page
$(function () {
    
    //this loads the data of the trip on the first page and sets if page is changed
    loadTripData();


    //Selected Row Event
    $("#trips-table tbody").on("click", "tr", function () {

        currentTrip = tripData.find(
            (trip) => trip._id == $(this).attr("data-id")
        );

        $("#trip-modal h4").html(`<h4>Trips Details (Bike: ${currentTrip.bikeid})</h4>`);
        $("#map-details").html(tripModalTemplate());

        $('#trip-modal').modal({ backdrop: 'static', keyword: false });

    });


    //Previous page Event
    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
        }
        loadTripData();
    });


    //Next page Event
    $("#next-page").on("click", function () {
        page++;
        loadTripData();
    });


    //SHOWN.BS.MODAL Event
    $("#trip-modal").on("shown.bs.modal", function () {

        let coordinates = {};
        coordinates.startAtX = currentTrip["start station location"].coordinates[0];
        coordinates.startAtY = currentTrip["start station location"].coordinates[1];
        coordinates.endAtX = currentTrip["end station location"].coordinates[0];
        coordinates.endAtY = currentTrip["end station location"].coordinates[1];

        map = new L.Map('leaflet', {
            layers: [new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')]
        });
        let start = L.marker([coordinates.startAtY, coordinates.startAtX])
        .bindTooltip(currentTrip["start station name"],
            {
                permanent: true,
                direction: 'right'
            }).addTo(map);
        let end = L.marker([coordinates.endAtY, coordinates.endAtX])
        .bindTooltip(currentTrip["end station name"],
            {
                permanent: true,
                direction: 'right'
            }).addTo(map);
        var group = new L.featureGroup([start, end]);
        map.fitBounds(group.getBounds(), { padding: [60, 60] });

    });

    //Hide the modal of the map
    $("#trip-modal").on("hidden.bs.modal", function () {
        map.remove();
    })

})