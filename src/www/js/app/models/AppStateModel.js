define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var AppStateModel = Model.extend(function() {
    Model.apply(this, arguments);
    var state = localStorage.getItem(this.store) || '{}';
    this.apply(JSON.parse(state));
  }, {
    store: 'appState',
    set: function() {
      Model.prototype.set.apply(this, arguments);
      localStorage.setItem(this.store, JSON.stringify(this.toObject()));
    },
    addRecentSearch: function(search) {
      var recentSearches = this.get('recentSearches') || [],
          ignore;
      recentSearches.forEach(function(item, i) {
        if (item.place_name === search.place_name) {
          recentSearches.splice(i, 1);
        }
      });
      recentSearches.unshift(search);
      this.set('recentSearches', recentSearches);
    }
  });
  return AppStateModel;
});