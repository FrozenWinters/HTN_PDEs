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

  function push_mesh(){
    time_now = Date.now();
    v = geometry.vertices;
    heights = [];
    for (a = 1; a <= window.mesh_res; a++) {
      for (b = 1; b <= window.mesh_res; b++) {
        i = idx(a, b);
        heights[i] = [v[i].y, v[i].uy];
      }
    }
    db.ref().child('Mesh').set([time_now, JSON.stringify(heights)]);
  }

  window.push_mesh = push_mesh;

  function syndicate(){
    console.log('Syndicate called!');
    push_mesh();
  }

  function subscribe(){
    db.ref().child('Mesh').on("value", function(s){
      console.log('Update recieved!');
      window.wave_heights = s.val();
      window.is_pull = true;
    });
  }

  //Seting up the DOM

  function App(id, option){
    this.wrapper = $(id);
    this.option = $.extend({}, App.defaults, option);
    subscribe();
    //writeDOM(this);
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
      syndicate();
		});
    app.wrapper.find('.receive').one("touchend mouseup", function (e) {
      subscribe();
    });
  }

  /*function fullscreen() {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  }*/

  window.App = App;
}(jQuery, window, document, firebase));

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

;(function(){
  $(document).ready(function() {
    window.is_pull = false;
    window.is_push = false;
    is_spect = false;
    console.log(getParameterByName('sten'));
    add_graphics(is_spect);
    var test = new App('#g_container', {});
  });
}());
