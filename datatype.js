(function() {

var multiMap = {};

_.mixin({
  extenderOf: function(x, protocol) {
    return _(x.protocols).indexOf(protocol) != -1;
  },

  multi: function(name, type, fn) {
    if(_.isUndefined(multiMap[name])) {
      var dispatchTable = {};
      multiMap[name] = dispatchTable;
      var dispatcher = {};
      dispatcher[name] = function(instance) {
        var rest = _.rest(arguments);
        return multiMap[name][instance.name].apply(instance, rest);
      };
      _.mixin(dispatcher);
    }
    multiMap[name][type.name] = fn;
  },

  protocol: function(obj) {
    obj.toString = function() {
      return ["<Protocol: ", (obj.name || _uniqueId("UnnamedProtocol")), ">"].join("");
    };
    return obj;
  },
  
  datatype: function(obj) {
    var klass = function() {
      if(_.isFunction(this.initialize)) {
        return this.initialize.apply(this, arguments);
      } else {
        return this;
      }
    };
    var protocols = obj.protcols || [];
    var name = obj.name = (obj.name || _.uniqueId("UnnamedType"));
    var methodMap = protocols
      .map(function(x) { x = _(x).clone(); delete x.name; delete x.toString; return x; });
    obj =_.reduce(methodMap.concat(obj), {}, function(memo, m) {
      return _.extend(memo, m);
    });
    obj = _(obj).extend({
      toString: function() {
        return ["<Type: ", name, ">"].join("");
      }
    });
    klass.name = name;
    klass.prototype = obj;
    klass.prototype.type = klass;
    klass.prototype.protocols = klass.protocols = protocols;
    return klass;
  }
});

})();
