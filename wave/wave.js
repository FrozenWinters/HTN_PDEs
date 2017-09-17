// Generated by CoffeeScript 1.12.7

function add_graphics(is_spect) {
  var C, C2, D, DAMPING, DELTA_X, DELTA_X2, DELTA_Z, DELTA_Z2, H, MAX_DT, MAX_ITERATRED_DT, MAX_Y, N, SIGMA, SIM_SPEED, W, animate, camera, controls, geometry, hitTest, idx, init, initGeometry, integrate, mesh, now, projector, renderer, scene, raycaster, mouse;

  mesh = null;

  renderer = null;

  scene = null;

  camera = null;

  geometry = null;

  controls = null;

  projector = null;

  N = 35;

  window.mesh_res = N;

  W = 200;

  H = W;

  D = 10;

  C = 0.04;

  C2 = C * C;

  DAMPING = 0.001;

  SIM_SPEED = 1;

  DELTA_X = W / N;

  DELTA_X2 = DELTA_X * DELTA_X;

  DELTA_Z = H / N;

  DELTA_Z2 = DELTA_Z * DELTA_Z;

  MAX_DT = 12;

  MAX_ITERATRED_DT = 1000;

  MAX_Y = 50;

  SIGMA = 0.01;

  init = function() {
    var cubeGeometry, cubeMesh, face, j, len, light, materials, matrix, ref, updateViewport;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 200;
    camera.position.y = 150;
    camera.position.x = 100;
    scene = new THREE.Scene();
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
    geometry = new THREE.PlaneGeometry(W, H, N, N);
    window.geometry = geometry;
    matrix = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
    geometry.applyMatrix(matrix);
    initGeometry();
    materials = [
      new THREE.MeshPhongMaterial({
        color: 0x0099ff
      }), new THREE.MeshBasicMaterial({
        visible: false
      })
    ];
    mesh = new THREE.Mesh(geometry, materials[0]);
    cubeGeometry = new THREE.CubeGeometry(W, D, H);
    ref = cubeGeometry.faces;
    for (j = 0, len = ref.length; j < len; j++) {
      face = ref[j];
      face.materialIndex = 1;
    }
    cubeGeometry.faces[2].materialIndex = 1;
    cubeMesh = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial(materials));
    cubeMesh.position.set(0, -D / 2, 0);
    scene.add(mesh);
    scene.add(cubeMesh);
    renderer = new THREE.WebGLRenderer();
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    /*controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
    );
    controls.noPan = true;
    controls.noZoom = true;*/
    if(is_spect){
      controls = new THREE.DeviceOrientationControls(camera, true);
      camera.position.z = 0;
      camera.position.y = 120;
      camera.position.x = 80;
      controls.connect();
      controls.update();
    } else{
      controls = new THREE.TrackballControls(camera);
    }
    //projector = new THREE.Projector();

    //Stereo fiddling begin
    effect = new THREE.StereoEffect(renderer);
    //fidling end
    raycaster = new THREE.Raycaster(); // create once
    mouse = new THREE.Vector2(); // create once

    updateViewport = function() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      effect.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      if(controls.target) {controls.target.set(0, 0, 0);}
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    document.addEventListener('mousedown', hitTest);
    renderer.domElement.addEventListener('click', fullscreen);
    return $('#w_container').append(renderer.domElement);
  };

  now = Date.now();

  animate = function() {
    var dt;
    time_temp = Date.now();
    requestAnimationFrame(animate);
    if(is_spect){
      effect.render(scene, camera);
    } else {
      renderer.render(scene, camera);
    }
    controls.update();

    if(!window.is_pull){
      dt = time_temp - now;
    } else{
      window.is_pull = false;
      dt = set_state(time_temp);
    }

    dt *= SIM_SPEED;
    if (dt > MAX_ITERATRED_DT) {
      dt = MAX_ITERATRED_DT;
    }

    while (dt > 0) {
      if (dt > MAX_DT) {
        integrate(MAX_DT);
      } else {
        integrate(dt);
      }
      dt -= MAX_DT;
    }
    return now = time_temp;
  };

  idx = function(x, z) {
    return x + (N + 1) * z;
  };

  window.idx = idx;

  initGeometry = function() {
    var index, j, len, ref, results, vertex;
    ref = geometry.vertices;
    results = [];
    for (index = j = 0, len = ref.length; j < len; index = ++j) {
      vertex = ref[index];
      vertex.y = MAX_Y * Math.exp(-SIGMA * vertex.x * vertex.x) * Math.exp(-SIGMA * vertex.z * vertex.z);
      vertex.uy = 0;
      results.push(vertex.ay = 0);
    }
    return results;
  };

  function fullscreen() {
    dom_obj  = renderer.domElement;
    if (dom_obj.requestFullscreen) {
      dom_obj.requestFullscreen();
    } else if (dom_obj.msRequestFullscreen) {
      dom_obj.msRequestFullscreen();
    } else if (dom_obj.mozRequestFullScreen) {
      dom_obj.mozRequestFullScreen();
    } else if (dom_obj.webkitRequestFullscreen) {
      dom_obj.webkitRequestFullscreen();
    }
  }

  set_state = function(stamp) {
    v = geometry.vertices;
    //console.log(window.wave_heights[1]);
    heights = JSON.parse(window.wave_heights[1]);
    for (a = 1; a <= N; a++) {
      for (b = 1; b <= N; b++) {
        i = idx(a, b);
        v[i].y = heights[i][0];
        v[i].uy = heights[i][1];
      }
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;
    return (stamp - window.wave_heights[0]);
  }

  integrate = function(dt) {
    var d2x, d2z, i, iNextX, iNextZ, iPrevX, iPrevZ, j, k, l, m, ref, ref1, ref2, ref3, v, x, z;
    v = geometry.vertices;
    for (z = j = 1, ref = N; 1 <= ref ? j < ref : j > ref; z = 1 <= ref ? ++j : --j) {
      for (x = k = 1, ref1 = N; 1 <= ref1 ? k < ref1 : k > ref1; x = 1 <= ref1 ? ++k : --k) {
        i = idx(x, z);
        iPrevX = idx(x - 1, z);
        iNextX = idx(x + 1, z);
        iPrevZ = idx(x, z - 1);
        iNextZ = idx(x, z + 1);
        d2x = (v[iNextX].y - 2 * v[i].y + v[iPrevX].y) / DELTA_X2;
        d2z = (v[iNextZ].y - 2 * v[i].y + v[iPrevZ].y) / DELTA_Z2;
        v[i].ay = C2 * (d2x + d2z);
        v[i].ay += -DAMPING * v[i].uy;
        v[i].uy += dt * v[i].ay;
        v[i].newY = v[i].y + dt * v[i].uy;
      }
    }
    for (z = l = 1, ref2 = N; 1 <= ref2 ? l < ref2 : l > ref2; z = 1 <= ref2 ? ++l : --l) {
      for (x = m = 1, ref3 = N; 1 <= ref3 ? m < ref3 : m > ref3; x = 1 <= ref3 ? ++m : --m) {
        i = idx(x, z);
        v[i].y = v[i].newY;
      }
    }
    geometry.verticesNeedUpdate = true;
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;
    if(window.is_push){
      window.push_mesh();
      window.is_push = false;
    }
  };

  hitTest = function(e) {
    var index, intersects, j, len, p, ref, results, vector, vertex, x, z;
    if(is_spect){
      mouse.x = (e.clientX / window.innerWidth) * 4 - 1;
      mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    } else {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    }
    //vector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    //projector.unprojectVector(vector, camera);
    //raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    raycaster.setFromCamera( mouse, camera );
    /*vector = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());*/
    console.log([mesh]);
    console.log([mouse]);
    intersects = raycaster.intersectObjects([mesh], true);
    //intersects = raycaster.intersectObjects([mesh]);
    if (intersects.length) {
      p = intersects[0].point;
      ref = geometry.vertices;
      results = [];
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        vertex = ref[index];
        x = vertex.x - p.x;
        z = vertex.z - p.z;
        vertex.y += MAX_Y * Math.exp(-SIGMA * x * x) * Math.exp(-SIGMA * z * z);
        if (vertex.x === -W / 2 || vertex.x === W / 2 || vertex.z === -H / 2 || vertex.z === H / 2) {
          results.push(vertex.y = 0);
        } else {
          results.push(void 0);
        }
      }
      window.is_push = true;
      return results;
    }
  };

  init();

  animate();

};
