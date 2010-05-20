(function() {

  function attributes(el) {
    var attrs = {},
        attr;
    el = (_.isElement(el)) ? el : el[0];
    _(el.attributes.length).times(function(i) {
      attr = el.attributes.item(i);
      if(attr.specified) attrs[attr.name]=attr.value;  
    });
    return attrs;
  };

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
  };

  function dashesToCamelCase(str) {
    return _(str.split("-")).map(function(s, i) {
      if(i == 0) return s;
      return capitalize(s);
    }).join("");
  };
  
  var root = this;
  root.Options = _.Module({
    name: "Options",
    getOptions: function(el, prefix) {
      prefix = "data-" + (prefix || "");
      var r = new RegExp("^"+prefix),
          options = {};
      _(attributes(el)).each(function(v, k) {
        if(k.match(r)) {
          k = k.replace(prefix+"-", "");
          k = dashesToCamelCase(k);
          options[k] = v;
        }
      });
      return options;
    }
  });
  
})();