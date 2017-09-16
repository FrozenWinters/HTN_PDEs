;(function ($, window, document) {

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
}

;(function(){
  $(document).ready(function() {
    var test = new App('#g_container', {});
  });
}());
