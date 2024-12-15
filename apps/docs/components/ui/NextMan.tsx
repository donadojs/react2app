import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const WIDTH_VALUE = 16;
const HEIGHT_VALUE = 9;

const GROUND_CONFIG = {
  LEVEL: 0,
  SIZE: 18,
  COLOR: "#ababab",
  OPACITY: 0.8,
};

// Paper configuration
const PAPER_CONFIG = {
  WIDTH: 0.21 * 3, // A4 proportions scaled up
  HEIGHT: 0.297 * 3,
  COUNT: 60,
  SPAWN_RANGE: 15,
  SPAWN_HEIGHT: 20,
  LINE_COUNT: 20, // Number of text lines per paper
  VELOCITY: {
    MIN: 2,
    MAX: 4,
  },
};

class Paper {
  group: THREE.Group;
  velocity: number;
  rotationSpeed: { x: number; y: number; z: number };
  position: THREE.Vector3;
  settled: boolean;

  constructor() {
    this.group = new THREE.Group();

    // Create paper texture with lines
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 724; // A4 proportion

    if (ctx) {
      // Set white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text lines with very light gray
      ctx.fillStyle = "#f8f8f8";
      const lineHeight = canvas.height / PAPER_CONFIG.LINE_COUNT;
      for (let i = 1; i < PAPER_CONFIG.LINE_COUNT; i++) {
        const y = i * lineHeight;
        // Randomize line width to simulate text
        const lineWidth = 0.5 + Math.random() * 0.3; // 50-80% width
        ctx.fillRect(40, y - 1, canvas.width * lineWidth - 80, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);

    // Create paper geometry (thin box for A4 paper)
    const geometry = new THREE.BoxGeometry(
      PAPER_CONFIG.WIDTH,
      0.005, // Make paper thinner
      PAPER_CONFIG.HEIGHT
    );

    // Create materials for different sides of the paper with enhanced whiteness
    const frontMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: texture,
      side: THREE.FrontSide,
      shininess: 60,
      emissive: 0x111111,
    });

    const backMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      shininess: 60,
      emissive: 0x111111,
    });

    const edgeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      shininess: 60,
      emissive: 0x111111,
    });

    // Create materials array for BoxGeometry
    // [right, left, top, bottom, front, back]
    const materials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];

    const paper = new THREE.Mesh(geometry, materials);
    paper.castShadow = true;
    paper.receiveShadow = true;
    this.group.add(paper);

    // Random initial position
    this.position = new THREE.Vector3(
      (Math.random() - 0.5) * PAPER_CONFIG.SPAWN_RANGE,
      PAPER_CONFIG.SPAWN_HEIGHT + Math.random() * 10,
      (Math.random() - 0.5) * PAPER_CONFIG.SPAWN_RANGE
    );
    this.group.position.copy(this.position);

    // Physics properties
    this.velocity = -(
      PAPER_CONFIG.VELOCITY.MIN +
      Math.random() * (PAPER_CONFIG.VELOCITY.MAX - PAPER_CONFIG.VELOCITY.MIN)
    );
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    };
    this.settled = false;

    // Random initial rotation
    this.group.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
  }

  update(deltaTime: number) {
    if (this.settled) return;

    // Update position
    this.position.y += this.velocity * deltaTime;
    this.group.position.copy(this.position);

    // Update rotation
    this.group.rotation.x += this.rotationSpeed.x;
    this.group.rotation.y += this.rotationSpeed.y;
    this.group.rotation.z += this.rotationSpeed.z;

    // Check for ground collision
    if (this.position.y <= GROUND_CONFIG.LEVEL + 0.1) {
      this.position.y = GROUND_CONFIG.LEVEL + 0.1;
      this.velocity = 0;
      this.rotationSpeed.x = 0;
      this.rotationSpeed.y = 0;
      this.rotationSpeed.z = 0;
      this.settled = true;
    }
  }

  reset() {
    this.position.set(
      (Math.random() - 0.5) * PAPER_CONFIG.SPAWN_RANGE,
      PAPER_CONFIG.SPAWN_HEIGHT + Math.random() * 10,
      (Math.random() - 0.5) * PAPER_CONFIG.SPAWN_RANGE
    );
    this.group.position.copy(this.position);
    this.velocity = -(
      PAPER_CONFIG.VELOCITY.MIN +
      Math.random() * (PAPER_CONFIG.VELOCITY.MAX - PAPER_CONFIG.VELOCITY.MIN)
    );
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    };
    this.settled = false;
    this.group.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
  }
}

