_.mixin({
  datatype: function(obj) {
    var klass = function() {};
    _(obj).chain()
      .filter(_.isFunction)
      .each(function(fn, k) {
        console.log(fn, k);
      }).value();
    return klass;
  }
});