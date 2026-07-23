"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type ProjectStatus = "Confirmed";

type MediaItem = {
  type: "video" | "image";
  src: string;
  poster?: string;
  label: string;
  aspect: "portrait" | "landscape" | "square";
};

type Project = {
  id: string;
  year: string;
  title: string;
  region: string;
  status: ProjectStatus;
  discipline: string;
  summary: string;
  role: string;
  deliverables: string[];
  media?: string;
  poster?: string;
  gallery?: MediaItem[];
  impactRank: number;
  accent: string;
};

const projects: Project[] = [
  {
    id: "tec",
    year: "2025",
    title: "Toronto Eaton Centre",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "CGI / 3D / VFX / social",
    summary:
      "A fast-turnaround visual system for the store-opening activation—moving from pre-rollout CGI into social, installation, and Nike By You content.",
    role: "CGI, 3D, VFX, workflow development",
    deliverables: [
      "Pre-rollout CGI",
      "Social reels",
      "3D athlete options",
      "Installation content",
      "Nike By You assets",
    ],
    media: "/media/2025-tec.mp4",
    poster: "/media/2025-tec.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/tec/r1-v5.mp4",
        poster: "/gallery/tec/r1-v5-poster.webp",
        label: "Opening Film / R1 V5",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/tec/nike-by-you.mp4",
        poster: "/gallery/tec/nike-by-you-poster.webp",
        label: "Nike By You",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/tec/nike-playground.mp4",
        poster: "/gallery/tec/nike-playground-poster.webp",
        label: "Nike Playground",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/tec/reel-athletes.mp4",
        poster: "/gallery/tec/reel-athletes-poster.webp",
        label: "Social Reel / Athletes",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/tec/reel-no-athletes.mp4",
        poster: "/gallery/tec/reel-no-athletes-poster.webp",
        label: "Social Reel / No Athletes",
        aspect: "portrait",
      },
    ],
    impactRank: 2,
    accent: "#ff4d25",
  },
  {
    id: "bata",
    year: "2025",
    title: "Air Max 95 × Bata",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "CGI / social / museum",
    summary:
      "A cinematic CGI and social package supporting the Air Max 95’s induction into the Bata Shoe Museum.",
    role: "CGI production, motion design, social delivery",
    deliverables: ["Main reel", "Teaser films", "9:16 imagery", "Photography support"],
    media: "/media/2025-bata.mp4",
    poster: "/media/2025-bata.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/bata/main-reel.mp4",
        poster: "/gallery/bata/main-reel-poster.webp",
        label: "Main Museum Reel",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/bata/teaser-1.mp4",
        poster: "/gallery/bata/teaser-1-poster.webp",
        label: "Teaser Film / 01",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/bata/teaser-2.mp4",
        poster: "/gallery/bata/teaser-2-poster.webp",
        label: "Teaser Film / 02",
        aspect: "portrait",
      },
    ],
    impactRank: 3,
    accent: "#d7ff34",
  },
  {
    id: "am95",
    year: "2024",
    title: "Toronto Air Max 95",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "CGI / DOOH / FOOH / AR",
    summary:
      "A multi-round campaign spanning digital out-of-home, social carousel, fake-out-of-home, and an Instagram AR workstream.",
    role: "CGI direction, production pipeline, visual effects",
    deliverables: [
      "CGI concept rounds",
      "DOOH",
      "Social carousel",
      "FOOH assets",
      "Instagram AR",
    ],
    media: "/media/2024-am95.mp4",
    poster: "/media/2024-am95.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/am95/billboard.mp4",
        poster: "/gallery/am95/billboard-poster.webp",
        label: "DOOH Billboard",
        aspect: "landscape",
      },
      {
        type: "image",
        src: "/gallery/am95/cne-render.webp",
        label: "CNE Campaign Render",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/am95/revised-master.mp4",
        poster: "/gallery/am95/revised-master-poster.webp",
        label: "Campaign Master",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/am95/kensington-4x5.mp4",
        poster: "/gallery/am95/kensington-4x5-poster.webp",
        label: "Kensington / 4:5",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/am95/kensington-9x16.mp4",
        poster: "/gallery/am95/kensington-9x16-poster.webp",
        label: "Kensington / 9:16",
        aspect: "portrait",
      },
    ],
    impactRank: 1,
    accent: "#fd4aa1",
  },
  {
    id: "dubai",
    year: "2021",
    title: "Cactus Jack × Fragment",
    region: "Dubai, UAE",
    status: "Confirmed",
    discipline: "Regional launch / motion",
    summary:
      "Regional launch content for the Travis Scott, Cactus Jack, and Fragment release, delivered in branded and no-logo placements.",
    role: "3D animation, motion design, delivery systems",
    deliverables: ["Branded social film", "No-logo placement", "Regional launch assets"],
    media: "/media/2021-dubai.mp4",
    poster: "/media/2021-dubai.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/dubai/logo-version.mp4",
        poster: "/gallery/dubai/logo-version-poster.webp",
        label: "Regional Launch / Branded",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/dubai/no-logo-version.mp4",
        poster: "/gallery/dubai/no-logo-version-poster.webp",
        label: "Regional Launch / No Logo",
        aspect: "portrait",
      },
    ],
    impactRank: 7,
    accent: "#58a5ff",
  },
  {
    id: "kuwait",
    year: "2021",
    title: "Air Max Day Kuwait",
    region: "Kuwait",
    status: "Confirmed",
    discipline: "Motion / conveyor system",
    summary:
      "Air Max Day motion content built around a finished campaign film and a high-resolution conveyor-loop sequence.",
    role: "3D animation, motion systems, final delivery",
    deliverables: ["Campaign film", "Conveyor loop", "High-resolution frame sequence"],
    media: "/media/2021-kuwait.mp4",
    poster: "/media/2021-kuwait.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/kuwait/campaign-film.mp4",
        poster: "/gallery/kuwait/campaign-film-poster.webp",
        label: "Air Max Day Campaign Film",
        aspect: "portrait",
      },
      {
        type: "image",
        src: "/gallery/kuwait/conveyor-frame.webp",
        label: "Conveyor Sequence Frame",
        aspect: "landscape",
      },
    ],
    impactRank: 6,
    accent: "#c6a7ff",
  },
  {
    id: "ofsaa",
    year: "2021",
    title: "OFSAA Nike XC AR",
    region: "Ontario, Canada",
    status: "Confirmed",
    discipline: "Instagram AR / Snapchat",
    summary:
      "A matched pair of social AR experiences for Instagram and Snapchat, supported by motion assets and a GIPHY system.",
    role: "AR development, motion design, cross-platform delivery",
    deliverables: ["Spark AR experience", "Lens Studio experience", "GIF system", "GIPHY assets"],
    media: "/media/2021-ofsaa.mp4",
    poster: "/media/2021-ofsaa.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/ofsaa/finish-on-empty.mp4",
        poster: "/gallery/ofsaa/finish-on-empty-poster.webp",
        label: "Finish On Empty / GIPHY",
        aspect: "square",
      },
    ],
    impactRank: 8,
    accent: "#ffffff",
  },
  {
    id: "amd",
    year: "2021",
    title: "Air Max Day Worldwide",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "3D / AR / live experience",
    summary:
      "A live-show chapter combining 3D animation, AR, a boundary-pushing local panel, and co-production with Nike.",
    role: "Featured artist, 3D animation, panel curation, co-production",
    deliverables: [
      "3D animation",
      "EVO reel",
      "AR frames",
      "Conveyor visuals",
      "Panel curation",
    ],
    media: "/media/2021-amd.mp4",
    poster: "/media/2021-amd.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/amd/giphy-loop.mp4",
        poster: "/gallery/amd/giphy-loop-poster.webp",
        label: "Air Max Day / GIPHY Loop",
        aspect: "landscape",
      },
      {
        type: "image",
        src: "/gallery/amd/cn-tower-marker.webp",
        label: "CN Tower AR Marker",
        aspect: "square",
      },
      {
        type: "video",
        src: "/gallery/amd/evo-reel.mp4",
        poster: "/gallery/amd/evo-reel-poster.webp",
        label: "Air Max EVO Reel",
        aspect: "portrait",
      },
    ],
    impactRank: 4,
    accent: "#ff6b35",
  },
  {
    id: "rayguns",
    year: "2021",
    title: "Roswell Rayguns",
    region: "Canada",
    status: "Confirmed",
    discipline: "Animation / social / GIPHY",
    summary:
      "An animated campaign system for the Roswell Rayguns, built for social formats and extended through a branded sticker world.",
    role: "3D animation, motion design, campaign toolkit",
    deliverables: ["30-second animation", "Social formats", "GIPHY sticker pack", "Loops"],
    media: "/media/2021-rayguns.mp4",
    poster: "/media/2021-rayguns.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/rayguns/final-4x5.mp4",
        poster: "/gallery/rayguns/final-4x5-poster.webp",
        label: "Campaign Film / 4:5",
        aspect: "portrait",
      },
      {
        type: "video",
        src: "/gallery/rayguns/final-9x16.mp4",
        poster: "/gallery/rayguns/final-9x16-poster.webp",
        label: "Campaign Film / 9:16",
        aspect: "portrait",
      },
    ],
    impactRank: 5,
    accent: "#2de5ff",
  },
  {
    id: "canada",
    year: "2020",
    title: "Canada Soccer Jersey",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "CGI launch / social",
    summary:
      "The first Nike chapter: a CGI-led launch centered on the Canada Soccer jersey, the Swoosh, maple leaf, and #20 CANADA details.",
    role: "Creative direction, CGI animation, production",
    deliverables: ["20-second CGI film", "Multi-format social stills", "Looping animation"],
    media: "/media/2020-canada.mp4",
    poster: "/media/2020-canada.webp",
    gallery: [
      {
        type: "video",
        src: "/gallery/canada/launch-film.mp4",
        poster: "/gallery/canada/launch-film-poster.webp",
        label: "Canada Soccer Launch Film",
        aspect: "portrait",
      },
      {
        type: "image",
        src: "/gallery/canada/jersey-1x1.webp",
        label: "Jersey Still / 1:1",
        aspect: "square",
      },
      {
        type: "image",
        src: "/gallery/canada/jersey-4x5.webp",
        label: "Jersey Still / 4:5",
        aspect: "portrait",
      },
      {
        type: "image",
        src: "/gallery/canada/jersey-horizontal.webp",
        label: "Jersey Still / Landscape",
        aspect: "landscape",
      },
    ],
    impactRank: 9,
    accent: "#ff233d",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectMedia({ project, onOpen }: { project: Project; onOpen: () => void }) {
  if (!project.media) {
    return null;
  }

  return (
    <button
      type="button"
      className="project-media"
      onClick={onOpen}
      aria-label={`Open ${project.title} campaign portfolio`}
    >
      <video
        data-auto-video
        src={project.media}
        poster={project.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${project.title} project preview`}
      />
      <span className="media-label">
        VIEW CAMPAIGN / {String(project.gallery?.length ?? 0).padStart(2, "0")} ASSETS
      </span>
      <span className="media-corner media-corner-top" />
      <span className="media-corner media-corner-bottom" />
    </button>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" onClick={onClose} autoFocus aria-label="Close project details">
          CLOSE <span aria-hidden="true">×</span>
        </button>
        <div className="dialog-layout">
          <div className="dialog-copy">
            <div className="dialog-index">
              {String(projects.indexOf(project) + 1).padStart(2, "0")}
            </div>
            <p className="eyebrow">
              {project.year} / {project.region}
            </p>
            <h2 id="dialog-title">{project.title}</h2>
            <p className="dialog-summary">{project.summary}</p>
            <div className="dialog-meta">
              <div>
                <span>ROLE</span>
                <p>{project.role}</p>
              </div>
              <div>
                <span>STATUS</span>
                <p>{project.status}</p>
              </div>
            </div>
            <div className="dialog-deliverables">
              <span>OUTPUT</span>
              <div>
                {project.deliverables.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <p className="dialog-ascii" aria-hidden="true">
              {`░▒▓ WS_ARCHIVE :: ${project.id.toUpperCase()} :: ${project.year} ▓▒░`}
            </p>
          </div>

          <div className="campaign-gallery">
            <div className="gallery-head">
              <span>CAMPAIGN MEDIA</span>
              <b>{String(project.gallery?.length ?? 0).padStart(2, "0")} ASSETS</b>
            </div>
            {project.gallery?.length ? (
              <div className="gallery-grid">
                {project.gallery.map((item, index) => (
                  <figure
                    className={`gallery-item is-${item.aspect}`}
                    key={`${item.src}-${index}`}
                  >
                    <div className="gallery-frame">
                      {item.type === "video" ? (
                        <video
                          src={item.src}
                          poster={item.poster}
                          controls
                          playsInline
                          preload="metadata"
                          aria-label={`${project.title} — ${item.label}`}
                        />
                      ) : (
                        <img
                          src={item.src}
                          loading="lazy"
                          alt={`${project.title} — ${item.label}`}
                        />
                      )}
                    </div>
                    <figcaption>
                      <span>
                        {String(index + 1).padStart(2, "0")} / {item.label}
                      </span>
                      <span>{item.type}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="archive-note">
                <span aria-hidden="true">[ NO PRODUCTION MEDIA ]</span>
                Exploratory and proposal work is represented as a system study.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeProjectRef = useRef(0);
  const [sortMode, setSortMode] = useState<"latest" | "impact">("latest");
  const [activeId, setActiveId] = useState("tec");
  const [selected, setSelected] = useState<Project | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  const orderedProjects = useMemo(() => {
    if (sortMode === "impact") {
      return [...projects].sort((a, b) => a.impactRank - b.impactRank);
    }
    return projects;
  }, [sortMode]);

  useEffect(() => {
    activeProjectRef.current = Math.max(
      0,
      projects.findIndex((project) => project.id === activeId),
    );
  }, [activeId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIntroComplete(true), 1100);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-project-id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveId((visible.target as HTMLElement).dataset.projectId ?? projects[0].id);
        }
      },
      { rootMargin: "-25% 0px -38% 0px", threshold: [0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [orderedProjects]);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("[data-auto-video]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      videos.forEach((video) => video.pause());
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.35, 0.7] },
    );
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [orderedProjects]);

  useEffect(() => {
    const moveCursor = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", moveCursor, { passive: true });
    return () => window.removeEventListener("pointermove", moveCursor);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060606, 0.045);
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.2, 12);

    const world = new THREE.Group();
    scene.add(world);

    const points = projects.map((_, index) => {
      const angle = index * 1.08 - 0.5;
      return new THREE.Vector3(
        Math.sin(angle) * (2.15 + (index % 2) * 0.55),
        4.8 - index * 0.95,
        Math.cos(angle) * 1.55,
      );
    });
    const curve = new THREE.CatmullRomCurve3(points);
    const route = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 180, 0.025, 8, false),
      new THREE.MeshBasicMaterial({
        color: 0xbdd92f,
        transparent: true,
        opacity: 0.38,
      }),
    );
    world.add(route);

    const nodeGeometry = new THREE.IcosahedronGeometry(0.17, 1);
    const nodes: THREE.Mesh[] = [];
    points.forEach((point, index) => {
      const project = projects[index];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(project.accent),
        emissive: new THREE.Color(project.accent),
        emissiveIntensity: 0.65,
        roughness: 0.25,
        metalness: 0.7,
      });
      const node = new THREE.Mesh(nodeGeometry, material);
      node.position.copy(point);
      node.userData.index = index;
      nodes.push(node);
      world.add(node);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.34, 0.012, 8, 40),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(project.accent),
          transparent: true,
          opacity: project.status === "Confirmed" ? 0.42 : 0.2,
        }),
      );
      ring.position.copy(point);
      ring.rotation.x = Math.PI / 2.4;
      world.add(ring);
    });

    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 700;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let index = 0; index < dustCount; index += 1) {
      dustPositions[index * 3] = (Math.random() - 0.5) * 26;
      dustPositions[index * 3 + 1] = (Math.random() - 0.5) * 22;
      dustPositions[index * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xb9b9b9,
        size: 0.025,
        transparent: true,
        opacity: 0.38,
      }),
    );
    scene.add(dust);

    const sculpt = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.25, 0.08, 160, 12, 2, 5),
      new THREE.MeshStandardMaterial({
        color: 0x181818,
        emissive: 0x3f4a14,
        emissiveIntensity: 0.45,
        metalness: 0.9,
        roughness: 0.28,
        wireframe: true,
        transparent: true,
        opacity: 0.46,
      }),
    );
    sculpt.position.set(0, 0.4, -1.5);
    sculpt.scale.setScalar(1.7);
    world.add(sculpt);

    scene.add(new THREE.AmbientLight(0xffffff, 0.38));
    const keyLight = new THREE.PointLight(0xd7ff34, 16, 22);
    keyLight.position.set(3.5, 4, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xff3e7d, 10, 20);
    rimLight.position.set(-5, -3, 3);
    scene.add(rimLight);

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const time = clock.getElapsedTime();
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      world.position.y += (progress * 7.4 - 1.5 - world.position.y) * 0.035;
      world.rotation.y +=
        ((reduceMotion ? 0.15 : pointer.x * 0.2 + progress * 1.15) - world.rotation.y) * 0.025;
      world.rotation.x +=
        ((reduceMotion ? -0.05 : pointer.y * 0.08 - 0.08) - world.rotation.x) * 0.025;
      sculpt.rotation.x = time * 0.07;
      sculpt.rotation.y = time * 0.11;
      dust.rotation.y = time * 0.009;

      nodes.forEach((node, index) => {
        const active = index === activeProjectRef.current;
        const pulse = active && !reduceMotion ? 1 + Math.sin(time * 4) * 0.12 : 1;
        const targetScale = (active ? 2.25 : 1) * pulse;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        const material = node.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity += ((active ? 2.2 : 0.65) - material.emissiveIntensity) * 0.08;
      });

      camera.position.x += ((reduceMotion ? 0 : pointer.x * 0.35) - camera.position.x) * 0.02;
      camera.position.y += ((reduceMotion ? 0.2 : -pointer.y * 0.22 + 0.2) - camera.position.y) * 0.02;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      dustGeometry.dispose();
      nodeGeometry.dispose();
      route.geometry.dispose();
      sculpt.geometry.dispose();
      nodes.forEach((node) => (node.material as THREE.Material).dispose());
      (route.material as THREE.Material).dispose();
      (sculpt.material as THREE.Material).dispose();
      (dust.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  const changeSort = (mode: "latest" | "impact") => {
    setSortMode(mode);
    setActiveId(mode === "latest" ? projects[0].id : projects.find((p) => p.impactRank === 1)!.id);
  };

  return (
    <main className={introComplete ? "site is-ready" : "site"}>
      <div className="intro-wipe" aria-hidden="true">
        <span>WS / NIKE ARCHIVE</span>
      </div>
      <div className="cursor-orb" aria-hidden="true" />
      <canvas ref={canvasRef} className="webgl-stage" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="ascii-field" aria-hidden="true">
        <span>░▒▓ WS_SYS / 3D / VFX / AI / 2020—25 ▓▒░</span>
        <span>010101 :: R&amp;D → IMPLEMENTATION :: 101010</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Will Selviz — back to top">
          W/S<span>®</span>
        </a>
        <p>AI CREATIVE TECHNOLOGIST</p>
        <nav aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#origin">Origin</a>
          <a href="mailto:selviz@rendrd.com">Contact</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>NIKE PROJECT UNIVERSE</span>
          <span>2020—2025</span>
        </div>
        <div className="hero-title-wrap">
          <p className="hero-number">09 / CONFIRMED</p>
          <h1>
            THE WORK
            <br />
            <span>IN MOTION.</span>
          </h1>
        </div>
        <div className="hero-lower">
          <p>
            Will Selviz builds the pipelines between 3D, VFX, AI, and emerging
            tools—turning R&amp;D into repeatable production.
          </p>
          <a href="#projects" className="round-link" aria-label="Enter the project timeline">
            <span>ENTER</span>
            <span>THE TIMELINE ↓</span>
          </a>
        </div>
        <div className="hero-stats" aria-label="Archive statistics">
          <span>
            <b>9.2</b> GB SOURCE
          </span>
          <span>
            <b>27</b> VISUAL ASSETS
          </span>
          <span>
            <b>03</b> REGIONS
          </span>
        </div>
      </section>

      <section className="origin-exposure" aria-labelledby="origin-exposure-title">
        <div className="origin-exposure-copy">
          <p className="section-label">00 / ORIGIN FILES</p>
          <h2 id="origin-exposure-title">
            The work started
            <br />
            <span>as a shoe.</span>
          </h2>
          <p>
            Before the campaigns, <em>Solely</em> turned sketches, scans, 3D
            prints, and material experiments into a working method: explore the
            impossible, build the pipeline, then make the image real.
          </p>
          <div className="origin-exposure-meta" aria-label="Origin archive details">
            <span>THESIS / PROTOTYPES / PROCESS</span>
            <span>TORONTO / 2016</span>
          </div>
        </div>

        <div className="origin-collage" aria-label="A collage of Will Selviz's early thesis work">
          <figure className="origin-tile origin-tile-board">
            <img
              src="/origin/thesis-board.webp"
              loading="lazy"
              alt="Solely thesis board with sneaker sketches, renders, and prototypes"
            />
            <figcaption>THESIS BOARD / 001</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-motion">
            <img
              src="/origin/motion-study.webp"
              loading="lazy"
              alt="Digital particle study of a sneaker form"
            />
            <figcaption>FORM STUDY / 002</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-studio">
            <img
              src="/origin/studio-01.webp"
              loading="lazy"
              alt="Will Selviz working with a desktop fabrication machine"
            />
            <figcaption>MAKING / 003</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-sole">
            <img
              src="/origin/studio-02.webp"
              loading="lazy"
              alt="Hand holding a 3D-printed sneaker sole prototype"
            />
            <figcaption>PROTOTYPE / 004</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-upcycle">
            <video
              data-auto-video
              src="/origin/upcycle-loop.mp4"
              poster="/origin/upcycle-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Animated translucent sneaker concept"
            />
            <figcaption>UP-CYCLE LOOP / 005</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-scan">
            <video
              data-auto-video
              src="/origin/scan-loop.mp4"
              poster="/origin/scan-poster.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Animated white sneaker scan"
            />
            <figcaption>SCAN / 006</figcaption>
          </figure>
          <span className="origin-collage-stamp" aria-hidden="true">
            ░▒▓ WORKING ARCHIVE / EXPOSED ▓▒░
          </span>
        </div>
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <p className="section-label">01 / PRACTICE</p>
        <h2 id="manifesto-title">
          More than an image.
          <br />
          <span>A system that makes the image possible.</span>
        </h2>
        <div className="manifesto-copy">
          <p>
            My job is to create pipelines and workflows that let teams do more
            with what they already have—then explore the tools, materials, and
            technologies that can take the work somewhere new.
          </p>
          <p>
            The goal is to move past hype: find the real implementation, make
            it repeatable, and carry an idea from experiment to launch.
          </p>
        </div>
      </section>

      <section className="project-archive" id="projects" aria-labelledby="projects-title">
        <div className="archive-head">
          <div>
            <p className="section-label">02 / PROJECT INDEX</p>
            <h2 id="projects-title">Six years. One moving archive.</h2>
          </div>
          <div className="sort-control" aria-label="Sort project archive">
            <button
              onClick={() => changeSort("latest")}
              aria-pressed={sortMode === "latest"}
              className={sortMode === "latest" ? "is-active" : ""}
            >
              LATEST
            </button>
            <button
              onClick={() => changeSort("impact")}
              aria-pressed={sortMode === "impact"}
              className={sortMode === "impact" ? "is-active" : ""}
            >
              IMPACT
            </button>
          </div>
        </div>

        <aside className="year-rail" aria-label="Project position">
          <span>{sortMode === "latest" ? "LATEST" : "IMPACT"}</span>
          <div>
            {orderedProjects.map((project) => (
              <a
                key={project.id}
                href={`#project-${project.id}`}
                className={activeId === project.id ? "is-active" : ""}
                aria-label={`Jump to ${project.title}`}
              >
                <i />
                <span>{project.year}</span>
              </a>
            ))}
          </div>
        </aside>

        <div className="project-list">
          {orderedProjects.map((project, index) => (
            <article
              className={`project-chapter ${index % 2 ? "is-reverse" : ""}`}
              data-project-id={project.id}
              id={`project-${project.id}`}
              key={project.id}
              style={{ "--accent": project.accent } as React.CSSProperties}
            >
              <div className="chapter-content">
                <div className="chapter-sequence">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.status}</span>
                </div>
                <p className="chapter-year">{project.year}</p>
                <h3>{project.title}</h3>
                <p className="chapter-discipline">{project.discipline}</p>
                <p className="chapter-summary">{project.summary}</p>
                <span className="chapter-ascii" aria-hidden="true">
                  ░▒ {project.id.toUpperCase()} / {project.year} /{" "}
                  {project.status.toUpperCase()} ▒░
                </span>
                <div className="chapter-footer">
                  <span>{project.region}</span>
                  <button onClick={() => setSelected(project)}>
                    OPEN PROJECT
                    {project.gallery?.length ? (
                      <small>{String(project.gallery.length).padStart(2, "0")} ASSETS</small>
                    ) : null}
                    <ArrowIcon />
                  </button>
                </div>
              </div>
              <ProjectMedia project={project} onOpen={() => setSelected(project)} />
            </article>
          ))}
        </div>
      </section>

      <section className="origin" id="origin" aria-labelledby="origin-title">
        <div className="origin-mark" aria-hidden="true">
          <span>S</span>
          <span>O</span>
          <span>L</span>
          <span>E</span>
          <span>LY</span>
        </div>
        <div className="origin-content">
          <p className="section-label">03 / THE ORIGIN</p>
          <h2 id="origin-title">Before the campaigns, there was a printed shoe.</h2>
          <p>
            The practice began with <em>Solely</em>, a 3D-printed sneaker thesis
            developed with Autodesk and mentored by Nike designers, including
            Errolson Hugh of ACRONYM. It established the pattern that still
            drives the work: test the material, build the system, move the idea
            into practice.
          </p>
          <a href="https://solelythesis.webflow.io/" target="_blank" rel="noreferrer">
            EXPLORE THE THESIS <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="section-label">04 / NEXT</p>
        <p>Have a difficult creative-technology problem?</p>
        <a href="mailto:selviz@rendrd.com">
          LET&apos;S BUILD
          <br />
          WHAT&apos;S NEXT. <ArrowIcon />
        </a>
        <footer>
          <span>WILL SELVIZ © 2026</span>
          <div>
            <a href="https://www.willselviz.co/" target="_blank" rel="noreferrer">
              PORTFOLIO
            </a>
            <a
              href="https://www.linkedin.com/in/willselviz"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN
            </a>
          </div>
          <span>TORONTO / GLOBAL</span>
        </footer>
      </section>

      {selected ? <ProjectDialog project={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}