const Tag = () => {
  return (
    <div className="absolute top-8 right-8 bg-gray-200/90 text-gray-500 px-3 py-1 rounded-full text-sm font-medium">
      w/o next2app
    </div>
  );
};

const Text = () => {
  return (
    <div className="absolute bottom-8 left-0 right-0 pt-6 pb-8 px-20">
      <p className="text-gray-900 font-bold tracking-tight text-[44px]">
        😵‍💫 To build apps as a web developer...
      </p>
      <p className="text-[24px] text-gray-700 font-light mt-4">
        You need to learn a lot, Solve endless bugs, Read never-ending docs.
      </p>
    </div>
  );
};

// Add these type definitions at the top of the file
interface AvatarMeshes {
  group: THREE.Group;
  head: THREE.Mesh;
  neck: THREE.Mesh;
  body: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftEyeWhite: THREE.Mesh;
  rightEyeWhite: THREE.Mesh;
  leftPupil: THREE.Mesh;
  rightPupil: THREE.Mesh;
}

interface AvatarPhysics {
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
}

class Avatar implements AvatarMeshes, AvatarPhysics {
  // Mesh properties
  group: THREE.Group;
  head: THREE.Mesh;
  neck: THREE.Mesh;
  body: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftEyeWhite: THREE.Mesh;
  rightEyeWhite: THREE.Mesh;
  leftPupil: THREE.Mesh;
  rightPupil: THREE.Mesh;

  // Physics properties
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

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
    });

    // Head with joint
    const headGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    this.head = new THREE.Mesh(headGeometry, material);
    this.head.position.y = 2.1;
    this.head.castShadow = true;

    // Add eyes
    const eyeWhiteGeometry = new THREE.SphereGeometry(0.12, 8, 8);
    const eyeWhiteMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
    });

    // Left eye white
    this.leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    this.leftEyeWhite.position.set(-0.15, 2.15, 0.3);

    // Right eye white
    this.rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    this.rightEyeWhite.position.set(0.15, 2.15, 0.3);

    // Pupils
    const pupilGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const pupilMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    // Left pupil
    this.leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    this.leftPupil.position.set(-0.15, 2.15, 0.4);

    // Right pupil
    this.rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    this.rightPupil.position.set(0.15, 2.15, 0.4);

    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.2, 8);
    this.neck = new THREE.Mesh(neckGeometry, material);
    this.neck.position.y = 1.9;
    this.neck.castShadow = true;

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.25, 1.5, 8);
    this.body = new THREE.Mesh(bodyGeometry, material);
    this.body.position.y = 1.0;
    this.body.castShadow = true;

    // Arms - adjust position to connect at shoulders
    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.8, 4, 8);
    this.leftArm = new THREE.Mesh(armGeometry, material);
    this.leftArm.position.set(-0.3, 1.6, 0);
    this.leftArm.castShadow = true;

    this.rightArm = new THREE.Mesh(armGeometry, material);
    this.rightArm.position.set(0.3, 1.6, 0);
    this.rightArm.castShadow = true;

    // Legs - adjust position to connect at bottom of body
    const legGeometry = new THREE.CapsuleGeometry(0.12, 1, 4, 8);
    this.leftLeg = new THREE.Mesh(legGeometry, material);
    this.leftLeg.position.set(-0.2, 0.25, 0);
    this.leftLeg.castShadow = true;

    this.rightLeg = new THREE.Mesh(legGeometry, material);
    this.rightLeg.position.set(0.2, 0.25, 0);
    this.rightLeg.castShadow = true;

    // Add all parts to group (removed shoulders and hips)
    this.group.add(this.head);
    this.group.add(this.neck);
    this.group.add(this.body);
    this.group.add(this.leftArm);
    this.group.add(this.rightArm);
    this.group.add(this.leftLeg);
    this.group.add(this.rightLeg);
    this.group.add(this.leftEyeWhite);
    this.group.add(this.rightEyeWhite);
    this.group.add(this.leftPupil);
    this.group.add(this.rightPupil);

    // Physics properties
    this.velocity = 0;
    this.acceleration = -9.8;
    this.position = 10;
    this.rotation = 0;
    this.rotationSpeed = Math.random() * 0.05 - 0.035;
    this.bounceFactor = 0.6;
    this.bounceCount = 0;
    this.maxBounces = 3;
    this.squashFactor = 1;
    this.groundLevel = GROUND_CONFIG.LEVEL;
    this.finalRestHeight = GROUND_CONFIG.LEVEL;
  }

  update(deltaTime: number) {
    // Update physics
    this.velocity += this.acceleration * deltaTime;
    this.position += this.velocity * deltaTime;
    this.rotation += this.rotationSpeed;

    // Ground collision with bouncing
    if (this.position < this.groundLevel) {
      if (this.bounceCount < this.maxBounces && Math.abs(this.velocity) > 1) {
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
        this.neck.rotation.z = 0;
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

      // Head and neck movement
      this.head.rotation.z = -this.rotation * 0.3;
      this.neck.rotation.z = -this.rotation * 0.2;
    }
  }
}

