import './style.scss';
import * as THREE from 'three'; 1
import Stats from 'three/examples/jsm/libs/stats.module';
// for cameras 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ShaderMaterial } from 'three';

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let clock = new THREE.Clock();

let lightAmbient: THREE.AmbientLight;
let lightPoint: THREE.PointLight;

let controls: OrbitControls;
let stats: any;

let earth: THREE.Mesh;
let plane: THREE.Mesh;
let exampleModel: THREE.Group;
let exampleTexture: THREE.Texture;

import vertexShader from '../resources/shaders/shader.vert?raw';
import fragmentShader from '../resources/shaders/shader.frag?raw';
let shaderMat: ShaderMaterial;

function main() {
    initScene();
    initStats();
    initListeners();
}

function initStats() {
    stats = new (Stats as any)();
    document.body.appendChild(stats.dom);
}

function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    lightAmbient = new THREE.AmbientLight(0x404040);
    scene.add(lightAmbient);

    // https://github.com/mrdoob/three.js/pull/14087#issuecomment-431003830
    const shadowIntensity = .2;

    lightPoint = new THREE.PointLight(0xffffff);
    lightPoint.position.set(0, 0, -10);
    lightPoint.castShadow = true;
    lightPoint.intensity = 1- shadowIntensity;
    lightPoint.distance = 0;
    scene.add(lightPoint);

    const lightPoint2 = lightPoint.clone();
    lightPoint2.position.set(0, 0, 10);
    lightPoint2.intensity = 1 - shadowIntensity;
    lightPoint2.castShadow = false;
    scene.add(lightPoint2);

   

    const mapSize = 1024; // Default 512
    const cameraNear = 0.5; // Default 0.5
    const cameraFar = 500; // Default 500
    lightPoint.shadow.mapSize.width = mapSize;
    lightPoint.shadow.mapSize.height = mapSize;
    lightPoint.shadow.camera.near = cameraNear;
    lightPoint.shadow.camera.far = cameraFar;

    
//     objLoader.load('3dobj/paloma_standing.obj', (root) => {
//     scene.add(root);
//   });
    const mtlLoader = new MTLLoader();
    mtlLoader.load('3dobj/paloma_standing.mtl', (mtl) => {
        mtl.preload();
        for (const material of Object.values(mtl.materials)) {
            material.side = THREE.DoubleSide;
        }
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('3dobj/paloma_standing.obj', (root) => {
            scene.add(root);
        });
    });

    // https://stackoverflow.com/questions/27620586/a-sphere-with-texture-in-three-js
    var earthloader = new THREE.TextureLoader();
    earthloader.load( '3dobj/earth.jpeg', function ( texture: any ) {
    var geometry = new THREE.SphereGeometry( 2);
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var earth = new THREE.Mesh( geometry, material );
    earth.position.y = -2;

    scene.add( earth );
    })

    var venusloader = new THREE.TextureLoader();
    venusloader.load( '3dobj/venus.jpeg', function ( venText: any ) {
    var venGeo = new THREE.SphereGeometry( 2);
    var venMat = new THREE.MeshBasicMaterial( { map: venText } );
    var venus = new THREE.Mesh( venGeo, venMat );
    venus.position.y = -2;
    venus.position.x = -6;
    scene.add( venus );})

    var mercuryLoader = new THREE.TextureLoader();
    mercuryLoader.load( '3dobj/mercury.jpeg', function ( venText: any ) {
    var mercGeo = new THREE.SphereGeometry( 1.5);
    var mercMat = new THREE.MeshBasicMaterial( { map: venText } );
    var mercury = new THREE.Mesh( mercGeo, mercMat );
    mercury.position.y = -2;
    mercury.position.x = -12;
    scene.add( mercury );})

    var sunLoader = new THREE.TextureLoader();
    sunLoader.load( '3dobj/sun.jpeg', function ( venText: any ) {
    var sunGeo = new THREE.SphereGeometry( 6);
    var sunMat = new THREE.MeshBasicMaterial( { map: venText } );
    var sun = new THREE.Mesh( sunGeo, sunMat );
    sun.position.y = -2;
    sun.position.x = -25;
    scene.add( sun );})

    var marsLoader = new THREE.TextureLoader();
    marsLoader.load( '3dobj/mars.jpeg', function ( venText: any ) {
    var marsGeo = new THREE.SphereGeometry(2.1);
    var marsMat = new THREE.MeshBasicMaterial( { map: venText } );
    var mars = new THREE.Mesh( marsGeo, marsMat );
    mars.position.y = -2;
    mars.position.x = 7;
    scene.add( mars );})

    var jupLoader = new THREE.TextureLoader();
    jupLoader.load( '3dobj/jupiter.jpeg', function ( venText: any ) {
    var jupGeo = new THREE.SphereGeometry( 4);
    var jupMat = new THREE.MeshBasicMaterial( { map: venText } );
    var jupiter = new THREE.Mesh( jupGeo, jupMat );
    jupiter.position.y = -2;
    jupiter.position.x = 15;
    scene.add( jupiter );})

    var satLoader = new THREE.TextureLoader();
    satLoader.load( '3dobj/saturn.jpeg', function ( venText: any ) {
    var satGeo = new THREE.SphereGeometry(3);
    var satMat = new THREE.MeshBasicMaterial( { map: venText } );
    var saturn = new THREE.Mesh( satGeo, satMat );
    saturn.position.y = -2;
    saturn.position.x = 24;
    scene.add( saturn );})

    var uriLoader = new THREE.TextureLoader();
    uriLoader.load( '3dobj/uranus.jpeg', function ( venText: any ) {
    var urGeo = new THREE.SphereGeometry(2.8);
    var urMat = new THREE.MeshBasicMaterial( { map: venText } );
    var uranus = new THREE.Mesh( urGeo, urMat );
    uranus.position.y = -2;
    uranus.position.x = 34;
    scene.add( uranus );})

    var nepLoader = new THREE.TextureLoader();
    nepLoader.load( '3dobj/neptune.jpeg', function ( venText: any ) {
    var nepGeo = new THREE.SphereGeometry(2.5);
    var nepMat = new THREE.MeshBasicMaterial( { map: venText } );
    var neptune = new THREE.Mesh( nepGeo, nepMat );
    neptune.position.y = -2;
    neptune.position.x = 43;
    scene.add( neptune );})

    // Init animation
    animate();
}

    
function initListeners() {
    window.addEventListener('resize', onWindowResize, false);

    window.addEventListener('keydown', (event) => {
        const { key } = event;

        switch (key) {
            case 'e':
                const win = window.open('', 'Canvas Image');

                const { domElement } = renderer;

                // Makse sure scene is rendered.
                renderer.render(scene, camera);

                const src = domElement.toDataURL();

                if (!win) return;

                win.document.write(`<img src='${src}' width='${domElement.width}' height='${domElement.height}'>`);
                break;

            default:
                break;
        }
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(() => {
        animate();
    });    
    renderer.render(scene, camera);
}

main()