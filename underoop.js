(function() {

  var root = this;
  root._sel = {};

  function Class() {};
  function Module() {};
  
  _.mixin({
    // create grouping of functions. Can be used with classes
    // to combine functionality.
    Module: function(obj) {
      var m = new Module;
      m._module = true;
      _(obj).each(function(v, k) {
        m[k] = v;
      });
      m.toString = function() {
        return ["<Module: ", (obj.name || _uniqueId("UnnamedModule")), ">"].join("");
      };
      return m;
    },

    // check if an object is a Module
    isModule: function(x) {
      return x._module === true;
    },

    // check if an object is using a module
    includes: function(x, module) {
      return _(module).isModule() && _(x.includes).indexOf(module) != -1;
    },

    // creates a class. does not support inheritance because inheritance
    // and AJAX do not work well together. Use Modules instead.
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
          methodMap = _(modules).map(function(x) {
            x = _(x).clone(); delete x.name; delete x.toString; delete x._module; return x;
          });
      obj =_.reduce(methodMap.concat(obj), {}, function(memo, m) {
        return _.extend(memo, m);
      });
      obj = _(obj).extend({
        toString: function() {
          return ["<Class: ", name, ">"].join("");
        }
      });

      klass._name = name;
      klass._class = true;
      klass._modules = klass._modules = modules;
      klass.prototype = new Class;

      _(obj).each(function(v, k) {
        klass.prototype[k] = v;
        if(_.isFunction(v) && _.isUndefined(_sel[k])) {
          _sel[k] = function() {
            var args = arguments;
            return function(x) {
              return x[k].apply(x, args);
            };
          };
        }
      });

      return klass;
    },

    isClass: function(x) {
      return x._class === true;
    }
  });

})();
