(function() {
  var root = this;
  root.Events = _.Module({
    name: "Events",
    
    addEvent: function (type, fn) {
      if(!this._events) this._events = {};
      var events = this._events;
      if(!events[type]) events[type] = [];
      events[type].push(fn);
    },
    
    fireEvent: function(type, x) {
      var events = this._events;
      if(events && events[type]) {
        _(events[type]).each(function(fn) {
          fn(x);
        });
      }
    },

    removeEvent: function(type, fn) {
      var events = this._events;
      if(events && events[type]) {
        events[type] = _(events[type]).without(fn);
      }
    },

    removeEvents: function(type) {
      var events = this._events;
      if(events[type]) {
        events[type] = [];
      }
    }
  });
})();