define(function(require) {

  var SearchView = require('app/ui/views/SearchView'),
      ListingsView = require('app/ui/views/ListingsView'),
      ListingView = require('app/ui/views/ListingView'),
      BaseController = require('./BaseController'),
      SearchModel = require('app/models/SearchModel'),
      Collection = require('lavaca/mvc/Collection'),
      Model = require('lavaca/mvc/Model');

  /**
   * @class app.net.SearchController
   * @super app.net.BaseController
   * Example controller
   */
  var SearchController = BaseController.extend({
    /**
     * @method home
     * Home action, creates a history state and shows a view
     *
     * @param {Object} params  Action arguments
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    home: function(params, model) {
      if (!model) {
        model = new SearchModel();
      }
      return this
        .view('home', SearchView, model)
        .then(this.updateState(null, 'PropertyCross', params.url));
    },
    listings: function(params, model) {
      if (!model && !params.listings) {
        this.redirect('/');
        return;
      }
      model = new Collection(model ? model.items : params.listings);
      if (params.search) {
        model.apply(params.search);
      }
      return this
        .view(null, ListingsView, model)
        .then(this.updateState(model.toObject(), model.count() + ' of ' + model.get('total_results') +' matches', params.url));
    },
    listing: function(params, model) {
      if (!model && !params.listing) {
        this.redirect('/', true);
        return;
      }
      model = model ? new Model(model) : params.listing;
      return this
        .view(null, ListingView, model)
        .then(this.updateState(model.toObject(), model.get('title'), params.url));
    }
  });

  return SearchController;

});
