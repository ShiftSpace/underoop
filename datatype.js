(function() {

  var root = this;
  root._sel = {};

  function Class() {};
  function Module() {};
  
  _.mixin({
    // check if an object is using a module
    includes: function(x, modules) {
      return _(x.modules).indexOf(module) != -1;
    },

    // check if an object is a Module
    isModule: function() {
      return x instanceof Module;
    },

    // create grouping of functions for mixins
    Module: function(obj) {
      obj.prototype = new Module;
      obj.toString = function() {
        return ["<Module: ", (obj.name || _uniqueId("UnnamedModule")), ">"].join("");
      };
      return obj;
    },

    // check if an instance derives from class
    memberof: function(x, _class) {
      return x instanceof _class;
    },

    // check if the instance has the same class
    instanceof: function(x, _class) {
      return x._class = _class;
    },

    // creates a class. does not support inheritance for good reason
    // use Modules. Selectors will be generated for any methods defined
    // in your class
    Class: function(obj) {
      obj = obj || {};
      var klass = function() {
        if(_.isFunction(this.initialize)) {
          return this.initialize.apply(this, arguments);
        } else {
          return this;
        }
      };
      var modules = obj.includes || [],
          name = obj.name = (obj.name || _.uniqueId("UnnamedClass")),
          methodMap = modules.map(function(x) {
            x = _(x).clone(); delete x.name; delete x.toString; return x;
          });
      obj =_.reduce(methodMap.concat(obj), {}, function(memo, m) {
        return _.extend(memo, m);
      });
      obj = _(obj).extend({
        toString: function() {
          return ["<Class: ", name, ">"].join("");
        }
      });
      klass.name = name;
      klass.prototype = new Class();
      klass.prototype.type = klass;
      klass.prototype.modules = klass.modules = modules;

      _(obj).each(function(v, k) {
        klass.prototype[k] = v;
        if(_.isUndefined(_sel[k])) {
          _sel[k] = function() {
            var args = arguments;
            return function(x) {
              var result;
              try {
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
