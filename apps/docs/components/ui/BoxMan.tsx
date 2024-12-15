import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type {
  Mesh,
  Group,
  Vector3,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
} from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { motion } from "framer-motion";

const WIDTH_VALUE = 16;
const HEIGHT_VALUE = 9;

const CANVAS_CONFIG = {
  WIDTH: "100%",
  ASPECT_RATIO: `${WIDTH_VALUE}/${HEIGHT_VALUE}`,
  MARGIN_Y: "10rem",
};

const GROUND_CONFIG = {
  LEVEL: 2,
  SIZE: 0,
  COLOR: "#ababab",
  OPACITY: 0,
};

const THOUGHT_BUBBLES = [
  "Should I focus on\ncore features first?",
  "When is the right time\nfor marketing?",
  "How do I get\nmy first users?",
  "Do I need to\npivot my product?",
  "Time to raise\nfunding?",
  "Is my tech stack\nscalable enough?",
  "How to improve\nuser retention?",
  "Should I hire\nmore developers?",
];

class TextBubble {
  mesh: Group;
  velocity: number;
  position: Vector3;
  bounceFactor: number;

  constructor(text: string, startPosition: Vector3) {
    this.mesh = new THREE.Group();

    // Create rounded rectangle shape
    const width = 3;
    const height = 1.8;
    const radius = 0.3;

    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(
      width / 2,
      -height / 2,
      width / 2,
      -height / 2 + radius
    );
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(
      width / 2,
      height / 2,
      width / 2 - radius,
      height / 2
    );
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(
      -width / 2,
      height / 2,
      -width / 2,
      height / 2 - radius
    );
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(
      -width / 2,
      -height / 2,
      -width / 2 + radius,
      -height / 2
    );

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 4,
    });

    const material = new THREE.MeshPhongMaterial({
      color: 0xf8f8f8,
      specular: 0x111111,
      shininess: 30,
      flatShading: false,
    });

    const bubble = new THREE.Mesh(geometry, material) as Mesh;
    bubble.castShadow = true;
    bubble.receiveShadow = true;
    this.mesh.add(bubble);

    // Create simple text using basic shapes for debugging
    const words = text.split("\n");
    const textGroup = new THREE.Group() as Group;

    words.forEach((word, index) => {
      const textMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        shininess: 0,
      });

      // Create a simple plane for each word
      const textGeometry = new THREE.PlaneGeometry(2, 0.3);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial) as Mesh;
      textMesh.position.y = -index * 0.4;
      textMesh.position.z = 0.2;
      textGroup.add(textMesh);
    });

    // Center the text group
    textGroup.position.y = (words.length - 1) * 0.2;
    this.mesh.add(textGroup);

    // Position and physics setup
    this.mesh.position.copy(startPosition);
    this.velocity = 0;
    this.position = startPosition;
    this.bounceFactor = 0.7;

    // Make sure text faces camera
    this.mesh.lookAt(new THREE.Vector3(0, this.mesh.position.y, 0));
  }

  update(deltaTime: number) {
    this.velocity += -9.8 * deltaTime;
    this.mesh.position.y += this.velocity * deltaTime;

    if (this.mesh.position.y < GROUND_CONFIG.LEVEL + 0.9) {
      this.mesh.position.y = GROUND_CONFIG.LEVEL + 0.9;
      if (Math.abs(this.velocity) > 0.1) {
        this.velocity = -this.velocity * this.bounceFactor;
      } else {
        this.velocity = 0;
      }
    }

    // Always look at camera position
    this.mesh.lookAt(new THREE.Vector3(0, this.mesh.position.y, 0));
  }
}

