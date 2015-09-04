var prefix = 'data-'
var datasets = ['encryptionlaws', 'resellers', 'targetedthreats', 'vendors'];
var datasets_toc = {}
var datatable = {}
var packages = {};
var countries = [];
var current_country = '';
var per_dataset = {};
var package_facts = {};
var active_package = null;

function PackageFacts(name) {
  return {
    name: name,
    color: '#18bc9c', //put in here for now so colours can be customized for each package if wanted
    countries: [],
    pdata: null,
  };
}

function init_package_facts() {
  _.each(datasets, function(name, key) {
    var facts = package_facts[name] = PackageFacts(name);

    getPackage(facts).done(function() {
       // any data processing we want
       // Make Unique countries
       _.each(facts.pdata, function(item, key) {
         if (_.indexOf(facts.countries, item.country) === -1) {
           facts.countries.push(item.country);
         }
       });
    });
  })
}

var getPackage = function(facts) {
    var res = $.ajax({
      url: url_api + facts.name,
      crossDomain: true,
      dataType: "jsonp",
      jsonp: 'callback',
    });
    res.done(function(response) {
      facts.pdata = response.result;
    });
    res.error(function() {
      facts.loadError = true;
    });
    res.always(function() {
    	//todo final render
    });
    return res;
};

var showDataRegion = function(region, package) {
  var view_template = _.template($('#view-' + package).html());
  var view_output = '';

  _.each(package_facts[package].pdata, function(item, key) {

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
  var package_details = _.findWhere(datasets_toc, { data_package: package });
  var this_package = package_facts[package.replace(prefix, '')].pdata;

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


function color_map(package_obj, color) {
  var regionValues = {};
  _.each(package_obj.countries, function(country) {
    regionValues[country] = color;
  })
  var map = $('#map').vectorMap('get', 'mapObject');
  map.series.regions[0].setValues(regionValues);
}

$(document).on('click', 'a.show-dataset', function(e) {
  showDataTable($(this).attr('href').replace('#', ''))
})

$(document).on('click', '#show-datasets-toc', function(e) {
  e.preventDefault()
  $(this).addClass('hidden')
  datatable.destroy()
  $('#datatable').html('')
  $('#datapackages-title').find('h1').html('Our Datasets')
  $('#datapackages-title').find('p').html('')
  $('#datapackages-details').show()
  $('#datapackages').show()
})

$(document).ready(function() {

    // Load data based on pages
    if ($('#map').length || $('#datapackages').length) {
        init_package_facts();
	active_package = package_facts['targetedthreats'];
    }

    if ($('#datapackages').length) {
        showPackages()
    }

    if ($('#map').length) {
        $('#map').vectorMap({
            map: 'world_mill',
            backgroundColor: '#ffffff',
            series: { regions: [ {attribute: 'fill'} ] },
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
            }
        });
    }
	
    $('#country-tabs a').click(function (e) {
      e.preventDefault();
      showDataRegion(current_country, $(this).attr('href').replace('#', ''));
      $(this).tab('show');
    })

    $('#dataset-selector :input').change(function() {
      color_map(active_package, 'grey');
      active_package = package_facts[this.value];
      color_map(active_package, active_package.color);
    })


})
