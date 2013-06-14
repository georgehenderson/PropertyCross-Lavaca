define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      service = require('app/data/NestoriaService');

  var ListingCollection = Collection.extend(function() {
    Collection.apply(this, arguments);
    this.setupComputedProperties();
  }, {
    fetch: function() {
      var params = {
            place_name: this.get('placeName'),
            page: parseInt(this.get('page'), 10) + 1
          };
      this.search(params);
    },
    search: function(params) {
      return service.request('search_listings', null, params).then(function() {
        this.responseFilter.apply(this, arguments);
      }.bind(this))
      .error(function(data) {
        this.set('error', data.error);
        this.trigger('reset');
      }.bind(this));
    },
    responseFilter: function(data) {
      if (data.listings && data.listings.length) {
        this.apply({
          lastFetchedModels: data.listings,
          page: data.page
        });
        this.add(data.listings);
      }
      this.trigger('reset');
    },
    setupComputedProperties: function() {
      this.apply({
        hasMoreResults: this.hasMoreResults.bind(this),
        longTitle: this.getLongTitle.bind(this),
        placeName: this.getPlaceName.bind(this),
        pageTitle: this.getPageTitle.bind(this)
      });
    },
    hasMoreResults: function() {
      return this.count() < this.get('total_results');
    },
    getLongTitle: function() {
      return this.get('locations')[0].long_title;
    },
    getPlaceName: function() {
      return this.get('locations')[0].place_name;
    },
    getPageTitle: function() {
      return this.count() + ' of ' + this.get('total_results') + ' matches';
    }
  });
  return ListingCollection;
});