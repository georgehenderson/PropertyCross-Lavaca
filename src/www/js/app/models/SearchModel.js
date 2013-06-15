define(function(require) {

  var Model = require('lavaca/mvc/Model'),
      service = require('app/data/NestoriaService'),
      state = require('./StateModel'),
      merge = require('mout/object/merge');

  var SearchModel = Model.extend(function() {
    Model.apply(this, arguments);
    this.apply({
      recentSearches: this.setRecentSearches.bind(this)
    });
  }, {
    searchText: function(text, page) {
      var params = {
            place_name: text,
            page: page || 1
          };
      this.search(params);
    },
    searchCoords: function(lat, lng, page) {
      var params = {
            centre_point: lat + ',' + lng,
            page: page || 1
          };
      this.search(params);
    },
    search: function(params) {
      return service.request('search_listings', null, params).then(function() {
        this.responseFilter.apply(this, arguments);
      }.bind(this))
      .error(function(data) {
        this.set('search', null);
        this.set('error', data.error);
        this.trigger('reset');
      }.bind(this));
    },
    responseFilter: function(data, showLocations) {
      if (data.listings && data.listings.length) {
        var recentSearch = merge({total_results: data.total_results}, data.locations[0]);
        state.addRecentSearch(recentSearch);
      } else if (!showLocations) {
        this.apply({
          showLocations: showLocations,
          search: data,
          error: 'This search has no properties.'
        });
        this.trigger('reset');
        return;
      }
      this.apply({
        showLocations: showLocations,
        search: data,
        error: null
      });
      this.trigger('reset');
    },
    setRecentSearches: function() {
      return state.get('recentSearches');
    }
  });

  return SearchModel;

});
