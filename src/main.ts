import './style.scss';
import * as THREE from 'three'; 1
import Stats from 'three/examples/jsm/libs/stats.module';
// for cameras 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DirectionalLight, ShaderMaterial } from 'three';

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

let conPos = 30;
let colorPalette = [0xA7226E,0xEC2049,0xF26B38,0xF7DB4F,0x2F9599];
let colorpos = 0;

let pointer: THREE.Vector2;
let raycaster: THREE.Raycaster;
let isShiftDown: Boolean = false;

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
    scene.background = new THREE.Color(0x0096FF);
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

    pointer = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

    // https://github.com/mrdoob/three.js/pull/14087#issuecomment-431003830
    const shadowIntensity = .2;

    lightPoint = new THREE.PointLight(0xffffff);
    lightPoint.position.set(2, 3, 4);
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

    

    // https://stackoverflow.com/questions/27620586/a-sphere-with-texture-in-three-js
    const geometry = new THREE.ConeGeometry( 6, 20,100);
    const material = new THREE.MeshPhongMaterial( {color: 0xD4BBB1,
        shininess: 100} );
    const cone = new THREE.Mesh( geometry, material );
    cone.rotateX(3.14);
    scene.add( cone );

    // Init animation
    animate();
}

    
function initListeners() {
    window.addEventListener('resize', onWindowResize, false);

    window.addEventListener('keydown', (event) => {
        const { key } = event;

        switch (key) {
            case 'c':
                const geometry = new THREE.ConeGeometry( 6, 20,100);
                const material = new THREE.MeshPhongMaterial( {color: 0xD4BBB1,
                    shininess: 100} );
                const cone = new THREE.Mesh( geometry, material );
                cone.rotateX(3.14);
                cone.position.x = conPos;
                scene.add( cone );
                conPos +=30;

        }
    });
    document.addEventListener( 'pointerdown', (event)=>{
        pointer.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
        raycaster.setFromCamera( pointer, camera );
	
        const circle = new THREE.SphereGeometry(6);
        const material = new THREE.MeshPhongMaterial( {color: 0xD4BBB1,
        shininess: 100} );
        const icecream = new THREE.Mesh( circle, material );
        icecream.position.x = event.clientX;
        icecream.position.y = event.clientY;
        scene.add(icecream);

        renderer.render( scene, camera );

    })
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