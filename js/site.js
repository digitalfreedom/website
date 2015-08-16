var jsonp_callback = function(data) {
  console.log('yo here');
  console.log(data)
};

$(document).ready(function() {

    $.ajax({
      url: 'http://dev:8888/targetedthreats',
      crossDomain: true,
      dataType: "jsonp",
      jsonp: 'callback',
      jsonpCallback: 'jsonp_callback'
    });


    $('#map').vectorMap({
        map: 'world_mill',
        backgroundColor: '#ffffff',
        regionStyle: {
            initial: {
                fill: 'grey',
                "fill-opacity": 1,
                stroke: 'none',
                "stroke-width": 0,
                "stroke-opacity": 1
            },
            hover: {
                "fill-opacity": 0.8,
                cursor: 'pointer'
            },
            selected: {
                fill: 'yellow'
            },
            selectedHover: {
            }
        },
        onRegionClick: function(event, country) {
            console.log(event)

            console.log(country)

            var map = $('#map').vectorMap('get', 'mapObject');
            $('#modal').modal();
        }
    });

});
