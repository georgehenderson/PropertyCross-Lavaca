define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/listings');

  /**
   * @class app.ui.ListingsView
   * @super app.ui.BaseView
   * Example view type
   */
  var ListingsView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'li': {tap: this.onTapListing.bind(this)}
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
