define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router'),
      stateModel = require('app/models/StateModel'),
      Template = require('lavaca/ui/Template'),
      History = require('lavaca/net/History');
  require('rdust!templates/listings');
  require('rdust!templates/listings-list-item');

  /**
   * @class app.ui.ListingsView
   * @super app.ui.BaseView
   * Example view type
   */
  var ListingsView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'li': {tap: this.onTapListing.bind(this)},
      '.has-more': {tap: this.onTapLoadMore.bind(this)},
      model: {
        fetchSuccess: this.onModelReset.bind(this)
      }
    });
  }, {
    /**
     * @field {String} template
     * @default 'templates/search'
     * The name of the template used by the view
     */
    template: 'templates/listings',
    /**
     * @field {String} className
     * @default 'search'
     * A class name added to the view container
     */
    className: 'listings',
    onModelReset: function() {
      stateModel.set('pageTitle', this.model.get('pageTitle'));
      stateModel.trigger('reset');
      this.renderCells();
      this.redraw('.load-more');
    },
    renderCells: function() {
      var template = Template.get('templates/listings-list-item');
      template.render({items: this.model.get('lastFetchedModels')})
        .success(function(html) {
          this.el.find('ul').append(html);
          History.replace(this.model.toObject(), this.model.get('pageTitle'), location.hash.split('#')[1]);
        }.bind(this));
    },
    onTapLoadMore: function(e) {
      e.stopPropagation();
      this.el.find('.load-more').html('Loading ...');
      this.model.fetch();
    },
    onTapListing: function(e) {
      var li = $(e.currentTarget),
          guid = li.data('guid'),
          listing = this.model.first({guid: guid});
      if (listing) {
        router.exec('/listings/' + this.model.get('placeName') + '/' + guid, null, {listing: listing});
      }
    }

  });

  return ListingsView;

});
