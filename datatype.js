(function() {

  var root = this;
  root._sel = {};

  function Type() {};
  function Protocol() {};
  
  _.mixin({
    extenderOf: function(x, protocol) {
      return _(x.protocols).indexOf(protocol) != -1;
    },

    isProtocol: function() {
      return x instanceof Protocol;
    },

    Protocol: function(obj) {
      obj.prototype = new Protocol;
      obj.toString = function() {
        return ["<Protocol: ", (obj.name || _uniqueId("UnnamedProtocol")), ">"].join("");
      };
      return obj;
    },
    
    isType: function(x) {
      return x instanceof Type;
    },

    Type: function(obj) {
      obj = obj || {};
      var klass = function() {
        if(_.isFunction(this.initialize)) {
          return this.initialize.apply(this, arguments);
        } else {
          return this;
        }
      };
      var protocols = obj.protocols || [],
          name = obj.name = (obj.name || _.uniqueId("UnnamedType")),
          methodMap = protocols.map(function(x) {
            x = _(x).clone(); delete x.name; delete x.toString; return x;
          });
      obj =_.reduce(methodMap.concat(obj), {}, function(memo, m) {
        return _.extend(memo, m);
      });
      obj = _(obj).extend({
        toString: function() {
          return ["<Type: ", name, ">"].join("");
        }
      });
      klass.name = name;
      klass.prototype = new Type();
      klass.prototype.type = klass;
      klass.prototype.protocols = klass.protocols = protocols;

      _(obj).each(function(v, k) {
        klass.prototype[k] = v;
        if(_.isUndefined(_sel[k])) {
          _sel[k] = function() {
            var args = arguments;
            return function(x) {
              var result;
              try{
                result = x[k].apply(x, args);                
              } catch (err) {
                throw Error([x.name, "does not implement", k, "or signature does not match"].join(" "));
              }
              return result;
            };
          };
        }
      });

      return klass;
    }
  });

})();
