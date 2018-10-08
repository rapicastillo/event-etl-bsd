'use strict';

// Global
window.eventTypeFilters = [
//   {
//   name: 'Campaign HQ',
//   id: 'headquarters',
//   onItem: "/img/icon/star.png",
//   offItem: "/img/icon/star-gray.png"
// }
];

window.refreshEventTypes = function () {
  var params = $.deparam(window.location.hash.substring(1));

  $("#filter-list *").remove();
  $("#filter-list").append(window.eventTypeFilters.map(function (d) {
    return $("<li />").append($("<input type='checkbox' class='filter-type' />").attr('name', 'f[]').attr("value", d.id).attr("id", d.id).prop("checked", !params.f ? true : $.inArray(d.id, params.f) >= 0)).append($("<label />").attr('for', d.id).append($("<span />").addClass('filter-on').append(d.onItem ? '<img style=\'width: 14px; height: 14px;\' src=\'' + d.onItem + '\'/>' : $("<span>").addClass('circle-button default-on'))).append($("<span />").addClass('filter-off').append(d.offItem ? '<img style=\'width: 14px; height: 14px;\' src=\'' + d.offItem + '\'/>' : $("<span>").addClass('circle-button default-off'))).append($("<span>").text(d.name)));
  }));
};
"use strict";

//Create an event node
var Event = function ($) {
  return function (properties) {
    var _this = this;

    this.properties = properties;

    this.blip = null;
    // // this.title = properties.field_65;
    // this.url = properties.field_68_raw.url;
    // this.address = properties.field_64;
    // this.listing = null;
    this.className = properties.event_type ? properties.event_type.replace(/[^\w]/ig, "-").toLowerCase() : "";

    // if (properties.url) {
    //   properties.url = properties.facebook ? properties.facebook : (
    //                         properties.twitter ? properties.twitter : null
    //                    )
    //   if (!properties.url) {
    //     return null;
    //   }
    // }

    this.props = {};
    this.props.title = properties.title;
    this.props.url = properties.url; //properties.url.match(/^@/g) ? `http://twitter.com/${properties.url}` : properties.url;
    this.props.start_datetime = properties.start_time;
    this.props.address = properties.venue;
    this.props.supergroup = properties.supergroup;
    this.props.start_time = moment(properties.start_time, 'YYYY-MM-DD HH:mm:ss')._d;

    // Remove the timezone issue from
    this.props.start_time = new Date(this.props.start_time.valueOf());
    this.props.group = properties.group;
    this.props.LatLng = [parseFloat(properties.lat), parseFloat(properties.lng)];
    this.props.event_type = properties.event_type;
    this.props.lat = properties.lat;
    this.props.lng = properties.lng;
    this.props.filters = properties.filters;
    this.props.office_hours = properties.office_hours;

    this.props.social = {
      facebook: properties.facebook,
      email: properties.email,
      phone: properties.phone,
      twitter: properties.twitter
    };

    this.render = function (distance, zipcode) {

      var that = this;

      // var endtime = that.endTime ? moment(that.endTime).format("h:mma") : null;
      if (["Campaign HQ", "Grassroots HQ"].includes(this.props.event_type)) {
        return that.render_group(distance, zipcode);
      } else {
        return that.render_event(distance, zipcode);
      }
    };

    this.render_group = function (distance, zipcode) {
      var that = this;

      var lat = that.props.lat;
      var lon = that.props.lng;

      var social_html = '';
      if (that.props.office_hours) {}

      if (that.props.social) {
        // if (that.props.social.facebook !== '') {
        //   social_html += '<a href=\'' + that.props.social.facebook + '\' target=\'_blank\'><img src=\'/img/icon/facebook.png\' /></a>';
        // }
        // if (that.props.social.twitter !== '') {
        //   social_html += '<a href=\'' + that.props.social.twitter + '\' target=\'_blank\'><img src=\'/img/icon/twitter.png\' /></a>';
        // }
        if (that.props.social.email !== '') {
          social_html += '<a href=\'mailto:' + that.props.social.email + '\' ><img src=\'/img/icon/mailchimp.png\' /></a>';
        }
        if (that.props.social.phone !== '') {
          social_html += '&nbsp;<img src=\'/img/icon/phone.png\' /><span>' + that.props.social.phone + '</span>';
        }
      }

      var new_window = true;
      if (that.props.url.match(/^mailto/g)) {
        new_window = false;
      }

      var rendered = $("<div class=montserrat/>").addClass('event-item ' + that.className).html("\n        <div class=\"event-item lato " + that.className + "\" lat=\"" + lat + "\" lon=\"" + lon + "\">\n          " + (this.isHQ() ? "" : "<h5 class=\"time-info\">" + datetime + "</h5>") + "\n          <h3>\n            <a target=\"_blank\" href=\"" + that.props.url + "\">" + that.props.title + "</a>\n          </h3>\n          <span class=\"label-icon\"></span>\n            " + (this.props.office_hours ? "<h3 style='font-size: 16px; margin-top: 0;'>Office hours: " + that.props.office_hours + "</h3>" : "") + "\n            <h5 class=\"event-type\">" + that.props.event_type + "</h5>\n            <p>" + that.props.address + "</p>\n            " + (this.props.social.phone ? "<p class='contact-line'><img src='/img/icon/phone.png' width=\"15\" height=\"15\" /><span>" + that.props.social.phone + "</span></p>" : '') + "\n            " + (this.props.social.email ? "<p class='contact-line'><img src='/img/icon/mailchimp.png' width=\"15\" height=\"15\" /><span>" + that.props.social.email + "</span></p>" : '') + "\n            <div style='margin-top: 10px;'>\n              <a class=\"rsvp-link\" href=\"" + that.props.url + "\" target=\"_blank\">\n                Visit\n              </a>\n            </div>\n          </div>");

      return rendered.html();
    };

    this.isHQ = function () {
      return _this.props.filters.includes('headquarters') || _this.props.filters.includes('grassroots-hq');
    };
    // console.log(this.props.filters);
    this.render_event = function (distance, zipcode) {
      var that = this;

      var datetime = moment(that.props.start_time).format("MMM DD (ddd) h:mma");
      var lat = that.props.lat;
      var lon = that.props.lng;

      var rendered = $("<div class=montserrat/>").addClass('event-item ' + that.className).html("\n        <div class=\"event-item lato " + that.className + "\" lat=\"" + lat + "\" lon=\"" + lon + "\">\n          " + (this.isHQ() ? "" : "<h5 class=\"time-info\">" + datetime + "</h5>") + "\n          <h3>\n            <a target=\"_blank\" href=\"" + that.props.url + "\">" + that.props.title + "</a>\n          </h3>\n          <span class=\"label-icon\"></span>\n            <h5 class=\"event-type\">" + that.props.event_type + "</h5>\n            <p>" + that.props.address + "</p>\n            " + (this.isHQ() ? "<p><img src='/img/icon/phone.png' width=\"15\" height=\"15\" /> " + that.props.social.phone + "</p>" : '') + "\n            <div style='margin-top: 10px;'>\n              <a class=\"rsvp-link\" href=\"" + that.props.url + "\" target=\"_blank\">\n                " + (this.isHQ() ? 'Visit' : 'RSVP') + "\n              </a>\n            </div>\n          </div>");

      return rendered.html();
    };
  };
}(jQuery); //End of events
"use strict";

/****
 *  MapManager proper
 */
var MapManager = function ($, d3, leaflet) {
  return function (eventData, campaignOffices, zipcodes, options) {
    var allFilters = window.eventTypeFilters.map(function (i) {
      return i.id;
    });

    var popup = L.popup();
    var options = options;
    var zipcodes = zipcodes.reduce(function (zips, item) {
      zips[item.zip] = item;return zips;
    }, {});

    var current_filters = [],
        current_zipcode = "",
        current_distance = "",
        current_sort = "";

    var originalEventList = eventData.map(function (d) {
      return new Event(d);
    });
    var eventsList = originalEventList.slice(0);

    // var officeList = campaignOffices.map(function(d) { return new CampaignOffices(d); });

    // var mapboxTiles = leaflet.tileLayer('http://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + leaflet.mapbox.accessToken, { attribution: '<a href="http://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'});

    var mapboxTiles = leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
    });

    // var mapboxTiles = leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    //   maxZoom: 18,
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
    // });

    var CAMPAIGN_OFFICE_ICON = L.icon({
      iconUrl: '/img/icon/star.png',
      iconSize: [17, 14] });
    var GOTV_CENTER_ICON = L.icon({
      iconUrl: '//d2bq2yf31lju3q.cloudfront.net/img/icon/gotv-star.png',
      iconSize: [13, 10] });
    var defaultCoord = options && options.defaultCoord ? options.defaultCoord : { center: [37.8, -96.9], zoom: 4 };

    var centralMap = new leaflet.Map("map-container", window.customMapCoord ? window.customMapCoord : defaultCoord).addLayer(mapboxTiles);
    if (centralMap) {}

    var overlays = L.layerGroup().addTo(centralMap);
    var offices = L.layerGroup().addTo(centralMap);
    var gotvCenter = L.layerGroup().addTo(centralMap);

    var campaignOfficeLayer = L.layerGroup().addTo(centralMap);

    //initialize map
    var filteredEvents = [];
    var module = {};

    var _popupEvents = function _popupEvents(event) {
      var target = event.target._latlng;

      var filtered = eventsList.filter(function (d) {

        return target.lat == d.props.LatLng[0] && target.lng == d.props.LatLng[1] && (!current_filters || current_filters.length == 0 || $(d.properties.filters).not(current_filters).length != d.properties.filters.length);
      }).sort(function (a, b) {
        return a.props.start_time - b.props.start_time;
      });

      var div = $("<div />").append(filtered.length > 1 ? "<h3 class='sched-count'>" + filtered.length + " Results</h3>" : "").append($("<div class='popup-list-container'/>").append($("<ul class='popup-list'>").append(filtered.map(function (d) {
        return $("<li class=montserrat/>").addClass(d.isFull ? "is-full" : "not-full").addClass(d.visible ? "is-visible" : "not-visible").append(d.render());
      }))));

      setTimeout(function () {
        L.popup().setLatLng(event.target._latlng).setContent(div.html()).openOn(centralMap);
      }, 100);
    };

    /***
     * Initialization
     */
    var initialize = function initialize() {
      var uniqueLocs = eventsList.reduce(function (arr, item) {
        var className = item.properties.filters.join(" ");
        if (arr.indexOf(item.properties.lat + "||" + item.properties.lng + "||" + className) >= 0) {
          return arr;
        } else {
          arr.push(item.properties.lat + "||" + item.properties.lng + "||" + className);
          return arr;
        }
      }, []);

      uniqueLocs = uniqueLocs.map(function (d) {
        var split = d.split("||");
        return { latLng: [parseFloat(split[0]), parseFloat(split[1])],
          className: split[2] };
      });

      var specialDots = window.eventTypeFilters.reduce(function (dict, item) {
        if (item.onItem) {
          item.onItemIcon = L.icon({
            iconUrl: item.onItem,
            iconSize: [14, 14] });
        }

        dict[item.id] = item;
        return dict;
      }, {});

      uniqueLocs.forEach(function (item) {

        // setTimeout(function() {
        // if (item.className == "campaign-office") {
        //   L.marker(item.latLng, {icon: CAMPAIGN_OFFICE_ICON, className: item.className})
        //     .on('click', function(e) { _popupEvents(e); })
        //     .addTo(offices);
        // } else if (item.className == "gotv-center") {
        //   L.marker(item.latLng, {icon: GOTV_CENTER_ICON, className: item.className})
        //     .on('click', function(e) { _popupEvents(e); })
        //     .addTo(gotvCenter);
        // }else
        // if (item.className.match(/\-event/ig)) {
        //   L.circleMarker(item.latLng, { radius: 12, className: item.className, color: 'white', fillColor: '#F55B5B', opacity: 0.8, fillOpacity: 0.7, weight: 2 })
        //     .on('click', function(e) { _popupEvents(e); })
        //     .addTo(overlays);
        // }
        if (specialDots[item.className] && specialDots[item.className].onItemIcon) {
          // console.log(item.className);
          L.marker(item.latLng, { icon: specialDots[item.className].onItemIcon, className: item.className }).on('click', function (e) {
            _popupEvents(e);
          }).addTo(item.className == 'headquarters' ? offices : gotvCenter);
        } else {
          L.circleMarker(item.latLng, { radius: 6, className: item.className, color: 'white', fillColor: '#FF3251', opacity: 0.8, fillOpacity: 0.7, weight: 2 }).on('click', function (e) {
            _popupEvents(e);
          }).addTo(overlays);
        }
        // }, 10);
      });

      // $(".leaflet-overlay-pane").find(".-event").parent().prependTo('.leaflet-zoom-animated');
    }; // End of initialize

    var toMile = function toMile(meter) {
      return meter * 0.00062137;
    };

    var filterEventsByCoords = function filterEventsByCoords(center, distance, filterTypes) {

      var zipLatLng = leaflet.latLng(center);

      var filtered = eventsList.filter(function (d) {
        var dist = toMile(zipLatLng.distanceTo(d.props.LatLng));
        if (dist < distance) {

          d.distance = Math.round(dist * 10) / 10;

          //If no filter was a match on the current filter
          if (options && options.defaultCoord && !filterTypes) {
            return true;
          }

          if ($(d.props.filters).not(filterTypes).length == d.props.filters.length) {
            return false;
          }

          return true;
        }
        return false;
      });

      return filtered;
    };

    var filterEvents = function filterEvents(zipcode, distance, filterTypes) {
      return filterEventsByCoords([parseFloat(zipcode.lat), parseFloat(zipcode.lon)], distance, filterTypes);
    };

    var sortEvents = function sortEvents(filteredEvents, sortType) {
      switch (sortType) {
        case 'distance':
          filteredEvents = filteredEvents.sort(function (a, b) {
            return a.distance - b.distance;
          });
          break;
        default:
          filteredEvents = filteredEvents.sort(function (a, b) {
            return a.props.start_time - b.props.start_time;
          });
          break;
      }

      // filteredEvents = filteredEvents.sort(function(a, b) {
      //   var aFull = a.isFull();
      //   var bFull = b.isFull();

      //   if (aFull && bFull) { return 0; }
      //   else if (aFull && !bFull) { return 1; }
      //   else if (!aFull && bFull) { return -1; }
      // });
      //sort by fullness;
      //..
      return filteredEvents;
    };

    setTimeout(function () {
      initialize();
    }, 10);

    module._eventsList = eventsList;
    module._zipcodes = zipcodes;
    module._options = options;

    /*
    * Refresh map with new events map
    */
    var _refreshMap = function _refreshMap() {
      overlays.clearLayers();
      initialize();
    };

    module.filterByType = function (type) {
      if ($(filters).not(type).length != 0 || $(type).not(filters).length != 0) {
        current_filters = type;

        //Filter only items in the list
        // eventsList = originalEventList.filter(function(eventItem) {
        //   var unmatch = $(eventItem.properties.filters).not(filters);
        //   return unmatch.length != eventItem.properties.filters.length;
        // });


        // var target = type.map(function(i) { return "." + i }).join(",");
        // $(".leaflet-overlay-pane").find("path:not("+type.map(function(i) { return "." + i }).join(",") + ")")

        var toHide = $(allFilters).not(type);

        if (toHide && toHide.length > 0) {
          toHide = toHide.splice(0, toHide.length);
          $(".leaflet-overlay-pane").find("." + toHide.join(",.")).hide();
        }

        if (type && type.length > 0) {
          $(".leaflet-overlay-pane").find("." + type.join(",.")).show();
          // _refreshMap();
        }

        //Specifically for campaign office
        if (!type) {
          centralMap.removeLayer(offices);
        } else if (type && type.indexOf('headquarters') < 0) {
          centralMap.removeLayer(offices);
        } else {
          centralMap.addLayer(offices);
        }

        //For gotv-centers
        if (!type) {
          centralMap.removeLayer(gotvCenter);
        } else if (type && type.indexOf('grassroots-hq') < 0) {
          centralMap.removeLayer(gotvCenter);
        } else {
          centralMap.addLayer(gotvCenter);
        }
      }
      return;
    };

    module.filterByCoords = function (coords, distance, sort, filterTypes) {

      console.log("Entered here");
      //Remove list
      d3.select("#event-list").selectAll("li").remove();

      var filtered = null;
      if (coords == null && distance == null && sort == null && filterTypes == null) {
        filtered = eventsList;
      } else {
        filtered = filterEventsByCoords(coords, parseInt(distance), filterTypes);

        //Sort event
        filtered = sortEvents(filtered, sort, filterTypes);
      }

      //Render event
      var eventList = d3.select("#event-list").selectAll("li").data(filtered, function (d) {
        return d.props.url;
      });

      eventList.enter().append("li").attr("class", function (d) {
        return (d.isFull ? 'is-full' : 'not-full') + " " + (this.visible ? "is-visible" : "not-visible");
      }).classed("lato", true).html(function (d) {
        return d.render(d.distance);
      });

      eventList.exit().remove();

      //add a highlighted marker
      function addhighlightedMarker(lat, lon) {
        var highlightedMarker = new L.circleMarker([lat, lon], { radius: 5, color: '#ea504e', fillColor: '#1462A2', opacity: 0.8, fillOpacity: 0.7, weight: 2 }).addTo(centralMap);
        // event listener to remove highlighted markers
        $(".not-full").mouseout(function () {
          centralMap.removeLayer(highlightedMarker);
        });
      }

      // event listener to get the mouseover
      $(".not-full").mouseover(function () {
        $(this).toggleClass("highlight");
        var cMarkerLat = $(this).children('div').attr('lat');
        var cMarkerLon = $(this).children('div').attr('lon');
        // function call to add highlighted marker
        addhighlightedMarker(cMarkerLat, cMarkerLon);
      });

      //Push all full items to end of list
      $("div#event-list-container ul#event-list li.is-full").appendTo("div#event-list-container ul#event-list");

      //Move campaign offices to

      var officeCount = $("div#event-list-container ul#event-list li .campaign-office").length;
      $("#hide-show-office").attr("data-count", officeCount);
      $("#campaign-off-count").text(officeCount);
      $("section#campaign-offices ul#campaign-office-list *").remove();
      $("div#event-list-container ul#event-list li .campaign-office").parent().appendTo("section#campaign-offices ul#campaign-office-list");
    };

    /***
     * FILTER()  -- When the user submits query, we will look at this.
     */
    module.filter = function (zipcode, distance, sort, filterTypes) {
      //Check type filter

      if (!zipcode || zipcode == "") {
        return;
      }

      //Start if other filters changed
      var targetZipcode = zipcodes[zipcode];

      //Remove list
      d3.select("#event-list").selectAll("li").remove();

      if (targetZipcode == undefined || !targetZipcode) {
        $("#event-list").append("<li class='error lato'>Zipcode does not exist.</li>");
        return;
      }

      //Calibrate map
      var zoom = 4;
      switch (parseInt(distance)) {
        case 5:
          zoom = 12;break;
        case 10:
          zoom = 11;break;
        case 20:
          zoom = 10;break;
        case 50:
          zoom = 9;break;
        case 100:
          zoom = 8;break;
        case 250:
          zoom = 7;break;
        case 500:
          zoom = 5;break;
        case 750:
          zoom = 5;break;
        case 1000:
          zoom = 4;break;
        case 2000:
          zoom = 4;break;
        case 3000:
          zoom = 3;break;
      }
      if (!(targetZipcode.lat && targetZipcode.lat != "")) {
        return;
      }

      if (current_zipcode != zipcode || current_distance != distance) {
        current_zipcode = zipcode;
        current_distance = distance;
        centralMap.setView([parseFloat(targetZipcode.lat), parseFloat(targetZipcode.lon)], zoom);
      }

      var filtered = filterEvents(targetZipcode, parseInt(distance), filterTypes);

      //Sort event
      filtered = sortEvents(filtered, sort, filterTypes);

      //Render event
      var eventList = d3.select("#event-list").selectAll("li").data(filtered, function (d) {
        return d.props.url;
      });

      eventList.enter().append("li").attr("class", function (d) {
        return (d.isFull ? 'is-full' : 'not-full') + " " + (this.visible ? "is-visible" : "not-visible");
      }).classed("lato", true).html(function (d) {
        return d.render(d.distance);
      });

      eventList.exit().remove();

      //add a highlighted marker
      function addhighlightedMarker(lat, lon) {
        var highlightedMarker = new L.circleMarker([lat, lon], { radius: 5, color: '#ea504e', fillColor: '#1462A2', opacity: 0.8, fillOpacity: 0.7, weight: 2 }).addTo(centralMap);
        // event listener to remove highlighted markers
        $(".not-full").mouseout(function () {
          centralMap.removeLayer(highlightedMarker);
        });
      }

      // event listener to get the mouseover
      $(".not-full").mouseover(function () {
        $(this).toggleClass("highlight");
        var cMarkerLat = $(this).children('div').attr('lat');
        var cMarkerLon = $(this).children('div').attr('lon');
        // function call to add highlighted marker
        addhighlightedMarker(cMarkerLat, cMarkerLon);
      });

      //Push all full items to end of list
      $("div#event-list-container ul#event-list li.is-full").appendTo("div#event-list-container ul#event-list");

      //Move campaign offices to

      var officeCount = $("div#event-list-container ul#event-list li .campaign-office").length;
      $("#hide-show-office").attr("data-count", officeCount);
      $("#campaign-off-count").text(officeCount);
      $("section#campaign-offices ul#campaign-office-list *").remove();
      $("div#event-list-container ul#event-list li .campaign-office").parent().appendTo("section#campaign-offices ul#campaign-office-list");
    };

    module.toMapView = function () {
      $("body").removeClass("list-view").addClass("map-view");
      centralMap.invalidateSize();
      centralMap._onResize();
    };
    module.toListView = function () {
      $("body").removeClass("map-view").addClass("list-view");
    };

    module.getMap = function () {
      return centralMap;
    };

    return module;
  };
}(jQuery, d3, L);

