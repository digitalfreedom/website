---
layout: default
title: Map
permalink: /map/
---

<script src="{{ "/js/jquery-2.1.4.min.js" | prepend : site.baseurl }}"></script>
<script src="{{ "/bootstrap/js/bootstrap.min.js" | prepend : site.baseurl }}"></script>
<script src="{{ "/js/jquery-jvectormap-2.0.4.min.js" | prepend: site.baseurl }}"></script>
<script src="{{ "/js/jquery-jvectormap-world-mill.js" | prepend: site.baseurl }}"></script>

<h1>Map</h1>

<p>Select a country to get an overview of information available.</p>

<center><div id="map" style="position: relative; width: 100%; height: 600px;"></div></center>

<div class="modal fade" id="modal">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Shit on Syria</h4>
        </div>
        <div class="modal-body">
            <p>Fuk yeah</p>
        </div>
    </div>
  </div>
</div>

<script>
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
        onRegionClick: function(event, code) {
            var map = $('#map').vectorMap('get', 'mapObject');
            $('#modal').modal();
        }
    });
</script>
