/*
  Globals...

  $
  _
  DataTable
  vectorMap
  url_api

*/

function Map() {
  var prefix = 'data-';
  var datasets = ['encryptionlaws', 'resellers', 'targetedthreats', 'vendors'];
  var datasets_toc = {};
  var datatable = {};
  var current_country = '';
  var package_facts = {};
  var active_package = null;

  // MAP VARIABLES (this should probably go into some magical style land)
  var defaultFill = '#d3d3d3'; // fill when no data is available
  var primaryFill = '#18bc9c'; // dark green fill for main selection
  var secondaryFill = '#8CDECE'; // light green for sub packages

  function PackageFacts(name) {
    return {
      name: name,
      color: primaryFill, // put in here for now so colours can be customized for each _package if wanted
      countries: [],
      pdata: null,
      subpackages: {}
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
        if (!facts.name.localeCompare('targetedthreats')) {
          processTargetedThreats();
          active_package = facts;
          color_map(active_package, active_package.color); //oh hello race condition
          $("#initial-dataset").addClass("active"); //bootstrap doesn't let you just put it in html as initially active
        }
      });
    });
  }

  function processTargetedThreats() {
    var threat_facts = package_facts['targetedthreats'];
    var current_threat_facts = null;
    threat_facts['targets'] = [];
    _.each(threat_facts.pdata, function(item, key) {
      if (_.indexOf(threat_facts.targets, item.target) === -1) {
        threat_facts.targets.push(item.target);
      }
    });
    _.map(threat_facts.targets, function(target_name) {
      current_threat_facts = threat_facts.subpackages[target_name] = makeSubpackage(target_name, threat_facts.pdata, {'target' : target_name});
      current_threat_facts.color = primaryFill;
      _.each(current_threat_facts.pdata, function(item, key) {
        if (_.indexOf(current_threat_facts.countries, item.country) === -1) {
          current_threat_facts.countries.push(item.country);
        }
      });
    });
  }

  // we can select a subset of a _package based on properties {}
  function makeSubpackage(name, data, properties) {
    var subpackage = PackageFacts(name);
    subpackage.pdata = _.filter(data, properties);
    return subpackage;
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
    // todo: final render?
    });
    return res;
  };

  var showDataRegion = function(region, _package) {
    var view_template = _.template($('#view-' + _package).html());
    var view_output = '';

    _.each(package_facts[_package].pdata, function(item, key) {
      if (item.country === region) {
        var package_view = view_template(item);
        view_output += package_view;
      }
    });

    if (view_output) {
      $('#' + _package).html('<p>&nbsp;</p><ul>' + view_output + '</ul>');
    } else {
      $('#' + _package).html('<h4>No ' + _package + ' data found</h4>');
    }
  };

	var showTab = function(tab) {
		var $tab = $('#modal').find('a[href=#' + tab + ']');
		if ($tab.length === 0) {
			// TODO: This fallback should be replaced with code that can handle
			// the targetedthreats sub types (activist, journalist, ...)
			tab = 'targetedthreats';
			$tab = $('#modal').find('a[href=#' + tab + ']');
		}
		showDataRegion(current_country, tab);
		$tab.tab('show');
	}
	
	var showCountry = function(country) { 
    current_country = country;
    var map = $('#map').vectorMap('get', 'mapObject');
    $('#modal').modal();
    $('#modal').find('.modal-title').html('Results for: ' + map.getRegionName(country));
		showTab(active_package.name);
	}

  var showToc = function(data) {
    var html_packages = '';
    var template_packages = _.template($('#view-datapackages').html());

    _.each(data.result, function(_package, key) {
      html_packages += template_packages(_package);
    });

    $('#datapackages').html(html_packages);
  };

  var showDataTable = function(_package) {
    var package_details = _.findWhere(datasets_toc, { data_package: _package });
    var this_package = package_facts[_package.replace(prefix, '')].pdata;

    if (this_package) {
      // Show / Hide HTML
      $('#datapackages-details').hide();
      $('#datapackages').hide();
      $('#datapackages-title').find('h1').html('Dataset: ' + package_details.name);
      $('#datapackages-title').find('p').html(package_details.description);
      $('#show-datasets-toc').removeClass('hidden');
      $('#datatable').show();

      // Build Objects / Render Datatable
      var keys = _.keys(this_package[0]);
      var titles = [];
      _.each(keys, function(item) {
        titles.push({ title: item });
      });

      var data_set = [];
      _.each(this_package, function(entry, key) {
        data_set.push(_.values(entry));
      });

      datatable = $('#datatable').DataTable({
        data: data_set,
        columns: titles
      });
    }
  };

  var showPackages = function() {
    $.ajax({
      url: url_api,
      crossDomain: true,
      dataType: "jsonp",
      jsonp: 'callback',
      success: function(data) {
        showToc(data);
        datasets_toc = data.result;
      }
    });
  };


  function color_map(package_obj, color) {
    var regionValues = {};
    var map = $('#map').vectorMap('get', 'mapObject');

    _.each(package_obj.countries, function(country) {
      regionValues[country] = color;
    });

    map.series.regions[0].setValues(regionValues);
  }

  $(document).on('click', 'a.show-dataset', function(e) {
    e.preventDefault();
    showDataTable($(this).attr('href').replace('#', ''));
  });

  $(document).on('click', '#show-datasets-toc', function(e) {
    e.preventDefault();
    $(this).addClass('hidden');
    datatable.destroy();
    $('#datatable').html('');
    $('#datapackages-title').find('h1').html('Our Datasets');
    $('#datapackages-title').find('p').html('');
    $('#datapackages-details').show();
    $('#datapackages').show();
  });

  $(document).ready(function() {
    // Load data based on pages
    if ($('#map').length || $('#datapackages').length) {
      init_package_facts();
    }

    if ($('#datapackages').length) {
      showPackages();
    }

    if ($('#map').length) {
      $('#map').vectorMap({
        map: 'world_mill',
        backgroundColor: '#ffffff',
        markersSelectable: true,
        markers: {
          "BH": { latLng: [26.02, 50.55], name: 'Bahrain' }
        },
        series: {
          regions: [{ attribute: 'fill' }]
        },
        regionStyle: {
          initial: {
            fill: defaultFill,
            "fill-opacity": 1,
            stroke: 'none',
            "stroke-width": 0,
            "stroke-opacity": 1
          },
          hover: {
            "fill-opacity": 0.8,
            "cursor": 'pointer'
          },
          selected: {
            fill: 'yellow'
          },
          selectedHover: {
            fill: 'yellow'
          }
        },
        // Tiny countries like Bahrain are rendered as markers. Not regions.
        markerStyle: {
          initial: {
            fill: defaultFill,
            stroke: 'none',
          },
          selected: {
            fill: 'yellow'
          }
        },
        onRegionClick: function(event, country) {
					showCountry(country);
        },
        onMarkerClick: function(event, country) {
					showCountry(country);
        }
      });
    }


    $('#country-tabs a').click(function(e) {
			var tab = $(this).attr('href').replace('#', '');
      e.preventDefault();
			showTab(tab);
    });

    $("[class='target-selector'] > a").click(function(e) {
      e.preventDefault();
      console.log(this);
      $(this).tab('show');
      color_map(active_package, defaultFill);
      color_map(package_facts['targetedthreats'], secondaryFill);
      var selection = $(this).attr('href').replace('#', '');
      active_package = package_facts['targetedthreats']['subpackages'][selection];
      color_map(active_package, active_package.color);
    });

    $("[class='dataset-selector'] > a").click(function (e) {
      e.preventDefault();
      console.log(this);
      $(this).tab('show');
      $(".target-selector").removeClass("active"); // tt submenu is no longer active if a dataset has been hit
      color_map(package_facts['targetedthreats'], defaultFill); //super hacked... not that everything else isn't...
      color_map(active_package, defaultFill);
      var selection = $(this).attr('href').replace('#','');
      active_package = package_facts[selection];
      color_map(active_package, active_package.color);
      if ($(this).is("#tt-toggle")) {
        $("#target-selections>ul").removeClass("hide");
      } else {
        $("#target-selections>ul").addClass("hide");
      }
    });
  });
}

module.exports = Map;
