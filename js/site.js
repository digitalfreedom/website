var prefix = 'data-'
var datasets = ['encryptionlaws', 'resellers', 'targetedthreats', 'vendors'];
var datasets_toc = {}
var datatable = {}
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
      url: url_api + package,
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
}

var showToc = function(data) {
  var html_packages = ''
  var template_packages = _.template($('#view-datapackages').html())

  _.each(data.result, function(package, key) {
    html_packages += template_packages(package)
  })

  $('#datapackages').html(html_packages)
}

var showDataTable = function(package) {
  var package_details = _.findWhere(datasets_toc, { data_package: package })
  var this_package = packages[package.replace(prefix, '')]

  if (this_package) {

    // Show / Hide HTML
    $('#datapackages-details').hide()
    $('#datapackages').hide()
    $('#datapackages-title').find('h1').html('Dataset: ' + package_details.name)
    $('#datapackages-title').find('p').html(package_details.description)
    $('#show-datasets-toc').removeClass('hidden')
    $('#datatable').show()

    // Build Objects / Render Datatable
    var keys = _.keys(this_package[0])
    var titles = []
    _.each(keys, function(item) {
      titles.push({ title: item })
    })

    var data_set = []
    _.each(this_package, function(entry, key) {
      data_set.push(_.values(entry))
    })

    datatable = $('#datatable').DataTable({
       data: data_set,
       columns: titles
    })
  }
}

var showPackages = function() {
  $.ajax({
    url: url_api,
    crossDomain: true,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(data) {
      showToc(data)
      datasets_toc = data.result
    }
  })
}

$(document).on('click', 'a.show-dataset', function(e) {
  showDataTable($(this).attr('href').replace('#', ''))
})

$(document).on('click', '#show-datasets-toc', function(e) {
  e.preventDefault()
  $(this).addClass('hidden')
  datatable.destroy()
  $('#datatable').html('')
  $('#datapackages-details').show()
  $('#datapackages').show()
})

$(document).ready(function() {

    // Load data based on pages
    if ($('#map').length || $('#datapackages').length) {
        getPackages()
    }

    if ($('#datapackages').length) {
        showPackages()
    }

    if ($('#map').length) {
        $('#map').vectorMap({
            map: 'world_mill',
            backgroundColor: '#ffffff',
            regionStyle: {
                initial: {
                    fill: '#18bc9c',
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
        })
    }

    $('#country-tabs a').click(function (e) {
      e.preventDefault();
      showDataRegion(current_country, $(this).attr('href').replace('#', ''));
      $(this).tab('show');
    })


})
