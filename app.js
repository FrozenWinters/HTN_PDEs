;(function ($, window, document, firebase) {

  //Firebase setup
  var config = {
    apiKey: "AIzaSyDWPeW46FDkb2egTZMgFN8OIFEe56d6r5w",
    authDomain: "htn-pde.firebaseapp.com",
    databaseURL: "https://htn-pde.firebaseio.com",
    projectId: "htn-pde",
    storageBucket: "htn-pde.appspot.com",
    messagingSenderId: "196411733137"
  };

  firebase.initializeApp(config);

  var db = firebase.database();

  function reset(){
    db.ref().child('Counter').child('count').set(0);
  }

  function increment(){
    var value;
    db.ref().child('Counter').child('count').once("value", function(snapshot) {
      value = snapshot.val();
    });
    db.ref().child('Counter').child('count').set(value + 1);
  }

  //Seting up the DOM

  function App(id, option){
    this.wrapper = $(id);
    this.option = $.extend({}, App.defaults, option);
    writeDOM(this);
  }

  App.prototype = {
    constructor: App
  }

  App.defaults = {
    width: 300,
    height: 100
  };

  function writeDOM(app) {
    var html ='';
    html += '<div class="screen" style="width:' + app.option.width + 'px; height:' + app.option.height +'px; background:blue;"></div>';
    app.wrapper.html(html);
    app.wrapper.find('.screen').on("touchend mouseup", function (e) {
			pressHandler.call(this, e, board);
		});
  }

  window.App = App;
  window.reset = reset;
  window.increment = increment;
}(jQuery, window, document, firebase));

;(function(){
  $(document).ready(function() {
    var test = new App('#g_container', {});
    reset();
    increment();
    increment();
  });
}());
