---
layout: default
title: Map
permalink: /map/
---

<h1>Map</h1>

<p>Select a country to get an overview of information available.</p>

<center><div id="map" style="position: relative; width: 100%; height: 600px;"></div></center>

<div class="modal fade" id="modal">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">{{country}}</h4>
        </div>
        <div class="modal-body">
            <p>We have records for {{number}} targeted attack/s in {{country}}, using the following malware families {{list of unique "family" names}}.</p>
            <p>We have records for {{number}} surveillance vendors in {{country}}.</p>
            <p>We have records for {{number}} surveillance resellers in {{country}}.</p>
            <hr />
            <p>For more information, <a href="/country/#{{country code}}">view the country page related to {{country}}</a>.</p>
        </div>
    </div>
  </div>
</div>
