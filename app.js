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

  function pushmesh(x, y){
    db.ref().child('Position').child('x_val').set(x);
    db.ref().child('Position').child('y_val').set(y);
    v = geometry.vertices;
    var points = [];
    for(i = 0; i < mesh_res * mesh_res; i++){
      points[i] = v[i].y;
      if(!(i % 500))
        console.log(v[i].y);
    }
    //db.ref().child('Mesh').set(points);
    db.ref().child('Mesh').set(v);
  }

  function subscribe(){
    db.ref().child('Mesh').on("value", function(s){
      window.wave_heights = s.val();
      window.is_pull = true;
      console.log(window.wave_heights);
      /*v = geometry.vertices;
      for(i = 0; i < mesh_res * mesh_res; i++){
        v[i].y = (s.val())[i];
      }
      geometry.verticesNeedUpdate = true;
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      geometry.normalsNeedUpdate = true;*/
    });
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
    width: 100,
    height: 100
  };

  function writeDOM(app) {
    var html ='';
    html += '<div class="send" style="width:' + app.option.width + 'px; height:'
      + app.option.height +'px; background:blue; z-index: 10; position:relative; top: -210px; left: 20px;"></div>';
    html += '<div class="receive" style="width:' + app.option.width + 'px; height:'
      + app.option.height +'px; background:red; z-index: 10; position:relative; top: -310px; left: 150px;"></div>';
    app.wrapper.html(html);
    app.wrapper.find('.send').on("touchend mouseup", function (e) {
      var x_val = e.pageX - $(this).offset().left;
      var y_val = e.pageY - $(this).offset().top;
      pushmesh(x_val, y_val);
		});
    app.wrapper.find('.receive').on("touchend mouseup", function (e) {
      subscribe();
    });
  }

  window.App = App;
  window.reset = reset;
  window.increment = increment;
}(jQuery, window, document, firebase));

;(function(){
  $(document).ready(function() {
    window.is_pull = false;
    add_graphics();
    var test = new App('#g_container', {});
    reset();
  });
}());
