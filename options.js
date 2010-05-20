(function() {

  function attributes (el) {
    var attrs = {},
        attr;
    el = (_.isElement(el)) ? el : el[0];
    _(el.attributes.length).times(function(i) {
      attr = el.attributes.item(i);
      if(attr.specified) attrs[attr.name]=attr.value;  
    });
    return attrs;
  };
  
  var root = this;
  root.Options = _.Module({
    name: "Options",
    getOptions: function(el, prefix) {
      prefix = "data-" + (prefix || "");
      var r = new RegExp("^"+prefix);
      return _(attributes(el)).filter(function(v, k) {
        return k.search(r) != -1;
      });
    }
  });
  
})();