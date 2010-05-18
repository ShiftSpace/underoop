_.mixin({
  extenderOf: function(x, protocol) {
    return _(x.protocols).indexOf(protocol) != -1;
  },

  protocol: function(obj) {
    obj.toString = function() {
      return ["<Protocol: ", (obj.name || "Unnamed protocol"), ">"].join("");
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
    var methodMap = obj.protocols
      .map(function(x) { x = _(x).clone(); delete x.name; delete x.toString; return x; });
    obj =_.reduce((methodMap || []).concat(obj), {}, function(memo, m) {
      return _.extend(memo, m);
    });
    obj = _(obj).extend({
      toString: function() {
        return ["<Type: ", this.name, ">"].join("");
      }
    });
    klass.prototype = obj;
    klass.prototype.type = klass;
    klass.prototype.protocols = klass.protocols = obj.protocols;
    return klass;
  }
});