var VotingInfoManager = function ($) {
  return function (votingInfo) {
    var module = {};

    function buildRegistrationMessage(state) {
      var $msg = $("<div class='registration-msg'/>").append($("<h3/>").text("Registration deadline: " + moment(new Date(state.registration_deadline)).format("MMM D"))).append($("<p />").html(state.name + " has <strong>" + state.is_open + " " + state.type + "</strong>. " + state.you_must)).append($("<p />").html("Find out where and how to register at <a target='_blank' href='https://#####/" + state.state + "'>#####</a>"));

      return $msg;
    }

    function buildPrimaryInfo(state) {

      var $msg = $("<div class='registration-msg'/>").append($("<h3/>").text("Primary day: " + moment(new Date(state.voting_day)).format("MMM D"))).append($("<p />").html(state.name + " has <strong>" + state.is_open + " " + state.type + "</strong>. " + state.you_must)).append($("<p />").html("Find out where and how to vote at <a target='_blank' href='https://#####/" + state.state + "'>#####</a>"));

      return $msg;
    }

    function buildCaucusInfo(state) {
      var $msg = $("<div class='registration-msg'/>").append($("<h3/>").text("Caucus day: " + moment(new Date(state.voting_day)).format("MMM D"))).append($("<p />").html(state.name + " has <strong>" + state.is_open + " " + state.type + "</strong>. " + state.you_must)).append($("<p />").html("Find out where and how to caucus at <a target='_blank' href='https://#####/" + state.state + "'>#####</a>"));

      return $msg;
    }

    module.getInfo = function (state) {
      var targetState = votingInfo.filter(function (d) {
        return d.state == state;
      })[0]; //return first
      if (!targetState) return null;

      var today = new Date();
      today.setDate(today.getDate() - 1);

      if (today <= new Date(targetState.registration_deadline)) {
        return buildRegistrationMessage(targetState);
      } else if (today <= new Date(targetState.voting_day)) {
        if (targetState.type == "primaries") {
          return buildPrimaryInfo(targetState);
        } else {
          //
          return buildCaucusInfo(targetState);
        }
      } else {
        return null;
      }
    };

    return module;
  };
}(jQuery);

// More events
(function ($) {
  $(document).on("click", function (event, params) {
    $(".event-rsvp-activity").hide();
  });

  $(document).on("click", ".rsvp-link, .event-rsvp-activity", function (event, params) {
    event.stopPropagation();
  });

  //Show email
  $(document).on("show-event-form", function (events, target) {
    var form = $(target).closest(".event-item").find(".event-rsvp-activity");
    form.fadeIn(100);
  });
})(jQuery);
'use strict';

var slugify = function slugify(str) {

  if (str !== undefined) {
    return "";
  }

  return str.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
  .replace(/[^\w\-]+/g, '') // Remove all non-word chars
  .replace(/\-\-+/g, '-') // Replace multiple - with single -
  .replace(/^-+/, '') // Trim - from start of text
  .replace(/-+$/, '') // Trim - from end of text
};

