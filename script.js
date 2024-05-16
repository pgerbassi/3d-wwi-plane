

let mixer;

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene()

let plane = null;

const loader = new THREE.GLTFLoader();//.setPath('models/donut/');
loader.load('./assets/plane/scene.gltf', (gltf)=>{
    plane = gltf.scene;

    plane.position.x = 1.5;
    plane.rotation.x = Math.PI * 0.2;
    plane.rotation.z = Math.PI * 0.15;

    console.log('loaded');
    const radius = 1.8;
    plane.scale.set(radius, radius, radius);
    scene.add(plane);

    // Acting
    mixer = new THREE.AnimationMixer(plane);
    mixer.clipAction(gltf.animations[0]).play();
 
    tick();
});


// Lights 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1,2,0);
scene.add(directionalLight);

// Transform plane
const transformPlane = [
    {
        rotationY: 0,
        rotationZ: 0.45,
        positionX: 1.5,
    }, {
        rotationY: 1,
        rotationZ: -7.0,
        positionX: - 1.5
    }, {
        rotationY: 3,
        rotationZ: -12.6314,
        positionX: 0
    }
];

// Scroll
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', ()=> {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY/sizes.height);
    console.log(newSection);

    if (newSection != currentSection){
        currentSection = newSection;

        if(!!plane){
            gsap.to(
                plane.rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    y: transformPlane[currentSection].rotationY
                }
            );
            gsap.to(
                plane.rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    z: transformPlane[currentSection].rotationZ
                }
            );
            gsap.to(
                plane.position, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: transformPlane[currentSection].positionX
                }   
            );
        }
    }
});

// On reload
window.onbeforeunload = ()=>{
    window.scrollTo(0,0);
}

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;
scene.add(camera)



// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Clock
const clock = new THREE.Clock();
//const speed = 2;
let lastElapsedTime = 0;
// Animte tick
const tick = ()=>{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastElapsedTime;
    lastElapsedTime = elapsedTime;


    if(!!plane){
        mixer.update(deltaTime * 0.9);
        plane.position.y = Math.sin(deltaTime * 0.5) * 0.1 - 0.1;
    }

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
}

tick();