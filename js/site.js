var datasets = ['encryptionlaws', 'resellers', 'targetedthreats', 'vendors'];
var packages = {};
var countries = [];
var current_country = '';

var getPackageCallback = function(response) {
  var name = response.name.replace('data-', '');
  packages[name] = response.result;

  // Make Unique countries
  _.each(response.result, function(item, key) {
    if (_.indexOf(countries, item.country) === -1) {
      countries.push(item.country);
    }
  });
};

var getPackages = function() {
  _.each(datasets, function(package, key) {
    $.ajax({
      url: 'http://dev:8888/' + package,
      crossDomain: true,
      dataType: "jsonp",
      jsonp: 'callback',
      success: function(data) {
        getPackageCallback(data);
      }
    });
  });
};

var showDataRegion = function(region, package) {

  var view_template = _.template($('#view-' + package).html());
  var view_output = '';

  _.each(packages[package], function(item, key) {

    if (item.country == region) {
      var package_view = view_template(item);
      view_output += package_view;
    }

  });

  if (view_output) {
    $('#' + package).html('<p>&nbsp;</p><ul>' + view_output + '</ul>');
  } else {
    $('#' + package).html('<h4>No ' + package + ' data found</h4>');

  }
};

$(document).ready(function() {

    getPackages();

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
                fill: 'yellow'
            }
        },
        onRegionClick: function(event, country) {

            current_country = country;
            var map = $('#map').vectorMap('get', 'mapObject');
            $('#modal').modal();
            $('#modal').find('.modal-title').html('Results for: ' + country);
            showDataRegion(country, 'targetedthreats');
        }
    });

    $('#country-tabs a').click(function (e) {
      e.preventDefault();
      showDataRegion(current_country, $(this).attr('href').replace('#', ''));
      $(this).tab('show');

    })


});