const NextMan = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const frameIdRef = useRef(null);
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

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    const camera = new THREE.PerspectiveCamera(
      75,
      WIDTH_VALUE / HEIGHT_VALUE, // Aspect ratio of 16:9
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const width = containerRef.current.clientWidth;
    const height = width * (HEIGHT_VALUE / WIDTH_VALUE); // Calculate height based on 16:9 ratio
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = { scene, camera, renderer };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Increased intensity
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add additional light to enhance paper whiteness
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    scene.add(hemisphereLight);

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
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = GROUND_CONFIG.LEVEL;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create avatar
    const avatar = new Avatar();
    scene.add(avatar.group);

    // Create papers
    const papers: Paper[] = [];
    for (let i = 0; i < PAPER_CONFIG.COUNT; i++) {
      const paper = new Paper();
      papers.push(paper);
      scene.add(paper.group);
    }

    // Camera position
    camera.position.set(0, 5, 16);
    camera.lookAt(0, 3, 0);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      avatar.update(deltaTime);

      // Update papers
      papers.forEach((paper) => {
        paper.update(deltaTime);
        if (paper.settled && Math.random() < 0.001) {
          paper.reset();
        }
      });

      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      const width = containerRef.current.clientWidth;
      const height = width * (9 / 16);
      camera.aspect = 16 / 9;
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
        scene.clear();
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [isInView]);

  return (
    <div className="relative ">
      <div
        ref={containerRef}
        className="w-full relative rounded-2xl overflow-hidden "
        style={{ aspectRatio: `${WIDTH_VALUE}/${HEIGHT_VALUE}` }}
      />
    </div>
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

const NextManSection = () => {
  return (
    <motion.div
      variants={fadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: "all",
      }}
      className="bg-[#f0f0f0] rounded-2xl"
    >
      <NextMan />
      <div className="mt-[-20px] md:px-16 mb:pb-16 px-12 md:p-12 pb-12 relative md:mt-[-60px] ">
        <div className="flex flex-col items-start gap-4 leading-[1.1] ">
          <p className="text-[32px] md:text-[44px]"></p>
          <p className="text-gray-900 font-bold tracking-tight text-[32px] md:text-[44px] leading-[1.1]">
            😵‍💫 Building native apps as a web dev...
          </p>
        </div>
        <p className="text-[22px] md:text-[24px] text-gray-700 font-light mt-4">
          You need to learn a lot, Solve endless bugs, Read never-ending docs.
        </p>
      </div>
    </motion.div>
  );
};

export default NextManSection;
