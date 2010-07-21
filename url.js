(function() {
var root = this;
root.URL = _.Class({
  initialize: function(options) {
    this.protocol = options.protocol || "http";
    this.host = options.host;
    this.port = options.port || "";
    this.path = options.path || "";
    this.params = options.params || {};
    this.hash = options.hash || "";
  },
  queryString: function() {
    return _(this.params).map(function(v, k) {
      return k + "=" + v;
    }).join("&");
  },
  addComponent: function(component) {
    this.path = [this.path, component].join("/");
  },
  addParam: function(k, v) {
    var temp = {};
    temp[k] = v;
    _(this.params).extend(temp);
  },
  toUrlString: function() {
    if(!this.host) throw new Error("No host specified");
    var portStr = (!this.port) ? "" : ":" + this.port,
        qs = this.queryString(),
        queryStr = qs ? "?" + qs : "",
        hashStr = this.hash ? this.hash : "";
    return [this.protocol || "http", "://",
            this.host,
            portStr,
            this.path,
            queryStr,
            hashStr].join("");
  }
});

function parseParams(paramString) {
  var xs = paramString.replace(/^\?/,'').split('&');
  return _.reduce(xs, {}, function(memo, x) {
    var temp = {},
        kv = x.split("=");
    temp[kv[0]] = kv[1];
    return _(memo).extend(temp);
  });
};

// adapted from http://snipplr.com/view/12659/parseurl/  
root.URL.parse = function(urlString) {
  var temp = jQuery("<a/>")[0];
  temp.href = urlString;
  console.log(temp);
  return new URL({
    protocol: temp.protocol.replace(":", ""),
    host: temp.hostname,
    port: temp.port,
    path: temp.pathname.replace(/^([^\/])/,'/$1'),
    params: parseParams(temp.search),
    hash: temp.hash.replace('#','')
  });
};
})();