var showToc = function(data) {

  var html_packages = ''
  var template_packages = _.template($('#view-datapackages').html())

  _.each(data.result, function(package, key) {
    html_packages += template_packages(package)
  })

  $('#datapackage').html(html_packages)

}

var showPackages = function() {
  $.ajax({
    url: 'http://dev:8888',
    crossDomain: true,
    dataType: "jsonp",
    jsonp: 'callback',
    success: function(data) {
      showToc(data);
    }
  });
}

$(document).ready(function() {
    showPackages()
})