const BoxMan = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
  } | null>(null);
  const frameIdRef = useRef(null);
  const thoughtBubblesRef = useRef([]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isInView) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.4, 4000);

    // Adjust camera position for better view
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 5, 0);

    // Brighter lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(
      0xffffff,
      1
    ) as DirectionalLight;
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    }) as WebGLRenderer;
    const width = containerRef.current.clientWidth;
    const height = width * (HEIGHT_VALUE / WIDTH_VALUE); // Calculate height based on 16:9 ratio
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = { scene, camera, renderer };

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(
      GROUND_CONFIG.SIZE,
      GROUND_CONFIG.SIZE
    );
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: GROUND_CONFIG.COLOR,
      transparent: true,
      opacity: GROUND_CONFIG.OPACITY,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial) as Mesh;
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_CONFIG.LEVEL;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add TextSphere class before Avatar class
    class TextSphere {
      mesh: Mesh;
      velocity: number;
      position: Vector3;
      text: string;
      bounceFactor: number;

      constructor(text: string, startPosition: Vector3) {
        // Create rounded rectangle shape
        const width = 3;
        const height = 2;
        const radius = 0.5;
        const shape = new THREE.Shape();

        shape.moveTo(-width / 2 + radius, -height / 2);
        shape.lineTo(width / 2 - radius, -height / 2);
        shape.quadraticCurveTo(
          width / 2,
          -height / 2,
          width / 2,
          -height / 2 + radius
        );
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(
          width / 2,
          height / 2,
          width / 2 - radius,
          height / 2
        );
        shape.lineTo(-width / 2 + radius, height / 2);
        shape.quadraticCurveTo(
          -width / 2,
          height / 2,
          -width / 2,
          height / 2 - radius
        );
        shape.lineTo(-width / 2, -height / 2 + radius);
        shape.quadraticCurveTo(
          -width / 2,
          -height / 2,
          -width / 2 + radius,
          -height / 2
        );

        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.2,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 3,
        });

        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: false,
          shininess: 0, // Matte finish
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;

        // Create text as a separate mesh using TextGeometry
        const loader = new FontLoader();
        const createText = (font) => {
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: 0.3,
            height: 0.01,
            curveSegments: 12,
          });

          const textMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);

          // Center the text
          textGeometry.computeBoundingBox();
          const textWidth =
            textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
          textMesh.position.set(-textWidth / 2, -0.15, 0.2);

          this.mesh.add(textMesh);
        };

        // Load font and create text
        loader.load(
          "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
          createText
        );

        // Set initial position and physics properties
        this.mesh.position.copy(startPosition);
        this.velocity = 0;
        this.position = startPosition;
        this.bounceFactor = 0.7;

        // Set fixed rotation to face camera
        this.mesh.rotation.set(0, 0, 0);
      }

      update() {
        // No rotation updates needed
      }
    }

    class Avatar {
      group: Group;
      head: Mesh;
      body: Mesh;
      leftArm: Mesh;
      rightArm: Mesh;
      leftLeg: Mesh;
      rightLeg: Mesh;
      velocity: number;
      acceleration: number;
      position: number;
      rotation: number;
      rotationSpeed: number;
      bounceFactor: number;
      bounceCount: number;
      maxBounces: number;
      squashFactor: number;
      groundLevel: number;
      finalRestHeight: number;

      constructor() {
        this.group = new THREE.Group();

        // Brown material for the box character
        const material = new THREE.MeshPhongMaterial({
          color: 0xa0522d, // Light brown color
          flatShading: true,
        });

        // Head - using BoxGeometry
        const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        this.head = new THREE.Mesh(headGeometry, material);
        this.head.position.y = 2.1;
        this.head.castShadow = true;

        // Eyes - white part (bigger and round)
        const eyeGeometry = new THREE.SphereGeometry(0.18, 32, 32);
        const eyeWhiteMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          flatShading: false,
          shininess: 100,
        });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEye.position.set(-0.22, 0.05, 0.35);
        leftEye.scale.set(1, 1, 0.5); // Make it slightly oval
        this.head.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        rightEye.position.set(0.22, 0.05, 0.35);
        rightEye.scale.set(1, 1, 0.5); // Make it slightly oval
        this.head.add(rightEye);

        // Pupils - black part (round)
        const pupilGeometry = new THREE.SphereGeometry(0.08, 32, 32);
        const pupilMaterial = new THREE.MeshPhongMaterial({
          color: 0x000000,
          flatShading: false,
          shininess: 100,
        });

        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0, 0, 0.2);
        leftEye.add(leftPupil);

        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(0, 0, 0.2);
        rightEye.add(rightPupil);

        // Body - using BoxGeometry
        const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.8);
        this.body = new THREE.Mesh(bodyGeometry, material);
        this.body.position.y = 1.0;
        this.body.castShadow = true;

        // Arms - using BoxGeometry
        const armGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        this.leftArm = new THREE.Mesh(armGeometry, material);
        this.leftArm.position.set(-0.7, 1.4, 0);
        this.leftArm.castShadow = true;

        this.rightArm = new THREE.Mesh(armGeometry, material);
        this.rightArm.position.set(0.7, 1.4, 0);
        this.rightArm.castShadow = true;

        // Legs - using BoxGeometry
        const legGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        this.leftLeg = new THREE.Mesh(legGeometry, material);
        this.leftLeg.position.set(-0.3, 0.3, 0);
        this.leftLeg.castShadow = true;

        this.rightLeg = new THREE.Mesh(legGeometry, material);
        this.rightLeg.position.set(0.3, 0.3, 0);
        this.rightLeg.castShadow = true;

        // Add all parts to group
        this.group.add(this.head);
        this.group.add(this.body);
        this.group.add(this.leftArm);
        this.group.add(this.rightArm);
        this.group.add(this.leftLeg);
        this.group.add(this.rightLeg);

        // Physics properties remain the same
        this.velocity = 0;
        this.acceleration = -9.8;
        this.position = 10;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.05 - 0.025;
        this.bounceFactor = 0.6;
        this.bounceCount = 0;
        this.maxBounces = 3;
        this.squashFactor = 1;
        this.groundLevel = GROUND_CONFIG.LEVEL;
        this.finalRestHeight = GROUND_CONFIG.LEVEL;
      }

      update(deltaTime) {
        // Update physics
        this.velocity += this.acceleration * deltaTime;
        this.position += this.velocity * deltaTime;
        this.rotation += this.rotationSpeed;

        // Ground collision with bouncing
        if (this.position < this.groundLevel) {
          if (
            this.bounceCount < this.maxBounces &&
            Math.abs(this.velocity) > 1
          ) {
            this.velocity = -this.velocity * this.bounceFactor;
            this.position = this.groundLevel;
            this.bounceCount++;
            this.rotationSpeed *= 0.7;
            this.squashFactor = 0.7;
          } else {
            this.position = this.finalRestHeight;
            this.velocity = 0;
            this.rotationSpeed = 0;
            this.squashFactor = 1;

            // Reset to resting position
            this.group.rotation.z = 0;
            this.group.rotation.x = 0;
            this.leftArm.rotation.z = 0.1;
            this.rightArm.rotation.z = -0.1;
            this.leftLeg.rotation.z = 0;
            this.rightLeg.rotation.z = 0;
            this.head.rotation.z = 0;
          }
        }

        // Gradually return to normal shape
        this.squashFactor += (1 - this.squashFactor) * deltaTime * 5;

        // Apply transforms
        this.group.position.y = this.position;
        this.group.rotation.z = this.rotation * 0.5;
        this.group.rotation.x = this.rotation * 0.3;

        // Scale for squash and stretch
        this.group.scale.y = this.squashFactor;
        this.group.scale.x = 1 + (1 - this.squashFactor) * 0.5;
        this.group.scale.z = 1 + (1 - this.squashFactor) * 0.5;

        // Natural joint movements
        if (this.velocity !== 0) {
          const fallFactor = Math.min(Math.abs(this.velocity) / 20, 1);

          // Arm movement
          const armSwing = Math.sin(this.rotation * 2) * 0.3;
          this.leftArm.rotation.z = 0.3 + fallFactor + armSwing;
          this.rightArm.rotation.z = -0.3 - fallFactor - armSwing;

          // Leg movement
          const legSwing = Math.sin(this.rotation * 2) * 0.2;
          this.leftLeg.rotation.z = -fallFactor * 0.5 + legSwing;
          this.rightLeg.rotation.z = fallFactor * 0.5 - legSwing;

          // Head movement (removed neck movement)
          this.head.rotation.z = -this.rotation * 0.3;
        }
      }
    }

    // Create avatar
    const avatar = new Avatar();
    scene.add(avatar.group);

    // Animation loop
    const clock = new THREE.Clock();

    // Create thought spheres
    const createThoughtBubbles = () => {
      THOUGHT_BUBBLES.forEach((text, index) => {
        const radius = 7;
        const angle = (index / THOUGHT_BUBBLES.length) * Math.PI * 2;
        const startPosition = new THREE.Vector3(
          Math.cos(angle) * radius,
          15 + Math.random() * 5,
          Math.sin(angle) * radius
        );

        const bubble = new TextBubble(text, startPosition);
        scene.add(bubble.mesh);
        thoughtBubblesRef.current.push(bubble);
      });
    };

    createThoughtBubbles();

    // Modify the animate function to update thought spheres
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      avatar.update(deltaTime);

      // Update thought spheres
      thoughtBubblesRef.current.forEach((bubble) => {
        bubble.update(deltaTime);
      });

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = width * (HEIGHT_VALUE / WIDTH_VALUE);
      camera.aspect = WIDTH_VALUE / HEIGHT_VALUE;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        const { scene, renderer } = sceneRef.current;
        thoughtBubblesRef.current = [];
        scene.clear();
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className="w-full relative rounded-2xl overflow-hidden"
      style={{ aspectRatio: CANVAS_CONFIG.ASPECT_RATIO }}
    />
  );
};

export const fadeInUpVariant = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      bounce: 0.4,
    },
  },
};

const BoxManSection = () => {
  return (
    <motion.div
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: "all",
      }}
      className="flex flex-col gap-4 bg-[#f0f0f0] rounded-2xl my-16 md:my-40"
    >
      <BoxMan />
      <div className="flex flex-col gap-2 md:mt-[-180px] px-12 z-10 pb-12">
        <p className="text-gray-900 font-bold tracking-tight text-[32px] leading-[1.1] md:text-[44px]">
          📦 Meanwhile your product...
        </p>

        <p className="text-[22px] text-gray-700 font-light mt-4">
          Delayed Launch, No users, No features, No money
        </p>
      </div>
    </motion.div>
  );
};

export default BoxManSection;
