(function(root) {

root.NotifyClass = _.Class({
  name: "Notify",
  includes: [Events],

  initialize: function() {
  },

  observe: function(eventType, callback) {
    this.addEvent(eventType, callback);
  },

  unobserve: function(eventType, callback) {
    this.removeEvent(eventType, callback);
  },

  unobserveAll: function(eventType) {
    this.removeEvents(eventType);
  },

  notify: function(eventType, data) {
    this.fireEvent(eventType, data);
  }

});

root.Notify = new NotifyClass();

})(this);