(function ($, d3) {
  var date = new Date();
  $("#loading-icon").show();

  // window.all_events_data = [];
  window.us_zipcodes = null;
  console.log("TEST");
  $.when(function () {})
  // .then(() =>{
  //   return $.ajax({
  //       url: '/data/hq.json',
  //       dataType: 'json',
  //       success: (data) => {
  //         window.all_events_data =  window.all_events_data.concat(data);
  //       },
  //       error: (data, error) => { console.log(data, error); }
  //     });
  // })
  // .done((data) => {})
  .then(function () {
    var defer = $.Deferred();
    d3.csv('//d1y0otadi3knf6.cloudfront.net/d/us_postal_codes.gz', function (zipcodes) {
      defer.resolve(zipcodes);
    });
    return defer.promise();
  }).done(function (zipcodes) {

    window.us_zipcodes = zipcodes;
    var eventTypesDict = window.eventTypeFilters.reduce(function (acc, current) {
      acc[current.name] = current.id;
      return acc;
    }, {});

    $("#loading-icon").hide();
    // Parse Data
    console.log("Entered here", window.all_events_data);
    window.all_events_data = window.all_events_data.map(function (item) {
      item.filters = [];

      if (eventTypesDict[item.event_type]) {
        item.filters.push(eventTypesDict[item.event_type]);
      } else {
        eventTypesDict[item.event_type] = slugify(item.event_type);
        item.filters.push(eventTypesDict[item.event_type]);
        window.eventTypeFilters.push({
          name: item.event_type,
          id: eventTypesDict[item.event_type]
        });
      }

      return item;
    }).filter(function (i) {
      return i !== null;
    });

    // Load Map
    var params = $.deparam(window.location.hash.substring(1));

    // review list-view
    window.refreshEventTypes();
    var oldDate = new Date();

    /* Extract default lat lon */
    var m = /.*\?c=(.+?),(.+?),(\d+)z#?.*/g.exec(window.location.href);
    if (m && m[1] && m[2] && m[3]) {
      var defaultCoord = {
        center: [parseFloat(m[1]), parseFloat(m[2])],
        zoom: parseInt(m[3])
      };
      window.mapManager = MapManager(window.all_events_data, campaignOffices, window.us_zipcodes, {
        defaultCoord: defaultCoord
      });

      window.mapManager.filterByCoords(defaultCoord.center, 50, params.sort, params.f);
    } else {
      window.mapManager = MapManager(window.all_events_data, null, window.us_zipcodes);
    }

    // Refresh
    $(window).trigger("hashchange");
  }).then(function () {
    // Load Connecticut area
    var district_boundary = new L.geoJson(null, {
      clickable: false
    });
    district_boundary.addTo(window.mapManager.getMap());
    $.ajax({
      dataType: "json",
      url: "/static/data/ga.json",
      success: function success(data) {
        $(data.features[0].geometry).each(function (key, data) {
          district_boundary.addData(data).setStyle({
            fillColor: 'rgba(54, 52, 107, 0.6)',
            color: 'rgb(54, 52, 107)'
          });
          if (!params.zipcode || params.zipcode === '') {
            window.mapManager.getMap().fitBounds(district_boundary.getBounds(), { animate: false });
          }
        });
        district_boundary.bringToBack();
      }
    }).error(function () {});
  });

  /** initial loading before activating listeners...*/
  var params = $.deparam(window.location.hash.substring(1));
  if (params.zipcode) {
    $("input[name='zipcode']").val(params.zipcode);
  }

  if (params.distance) {
    $("select[name='distance']").val(params.distance);
  }
  if (params.sort) {
    $("select[name='sort']").val(params.sort);
  }

  /* Prepare filters */
  window.refreshEventTypes();
  /***
   *  define events
   */
  //only numbers
  $("input[name='zipcode']").on('keyup keydown', function (e) {
    if (e.type == 'keydown' && (e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 8 && !(e.keyCode >= 37 || e.keyCode <= 40)) {
      return false;
    }

    if (e.type == 'keyup' && $(this).val().length == 5) {
      if (!(e.keyCode >= 37 && e.keyCode <= 40)) {
        $(this).closest("form#filter-form").submit();
        $("#hidden-button").focus();
      }
    }
  });

  /***
   *  onchange of select
   */
  $(document).on('change', "select[name='distance'],select[name='sort']", function (e) {
    $(this).closest("form#filter-form").submit();
  });

  /**
   * On filter type change
   */
  $(document).on('change', ".filter-type", function (e) {
    $(this).closest("form#filter-form").submit();
  });

  //On submit
  $("form#filter-form").on('submit', function (e) {
    var serial = $(this).serialize();
    window.location.hash = serial;
    e.preventDefault();
    return false;
  });

  $(window).on('hashchange', function (e) {

    $(document).trigger('trigger-update-embed');

    var hash = window.location.hash;
    if (hash.length == 0 || hash.substring(1) == 0) {
      $("#loading-icon").hide();
      window.mapManager.filterByCoords(null, null, null, null);
      return false;
    }

    var params = $.deparam(hash.substring(1));

    //Custom feature for specific default lat/lon
    //lat=40.7415479&lon=-73.8239609&zoom=17
    setTimeout(function () {
      $("#loading-icon").show();

      // If there are no filters defined, will show all events
      if (params.f == null && params.distance !== '') {
        // params.f = window.eventTypeFilters.map((item) => item.id);
        $("input.filter-type").prop("checked", false);
      }


      if (window.mapManager._options && window.mapManager._options.defaultCoord && params.zipcode.length != 5) {
        window.mapManager.filterByType(params.f);
        window.mapManager.filterByCoords(window.mapManager._options.defaultCoord.center, params.distance, params.sort, params.f);
      } else {
        window.mapManager.filterByType(params.f);
        window.mapManager.filter(params.zipcode, params.distance, params.sort, params.f);
      }
      $("#loading-icon").hide();
    }, 10);
    // $("#loading-icon").hide();
    if (params.zipcode.length == 5 && $("body").hasClass("initial-view")) {
      $("#events").removeClass("show-type-filter");
      $("body").removeClass("initial-view");
    }
  });

  var pre = $.deparam(window.location.hash.substring(1));
  if ($("body").hasClass("initial-view")) {
    if ($(window).width() >= 600 && (!pre.zipcode || pre && pre.zipcode.length != 5)) {
      $("#events").addClass("show-type-filter");
    }
  }

  $(document).on('click', 'a#event-show-all', function (e) {
    $("#filter-list").find("input[type=checkbox]").prop("checked", true).trigger("change");
  });

  $(document).on('change', '#filter-list input:checkbox', function (e) {
    // if($("input.filter-type:checked").length == 0) {
    //   $("input.filter-type").prop("checked", true);
    // }
  });
  /**
  Embed Link Elements
  */
  $(document).on('click', 'button.btn.more-items', function (e, opt) {
    $('#embed-area').toggleClass('open');
  });

  $(document).on('click', "#copy-embed", function (e) {
    var copyText = document.getElementById("embed-text");
    copyText.select();
    document.execCommand("Copy");
  });

  $(document).on('trigger-update-embed', function (e) {
    //update embed line
    var hash = $.deparam($("#filter-form").serialize());
    hash.embed = true;
    // $('#embed-area input[name=embed]').val('<iframe src="http://map.staceyabrams.com#' + $.param(hash) + '" width="1100" height="500" frameborder="0"></iframe>');
    $('#embed-area input[name=embed]').val('http://map.staceyabrams.com#' + $.param(hash));
  });
})(jQuery, d3);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvZXZlbnQtdHlwZXMuanMiLCJjbGFzc2VzL2V2ZW50LmpzIiwiY2xhc3Nlcy9tYXAtbWFuYWdlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJldmVudFR5cGVGaWx0ZXJzIiwibmFtZSIsImlkIiwib25JdGVtIiwib2ZmSXRlbSIsInJlZnJlc2hFdmVudFR5cGVzIiwicGFyYW1zIiwiJCIsImRlcGFyYW0iLCJsb2NhdGlvbiIsImhhc2giLCJzdWJzdHJpbmciLCJyZW1vdmUiLCJhcHBlbmQiLCJtYXAiLCJkIiwiYXR0ciIsInByb3AiLCJmIiwiaW5BcnJheSIsImFkZENsYXNzIiwidGV4dCIsIkV2ZW50IiwicHJvcGVydGllcyIsImJsaXAiLCJjbGFzc05hbWUiLCJldmVudF90eXBlIiwicmVwbGFjZSIsInRvTG93ZXJDYXNlIiwicHJvcHMiLCJ0aXRsZSIsInVybCIsInN0YXJ0X2RhdGV0aW1lIiwic3RhcnRfdGltZSIsImFkZHJlc3MiLCJ2ZW51ZSIsInN1cGVyZ3JvdXAiLCJtb21lbnQiLCJfZCIsIkRhdGUiLCJ2YWx1ZU9mIiwiZ3JvdXAiLCJMYXRMbmciLCJwYXJzZUZsb2F0IiwibGF0IiwibG5nIiwiZmlsdGVycyIsIm9mZmljZV9ob3VycyIsInNvY2lhbCIsImZhY2Vib29rIiwiZW1haWwiLCJwaG9uZSIsInR3aXR0ZXIiLCJyZW5kZXIiLCJkaXN0YW5jZSIsInppcGNvZGUiLCJ0aGF0IiwiaW5jbHVkZXMiLCJyZW5kZXJfZ3JvdXAiLCJyZW5kZXJfZXZlbnQiLCJsb24iLCJzb2NpYWxfaHRtbCIsIm5ld193aW5kb3ciLCJtYXRjaCIsInJlbmRlcmVkIiwiaHRtbCIsImlzSFEiLCJkYXRldGltZSIsImZvcm1hdCIsImpRdWVyeSIsIk1hcE1hbmFnZXIiLCJkMyIsImxlYWZsZXQiLCJldmVudERhdGEiLCJjYW1wYWlnbk9mZmljZXMiLCJ6aXBjb2RlcyIsIm9wdGlvbnMiLCJhbGxGaWx0ZXJzIiwiaSIsInBvcHVwIiwiTCIsInJlZHVjZSIsInppcHMiLCJpdGVtIiwiemlwIiwiY3VycmVudF9maWx0ZXJzIiwiY3VycmVudF96aXBjb2RlIiwiY3VycmVudF9kaXN0YW5jZSIsImN1cnJlbnRfc29ydCIsIm9yaWdpbmFsRXZlbnRMaXN0IiwiZXZlbnRzTGlzdCIsInNsaWNlIiwibWFwYm94VGlsZXMiLCJ0aWxlTGF5ZXIiLCJtYXhab29tIiwiYXR0cmlidXRpb24iLCJDQU1QQUlHTl9PRkZJQ0VfSUNPTiIsImljb24iLCJpY29uVXJsIiwiaWNvblNpemUiLCJHT1RWX0NFTlRFUl9JQ09OIiwiZGVmYXVsdENvb3JkIiwiY2VudGVyIiwiem9vbSIsImNlbnRyYWxNYXAiLCJNYXAiLCJjdXN0b21NYXBDb29yZCIsImFkZExheWVyIiwib3ZlcmxheXMiLCJsYXllckdyb3VwIiwiYWRkVG8iLCJvZmZpY2VzIiwiZ290dkNlbnRlciIsImNhbXBhaWduT2ZmaWNlTGF5ZXIiLCJmaWx0ZXJlZEV2ZW50cyIsIm1vZHVsZSIsIl9wb3B1cEV2ZW50cyIsImV2ZW50IiwidGFyZ2V0IiwiX2xhdGxuZyIsImZpbHRlcmVkIiwiZmlsdGVyIiwibGVuZ3RoIiwibm90Iiwic29ydCIsImEiLCJiIiwiZGl2IiwiaXNGdWxsIiwidmlzaWJsZSIsInNldFRpbWVvdXQiLCJzZXRMYXRMbmciLCJzZXRDb250ZW50Iiwib3Blbk9uIiwiaW5pdGlhbGl6ZSIsInVuaXF1ZUxvY3MiLCJhcnIiLCJqb2luIiwiaW5kZXhPZiIsInB1c2giLCJzcGxpdCIsImxhdExuZyIsInNwZWNpYWxEb3RzIiwiZGljdCIsIm9uSXRlbUljb24iLCJmb3JFYWNoIiwibWFya2VyIiwib24iLCJlIiwiY2lyY2xlTWFya2VyIiwicmFkaXVzIiwiY29sb3IiLCJmaWxsQ29sb3IiLCJvcGFjaXR5IiwiZmlsbE9wYWNpdHkiLCJ3ZWlnaHQiLCJ0b01pbGUiLCJtZXRlciIsImZpbHRlckV2ZW50c0J5Q29vcmRzIiwiZmlsdGVyVHlwZXMiLCJ6aXBMYXRMbmciLCJkaXN0IiwiZGlzdGFuY2VUbyIsIk1hdGgiLCJyb3VuZCIsImZpbHRlckV2ZW50cyIsInNvcnRFdmVudHMiLCJzb3J0VHlwZSIsIl9ldmVudHNMaXN0IiwiX3ppcGNvZGVzIiwiX29wdGlvbnMiLCJfcmVmcmVzaE1hcCIsImNsZWFyTGF5ZXJzIiwiZmlsdGVyQnlUeXBlIiwidHlwZSIsInRvSGlkZSIsInNwbGljZSIsImZpbmQiLCJoaWRlIiwic2hvdyIsInJlbW92ZUxheWVyIiwiZmlsdGVyQnlDb29yZHMiLCJjb29yZHMiLCJzZWxlY3QiLCJzZWxlY3RBbGwiLCJwYXJzZUludCIsImV2ZW50TGlzdCIsImRhdGEiLCJlbnRlciIsImNsYXNzZWQiLCJleGl0IiwiYWRkaGlnaGxpZ2h0ZWRNYXJrZXIiLCJoaWdobGlnaHRlZE1hcmtlciIsIm1vdXNlb3V0IiwibW91c2VvdmVyIiwidG9nZ2xlQ2xhc3MiLCJjTWFya2VyTGF0IiwiY2hpbGRyZW4iLCJjTWFya2VyTG9uIiwiYXBwZW5kVG8iLCJvZmZpY2VDb3VudCIsInBhcmVudCIsInRhcmdldFppcGNvZGUiLCJ1bmRlZmluZWQiLCJzZXRWaWV3IiwidG9NYXBWaWV3IiwicmVtb3ZlQ2xhc3MiLCJpbnZhbGlkYXRlU2l6ZSIsIl9vblJlc2l6ZSIsInRvTGlzdFZpZXciLCJnZXRNYXAiLCJWb3RpbmdJbmZvTWFuYWdlciIsInZvdGluZ0luZm8iLCJidWlsZFJlZ2lzdHJhdGlvbk1lc3NhZ2UiLCJzdGF0ZSIsIiRtc2ciLCJyZWdpc3RyYXRpb25fZGVhZGxpbmUiLCJpc19vcGVuIiwieW91X211c3QiLCJidWlsZFByaW1hcnlJbmZvIiwidm90aW5nX2RheSIsImJ1aWxkQ2F1Y3VzSW5mbyIsImdldEluZm8iLCJ0YXJnZXRTdGF0ZSIsInRvZGF5Iiwic2V0RGF0ZSIsImdldERhdGUiLCJkb2N1bWVudCIsInN0b3BQcm9wYWdhdGlvbiIsImV2ZW50cyIsImZvcm0iLCJjbG9zZXN0IiwiZmFkZUluIiwic2x1Z2lmeSIsInN0ciIsInRvU3RyaW5nIiwiZGF0ZSIsImFsbF9ldmVudHNfZGF0YSIsInVzX3ppcGNvZGVzIiwiY29uc29sZSIsImxvZyIsIndoZW4iLCJ0aGVuIiwiZGVmZXIiLCJEZWZlcnJlZCIsImNzdiIsInJlc29sdmUiLCJwcm9taXNlIiwiZG9uZSIsImFqYXgiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJjb25jYXQiLCJldmVudFR5cGVzRGljdCIsImFjYyIsImN1cnJlbnQiLCJvbGREYXRlIiwibSIsImV4ZWMiLCJocmVmIiwibWFwTWFuYWdlciIsInRyaWdnZXIiLCJkaXN0cmljdF9ib3VuZGFyeSIsImdlb0pzb24iLCJjbGlja2FibGUiLCJmZWF0dXJlcyIsImdlb21ldHJ5IiwiZWFjaCIsImtleSIsImFkZERhdGEiLCJzZXRTdHlsZSIsImZpdEJvdW5kcyIsImdldEJvdW5kcyIsImFuaW1hdGUiLCJicmluZ1RvQmFjayIsImVycm9yIiwidmFsIiwia2V5Q29kZSIsInN1Ym1pdCIsImZvY3VzIiwic2VyaWFsIiwic2VyaWFsaXplIiwicHJldmVudERlZmF1bHQiLCJoYXNDbGFzcyIsInByZSIsIndpZHRoIiwib3B0IiwiY29weVRleHQiLCJnZXRFbGVtZW50QnlJZCIsImV4ZWNDb21tYW5kIiwiZW1iZWQiLCJwYXJhbSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxPQUFPQyxnQkFBUCxHQUEwQixDQUN4QjtBQUNFQyxRQUFNLGFBRFI7QUFFRUMsTUFBSSxjQUZOO0FBR0VDLFVBQVEsb0JBSFY7QUFJRUMsV0FBUztBQUpYLENBRHdCLENBQTFCOztBQVVBTCxPQUFPTSxpQkFBUCxHQUEyQixZQUFNO0FBQy9CLE1BQUlDLFNBQVNDLEVBQUVDLE9BQUYsQ0FBVVQsT0FBT1UsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjs7QUFFQUosSUFBRSxnQkFBRixFQUFvQkssTUFBcEI7QUFDQUwsSUFBRSxjQUFGLEVBQWtCTSxNQUFsQixDQUNFZCxPQUFPQyxnQkFBUCxDQUF3QmMsR0FBeEIsQ0FBNEIsVUFBU0MsQ0FBVCxFQUFZ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QUFyRSxDQUE2RSxRQUE3RTtBQUNELEdBRkQ7O0FBSUE5UCxJQUFFNE4sUUFBRixFQUFZaEYsRUFBWixDQUFlLFFBQWYsRUFBeUIsNkJBQXpCLEVBQXdELFVBQUNDLENBQUQsRUFBTztBQUM3RDtBQUNBO0FBQ0E7QUFDRCxHQUpEO0FBS0E7OztBQUdBN0ksSUFBRTROLFFBQUYsRUFBWWhGLEVBQVosQ0FBZSxPQUFmLEVBQXdCLHVCQUF4QixFQUFpRCxVQUFVQyxDQUFWLEVBQWEwSSxHQUFiLEVBQWtCO0FBQ2pFdlIsTUFBRSxhQUFGLEVBQWlCNEwsV0FBakIsQ0FBNkIsTUFBN0I7QUFDRCxHQUZEOztBQUlBNUwsSUFBRTROLFFBQUYsRUFBWWhGLEVBQVosQ0FBZSxPQUFmLEVBQXdCLGFBQXhCLEVBQXVDLFVBQUNDLENBQUQsRUFBTztBQUM1QyxRQUFJMkksV0FBVzVELFNBQVM2RCxjQUFULENBQXdCLFlBQXhCLENBQWY7QUFDQUQsYUFBU3hHLE1BQVQ7QUFDQTRDLGFBQVM4RCxXQUFULENBQXFCLE1BQXJCO0FBQ0QsR0FKRDs7QUFNQTFSLElBQUU0TixRQUFGLEVBQVloRixFQUFaLENBQWUsc0JBQWYsRUFBdUMsVUFBVUMsQ0FBVixFQUFhO0FBQ2xEO0FBQ0EsUUFBSTFJLE9BQU9ILEVBQUVDLE9BQUYsQ0FBVUQsRUFBRSxjQUFGLEVBQWtCa1IsU0FBbEIsRUFBVixDQUFYO0FBQ0EvUSxTQUFLd1IsS0FBTCxHQUFhLElBQWI7QUFDQTtBQUNBM1IsTUFBRSwrQkFBRixFQUFtQzZRLEdBQW5DLENBQXVDLGlDQUFpQzdRLEVBQUU0UixLQUFGLENBQVF6UixJQUFSLENBQXhFO0FBQ0QsR0FORDtBQVFELENBdlFELEVBdVFHMkQsTUF2UUgsRUF1UVdFLEVBdlFYIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEdsb2JhbFxud2luZG93LmV2ZW50VHlwZUZpbHRlcnMgPSBbXG4gIHtcbiAgICBuYW1lOiAnQ2FtcGFpZ24gSFEnLFxuICAgIGlkOiAnaGVhZHF1YXJ0ZXJzJyxcbiAgICBvbkl0ZW06IFwiL2ltZy9pY29uL3N0YXIucG5nXCIsXG4gICAgb2ZmSXRlbTogXCIvaW1nL2ljb24vc3Rhci1ncmF5LnBuZ1wiXG4gIH1cbl07XG5cblxud2luZG93LnJlZnJlc2hFdmVudFR5cGVzID0gKCkgPT4ge1xuICB2YXIgcGFyYW1zID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cbiAgJChcIiNmaWx0ZXItbGlzdCAqXCIpLnJlbW92ZSgpO1xuICAkKFwiI2ZpbHRlci1saXN0XCIpLmFwcGVuZChcbiAgICB3aW5kb3cuZXZlbnRUeXBlRmlsdGVycy5tYXAoZnVuY3Rpb24oZCkge1xuICAgICAgcmV0dXJuICQoXCI8bGkgLz5cIilcbiAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyBjbGFzcz0nZmlsdGVyLXR5cGUnIC8+XCIpXG4gICAgICAgICAgLmF0dHIoJ25hbWUnLCAnZltdJylcbiAgICAgICAgICAuYXR0cihcInZhbHVlXCIsIGQuaWQpXG4gICAgICAgICAgLmF0dHIoXCJpZFwiLCBkLmlkKVxuICAgICAgICAgIC5wcm9wKFwiY2hlY2tlZFwiLCAhcGFyYW1zLmYgPyB0cnVlIDogJC5pbkFycmF5KGQuaWQsIHBhcmFtcy5mKSA+PSAwKVxuICAgICAgICApXG4gICAgICAgIC5hcHBlbmQoJChcIjxsYWJlbCAvPlwiKS5hdHRyKCdmb3InLCBkLmlkKVxuICAgICAgICAuYXBwZW5kKCQoXCI8c3BhbiAvPlwiKS5hZGRDbGFzcygnZmlsdGVyLW9uJylcbiAgICAgICAgLmFwcGVuZChkLm9uSXRlbSA/IGA8aW1nIHN0eWxlPSd3aWR0aDogMTRweDsgaGVpZ2h0OiAxNHB4Oycgc3JjPScke2Qub25JdGVtfScvPmAgOiAkKFwiPHNwYW4+XCIpLmFkZENsYXNzKCdjaXJjbGUtYnV0dG9uIGRlZmF1bHQtb24nKSkpXG4gICAgICAgIC5hcHBlbmQoJChcIjxzcGFuIC8+XCIpLmFkZENsYXNzKCdmaWx0ZXItb2ZmJylcbiAgICAgICAgLmFwcGVuZChkLm9mZkl0ZW0gPyBgPGltZyBzdHlsZT0nd2lkdGg6IDE0cHg7IGhlaWdodDogMTRweDsnIHNyYz0nJHtkLm9mZkl0ZW19Jy8+YCA6ICQoXCI8c3Bhbj5cIikuYWRkQ2xhc3MoJ2NpcmNsZS1idXR0b24gZGVmYXVsdC1vZmYnKSkpXG4gICAgICAgIC5hcHBlbmQoJChcIjxzcGFuPlwiKS50ZXh0KGQubmFtZSkpKTtcbiAgICB9KVxuICApO1xufTtcbiIsIi8vQ3JlYXRlIGFuIGV2ZW50IG5vZGVcbnZhciBFdmVudCA9IGZ1bmN0aW9uICgkKSB7XG4gIHJldHVybiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcblxuICAgIHRoaXMuYmxpcCA9IG51bGw7XG4gICAgLy8gLy8gdGhpcy50aXRsZSA9IHByb3BlcnRpZXMuZmllbGRfNjU7XG4gICAgLy8gdGhpcy51cmwgPSBwcm9wZXJ0aWVzLmZpZWxkXzY4X3Jhdy51cmw7XG4gICAgLy8gdGhpcy5hZGRyZXNzID0gcHJvcGVydGllcy5maWVsZF82NDtcbiAgICAvLyB0aGlzLmxpc3RpbmcgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gcHJvcGVydGllcy5ldmVudF90eXBlLnJlcGxhY2UoL1teXFx3XS9pZywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAvLyBpZiAocHJvcGVydGllcy51cmwpIHtcbiAgICAvLyAgIHByb3BlcnRpZXMudXJsID0gcHJvcGVydGllcy5mYWNlYm9vayA/IHByb3BlcnRpZXMuZmFjZWJvb2sgOiAoXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcy50d2l0dGVyID8gcHJvcGVydGllcy50d2l0dGVyIDogbnVsbFxuICAgIC8vICAgICAgICAgICAgICAgICAgICApXG4gICAgLy8gICBpZiAoIXByb3BlcnRpZXMudXJsKSB7XG4gICAgLy8gICAgIHJldHVybiBudWxsO1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIHRoaXMucHJvcHMgPSB7fTtcbiAgICB0aGlzLnByb3BzLnRpdGxlID0gcHJvcGVydGllcy50aXRsZTtcbiAgICB0aGlzLnByb3BzLnVybCA9IHByb3BlcnRpZXMudXJsOyAvL3Byb3BlcnRpZXMudXJsLm1hdGNoKC9eQC9nKSA/IGBodHRwOi8vdHdpdHRlci5jb20vJHtwcm9wZXJ0aWVzLnVybH1gIDogcHJvcGVydGllcy51cmw7XG4gICAgdGhpcy5wcm9wcy5zdGFydF9kYXRldGltZSA9IHByb3BlcnRpZXMuc3RhcnRfdGltZTtcbiAgICB0aGlzLnByb3BzLmFkZHJlc3MgPSBwcm9wZXJ0aWVzLnZlbnVlO1xuICAgIHRoaXMucHJvcHMuc3VwZXJncm91cCA9IHByb3BlcnRpZXMuc3VwZXJncm91cDtcbiAgICB0aGlzLnByb3BzLnN0YXJ0X3RpbWUgPSBtb21lbnQocHJvcGVydGllcy5zdGFydF90aW1lLCAnWVlZWS1NTS1ERCBISDptbTpzcycpLl9kO1xuXG4gICAgLy8gUmVtb3ZlIHRoZSB0aW1lem9uZSBpc3N1ZSBmcm9tXG4gICAgdGhpcy5wcm9wcy5zdGFydF90aW1lID0gbmV3IERhdGUodGhpcy5wcm9wcy5zdGFydF90aW1lLnZhbHVlT2YoKSk7XG4gICAgdGhpcy5wcm9wcy5ncm91cCA9IHByb3BlcnRpZXMuZ3JvdXA7XG4gICAgdGhpcy5wcm9wcy5MYXRMbmcgPSBbcGFyc2VGbG9hdChwcm9wZXJ0aWVzLmxhdCksIHBhcnNlRmxvYXQocHJvcGVydGllcy5sbmcpXTtcbiAgICB0aGlzLnByb3BzLmV2ZW50X3R5cGUgPSBwcm9wZXJ0aWVzLmV2ZW50X3R5cGU7XG4gICAgdGhpcy5wcm9wcy5sYXQgPSBwcm9wZXJ0aWVzLmxhdDtcbiAgICB0aGlzLnByb3BzLmxuZyA9IHByb3BlcnRpZXMubG5nO1xuICAgIHRoaXMucHJvcHMuZmlsdGVycyA9IHByb3BlcnRpZXMuZmlsdGVycztcbiAgICB0aGlzLnByb3BzLm9mZmljZV9ob3VycyA9IHByb3BlcnRpZXMub2ZmaWNlX2hvdXJzO1xuXG4gICAgdGhpcy5wcm9wcy5zb2NpYWwgPSB7XG4gICAgICBmYWNlYm9vazogcHJvcGVydGllcy5mYWNlYm9vayxcbiAgICAgIGVtYWlsOiBwcm9wZXJ0aWVzLmVtYWlsLFxuICAgICAgcGhvbmU6IHByb3BlcnRpZXMucGhvbmUsXG4gICAgICB0d2l0dGVyOiBwcm9wZXJ0aWVzLnR3aXR0ZXJcbiAgICB9O1xuXG4gICAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbiAoZGlzdGFuY2UsIHppcGNvZGUpIHtcblxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAvLyB2YXIgZW5kdGltZSA9IHRoYXQuZW5kVGltZSA/IG1vbWVudCh0aGF0LmVuZFRpbWUpLmZvcm1hdChcImg6bW1hXCIpIDogbnVsbDtcbiAgICAgIGlmIChbXCJDYW1wYWlnbiBIUVwiLCBcIkdyYXNzcm9vdHMgSFFcIl0uaW5jbHVkZXModGhpcy5wcm9wcy5ldmVudF90eXBlKSkge1xuICAgICAgICByZXR1cm4gdGhhdC5yZW5kZXJfZ3JvdXAoZGlzdGFuY2UsIHppcGNvZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoYXQucmVuZGVyX2V2ZW50KGRpc3RhbmNlLCB6aXBjb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5yZW5kZXJfZ3JvdXAgPSBmdW5jdGlvbiAoZGlzdGFuY2UsIHppcGNvZGUpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgdmFyIGxhdCA9IHRoYXQucHJvcHMubGF0O1xuICAgICAgdmFyIGxvbiA9IHRoYXQucHJvcHMubG5nO1xuXG4gICAgICB2YXIgc29jaWFsX2h0bWwgPSAnJztcbiAgICAgIGlmICh0aGF0LnByb3BzLm9mZmljZV9ob3Vycykge1xuXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGF0LnByb3BzLnNvY2lhbCkge1xuICAgICAgICAvLyBpZiAodGhhdC5wcm9wcy5zb2NpYWwuZmFjZWJvb2sgIT09ICcnKSB7XG4gICAgICAgIC8vICAgc29jaWFsX2h0bWwgKz0gJzxhIGhyZWY9XFwnJyArIHRoYXQucHJvcHMuc29jaWFsLmZhY2Vib29rICsgJ1xcJyB0YXJnZXQ9XFwnX2JsYW5rXFwnPjxpbWcgc3JjPVxcJy9pbWcvaWNvbi9mYWNlYm9vay5wbmdcXCcgLz48L2E+JztcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBpZiAodGhhdC5wcm9wcy5zb2NpYWwudHdpdHRlciAhPT0gJycpIHtcbiAgICAgICAgLy8gICBzb2NpYWxfaHRtbCArPSAnPGEgaHJlZj1cXCcnICsgdGhhdC5wcm9wcy5zb2NpYWwudHdpdHRlciArICdcXCcgdGFyZ2V0PVxcJ19ibGFua1xcJz48aW1nIHNyYz1cXCcvaW1nL2ljb24vdHdpdHRlci5wbmdcXCcgLz48L2E+JztcbiAgICAgICAgLy8gfVxuICAgICAgICBpZiAodGhhdC5wcm9wcy5zb2NpYWwuZW1haWwgIT09ICcnKSB7XG4gICAgICAgICAgc29jaWFsX2h0bWwgKz0gJzxhIGhyZWY9XFwnbWFpbHRvOicgKyB0aGF0LnByb3BzLnNvY2lhbC5lbWFpbCArICdcXCcgPjxpbWcgc3JjPVxcJy9pbWcvaWNvbi9tYWlsY2hpbXAucG5nXFwnIC8+PC9hPic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoYXQucHJvcHMuc29jaWFsLnBob25lICE9PSAnJykge1xuICAgICAgICAgIHNvY2lhbF9odG1sICs9ICcmbmJzcDs8aW1nIHNyYz1cXCcvaW1nL2ljb24vcGhvbmUucG5nXFwnIC8+PHNwYW4+JyArIHRoYXQucHJvcHMuc29jaWFsLnBob25lICsgJzwvc3Bhbj4nO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdfd2luZG93ID0gdHJ1ZTtcbiAgICAgIGlmICh0aGF0LnByb3BzLnVybC5tYXRjaCgvXm1haWx0by9nKSkge1xuICAgICAgICBuZXdfd2luZG93ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciByZW5kZXJlZCA9ICQoXCI8ZGl2IGNsYXNzPW1vbnRzZXJyYXQvPlwiKS5hZGRDbGFzcygnZXZlbnQtaXRlbSAnICsgdGhhdC5jbGFzc05hbWUpLmh0bWwoYFxuICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnQtaXRlbSBsYXRvICR7dGhhdC5jbGFzc05hbWV9XCIgbGF0PVwiJHtsYXR9XCIgbG9uPVwiJHtsb259XCI+XG4gICAgICAgICAgJHt0aGlzLmlzSFEoKSA/IFwiXCIgOiBgPGg1IGNsYXNzPVwidGltZS1pbmZvXCI+JHtkYXRldGltZX08L2g1PmB9XG4gICAgICAgICAgPGgzPlxuICAgICAgICAgICAgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7dGhhdC5wcm9wcy51cmx9XCI+JHt0aGF0LnByb3BzLnRpdGxlfTwvYT5cbiAgICAgICAgICA8L2gzPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWwtaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICR7dGhpcy5wcm9wcy5vZmZpY2VfaG91cnMgPyBgPGgzIHN0eWxlPSdmb250LXNpemU6IDE2cHg7IG1hcmdpbi10b3A6IDA7Jz5PZmZpY2UgaG91cnM6ICR7dGhhdC5wcm9wcy5vZmZpY2VfaG91cnN9PC9oMz5gIDogXCJcIn1cbiAgICAgICAgICAgIDxoNSBjbGFzcz1cImV2ZW50LXR5cGVcIj4ke3RoYXQucHJvcHMuZXZlbnRfdHlwZX08L2g1PlxuICAgICAgICAgICAgPHA+JHt0aGF0LnByb3BzLmFkZHJlc3N9PC9wPlxuICAgICAgICAgICAgJHt0aGlzLnByb3BzLnNvY2lhbC5waG9uZSA/IGA8cCBjbGFzcz0nY29udGFjdC1saW5lJz48aW1nIHNyYz0nL2ltZy9pY29uL3Bob25lLnBuZycgd2lkdGg9XCIxNVwiIGhlaWdodD1cIjE1XCIgLz48c3Bhbj4ke3RoYXQucHJvcHMuc29jaWFsLnBob25lfTwvc3Bhbj48L3A+YCA6ICcnfVxuICAgICAgICAgICAgJHt0aGlzLnByb3BzLnNvY2lhbC5lbWFpbCA/IGA8cCBjbGFzcz0nY29udGFjdC1saW5lJz48aW1nIHNyYz0nL2ltZy9pY29uL21haWxjaGltcC5wbmcnIHdpZHRoPVwiMTVcIiBoZWlnaHQ9XCIxNVwiIC8+PHNwYW4+JHt0aGF0LnByb3BzLnNvY2lhbC5lbWFpbH08L3NwYW4+PC9wPmAgOiAnJ31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9J21hcmdpbi10b3A6IDEwcHg7Jz5cbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJyc3ZwLWxpbmtcIiBocmVmPVwiJHt0aGF0LnByb3BzLnVybH1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cbiAgICAgICAgICAgICAgICBWaXNpdFxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5gKTtcblxuICAgICAgcmV0dXJuIHJlbmRlcmVkLmh0bWwoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5pc0hRID0gKCkgPT4gdGhpcy5wcm9wcy5maWx0ZXJzLmluY2x1ZGVzKCdoZWFkcXVhcnRlcnMnKSB8fCB0aGlzLnByb3BzLmZpbHRlcnMuaW5jbHVkZXMoJ2dyYXNzcm9vdHMtaHEnKTtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnByb3BzLmZpbHRlcnMpO1xuICAgIHRoaXMucmVuZGVyX2V2ZW50ID0gZnVuY3Rpb24gKGRpc3RhbmNlLCB6aXBjb2RlKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIHZhciBkYXRldGltZSA9IG1vbWVudCh0aGF0LnByb3BzLnN0YXJ0X3RpbWUpLmZvcm1hdChcIk1NTSBERCAoZGRkKSBoOm1tYVwiKTtcbiAgICAgIHZhciBsYXQgPSB0aGF0LnByb3BzLmxhdDtcbiAgICAgIHZhciBsb24gPSB0aGF0LnByb3BzLmxuZztcblxuICAgICAgdmFyIHJlbmRlcmVkID0gJChcIjxkaXYgY2xhc3M9bW9udHNlcnJhdC8+XCIpLmFkZENsYXNzKCdldmVudC1pdGVtICcgKyB0aGF0LmNsYXNzTmFtZSkuaHRtbChgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJldmVudC1pdGVtIGxhdG8gJHt0aGF0LmNsYXNzTmFtZX1cIiBsYXQ9XCIke2xhdH1cIiBsb249XCIke2xvbn1cIj5cbiAgICAgICAgICAke3RoaXMuaXNIUSgpID8gXCJcIiA6IGA8aDUgY2xhc3M9XCJ0aW1lLWluZm9cIj4ke2RhdGV0aW1lfTwvaDU+YH1cbiAgICAgICAgICA8aDM+XG4gICAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiJHt0aGF0LnByb3BzLnVybH1cIj4ke3RoYXQucHJvcHMudGl0bGV9PC9hPlxuICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbC1pY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgPGg1IGNsYXNzPVwiZXZlbnQtdHlwZVwiPiR7dGhhdC5wcm9wcy5ldmVudF90eXBlfTwvaDU+XG4gICAgICAgICAgICA8cD4ke3RoYXQucHJvcHMuYWRkcmVzc308L3A+XG4gICAgICAgICAgICAke3RoaXMuaXNIUSgpID8gYDxwPjxpbWcgc3JjPScvaW1nL2ljb24vcGhvbmUucG5nJyB3aWR0aD1cIjE1XCIgaGVpZ2h0PVwiMTVcIiAvPiAke3RoYXQucHJvcHMuc29jaWFsLnBob25lfTwvcD5gIDogJyd9XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPSdtYXJnaW4tdG9wOiAxMHB4Oyc+XG4gICAgICAgICAgICAgIDxhIGNsYXNzPVwicnN2cC1saW5rXCIgaHJlZj1cIiR7dGhhdC5wcm9wcy51cmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG4gICAgICAgICAgICAgICAgJHsgdGhpcy5pc0hRKCkgPyAnVmlzaXQnIDogJ1JTVlAnfVxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5gKTtcblxuICAgICAgcmV0dXJuIHJlbmRlcmVkLmh0bWwoKTtcbiAgICB9O1xuICB9O1xuXG59KGpRdWVyeSk7IC8vRW5kIG9mIGV2ZW50c1xuIiwiLyoqKipcbiAqICBNYXBNYW5hZ2VyIHByb3BlclxuICovXG52YXIgTWFwTWFuYWdlciA9IGZ1bmN0aW9uICgkLCBkMywgbGVhZmxldCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50RGF0YSwgY2FtcGFpZ25PZmZpY2VzLCB6aXBjb2Rlcywgb3B0aW9ucykge1xuICAgIHZhciBhbGxGaWx0ZXJzID0gd2luZG93LmV2ZW50VHlwZUZpbHRlcnMubWFwKGZ1bmN0aW9uIChpKSB7XG4gICAgICByZXR1cm4gaS5pZDtcbiAgICB9KTtcblxuICAgIHZhciBwb3B1cCA9IEwucG9wdXAoKTtcbiAgICB2YXIgb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdmFyIHppcGNvZGVzID0gemlwY29kZXMucmVkdWNlKGZ1bmN0aW9uICh6aXBzLCBpdGVtKSB7XG4gICAgICB6aXBzW2l0ZW0uemlwXSA9IGl0ZW07cmV0dXJuIHppcHM7XG4gICAgfSwge30pO1xuXG4gICAgdmFyIGN1cnJlbnRfZmlsdGVycyA9IFtdLFxuICAgICAgICBjdXJyZW50X3ppcGNvZGUgPSBcIlwiLFxuICAgICAgICBjdXJyZW50X2Rpc3RhbmNlID0gXCJcIixcbiAgICAgICAgY3VycmVudF9zb3J0ID0gXCJcIjtcblxuICAgIHZhciBvcmlnaW5hbEV2ZW50TGlzdCA9IGV2ZW50RGF0YS5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgIHJldHVybiBuZXcgRXZlbnQoZCk7XG4gICAgfSk7XG4gICAgdmFyIGV2ZW50c0xpc3QgPSBvcmlnaW5hbEV2ZW50TGlzdC5zbGljZSgwKTtcblxuICAgIC8vIHZhciBvZmZpY2VMaXN0ID0gY2FtcGFpZ25PZmZpY2VzLm1hcChmdW5jdGlvbihkKSB7IHJldHVybiBuZXcgQ2FtcGFpZ25PZmZpY2VzKGQpOyB9KTtcblxuICAgIC8vIHZhciBtYXBib3hUaWxlcyA9IGxlYWZsZXQudGlsZUxheWVyKCdodHRwOi8ve3N9LnRpbGVzLm1hcGJveC5jb20vdjQvbWFwYm94LnN0cmVldHMve3p9L3t4fS97eX0ucG5nP2FjY2Vzc190b2tlbj0nICsgbGVhZmxldC5tYXBib3guYWNjZXNzVG9rZW4sIHsgYXR0cmlidXRpb246ICc8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIiB0YXJnZXQ9XCJfYmxhbmtcIj4mY29weTsgT3BlblN0cmVldE1hcCBjb250cmlidXRvcnM8L2E+J30pO1xuXG4gICAgdmFyIG1hcGJveFRpbGVzID0gbGVhZmxldC50aWxlTGF5ZXIoJ2h0dHBzOi8vY2FydG9kYi1iYXNlbWFwcy17c30uZ2xvYmFsLnNzbC5mYXN0bHkubmV0L2xpZ2h0X2FsbC97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICBtYXhab29tOiAxOCxcbiAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+LCAmY29weTs8YSBocmVmPVwiaHR0cHM6Ly9jYXJ0by5jb20vYXR0cmlidXRpb25cIj5DQVJUTzwvYT4nXG4gICAgfSk7XG5cbiAgICAvLyB2YXIgbWFwYm94VGlsZXMgPSBsZWFmbGV0LnRpbGVMYXllcignaHR0cHM6Ly9jYXJ0b2RiLWJhc2VtYXBzLXtzfS5nbG9iYWwuc3NsLmZhc3RseS5uZXQvbGlnaHRfYWxsL3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAvLyAgIG1heFpvb206IDE4LFxuICAgIC8vICAgYXR0cmlidXRpb246ICcmY29weTsgPGEgaHJlZj1cImh0dHA6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4sICZjb3B5OzxhIGhyZWY9XCJodHRwczovL2NhcnRvLmNvbS9hdHRyaWJ1dGlvblwiPkNBUlRPPC9hPidcbiAgICAvLyB9KTtcblxuICAgIHZhciBDQU1QQUlHTl9PRkZJQ0VfSUNPTiA9IEwuaWNvbih7XG4gICAgICBpY29uVXJsOiAnL2ltZy9pY29uL3N0YXIucG5nJyxcbiAgICAgIGljb25TaXplOiBbMTcsIDE0XSB9KTtcbiAgICB2YXIgR09UVl9DRU5URVJfSUNPTiA9IEwuaWNvbih7XG4gICAgICBpY29uVXJsOiAnLy9kMmJxMnlmMzFsanUzcS5jbG91ZGZyb250Lm5ldC9pbWcvaWNvbi9nb3R2LXN0YXIucG5nJyxcbiAgICAgIGljb25TaXplOiBbMTMsIDEwXSB9KTtcbiAgICB2YXIgZGVmYXVsdENvb3JkID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlZmF1bHRDb29yZCA/IG9wdGlvbnMuZGVmYXVsdENvb3JkIDogeyBjZW50ZXI6IFszNy44LCAtOTYuOV0sIHpvb206IDQgfTtcblxuICAgIHZhciBjZW50cmFsTWFwID0gbmV3IGxlYWZsZXQuTWFwKFwibWFwLWNvbnRhaW5lclwiLCB3aW5kb3cuY3VzdG9tTWFwQ29vcmQgPyB3aW5kb3cuY3VzdG9tTWFwQ29vcmQgOiBkZWZhdWx0Q29vcmQpLmFkZExheWVyKG1hcGJveFRpbGVzKTtcbiAgICBpZiAoY2VudHJhbE1hcCkge31cblxuICAgIHZhciBvdmVybGF5cyA9IEwubGF5ZXJHcm91cCgpLmFkZFRvKGNlbnRyYWxNYXApO1xuICAgIHZhciBvZmZpY2VzID0gTC5sYXllckdyb3VwKCkuYWRkVG8oY2VudHJhbE1hcCk7XG4gICAgdmFyIGdvdHZDZW50ZXIgPSBMLmxheWVyR3JvdXAoKS5hZGRUbyhjZW50cmFsTWFwKTtcblxuICAgIHZhciBjYW1wYWlnbk9mZmljZUxheWVyID0gTC5sYXllckdyb3VwKCkuYWRkVG8oY2VudHJhbE1hcCk7XG5cbiAgICAvL2luaXRpYWxpemUgbWFwXG4gICAgdmFyIGZpbHRlcmVkRXZlbnRzID0gW107XG4gICAgdmFyIG1vZHVsZSA9IHt9O1xuXG4gICAgdmFyIF9wb3B1cEV2ZW50cyA9IGZ1bmN0aW9uIF9wb3B1cEV2ZW50cyhldmVudCkge1xuICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldC5fbGF0bG5nO1xuXG4gICAgICB2YXIgZmlsdGVyZWQgPSBldmVudHNMaXN0LmZpbHRlcihmdW5jdGlvbiAoZCkge1xuXG4gICAgICAgIHJldHVybiB0YXJnZXQubGF0ID09IGQucHJvcHMuTGF0TG5nWzBdICYmIHRhcmdldC5sbmcgPT0gZC5wcm9wcy5MYXRMbmdbMV0gJiYgKCFjdXJyZW50X2ZpbHRlcnMgfHwgY3VycmVudF9maWx0ZXJzLmxlbmd0aCA9PSAwIHx8ICQoZC5wcm9wZXJ0aWVzLmZpbHRlcnMpLm5vdChjdXJyZW50X2ZpbHRlcnMpLmxlbmd0aCAhPSBkLnByb3BlcnRpZXMuZmlsdGVycy5sZW5ndGgpO1xuICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5wcm9wcy5zdGFydF90aW1lIC0gYi5wcm9wcy5zdGFydF90aW1lO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBkaXYgPSAkKFwiPGRpdiAvPlwiKS5hcHBlbmQoZmlsdGVyZWQubGVuZ3RoID4gMSA/IFwiPGgzIGNsYXNzPSdzY2hlZC1jb3VudCc+XCIgKyBmaWx0ZXJlZC5sZW5ndGggKyBcIiBSZXN1bHRzPC9oMz5cIiA6IFwiXCIpLmFwcGVuZCgkKFwiPGRpdiBjbGFzcz0ncG9wdXAtbGlzdC1jb250YWluZXInLz5cIikuYXBwZW5kKCQoXCI8dWwgY2xhc3M9J3BvcHVwLWxpc3QnPlwiKVxuICAgICAgLmFwcGVuZChmaWx0ZXJlZC5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuICQoXCI8bGkgY2xhc3M9bW9udHNlcnJhdC8+XCIpLmFkZENsYXNzKGQuaXNGdWxsID8gXCJpcy1mdWxsXCIgOiBcIm5vdC1mdWxsXCIpLmFkZENsYXNzKGQudmlzaWJsZSA/IFwiaXMtdmlzaWJsZVwiIDogXCJub3QtdmlzaWJsZVwiKS5hcHBlbmQoZC5yZW5kZXIoKSk7XG4gICAgICB9KSkpKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIEwucG9wdXAoKS5zZXRMYXRMbmcoZXZlbnQudGFyZ2V0Ll9sYXRsbmcpLnNldENvbnRlbnQoZGl2Lmh0bWwoKSkub3Blbk9uKGNlbnRyYWxNYXApO1xuICAgICAgfSwgMTAwKTtcbiAgICB9O1xuXG4gICAgLyoqKlxuICAgICAqIEluaXRpYWxpemF0aW9uXG4gICAgICovXG4gICAgdmFyIGluaXRpYWxpemUgPSBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgICAgdmFyIHVuaXF1ZUxvY3MgPSBldmVudHNMaXN0LnJlZHVjZShmdW5jdGlvbiAoYXJyLCBpdGVtKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSBpdGVtLnByb3BlcnRpZXMuZmlsdGVycy5qb2luKFwiIFwiKTtcbiAgICAgICAgaWYgKGFyci5pbmRleE9mKGl0ZW0ucHJvcGVydGllcy5sYXQgKyBcInx8XCIgKyBpdGVtLnByb3BlcnRpZXMubG5nICsgXCJ8fFwiICsgY2xhc3NOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcnIucHVzaChpdGVtLnByb3BlcnRpZXMubGF0ICsgXCJ8fFwiICsgaXRlbS5wcm9wZXJ0aWVzLmxuZyArIFwifHxcIiArIGNsYXNzTmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfVxuICAgICAgfSwgW10pO1xuXG4gICAgICB1bmlxdWVMb2NzID0gdW5pcXVlTG9jcy5tYXAoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gZC5zcGxpdChcInx8XCIpO1xuICAgICAgICByZXR1cm4geyBsYXRMbmc6IFtwYXJzZUZsb2F0KHNwbGl0WzBdKSwgcGFyc2VGbG9hdChzcGxpdFsxXSldLFxuICAgICAgICAgIGNsYXNzTmFtZTogc3BsaXRbMl0gfTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzcGVjaWFsRG90cyA9IHdpbmRvdy5ldmVudFR5cGVGaWx0ZXJzLnJlZHVjZSgoZGljdCwgaXRlbSkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5vbkl0ZW0pIHtcbiAgICAgICAgICBpdGVtLm9uSXRlbUljb24gPSBMLmljb24oe1xuICAgICAgICAgICAgaWNvblVybDogaXRlbS5vbkl0ZW0sXG4gICAgICAgICAgICBpY29uU2l6ZTogWzE0LCAxNF0gfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkaWN0W2l0ZW0uaWRdID0gaXRlbTtcbiAgICAgICAgcmV0dXJuIGRpY3Q7XG4gICAgICB9LCB7fSk7XG5cbiAgICAgIHVuaXF1ZUxvY3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGlmIChpdGVtLmNsYXNzTmFtZSA9PSBcImNhbXBhaWduLW9mZmljZVwiKSB7XG4gICAgICAgIC8vICAgTC5tYXJrZXIoaXRlbS5sYXRMbmcsIHtpY29uOiBDQU1QQUlHTl9PRkZJQ0VfSUNPTiwgY2xhc3NOYW1lOiBpdGVtLmNsYXNzTmFtZX0pXG4gICAgICAgIC8vICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBfcG9wdXBFdmVudHMoZSk7IH0pXG4gICAgICAgIC8vICAgICAuYWRkVG8ob2ZmaWNlcyk7XG4gICAgICAgIC8vIH0gZWxzZSBpZiAoaXRlbS5jbGFzc05hbWUgPT0gXCJnb3R2LWNlbnRlclwiKSB7XG4gICAgICAgIC8vICAgTC5tYXJrZXIoaXRlbS5sYXRMbmcsIHtpY29uOiBHT1RWX0NFTlRFUl9JQ09OLCBjbGFzc05hbWU6IGl0ZW0uY2xhc3NOYW1lfSlcbiAgICAgICAgLy8gICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IF9wb3B1cEV2ZW50cyhlKTsgfSlcbiAgICAgICAgLy8gICAgIC5hZGRUbyhnb3R2Q2VudGVyKTtcbiAgICAgICAgLy8gfWVsc2VcbiAgICAgICAgLy8gaWYgKGl0ZW0uY2xhc3NOYW1lLm1hdGNoKC9iZXJuaWVcXC1ldmVudC9pZykpIHtcbiAgICAgICAgLy8gICBMLmNpcmNsZU1hcmtlcihpdGVtLmxhdExuZywgeyByYWRpdXM6IDEyLCBjbGFzc05hbWU6IGl0ZW0uY2xhc3NOYW1lLCBjb2xvcjogJ3doaXRlJywgZmlsbENvbG9yOiAnI0Y1NUI1QicsIG9wYWNpdHk6IDAuOCwgZmlsbE9wYWNpdHk6IDAuNywgd2VpZ2h0OiAyIH0pXG4gICAgICAgIC8vICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBfcG9wdXBFdmVudHMoZSk7IH0pXG4gICAgICAgIC8vICAgICAuYWRkVG8ob3ZlcmxheXMpO1xuICAgICAgICAvLyB9XG4gICAgICAgIGlmIChzcGVjaWFsRG90c1tpdGVtLmNsYXNzTmFtZV0gJiYgc3BlY2lhbERvdHNbaXRlbS5jbGFzc05hbWVdLm9uSXRlbUljb24pIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhpdGVtLmNsYXNzTmFtZSk7XG4gICAgICAgICAgTC5tYXJrZXIoaXRlbS5sYXRMbmcsIHtpY29uOiBzcGVjaWFsRG90c1tpdGVtLmNsYXNzTmFtZV0ub25JdGVtSWNvbiwgY2xhc3NOYW1lOiBpdGVtLmNsYXNzTmFtZX0pXG4gICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHsgX3BvcHVwRXZlbnRzKGUpOyB9KVxuICAgICAgICAgICAgIC5hZGRUbyhpdGVtLmNsYXNzTmFtZSA9PSAnaGVhZHF1YXJ0ZXJzJyA/IG9mZmljZXM6IGdvdHZDZW50ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIEwuY2lyY2xlTWFya2VyKGl0ZW0ubGF0TG5nLCB7IHJhZGl1czogNiwgY2xhc3NOYW1lOiBpdGVtLmNsYXNzTmFtZSwgY29sb3I6ICd3aGl0ZScsIGZpbGxDb2xvcjogJyNGRjMyNTEnLCBvcGFjaXR5OiAwLjgsIGZpbGxPcGFjaXR5OiAwLjcsIHdlaWdodDogMiB9KS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgX3BvcHVwRXZlbnRzKGUpO1xuICAgICAgICAgIH0pLmFkZFRvKG92ZXJsYXlzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB9LCAxMCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gJChcIi5sZWFmbGV0LW92ZXJsYXktcGFuZVwiKS5maW5kKFwiLmJlcm5pZS1ldmVudFwiKS5wYXJlbnQoKS5wcmVwZW5kVG8oJy5sZWFmbGV0LXpvb20tYW5pbWF0ZWQnKTtcbiAgICB9OyAvLyBFbmQgb2YgaW5pdGlhbGl6ZVxuXG4gICAgdmFyIHRvTWlsZSA9IGZ1bmN0aW9uIHRvTWlsZShtZXRlcikge1xuICAgICAgcmV0dXJuIG1ldGVyICogMC4wMDA2MjEzNztcbiAgICB9O1xuXG4gICAgdmFyIGZpbHRlckV2ZW50c0J5Q29vcmRzID0gZnVuY3Rpb24gZmlsdGVyRXZlbnRzQnlDb29yZHMoY2VudGVyLCBkaXN0YW5jZSwgZmlsdGVyVHlwZXMpIHtcblxuICAgICAgdmFyIHppcExhdExuZyA9IGxlYWZsZXQubGF0TG5nKGNlbnRlcik7XG5cbiAgICAgIHZhciBmaWx0ZXJlZCA9IGV2ZW50c0xpc3QuZmlsdGVyKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHZhciBkaXN0ID0gdG9NaWxlKHppcExhdExuZy5kaXN0YW5jZVRvKGQucHJvcHMuTGF0TG5nKSk7XG4gICAgICAgIGlmIChkaXN0IDwgZGlzdGFuY2UpIHtcblxuICAgICAgICAgIGQuZGlzdGFuY2UgPSBNYXRoLnJvdW5kKGRpc3QgKiAxMCkgLyAxMDtcblxuICAgICAgICAgIC8vSWYgbm8gZmlsdGVyIHdhcyBhIG1hdGNoIG9uIHRoZSBjdXJyZW50IGZpbHRlclxuICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVmYXVsdENvb3JkICYmICFmaWx0ZXJUeXBlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCQoZC5wcm9wcy5maWx0ZXJzKS5ub3QoZmlsdGVyVHlwZXMpLmxlbmd0aCA9PSBkLnByb3BzLmZpbHRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgICB9O1xuXG4gICAgdmFyIGZpbHRlckV2ZW50cyA9IGZ1bmN0aW9uIGZpbHRlckV2ZW50cyh6aXBjb2RlLCBkaXN0YW5jZSwgZmlsdGVyVHlwZXMpIHtcbiAgICAgIHJldHVybiBmaWx0ZXJFdmVudHNCeUNvb3JkcyhbcGFyc2VGbG9hdCh6aXBjb2RlLmxhdCksIHBhcnNlRmxvYXQoemlwY29kZS5sb24pXSwgZGlzdGFuY2UsIGZpbHRlclR5cGVzKTtcbiAgICB9O1xuXG4gICAgdmFyIHNvcnRFdmVudHMgPSBmdW5jdGlvbiBzb3J0RXZlbnRzKGZpbHRlcmVkRXZlbnRzLCBzb3J0VHlwZSkge1xuICAgICAgc3dpdGNoIChzb3J0VHlwZSkge1xuICAgICAgICBjYXNlICdkaXN0YW5jZSc6XG4gICAgICAgICAgZmlsdGVyZWRFdmVudHMgPSBmaWx0ZXJlZEV2ZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZmlsdGVyZWRFdmVudHMgPSBmaWx0ZXJlZEV2ZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5wcm9wcy5zdGFydF90aW1lIC0gYi5wcm9wcy5zdGFydF90aW1lO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBmaWx0ZXJlZEV2ZW50cyA9IGZpbHRlcmVkRXZlbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgLy8gICB2YXIgYUZ1bGwgPSBhLmlzRnVsbCgpO1xuICAgICAgLy8gICB2YXIgYkZ1bGwgPSBiLmlzRnVsbCgpO1xuXG4gICAgICAvLyAgIGlmIChhRnVsbCAmJiBiRnVsbCkgeyByZXR1cm4gMDsgfVxuICAgICAgLy8gICBlbHNlIGlmIChhRnVsbCAmJiAhYkZ1bGwpIHsgcmV0dXJuIDE7IH1cbiAgICAgIC8vICAgZWxzZSBpZiAoIWFGdWxsICYmIGJGdWxsKSB7IHJldHVybiAtMTsgfVxuICAgICAgLy8gfSk7XG4gICAgICAvL3NvcnQgYnkgZnVsbG5lc3M7XG4gICAgICAvLy4uXG4gICAgICByZXR1cm4gZmlsdGVyZWRFdmVudHM7XG4gICAgfTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH0sIDEwKTtcblxuICAgIG1vZHVsZS5fZXZlbnRzTGlzdCA9IGV2ZW50c0xpc3Q7XG4gICAgbW9kdWxlLl96aXBjb2RlcyA9IHppcGNvZGVzO1xuICAgIG1vZHVsZS5fb3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICAvKlxuICAgICogUmVmcmVzaCBtYXAgd2l0aCBuZXcgZXZlbnRzIG1hcFxuICAgICovXG4gICAgdmFyIF9yZWZyZXNoTWFwID0gZnVuY3Rpb24gX3JlZnJlc2hNYXAoKSB7XG4gICAgICBvdmVybGF5cy5jbGVhckxheWVycygpO1xuICAgICAgaW5pdGlhbGl6ZSgpO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZmlsdGVyQnlUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGlmICgkKGZpbHRlcnMpLm5vdCh0eXBlKS5sZW5ndGggIT0gMCB8fCAkKHR5cGUpLm5vdChmaWx0ZXJzKS5sZW5ndGggIT0gMCkge1xuICAgICAgICBjdXJyZW50X2ZpbHRlcnMgPSB0eXBlO1xuXG4gICAgICAgIC8vRmlsdGVyIG9ubHkgaXRlbXMgaW4gdGhlIGxpc3RcbiAgICAgICAgLy8gZXZlbnRzTGlzdCA9IG9yaWdpbmFsRXZlbnRMaXN0LmZpbHRlcihmdW5jdGlvbihldmVudEl0ZW0pIHtcbiAgICAgICAgLy8gICB2YXIgdW5tYXRjaCA9ICQoZXZlbnRJdGVtLnByb3BlcnRpZXMuZmlsdGVycykubm90KGZpbHRlcnMpO1xuICAgICAgICAvLyAgIHJldHVybiB1bm1hdGNoLmxlbmd0aCAhPSBldmVudEl0ZW0ucHJvcGVydGllcy5maWx0ZXJzLmxlbmd0aDtcbiAgICAgICAgLy8gfSk7XG5cblxuICAgICAgICAvLyB2YXIgdGFyZ2V0ID0gdHlwZS5tYXAoZnVuY3Rpb24oaSkgeyByZXR1cm4gXCIuXCIgKyBpIH0pLmpvaW4oXCIsXCIpO1xuICAgICAgICAvLyAkKFwiLmxlYWZsZXQtb3ZlcmxheS1wYW5lXCIpLmZpbmQoXCJwYXRoOm5vdChcIit0eXBlLm1hcChmdW5jdGlvbihpKSB7IHJldHVybiBcIi5cIiArIGkgfSkuam9pbihcIixcIikgKyBcIilcIilcblxuICAgICAgICB2YXIgdG9IaWRlID0gJChhbGxGaWx0ZXJzKS5ub3QodHlwZSk7XG5cbiAgICAgICAgaWYgKHRvSGlkZSAmJiB0b0hpZGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRvSGlkZSA9IHRvSGlkZS5zcGxpY2UoMCwgdG9IaWRlLmxlbmd0aCk7XG4gICAgICAgICAgJChcIi5sZWFmbGV0LW92ZXJsYXktcGFuZVwiKS5maW5kKFwiLlwiICsgdG9IaWRlLmpvaW4oXCIsLlwiKSkuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgJiYgdHlwZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgJChcIi5sZWFmbGV0LW92ZXJsYXktcGFuZVwiKS5maW5kKFwiLlwiICsgdHlwZS5qb2luKFwiLC5cIikpLnNob3coKTtcbiAgICAgICAgICAvLyBfcmVmcmVzaE1hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TcGVjaWZpY2FsbHkgZm9yIGNhbXBhaWduIG9mZmljZVxuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICBjZW50cmFsTWFwLnJlbW92ZUxheWVyKG9mZmljZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgJiYgdHlwZS5pbmRleE9mKCdoZWFkcXVhcnRlcnMnKSA8IDApIHtcbiAgICAgICAgICBjZW50cmFsTWFwLnJlbW92ZUxheWVyKG9mZmljZXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNlbnRyYWxNYXAuYWRkTGF5ZXIob2ZmaWNlcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0ZvciBnb3R2LWNlbnRlcnNcbiAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgY2VudHJhbE1hcC5yZW1vdmVMYXllcihnb3R2Q2VudGVyKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlICYmIHR5cGUuaW5kZXhPZignZ3Jhc3Nyb290cy1ocScpIDwgMCkge1xuICAgICAgICAgIGNlbnRyYWxNYXAucmVtb3ZlTGF5ZXIoZ290dkNlbnRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2VudHJhbE1hcC5hZGRMYXllcihnb3R2Q2VudGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH07XG5cbiAgICBtb2R1bGUuZmlsdGVyQnlDb29yZHMgPSBmdW5jdGlvbiAoY29vcmRzLCBkaXN0YW5jZSwgc29ydCwgZmlsdGVyVHlwZXMpIHtcbiAgICAgIC8vUmVtb3ZlIGxpc3RcbiAgICAgIGQzLnNlbGVjdChcIiNldmVudC1saXN0XCIpLnNlbGVjdEFsbChcImxpXCIpLnJlbW92ZSgpO1xuXG4gICAgICB2YXIgZmlsdGVyZWQgPSBmaWx0ZXJFdmVudHNCeUNvb3Jkcyhjb29yZHMsIHBhcnNlSW50KGRpc3RhbmNlKSwgZmlsdGVyVHlwZXMpO1xuICAgICAgLy9Tb3J0IGV2ZW50XG4gICAgICBmaWx0ZXJlZCA9IHNvcnRFdmVudHMoZmlsdGVyZWQsIHNvcnQsIGZpbHRlclR5cGVzKTtcblxuICAgICAgLy9SZW5kZXIgZXZlbnRcbiAgICAgIHZhciBldmVudExpc3QgPSBkMy5zZWxlY3QoXCIjZXZlbnQtbGlzdFwiKS5zZWxlY3RBbGwoXCJsaVwiKS5kYXRhKGZpbHRlcmVkLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gZC5wcm9wcy51cmw7XG4gICAgICB9KTtcblxuICAgICAgZXZlbnRMaXN0LmVudGVyKCkuYXBwZW5kKFwibGlcIikuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiAoZC5pc0Z1bGwgPyAnaXMtZnVsbCcgOiAnbm90LWZ1bGwnKSArIFwiIFwiICsgKHRoaXMudmlzaWJsZSA/IFwiaXMtdmlzaWJsZVwiIDogXCJub3QtdmlzaWJsZVwiKTtcbiAgICAgIH0pLmNsYXNzZWQoXCJsYXRvXCIsIHRydWUpLmh0bWwoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQucmVuZGVyKGQuZGlzdGFuY2UpO1xuICAgICAgfSk7XG5cbiAgICAgIGV2ZW50TGlzdC5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICAgIC8vYWRkIGEgaGlnaGxpZ2h0ZWQgbWFya2VyXG4gICAgICBmdW5jdGlvbiBhZGRoaWdobGlnaHRlZE1hcmtlcihsYXQsIGxvbikge1xuICAgICAgICB2YXIgaGlnaGxpZ2h0ZWRNYXJrZXIgPSBuZXcgTC5jaXJjbGVNYXJrZXIoW2xhdCwgbG9uXSwgeyByYWRpdXM6IDUsIGNvbG9yOiAnI2VhNTA0ZScsIGZpbGxDb2xvcjogJyMxNDYyQTInLCBvcGFjaXR5OiAwLjgsIGZpbGxPcGFjaXR5OiAwLjcsIHdlaWdodDogMiB9KS5hZGRUbyhjZW50cmFsTWFwKTtcbiAgICAgICAgLy8gZXZlbnQgbGlzdGVuZXIgdG8gcmVtb3ZlIGhpZ2hsaWdodGVkIG1hcmtlcnNcbiAgICAgICAgJChcIi5ub3QtZnVsbFwiKS5tb3VzZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2VudHJhbE1hcC5yZW1vdmVMYXllcihoaWdobGlnaHRlZE1hcmtlcik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBldmVudCBsaXN0ZW5lciB0byBnZXQgdGhlIG1vdXNlb3ZlclxuICAgICAgJChcIi5ub3QtZnVsbFwiKS5tb3VzZW92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKFwiaGlnaGxpZ2h0XCIpO1xuICAgICAgICB2YXIgY01hcmtlckxhdCA9ICQodGhpcykuY2hpbGRyZW4oJ2RpdicpLmF0dHIoJ2xhdCcpO1xuICAgICAgICB2YXIgY01hcmtlckxvbiA9ICQodGhpcykuY2hpbGRyZW4oJ2RpdicpLmF0dHIoJ2xvbicpO1xuICAgICAgICAvLyBmdW5jdGlvbiBjYWxsIHRvIGFkZCBoaWdobGlnaHRlZCBtYXJrZXJcbiAgICAgICAgYWRkaGlnaGxpZ2h0ZWRNYXJrZXIoY01hcmtlckxhdCwgY01hcmtlckxvbik7XG4gICAgICB9KTtcblxuICAgICAgLy9QdXNoIGFsbCBmdWxsIGl0ZW1zIHRvIGVuZCBvZiBsaXN0XG4gICAgICAkKFwiZGl2I2V2ZW50LWxpc3QtY29udGFpbmVyIHVsI2V2ZW50LWxpc3QgbGkuaXMtZnVsbFwiKS5hcHBlbmRUbyhcImRpdiNldmVudC1saXN0LWNvbnRhaW5lciB1bCNldmVudC1saXN0XCIpO1xuXG4gICAgICAvL01vdmUgY2FtcGFpZ24gb2ZmaWNlcyB0b1xuXG4gICAgICB2YXIgb2ZmaWNlQ291bnQgPSAkKFwiZGl2I2V2ZW50LWxpc3QtY29udGFpbmVyIHVsI2V2ZW50LWxpc3QgbGkgLmNhbXBhaWduLW9mZmljZVwiKS5sZW5ndGg7XG4gICAgICAkKFwiI2hpZGUtc2hvdy1vZmZpY2VcIikuYXR0cihcImRhdGEtY291bnRcIiwgb2ZmaWNlQ291bnQpO1xuICAgICAgJChcIiNjYW1wYWlnbi1vZmYtY291bnRcIikudGV4dChvZmZpY2VDb3VudCk7XG4gICAgICAkKFwic2VjdGlvbiNjYW1wYWlnbi1vZmZpY2VzIHVsI2NhbXBhaWduLW9mZmljZS1saXN0ICpcIikucmVtb3ZlKCk7XG4gICAgICAkKFwiZGl2I2V2ZW50LWxpc3QtY29udGFpbmVyIHVsI2V2ZW50LWxpc3QgbGkgLmNhbXBhaWduLW9mZmljZVwiKS5wYXJlbnQoKS5hcHBlbmRUbyhcInNlY3Rpb24jY2FtcGFpZ24tb2ZmaWNlcyB1bCNjYW1wYWlnbi1vZmZpY2UtbGlzdFwiKTtcbiAgICB9O1xuXG4gICAgLyoqKlxuICAgICAqIEZJTFRFUigpICAtLSBXaGVuIHRoZSB1c2VyIHN1Ym1pdHMgcXVlcnksIHdlIHdpbGwgbG9vayBhdCB0aGlzLlxuICAgICAqL1xuICAgIG1vZHVsZS5maWx0ZXIgPSBmdW5jdGlvbiAoemlwY29kZSwgZGlzdGFuY2UsIHNvcnQsIGZpbHRlclR5cGVzKSB7XG4gICAgICAvL0NoZWNrIHR5cGUgZmlsdGVyXG5cbiAgICAgIGlmICghemlwY29kZSB8fCB6aXBjb2RlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvL1N0YXJ0IGlmIG90aGVyIGZpbHRlcnMgY2hhbmdlZFxuICAgICAgdmFyIHRhcmdldFppcGNvZGUgPSB6aXBjb2Rlc1t6aXBjb2RlXTtcblxuICAgICAgLy9SZW1vdmUgbGlzdFxuICAgICAgZDMuc2VsZWN0KFwiI2V2ZW50LWxpc3RcIikuc2VsZWN0QWxsKFwibGlcIikucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0YXJnZXRaaXBjb2RlID09IHVuZGVmaW5lZCB8fCAhdGFyZ2V0WmlwY29kZSkge1xuICAgICAgICAkKFwiI2V2ZW50LWxpc3RcIikuYXBwZW5kKFwiPGxpIGNsYXNzPSdlcnJvciBsYXRvJz5aaXBjb2RlIGRvZXMgbm90IGV4aXN0LjwvbGk+XCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vQ2FsaWJyYXRlIG1hcFxuICAgICAgdmFyIHpvb20gPSA0O1xuICAgICAgc3dpdGNoIChwYXJzZUludChkaXN0YW5jZSkpIHtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIHpvb20gPSAxMjticmVhaztcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICB6b29tID0gMTE7YnJlYWs7XG4gICAgICAgIGNhc2UgMjA6XG4gICAgICAgICAgem9vbSA9IDEwO2JyZWFrO1xuICAgICAgICBjYXNlIDUwOlxuICAgICAgICAgIHpvb20gPSA5O2JyZWFrO1xuICAgICAgICBjYXNlIDEwMDpcbiAgICAgICAgICB6b29tID0gODticmVhaztcbiAgICAgICAgY2FzZSAyNTA6XG4gICAgICAgICAgem9vbSA9IDc7YnJlYWs7XG4gICAgICAgIGNhc2UgNTAwOlxuICAgICAgICAgIHpvb20gPSA1O2JyZWFrO1xuICAgICAgICBjYXNlIDc1MDpcbiAgICAgICAgICB6b29tID0gNTticmVhaztcbiAgICAgICAgY2FzZSAxMDAwOlxuICAgICAgICAgIHpvb20gPSA0O2JyZWFrO1xuICAgICAgICBjYXNlIDIwMDA6XG4gICAgICAgICAgem9vbSA9IDQ7YnJlYWs7XG4gICAgICAgIGNhc2UgMzAwMDpcbiAgICAgICAgICB6b29tID0gMzticmVhaztcbiAgICAgIH1cbiAgICAgIGlmICghKHRhcmdldFppcGNvZGUubGF0ICYmIHRhcmdldFppcGNvZGUubGF0ICE9IFwiXCIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRfemlwY29kZSAhPSB6aXBjb2RlIHx8IGN1cnJlbnRfZGlzdGFuY2UgIT0gZGlzdGFuY2UpIHtcbiAgICAgICAgY3VycmVudF96aXBjb2RlID0gemlwY29kZTtcbiAgICAgICAgY3VycmVudF9kaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICBjZW50cmFsTWFwLnNldFZpZXcoW3BhcnNlRmxvYXQodGFyZ2V0WmlwY29kZS5sYXQpLCBwYXJzZUZsb2F0KHRhcmdldFppcGNvZGUubG9uKV0sIHpvb20pO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmlsdGVyZWQgPSBmaWx0ZXJFdmVudHModGFyZ2V0WmlwY29kZSwgcGFyc2VJbnQoZGlzdGFuY2UpLCBmaWx0ZXJUeXBlcyk7XG5cbiAgICAgIC8vU29ydCBldmVudFxuICAgICAgZmlsdGVyZWQgPSBzb3J0RXZlbnRzKGZpbHRlcmVkLCBzb3J0LCBmaWx0ZXJUeXBlcyk7XG5cbiAgICAgIC8vUmVuZGVyIGV2ZW50XG4gICAgICB2YXIgZXZlbnRMaXN0ID0gZDMuc2VsZWN0KFwiI2V2ZW50LWxpc3RcIikuc2VsZWN0QWxsKFwibGlcIikuZGF0YShmaWx0ZXJlZCwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQucHJvcHMudXJsO1xuICAgICAgfSk7XG5cbiAgICAgIGV2ZW50TGlzdC5lbnRlcigpLmFwcGVuZChcImxpXCIpLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICByZXR1cm4gKGQuaXNGdWxsID8gJ2lzLWZ1bGwnIDogJ25vdC1mdWxsJykgKyBcIiBcIiArICh0aGlzLnZpc2libGUgPyBcImlzLXZpc2libGVcIiA6IFwibm90LXZpc2libGVcIik7XG4gICAgICB9KS5jbGFzc2VkKFwibGF0b1wiLCB0cnVlKS5odG1sKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgIHJldHVybiBkLnJlbmRlcihkLmRpc3RhbmNlKTtcbiAgICAgIH0pO1xuXG4gICAgICBldmVudExpc3QuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvL2FkZCBhIGhpZ2hsaWdodGVkIG1hcmtlclxuICAgICAgZnVuY3Rpb24gYWRkaGlnaGxpZ2h0ZWRNYXJrZXIobGF0LCBsb24pIHtcbiAgICAgICAgdmFyIGhpZ2hsaWdodGVkTWFya2VyID0gbmV3IEwuY2lyY2xlTWFya2VyKFtsYXQsIGxvbl0sIHsgcmFkaXVzOiA1LCBjb2xvcjogJyNlYTUwNGUnLCBmaWxsQ29sb3I6ICcjMTQ2MkEyJywgb3BhY2l0eTogMC44LCBmaWxsT3BhY2l0eTogMC43LCB3ZWlnaHQ6IDIgfSkuYWRkVG8oY2VudHJhbE1hcCk7XG4gICAgICAgIC8vIGV2ZW50IGxpc3RlbmVyIHRvIHJlbW92ZSBoaWdobGlnaHRlZCBtYXJrZXJzXG4gICAgICAgICQoXCIubm90LWZ1bGxcIikubW91c2VvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNlbnRyYWxNYXAucmVtb3ZlTGF5ZXIoaGlnaGxpZ2h0ZWRNYXJrZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gZXZlbnQgbGlzdGVuZXIgdG8gZ2V0IHRoZSBtb3VzZW92ZXJcbiAgICAgICQoXCIubm90LWZ1bGxcIikubW91c2VvdmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcyhcImhpZ2hsaWdodFwiKTtcbiAgICAgICAgdmFyIGNNYXJrZXJMYXQgPSAkKHRoaXMpLmNoaWxkcmVuKCdkaXYnKS5hdHRyKCdsYXQnKTtcbiAgICAgICAgdmFyIGNNYXJrZXJMb24gPSAkKHRoaXMpLmNoaWxkcmVuKCdkaXYnKS5hdHRyKCdsb24nKTtcbiAgICAgICAgLy8gZnVuY3Rpb24gY2FsbCB0byBhZGQgaGlnaGxpZ2h0ZWQgbWFya2VyXG4gICAgICAgIGFkZGhpZ2hsaWdodGVkTWFya2VyKGNNYXJrZXJMYXQsIGNNYXJrZXJMb24pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vUHVzaCBhbGwgZnVsbCBpdGVtcyB0byBlbmQgb2YgbGlzdFxuICAgICAgJChcImRpdiNldmVudC1saXN0LWNvbnRhaW5lciB1bCNldmVudC1saXN0IGxpLmlzLWZ1bGxcIikuYXBwZW5kVG8oXCJkaXYjZXZlbnQtbGlzdC1jb250YWluZXIgdWwjZXZlbnQtbGlzdFwiKTtcblxuICAgICAgLy9Nb3ZlIGNhbXBhaWduIG9mZmljZXMgdG9cblxuICAgICAgdmFyIG9mZmljZUNvdW50ID0gJChcImRpdiNldmVudC1saXN0LWNvbnRhaW5lciB1bCNldmVudC1saXN0IGxpIC5jYW1wYWlnbi1vZmZpY2VcIikubGVuZ3RoO1xuICAgICAgJChcIiNoaWRlLXNob3ctb2ZmaWNlXCIpLmF0dHIoXCJkYXRhLWNvdW50XCIsIG9mZmljZUNvdW50KTtcbiAgICAgICQoXCIjY2FtcGFpZ24tb2ZmLWNvdW50XCIpLnRleHQob2ZmaWNlQ291bnQpO1xuICAgICAgJChcInNlY3Rpb24jY2FtcGFpZ24tb2ZmaWNlcyB1bCNjYW1wYWlnbi1vZmZpY2UtbGlzdCAqXCIpLnJlbW92ZSgpO1xuICAgICAgJChcImRpdiNldmVudC1saXN0LWNvbnRhaW5lciB1bCNldmVudC1saXN0IGxpIC5jYW1wYWlnbi1vZmZpY2VcIikucGFyZW50KCkuYXBwZW5kVG8oXCJzZWN0aW9uI2NhbXBhaWduLW9mZmljZXMgdWwjY2FtcGFpZ24tb2ZmaWNlLWxpc3RcIik7XG4gICAgfTtcblxuICAgIG1vZHVsZS50b01hcFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImxpc3Qtdmlld1wiKS5hZGRDbGFzcyhcIm1hcC12aWV3XCIpO1xuICAgICAgY2VudHJhbE1hcC5pbnZhbGlkYXRlU2l6ZSgpO1xuICAgICAgY2VudHJhbE1hcC5fb25SZXNpemUoKTtcbiAgICB9O1xuICAgIG1vZHVsZS50b0xpc3RWaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJtYXAtdmlld1wiKS5hZGRDbGFzcyhcImxpc3Qtdmlld1wiKTtcbiAgICB9O1xuXG4gICAgbW9kdWxlLmdldE1hcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBjZW50cmFsTWFwO1xuICAgIH07XG5cbiAgICByZXR1cm4gbW9kdWxlO1xuICB9O1xufShqUXVlcnksIGQzLCBMKTtcblxudmFyIFZvdGluZ0luZm9NYW5hZ2VyID0gZnVuY3Rpb24gKCQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2b3RpbmdJbmZvKSB7XG4gICAgdmFyIG1vZHVsZSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYnVpbGRSZWdpc3RyYXRpb25NZXNzYWdlKHN0YXRlKSB7XG4gICAgICB2YXIgJG1zZyA9ICQoXCI8ZGl2IGNsYXNzPSdyZWdpc3RyYXRpb24tbXNnJy8+XCIpLmFwcGVuZCgkKFwiPGgzLz5cIikudGV4dChcIlJlZ2lzdHJhdGlvbiBkZWFkbGluZTogXCIgKyBtb21lbnQobmV3IERhdGUoc3RhdGUucmVnaXN0cmF0aW9uX2RlYWRsaW5lKSkuZm9ybWF0KFwiTU1NIERcIikpKS5hcHBlbmQoJChcIjxwIC8+XCIpLmh0bWwoc3RhdGUubmFtZSArIFwiIGhhcyA8c3Ryb25nPlwiICsgc3RhdGUuaXNfb3BlbiArIFwiIFwiICsgc3RhdGUudHlwZSArIFwiPC9zdHJvbmc+LiBcIiArIHN0YXRlLnlvdV9tdXN0KSkuYXBwZW5kKCQoXCI8cCAvPlwiKS5odG1sKFwiRmluZCBvdXQgd2hlcmUgYW5kIGhvdyB0byByZWdpc3RlciBhdCA8YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cHM6Ly92b3RlLmJlcm5pZXNhbmRlcnMuY29tL1wiICsgc3RhdGUuc3RhdGUgKyBcIic+dm90ZS5iZXJuaWVzYW5kZXJzLmNvbTwvYT5cIikpO1xuXG4gICAgICByZXR1cm4gJG1zZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWlsZFByaW1hcnlJbmZvKHN0YXRlKSB7XG5cbiAgICAgIHZhciAkbXNnID0gJChcIjxkaXYgY2xhc3M9J3JlZ2lzdHJhdGlvbi1tc2cnLz5cIikuYXBwZW5kKCQoXCI8aDMvPlwiKS50ZXh0KFwiUHJpbWFyeSBkYXk6IFwiICsgbW9tZW50KG5ldyBEYXRlKHN0YXRlLnZvdGluZ19kYXkpKS5mb3JtYXQoXCJNTU0gRFwiKSkpLmFwcGVuZCgkKFwiPHAgLz5cIikuaHRtbChzdGF0ZS5uYW1lICsgXCIgaGFzIDxzdHJvbmc+XCIgKyBzdGF0ZS5pc19vcGVuICsgXCIgXCIgKyBzdGF0ZS50eXBlICsgXCI8L3N0cm9uZz4uIFwiICsgc3RhdGUueW91X211c3QpKS5hcHBlbmQoJChcIjxwIC8+XCIpLmh0bWwoXCJGaW5kIG91dCB3aGVyZSBhbmQgaG93IHRvIHZvdGUgYXQgPGEgdGFyZ2V0PSdfYmxhbmsnIGhyZWY9J2h0dHBzOi8vdm90ZS5iZXJuaWVzYW5kZXJzLmNvbS9cIiArIHN0YXRlLnN0YXRlICsgXCInPnZvdGUuYmVybmllc2FuZGVycy5jb208L2E+XCIpKTtcblxuICAgICAgcmV0dXJuICRtc2c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYnVpbGRDYXVjdXNJbmZvKHN0YXRlKSB7XG4gICAgICB2YXIgJG1zZyA9ICQoXCI8ZGl2IGNsYXNzPSdyZWdpc3RyYXRpb24tbXNnJy8+XCIpLmFwcGVuZCgkKFwiPGgzLz5cIikudGV4dChcIkNhdWN1cyBkYXk6IFwiICsgbW9tZW50KG5ldyBEYXRlKHN0YXRlLnZvdGluZ19kYXkpKS5mb3JtYXQoXCJNTU0gRFwiKSkpLmFwcGVuZCgkKFwiPHAgLz5cIikuaHRtbChzdGF0ZS5uYW1lICsgXCIgaGFzIDxzdHJvbmc+XCIgKyBzdGF0ZS5pc19vcGVuICsgXCIgXCIgKyBzdGF0ZS50eXBlICsgXCI8L3N0cm9uZz4uIFwiICsgc3RhdGUueW91X211c3QpKS5hcHBlbmQoJChcIjxwIC8+XCIpLmh0bWwoXCJGaW5kIG91dCB3aGVyZSBhbmQgaG93IHRvIGNhdWN1cyBhdCA8YSB0YXJnZXQ9J19ibGFuaycgaHJlZj0naHR0cHM6Ly92b3RlLmJlcm5pZXNhbmRlcnMuY29tL1wiICsgc3RhdGUuc3RhdGUgKyBcIic+dm90ZS5iZXJuaWVzYW5kZXJzLmNvbTwvYT5cIikpO1xuXG4gICAgICByZXR1cm4gJG1zZztcbiAgICB9XG5cbiAgICBtb2R1bGUuZ2V0SW5mbyA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgdmFyIHRhcmdldFN0YXRlID0gdm90aW5nSW5mby5maWx0ZXIoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgcmV0dXJuIGQuc3RhdGUgPT0gc3RhdGU7XG4gICAgICB9KVswXTsgLy9yZXR1cm4gZmlyc3RcbiAgICAgIGlmICghdGFyZ2V0U3RhdGUpIHJldHVybiBudWxsO1xuXG4gICAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpO1xuICAgICAgdG9kYXkuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgLSAxKTtcblxuICAgICAgaWYgKHRvZGF5IDw9IG5ldyBEYXRlKHRhcmdldFN0YXRlLnJlZ2lzdHJhdGlvbl9kZWFkbGluZSkpIHtcbiAgICAgICAgcmV0dXJuIGJ1aWxkUmVnaXN0cmF0aW9uTWVzc2FnZSh0YXJnZXRTdGF0ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRvZGF5IDw9IG5ldyBEYXRlKHRhcmdldFN0YXRlLnZvdGluZ19kYXkpKSB7XG4gICAgICAgIGlmICh0YXJnZXRTdGF0ZS50eXBlID09IFwicHJpbWFyaWVzXCIpIHtcbiAgICAgICAgICByZXR1cm4gYnVpbGRQcmltYXJ5SW5mbyh0YXJnZXRTdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9cbiAgICAgICAgICByZXR1cm4gYnVpbGRDYXVjdXNJbmZvKHRhcmdldFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBtb2R1bGU7XG4gIH07XG59KGpRdWVyeSk7XG5cbi8vIE1vcmUgZXZlbnRzXG4oZnVuY3Rpb24gKCQpIHtcbiAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgICQoXCIuZXZlbnQtcnN2cC1hY3Rpdml0eVwiKS5oaWRlKCk7XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKFwiY2xpY2tcIiwgXCIucnN2cC1saW5rLCAuZXZlbnQtcnN2cC1hY3Rpdml0eVwiLCBmdW5jdGlvbiAoZXZlbnQsIHBhcmFtcykge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KTtcblxuICAvL1Nob3cgZW1haWxcbiAgJChkb2N1bWVudCkub24oXCJzaG93LWV2ZW50LWZvcm1cIiwgZnVuY3Rpb24gKGV2ZW50cywgdGFyZ2V0KSB7XG4gICAgdmFyIGZvcm0gPSAkKHRhcmdldCkuY2xvc2VzdChcIi5ldmVudC1pdGVtXCIpLmZpbmQoXCIuZXZlbnQtcnN2cC1hY3Rpdml0eVwiKTtcbiAgICBmb3JtLmZhZGVJbigxMDApO1xuICB9KTtcbn0pKGpRdWVyeSk7XG4iLCJjb25zdCBzbHVnaWZ5ID0gKHN0cikgPT4ge1xuXG4gIHJldHVybiBzdHIudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgLnJlcGxhY2UoL1xccysvZywgJy0nKSAgICAgICAgICAgLy8gUmVwbGFjZSBzcGFjZXMgd2l0aCAtXG4gICAgICAgICAgLnJlcGxhY2UoL1teXFx3XFwtXSsvZywgJycpICAgICAgIC8vIFJlbW92ZSBhbGwgbm9uLXdvcmQgY2hhcnNcbiAgICAgICAgICAucmVwbGFjZSgvXFwtXFwtKy9nLCAnLScpICAgICAgICAgLy8gUmVwbGFjZSBtdWx0aXBsZSAtIHdpdGggc2luZ2xlIC1cbiAgICAgICAgICAucmVwbGFjZSgvXi0rLywgJycpICAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIHN0YXJ0IG9mIHRleHRcbiAgICAgICAgICAucmVwbGFjZSgvLSskLywgJycpOyAgICAgICAgICAgIC8vIFRyaW0gLSBmcm9tIGVuZCBvZiB0ZXh0XG59XG5cbihmdW5jdGlvbigkLCBkMykge1xuICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICQoXCIjbG9hZGluZy1pY29uXCIpLnNob3coKTtcblxuICB3aW5kb3cuYWxsX2V2ZW50c19kYXRhID0gW107XG4gIHdpbmRvdy51c196aXBjb2RlcyA9IG51bGw7XG4gIGNvbnNvbGUubG9nKFwiVEVTVFwiKTtcbiAgJC53aGVuKCgpPT57fSlcbiAgICAvLyAudGhlbigoKSA9PntcbiAgICAvLyAgIHJldHVybiAkLmFqYXgoe1xuICAgIC8vICAgICAgIHVybDogJy9kYXRhL2hxLmpzb24nLFxuICAgIC8vICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgLy8gICAgICAgc3VjY2VzczogKGRhdGEpID0+IHtcbiAgICAvLyAgICAgICAgIHdpbmRvdy5hbGxfZXZlbnRzX2RhdGEgPSAgd2luZG93LmFsbF9ldmVudHNfZGF0YS5jb25jYXQoZGF0YSk7XG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICBlcnJvcjogKGRhdGEsIGVycm9yKSA9PiB7IGNvbnNvbGUubG9nKGRhdGEsIGVycm9yKTsgfVxuICAgIC8vICAgICB9KTtcbiAgICAvLyB9KVxuICAgIC8vIC5kb25lKChkYXRhKSA9PiB7fSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICB2YXIgZGVmZXIgPSAkLkRlZmVycmVkKCk7XG4gICAgICBkMy5jc3YoJy8vZDF5MG90YWRpM2tuZjYuY2xvdWRmcm9udC5uZXQvZC91c19wb3N0YWxfY29kZXMuZ3onLFxuICAgICAgICBmdW5jdGlvbih6aXBjb2Rlcykge1xuICAgICAgICAgIGRlZmVyLnJlc29sdmUoemlwY29kZXMpO1xuICAgICAgICAgIH0pO1xuY29uc29sZS5sb2coXCJURVNUXCIpO1xuICAgICAgcmV0dXJuIGRlZmVyLnByb21pc2UoKTtcbiAgICB9KVxuICAgIC5kb25lKCh6aXBjb2RlcykgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJURVNUXCIpO1xuICAgICAgd2luZG93LnVzX3ppcGNvZGVzID0gemlwY29kZXM7XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIlRFU1RcIik7XG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xuICAgICAgICAgIHVybDogJy9kYXRhL3Rlc3QuanNvbicsIC8vJ3wqKkRBVEFfU09VUkNFKip8JyxcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgIC8vIGNhY2hlOiB0cnVlLCAvLyBvdGhlcndpc2Ugd2lsbCBnZXQgZnJlc2ggY29weSBldmVyeSBwYWdlIGxvYWRcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyB3aW5kb3cuYWxsX2V2ZW50c19kYXRhID0gd2luZG93LmFsbF9ldmVudHNfZGF0YS5jb25jYXQod2luZG93LkVWRU5UU19EQVRBKTtcbiAgICAgICAgICAgIHdpbmRvdy5hbGxfZXZlbnRzX2RhdGEgPSB3aW5kb3cuYWxsX2V2ZW50c19kYXRhLmNvbmNhdChkYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmRvbmUoKCkgPT4ge1xuXG4gICAgICBjb25zb2xlLmxvZyhcIlRFU1RcIik7XG4gICAgICBsZXQgZXZlbnRUeXBlc0RpY3QgPSB3aW5kb3cuZXZlbnRUeXBlRmlsdGVycy5yZWR1Y2UoKGFjYywgY3VycmVudCk9PiB7XG4gICAgICAgIGFjY1tjdXJyZW50Lm5hbWVdID0gY3VycmVudC5pZDtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcblxuICAgICAgJChcIiNsb2FkaW5nLWljb25cIikuaGlkZSgpO1xuICAgICAgLy8gUGFyc2UgRGF0YVxuICAgICAgd2luZG93LmFsbF9ldmVudHNfZGF0YSA9IHdpbmRvdy5hbGxfZXZlbnRzX2RhdGEubWFwKChpdGVtKSA9PiB7XG4gICAgICAgIGl0ZW0uZmlsdGVycyA9IFtdO1xuXG4gICAgICAgIGlmIChldmVudFR5cGVzRGljdFtpdGVtLmV2ZW50X3R5cGVdKSB7XG4gICAgICAgICAgaXRlbS5maWx0ZXJzLnB1c2goZXZlbnRUeXBlc0RpY3RbaXRlbS5ldmVudF90eXBlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXZlbnRUeXBlc0RpY3RbaXRlbS5ldmVudF90eXBlXSA9IHNsdWdpZnkoaXRlbS5ldmVudF90eXBlKTtcbiAgICAgICAgICBpdGVtLmZpbHRlcnMucHVzaChldmVudFR5cGVzRGljdFtpdGVtLmV2ZW50X3R5cGVdKTtcbiAgICAgICAgICB3aW5kb3cuZXZlbnRUeXBlRmlsdGVycy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0uZXZlbnRfdHlwZSxcbiAgICAgICAgICAgIGlkOiBldmVudFR5cGVzRGljdFtpdGVtLmV2ZW50X3R5cGVdXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbTtcblxuICAgICAgfSkuZmlsdGVyKChpKSA9PiAgaSAhPT0gbnVsbCk7XG5cbiAgICAgIC8vIExvYWQgTWFwXG4gICAgICB2YXIgcGFyYW1zID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG5cbiAgICAgIC8vIHJldmlldyBsaXN0LXZpZXdcbiAgICAgIHdpbmRvdy5yZWZyZXNoRXZlbnRUeXBlcygpO1xuICAgICAgdmFyIG9sZERhdGUgPSBuZXcgRGF0ZSgpO1xuXG5cbiAgICAgIC8qIEV4dHJhY3QgZGVmYXVsdCBsYXQgbG9uICovXG4gICAgICB2YXIgbSA9IC8uKlxcP2M9KC4rPyksKC4rPyksKFxcZCspeiM/LiovZy5leGVjKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICAgIGlmIChtICYmIG1bMV0gJiYgbVsyXSAmJiBtWzNdKSB7XG4gICAgICAgIHZhciBkZWZhdWx0Q29vcmQgPSB7XG4gICAgICAgICAgY2VudGVyOiBbcGFyc2VGbG9hdChtWzFdKSwgcGFyc2VGbG9hdChtWzJdKV0sXG4gICAgICAgICAgem9vbTogcGFyc2VJbnQobVszXSlcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93Lm1hcE1hbmFnZXIgPSBNYXBNYW5hZ2VyKHdpbmRvdy5hbGxfZXZlbnRzX2RhdGEsIGNhbXBhaWduT2ZmaWNlcywgd2luZG93LnVzX3ppcGNvZGVzLCB7XG4gICAgICAgICAgZGVmYXVsdENvb3JkOiBkZWZhdWx0Q29vcmRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2luZG93Lm1hcE1hbmFnZXIuZmlsdGVyQnlDb29yZHMoZGVmYXVsdENvb3JkLmNlbnRlciwgNTAsIHBhcmFtcy5zb3J0LCBwYXJhbXMuZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubWFwTWFuYWdlciA9IE1hcE1hbmFnZXIod2luZG93LmFsbF9ldmVudHNfZGF0YSwgbnVsbCwgd2luZG93LnVzX3ppcGNvZGVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVmcmVzaFxuICAgICAgJCh3aW5kb3cpLnRyaWdnZXIoXCJoYXNoY2hhbmdlXCIpO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT57XG4gICAgICBjb25zb2xlLmxvZyhcIlRFU1RcIik7XG4gICAgICAvLyBMb2FkIENvbm5lY3RpY3V0IGFyZWFcbiAgICAgIHZhciBkaXN0cmljdF9ib3VuZGFyeSA9IG5ldyBMLmdlb0pzb24obnVsbCwge1xuICAgICAgICBjbGlja2FibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIGRpc3RyaWN0X2JvdW5kYXJ5LmFkZFRvKHdpbmRvdy5tYXBNYW5hZ2VyLmdldE1hcCgpKTtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgdXJsOiBcIi9kYXRhL2dhLmpzb25cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICQoZGF0YS5mZWF0dXJlc1swXS5nZW9tZXRyeSkuZWFjaChmdW5jdGlvbihrZXksIGRhdGEpIHtcbiAgICAgICAgICAgIGRpc3RyaWN0X2JvdW5kYXJ5XG4gICAgICAgICAgICAgIC5hZGREYXRhKGRhdGEpXG4gICAgICAgICAgICAgIC5zZXRTdHlsZSh7XG4gICAgICAgICAgICAgICAgZmlsbENvbG9yOiAncmdiYSg1NCwgNTIsIDEwNywgMC42KScsXG4gICAgICAgICAgICAgICAgY29sb3I6ICdyZ2IoNTQsIDUyLCAxMDcpJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghcGFyYW1zLnppcGNvZGUgfHwgcGFyYW1zLnppcGNvZGUgPT09ICcnKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5tYXBNYW5hZ2VyLmdldE1hcCgpXG4gICAgICAgICAgICAgICAgLmZpdEJvdW5kcyhkaXN0cmljdF9ib3VuZGFyeS5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkaXN0cmljdF9ib3VuZGFyeS5icmluZ1RvQmFjaygpO1xuICAgICAgICB9XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbigpIHt9KTtcblxuICAgIH0pO1xuXG5cbiAgLyoqIGluaXRpYWwgbG9hZGluZyBiZWZvcmUgYWN0aXZhdGluZyBsaXN0ZW5lcnMuLi4qL1xuICB2YXIgcGFyYW1zID0gJC5kZXBhcmFtKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cmluZygxKSk7XG4gIGlmIChwYXJhbXMuemlwY29kZSkge1xuICAgICQoXCJpbnB1dFtuYW1lPSd6aXBjb2RlJ11cIikudmFsKHBhcmFtcy56aXBjb2RlKTtcbiAgfVxuXG4gIGlmIChwYXJhbXMuZGlzdGFuY2UpIHtcbiAgICAkKFwic2VsZWN0W25hbWU9J2Rpc3RhbmNlJ11cIikudmFsKHBhcmFtcy5kaXN0YW5jZSk7XG4gIH1cbiAgaWYgKHBhcmFtcy5zb3J0KSB7XG4gICAgJChcInNlbGVjdFtuYW1lPSdzb3J0J11cIikudmFsKHBhcmFtcy5zb3J0KTtcbiAgfVxuXG4gIC8qIFByZXBhcmUgZmlsdGVycyAqL1xuICB3aW5kb3cucmVmcmVzaEV2ZW50VHlwZXMoKTtcbiAgLyoqKlxuICAgKiAgZGVmaW5lIGV2ZW50c1xuICAgKi9cbiAgLy9vbmx5IG51bWJlcnNcbiAgJChcImlucHV0W25hbWU9J3ppcGNvZGUnXVwiKS5vbigna2V5dXAga2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS50eXBlID09ICdrZXlkb3duJyAmJiAoZS5rZXlDb2RlIDwgNDggfHwgZS5rZXlDb2RlID4gNTcpICYmXG4gICAgICBlLmtleUNvZGUgIT0gOCAmJiAhKGUua2V5Q29kZSA+PSAzNyB8fCBlLmtleUNvZGUgPD0gNDApKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGUudHlwZSA9PSAna2V5dXAnICYmICQodGhpcykudmFsKCkubGVuZ3RoID09IDUpIHtcbiAgICAgIGlmICghKGUua2V5Q29kZSA+PSAzNyAmJiBlLmtleUNvZGUgPD0gNDApKSB7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcImZvcm0jZmlsdGVyLWZvcm1cIikuc3VibWl0KCk7XG4gICAgICAgICQoXCIjaGlkZGVuLWJ1dHRvblwiKS5mb2N1cygpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgLyoqKlxuICAgKiAgb25jaGFuZ2Ugb2Ygc2VsZWN0XG4gICAqL1xuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgXCJzZWxlY3RbbmFtZT0nZGlzdGFuY2UnXSxzZWxlY3RbbmFtZT0nc29ydCddXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAkKHRoaXMpLmNsb3Nlc3QoXCJmb3JtI2ZpbHRlci1mb3JtXCIpLnN1Ym1pdCgpO1xuICB9KTtcblxuICAvKipcbiAgICogT24gZmlsdGVyIHR5cGUgY2hhbmdlXG4gICAqL1xuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgXCIuZmlsdGVyLXR5cGVcIiwgZnVuY3Rpb24oZSkge1xuICAgICQodGhpcykuY2xvc2VzdChcImZvcm0jZmlsdGVyLWZvcm1cIikuc3VibWl0KCk7XG4gIH0pO1xuXG4gIC8vT24gc3VibWl0XG4gICQoXCJmb3JtI2ZpbHRlci1mb3JtXCIpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHNlcmlhbCA9ICQodGhpcykuc2VyaWFsaXplKCk7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBzZXJpYWw7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSk7XG5cbiAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgZnVuY3Rpb24oZSkge1xuXG4gICAgJChkb2N1bWVudCkudHJpZ2dlcigndHJpZ2dlci11cGRhdGUtZW1iZWQnKTtcblxuICAgIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgaWYgKGhhc2gubGVuZ3RoID09IDAgfHwgaGFzaC5zdWJzdHJpbmcoMSkgPT0gMCkge1xuICAgICAgJChcIiNsb2FkaW5nLWljb25cIikuaGlkZSgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBwYXJhbXMgPSAkLmRlcGFyYW0oaGFzaC5zdWJzdHJpbmcoMSkpO1xuXG4gICAgLy9DdXN0b20gZmVhdHVyZSBmb3Igc3BlY2lmaWMgZGVmYXVsdCBsYXQvbG9uXG4gICAgLy9sYXQ9NDAuNzQxNTQ3OSZsb249LTczLjgyMzk2MDkmem9vbT0xN1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAkKFwiI2xvYWRpbmctaWNvblwiKS5zaG93KCk7XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBmaWx0ZXJzIGRlZmluZWQsIHdpbGwgc2hvdyBhbGwgZXZlbnRzXG4gICAgICBpZiAocGFyYW1zLmYgPT0gbnVsbCAmJiBwYXJhbXMuZGlzdGFuY2UgIT09ICcnKSAge1xuICAgICAgICAvLyBwYXJhbXMuZiA9IHdpbmRvdy5ldmVudFR5cGVGaWx0ZXJzLm1hcCgoaXRlbSkgPT4gaXRlbS5pZCk7XG4gICAgICAgICQoXCJpbnB1dC5maWx0ZXItdHlwZVwiKS5wcm9wKFwiY2hlY2tlZFwiLCBmYWxzZSk7XG4gICAgICB9XG5cblxuICAgICAgaWYgKHdpbmRvdy5tYXBNYW5hZ2VyLl9vcHRpb25zICYmIHdpbmRvdy5tYXBNYW5hZ2VyLl9vcHRpb25zLmRlZmF1bHRDb29yZCAmJiBwYXJhbXMuemlwY29kZS5sZW5ndGggIT0gNSkge1xuICAgICAgICB3aW5kb3cubWFwTWFuYWdlci5maWx0ZXJCeVR5cGUocGFyYW1zLmYpO1xuICAgICAgICB3aW5kb3cubWFwTWFuYWdlci5maWx0ZXJCeUNvb3Jkcyh3aW5kb3cubWFwTWFuYWdlci5fb3B0aW9ucy5kZWZhdWx0Q29vcmQuY2VudGVyLCBwYXJhbXMuZGlzdGFuY2UsIHBhcmFtcy5zb3J0LCBwYXJhbXMuZik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubWFwTWFuYWdlci5maWx0ZXJCeVR5cGUocGFyYW1zLmYpO1xuICAgICAgICB3aW5kb3cubWFwTWFuYWdlci5maWx0ZXIocGFyYW1zLnppcGNvZGUsIHBhcmFtcy5kaXN0YW5jZSwgcGFyYW1zLnNvcnQsIHBhcmFtcy5mKTtcbiAgICAgIH1cbiAgICAgICQoXCIjbG9hZGluZy1pY29uXCIpLmhpZGUoKTtcblxuICAgIH0sIDEwKTtcbiAgICAvLyAkKFwiI2xvYWRpbmctaWNvblwiKS5oaWRlKCk7XG4gICAgaWYgKHBhcmFtcy56aXBjb2RlLmxlbmd0aCA9PSA1ICYmICQoXCJib2R5XCIpLmhhc0NsYXNzKFwiaW5pdGlhbC12aWV3XCIpKSB7XG4gICAgICAkKFwiI2V2ZW50c1wiKS5yZW1vdmVDbGFzcyhcInNob3ctdHlwZS1maWx0ZXJcIik7XG4gICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcImluaXRpYWwtdmlld1wiKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBwcmUgPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcbiAgaWYgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwiaW5pdGlhbC12aWV3XCIpKSB7XG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IDYwMCAmJiAoIXByZS56aXBjb2RlIHx8IHByZSAmJiBwcmUuemlwY29kZS5sZW5ndGggIT0gNSkpIHtcbiAgICAgICQoXCIjZXZlbnRzXCIpLmFkZENsYXNzKFwic2hvdy10eXBlLWZpbHRlclwiKTtcbiAgICB9XG4gIH1cblxuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdhI2V2ZW50LXNob3ctYWxsJywgKGUpID0+IHtcbiAgICAkKFwiI2ZpbHRlci1saXN0XCIpLmZpbmQoXCJpbnB1dFt0eXBlPWNoZWNrYm94XVwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICB9KTtcblxuICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJyNmaWx0ZXItbGlzdCBpbnB1dDpjaGVja2JveCcsIChlKSA9PiB7XG4gICAgLy8gaWYoJChcImlucHV0LmZpbHRlci10eXBlOmNoZWNrZWRcIikubGVuZ3RoID09IDApIHtcbiAgICAvLyAgICQoXCJpbnB1dC5maWx0ZXItdHlwZVwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcbiAgICAvLyB9XG4gIH0pO1xuICAvKipcbiAgRW1iZWQgTGluayBFbGVtZW50c1xuICAqL1xuICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnYnV0dG9uLmJ0bi5tb3JlLWl0ZW1zJywgZnVuY3Rpb24gKGUsIG9wdCkge1xuICAgICQoJyNlbWJlZC1hcmVhJykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcbiAgfSk7XG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgXCIjY29weS1lbWJlZFwiLCAoZSkgPT4ge1xuICAgIHZhciBjb3B5VGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1iZWQtdGV4dFwiKTtcbiAgICBjb3B5VGV4dC5zZWxlY3QoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZChcIkNvcHlcIik7XG4gIH0pO1xuXG4gICQoZG9jdW1lbnQpLm9uKCd0cmlnZ2VyLXVwZGF0ZS1lbWJlZCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy91cGRhdGUgZW1iZWQgbGluZVxuICAgIHZhciBoYXNoID0gJC5kZXBhcmFtKCQoXCIjZmlsdGVyLWZvcm1cIikuc2VyaWFsaXplKCkpO1xuICAgIGhhc2guZW1iZWQgPSB0cnVlO1xuICAgIC8vICQoJyNlbWJlZC1hcmVhIGlucHV0W25hbWU9ZW1iZWRdJykudmFsKCc8aWZyYW1lIHNyYz1cImh0dHA6Ly9tYXAuc3RhY2V5YWJyYW1zLmNvbSMnICsgJC5wYXJhbShoYXNoKSArICdcIiB3aWR0aD1cIjExMDBcIiBoZWlnaHQ9XCI1MDBcIiBmcmFtZWJvcmRlcj1cIjBcIj48L2lmcmFtZT4nKTtcbiAgICAkKCcjZW1iZWQtYXJlYSBpbnB1dFtuYW1lPWVtYmVkXScpLnZhbCgnaHR0cDovL21hcC5zdGFjZXlhYnJhbXMuY29tIycgKyAkLnBhcmFtKGhhc2gpKTtcbiAgfSk7XG5cbn0pKGpRdWVyeSwgZDMpO1xuIl19
