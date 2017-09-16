//;(function ($, window, document, firebase) {

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
    db.child('Counter').child('count').set(0);
  }

  function increment(){
    var value;
    db.child('Counter').child('count').once("value", function(snapshot) {
      value = snapshot.val();
    });
    db.child('Counter').child('count').set(value + 1);
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
    width: 15,
    height: 25
  };

  function writeDOM(app) {
    var html ='';
    html += '<div style="width:' + app.option.width + 'px; height:' + app.option.height +'px; background:blue;"></div>';
    app.wrapper.html(html);
  }
//}(jQuery, window, document, firebase));

;(function(){
  $(document).ready(function() {
    var test = new App('#g_container', {});
    reset();
    increment();
    increment();
  });
}());
