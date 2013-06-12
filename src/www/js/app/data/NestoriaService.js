define(function(require) {

  var EventDispatcher = require('lavaca/events/EventDispatcher'),
      Config = require('lavaca/util/Config'),
      Translation = require('lavaca/util/Translation'),
      Promise = require('lavaca/util/Promise'),
      merge = require('mout/object/merge'),
      Connectivity = require('lavaca/net/Connectivity'),
      _makeRequest = function(resource, urlParams, queryParams, type, dataType) {
        var promise = new Promise(this),
            apiBaseUrl = Config.get('nestoria_base_url'),
            resourceUrl = apiBaseUrl + resource;
        if (urlParams && urlParams.length) {
          resourceUrl += '/' + urlParams.join('/');
        }
        resourceUrl += '/';
        Connectivity.ajax({
          url: resourceUrl,
          dataType: dataType || 'json',
          type: type || 'GET',
          data: queryParams,
          timeout: 5000,
          success: function(response, status) {
            if (status === 'success') {
              promise.resolve(response);
            } else {
              promise.reject(response);
            }
          },
          error: function(xhr) {
            promise.reject(xhr);
          }
        });
        return promise;
      };

  var NestoriaService = EventDispatcher.extend({
    request: function(resource, urlParams, queryParams, type, dataType) {
      var promise = new Promise(this);
      queryParams = merge({
        country: 'uk',
        action: resource,
        encoding: 'json',
        listing_type: 'buy',
        pretty: 1
      }, queryParams);
      _makeRequest('', urlParams, queryParams, type, 'jsonp')
        .success(function(data) {
          var successStatusCodes = ['100','101','110'],
              ambiguousStatusCodel = ['200','202'],
              responseCode = data.response.application_response_code;
          if (successStatusCodes.indexOf(responseCode) > -1
            || ambiguousStatusCodel.indexOf(responseCode) > -1) {
            promise.resolve(data.response, (ambiguousStatusCodel.indexOf(responseCode) > -1));
          } else {
            if (data.response === 'unknown location') {
              promise.reject({error: Translation.get('not_matched')});
            } else if(responseCode === '210') {
              promise.reject({error: Translation.get('location_not_found')});
            } else {
              promise.reject({error: Translation.get('error_offline')});
            }
          }
        })
        .error(function(xhr) {
          promise.reject(xhr);
        });
      return promise;
    }
  });

  return new NestoriaService();

});
