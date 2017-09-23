$(document).ready(function()
{

	//global variables
	var cityPlaceId;

var apiKeys =
{
	googleGeocode: "AIzaSyAtpm5B5wXU56SrAZ-Z9OBgfMoMaXovy3A",
	googleStreetview: "AIzaSyDgH7bb2ybHKZ3K-45N_jNKOPAhB6p-5kc",
	zillow: "X1-ZWz1fzqykaoah7_aui2x"
};

var userAddress =
{
	street1: "",
	street2: "",
	city: "",
	state: "",
	zipcode: ""
};

var userLocation =
{
	latitude: 0,
	longitude: 0,
	placeID: ""
};


$("#address_submit").click(function()
{
	event.preventDefault();

	userAddress.street1 = $("#address_street1").val().trim().replace(/ /g, "+");
	userAddress.street2 = $("#address_street2").val().trim();
	userAddress.city = $("#address_city").val().trim().replace(/ /g, "+");
	userAddress.state = $("#address_state").val().trim();
	userAddress.zipcode = $("#address_zipcode").val().trim();	

	var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userAddress.street1 + ",+" + 
		userAddress.city + ",+" + userAddress.state + "&key=" + apiKeys.googleGeocode;

	console.log(geocodeURL);

	$.ajax(
	{
  		url: geocodeURL,
  		method: "GET",
	})

	.done(function(apireturn)
	{
		console.log(apireturn);
		userLocation.latitude = apireturn.results[0].geometry.location.lat;
		userLocation.longitude = apireturn.results[0].geometry.location.lng;
		userLocation.placeID = apireturn.results[0].place_id;

		var steetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + 
			userLocation.latitude + "," + userLocation.longitude + "&key=" +
			apiKeys.googleStreetview;

		console.log(steetviewURL);

		var streetViewImage = $("<img>").attr("src", steetviewURL)
		$("#streetview_results").append(streetViewImage);

	})	

	var geocodeCityURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
		userAddress.city + ",+" + userAddress.state + "&key=" + apiKeys.googleGeocode;
	$.ajax(
	{
		url: geocodeCityURL,
		method: "GET",
	})
	.done(function(apireturn){
		console.log(apireturn);
		cityPlaceId = apireturn.results[0].place_id;
		console.log(cityPlaceId);
	

	logPlaceDetails();

	function logPlaceDetails() {
          var service = new google.maps.places.PlacesService(document.getElementById('map'));
          service.getDetails({
            placeId: cityPlaceId //'ChIJLwPMoJm1RIYRetVp1EtGm10'
          }, function (place, status) {
            console.log('Place details:', place);

            for(i=0;i<place.photos.length;i++){
            	var photoURL = place.photos[i].getUrl({maxWidth: 400, maxHeight: 400})

            	var addImg = $("<img>");
            	addImg.attr("src", photoURL);

            	$("#pictures").append(addImg);
            }
          });
      }

});
})



})