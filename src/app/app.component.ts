import { Component, OnInit, AfterViewInit, HostListener, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface Project {
  number: string;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  tech: string[];
  metricValue: string;
  metricLabel: string;
}

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('threeContainer', { static: false }) threeContainer!: ElementRef;
  @ViewChild('globeCanvas', { static: false }) globeCanvas!: ElementRef;

  private isBrowser: boolean;
  cursorX = 0;
  cursorY = 0;
  cursorDotX = 0;
  cursorDotY = 0;
  cursorHover = false;
  navScrolled = false;

  skillCategories: SkillCategory[] = [
    {
      title: 'Languages',
      skills: [
        { name: 'C / C++', level: 5 },
        { name: 'Python', level: 4 },
        { name: 'JavaScript', level: 4 },
        { name: 'SQL', level: 4 }
      ]
    },
    {
      title: 'AI / ML',
      skills: [
        { name: 'Deep Learning', level: 5 },
        { name: 'TensorFlow / Keras', level: 4 },
        { name: 'NLP', level: 4 },
        { name: 'Neural Networks', level: 5 }
      ]
    },
    {
      title: 'Core CS',
      skills: [
        { name: 'Data Structures & Algorithms', level: 5 },
        { name: 'Operating Systems', level: 4 },
        { name: 'DBMS', level: 4 },
        { name: 'Networking', level: 4 }
      ]
    },
    {
      title: 'Tools & Frameworks',
      skills: [
        { name: 'Git / GitHub', level: 5 },
        { name: 'VS Code', level: 5 },
        { name: 'PyTorch', level: 4 },
        { name: 'Web Development', level: 3 }
      ]
    }
  ];

  projects: Project[] = [
    {
      number: '01',
      icon: '🫁',
      iconClass: 'ai',
      title: 'Enhanced Pneumonia Detection',
      description: 'Built a CNN using transfer learning on 5,856 chest X-ray images. Applied preprocessing, LR tuning, and VGG16 layer freezing to achieve industry-grade accuracy.',
      tech: ['Python', 'TensorFlow', 'Keras', 'VGG16', 'PyTorch'],
      metricValue: '95%',
      metricLabel: 'Accuracy achieved through advanced optimization'
    },
    {
      number: '02',
      icon: '⚡',
      iconClass: 'code',
      title: 'Custom Programming Language',
      description: 'Implemented a complete interpreter using recursive descent parsing, lexer, and AST evaluation. Features 20+ core constructs including variables, control flow, and functions.',
      tech: ['C', 'Parsing', 'Compilers', 'AST'],
      metricValue: '20+',
      metricLabel: 'Language features implemented from scratch'
    },
    {
      number: '03',
      icon: '🎮',
      iconClass: 'ai',
      title: 'RL Pokemon Agent',
      description: 'Mentored a team to create a reinforcement learning agent for a custom Pokemon game using modified Q-learning algorithm over 20,000 training episodes.',
      tech: ['Python', 'Q-Learning', 'RL', 'Game AI'],
      metricValue: '78%',
      metricLabel: 'Win rate achieved from initial 42%'
    },
    {
      number: '04',
      icon: '🤖',
      iconClass: 'code',
      title: 'SarcasticBot — Hackverse Winner',
      description: 'Built a conversational AI robot teacher using RAG architecture. Won a track at Hackverse Hackathon for achieving exceptional response relevance.',
      tech: ['RAG', 'NLP', 'LLMs', 'AI'],
      metricValue: '92%',
      metricLabel: 'Response accuracy across 500+ test prompts'
    }
  ];

  achievements: Achievement[] = [
    { icon: '🏆', title: 'Hackverse Winner', description: 'Won a track for SarcasticBot — an AI robot teacher with 92% accuracy' },
    { icon: '🎓', title: 'Deep Learning Certified', description: 'Completed Deep Learning Specialization certification' },
    { icon: '💼', title: 'Google Intern', description: 'Selected for Software Engineering internship at Google' },
    { icon: '👥', title: 'ACM Executive', description: 'Mentored teams and led RL projects as executive member' },
    { icon: '🧠', title: 'IEEE', description: 'Brain Tumor Classification project achieving 94% accuracy' },
    { icon: '🌐', title: 'Web Enthusiasts\' Club', description: 'Executive member, participated in AI/ML and Linux sessions' },
    { icon: '📊', title: 'Top Academic', description: '9.04 CGPA at NIT Karnataka & 98.2% in Class 12' }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initThreeJS();
        this.initGlobe();
        this.initAnimations();
        this.initScrollObserver();
      }, 100);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.navScrolled = window.scrollY > 100;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isBrowser) {
      this.cursorX = event.clientX - 10;
      this.cursorY = event.clientY - 10;
      this.cursorDotX = event.clientX - 3;
      this.cursorDotY = event.clientY - 3;
    }
  }

  onHoverStart(): void {
    this.cursorHover = true;
  }

  onHoverEnd(): void {
    this.cursorHover = false;
  }

  getSkillDots(level: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < level);
  }

  scrollTo(elementId: string): void {
    if (this.isBrowser) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  private initThreeJS(): void {
    if (!this.threeContainer?.nativeElement) return;

    const container = this.threeContainer.nativeElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating Geometries
    const geometries: THREE.Mesh[] = [];
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.3 }),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 }),
      new THREE.MeshBasicMaterial({ color: 0xff00aa, wireframe: true, transparent: true, opacity: 0.3 })
    ];

    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.5, 1);
      const mesh = new THREE.Mesh(geometry, materials[i % 3]);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4 - 2
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      geometries.push(mesh);
    }

    // Torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.2 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 2;
    torus.position.z = -3;
    scene.add(torus);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      geometries.forEach((geo, i) => {
        geo.rotation.x += 0.002;
        geo.rotation.y += 0.003;
        geo.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
      });

      torus.rotation.z += 0.002;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  private initGlobe(): void {
    if (!this.globeCanvas?.nativeElement) return;

    const canvas = this.globeCanvas.nativeElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(500, 500);

    const globeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    const dotGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff00aa });
    const bengaluruDot = new THREE.Mesh(dotGeometry, dotMaterial);
    bengaluruDot.position.set(1.2, 0.2, 0.8);
    scene.add(bengaluruDot);

    camera.position.z = 4;

    const animateGlobe = () => {
      requestAnimationFrame(animateGlobe);
      globe.rotation.y += 0.005;
      bengaluruDot.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.005);
      renderer.render(scene, camera);
    };
    animateGlobe();
  }

  private initAnimations(): void {
    // Hero animations
    gsap.to('.hero-badge', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });

    gsap.to('.hero-title', {
      opacity: 1,
      duration: 0.1,
      delay: 0.3
    });

    gsap.to('.hero-title .line span', {
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      delay: 0.5,
      ease: 'power4.out'
    });

    gsap.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1.2,
      ease: 'power3.out'
    });

    gsap.to('.hero-cta', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1.5,
      ease: 'power3.out'
    });

    gsap.to('.scroll-indicator', {
      opacity: 1,
      duration: 1,
      delay: 2,
      ease: 'power3.out'
    });

    // Scroll-triggered reveals
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }

  private initScrollObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.mask-text').forEach(el => observer.observe(el));
  }

  onProjectCardMouseMove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  }

  onProjectCardMouseLeave(card: HTMLElement): void {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  }
}
