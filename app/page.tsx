"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

type ProjectStatus = "Confirmed";

type MediaItem = {
  id?: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  label: string;
  aspect: "portrait" | "landscape" | "square";
  enabled?: boolean;
  storageKey?: string;
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
  coverType?: "video" | "image";
  gallery?: MediaItem[];
  impactRank: number;
  accent: string;
  enabled?: boolean;
};

const PUBLIC_BASE_URL = import.meta.env.BASE_URL ?? "/";
const IS_PUBLIC_STATIC_BUILD =
  import.meta.env.VITE_PUBLIC_PORTFOLIO === "true";

function assetUrl(path?: string) {
  if (!path) return path;
  if (
    PUBLIC_BASE_URL === "/" ||
    /^(?:https?:|data:|blob:)/i.test(path) ||
    path.startsWith("/api/")
  ) {
    return path;
  }
  return `${PUBLIC_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function resolveProjectAssets(project: Project): Project {
  return {
    ...project,
    media: assetUrl(project.media),
    poster: assetUrl(project.poster),
    gallery: project.gallery?.map((item) => ({
      ...item,
      src: assetUrl(item.src) ?? item.src,
      poster: assetUrl(item.poster),
    })),
  };
}

const defaultProjects: Project[] = [
  {
    id: "tec",
    year: "2025",
    title: "Toronto Eaton Centre",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "CGI / 3D / VFX / social",
    summary:
      "A fast-turnaround visual system for the store-opening activation, moving from pre-rollout CGI into social, installation, and Nike By You content.",
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
    year: "2022",
    title: "Air Max Day Worldwide",
    region: "Toronto, Canada",
    status: "Confirmed",
    discipline: "Global campaign / 3D / live experience",
    summary:
      "Selected to represent Canada in Nike's global Air Max Day campaign, Bring the Future to Light, combining a featured artist story, 3D motion, a live broadcast, and a boundary-pushing local panel.",
    role: "Canada campaign representative, featured artist, 3D animation, panel curation, co-production",
    deliverables: [
      "Bring the Future to Light",
      "Global campaign feature",
      "3D animation",
      "EVO reel",
      "AR frames",
      "Livestream motion system",
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

const roleFitSignals = [
  {
    label: "GENAI SYSTEMS",
    detail: "Custom node graphs, model evaluation, and production-ready workflows",
    href: "#practice",
  },
  {
    label: "2D / 3D FOOTWEAR",
    detail: "Nine years across design, animation, VFX, and footwear visualization",
    href: "#origin",
  },
  {
    label: "PHYSICAL PROTOTYPING",
    detail: "Additive manufacturing and sustainable 3D-printed sneaker R&D",
    href: "#origin-path",
  },
  {
    label: "SPATIAL + REAL-TIME",
    detail: "AR, VR, WebXR, Unity, Unreal, scanning, and motion capture",
    href: "#project-ofsaa",
  },
  {
    label: "CREATIVE → ENGINEERING",
    detail: "Translating design needs into scalable technical systems",
    href: "#project-am95",
  },
  {
    label: "NIKE CONTEXT",
    detail: "Campaign craft, footwear fluency, and trusted delivery since 2020",
    href: "#project-amd",
  },
] as const;

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
      {project.coverType === "image" ? (
        <img
          src={project.media}
          loading="lazy"
          alt={`${project.title} project preview`}
        />
      ) : (
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
      )}
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
  position,
  onClose,
}: {
  project: Project;
  position: number;
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
              {String(position).padStart(2, "0")}
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
                    key={item.id ?? `${item.src}-${index}`}
                  >
                    <GalleryMedia item={item} projectTitle={project.title} />
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

function GalleryMedia({
  item,
  projectTitle,
}: {
  item: MediaItem;
  projectTitle: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRatio =
    item.aspect === "portrait" ? "4 / 5" : item.aspect === "square" ? "1 / 1" : "16 / 9";
  const [ratio, setRatio] = useState(fallbackRatio);

  const openFullscreen = () => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!video) return;

    if (frame?.requestFullscreen) {
      void frame
        .requestFullscreen()
        .then(() => video.play().catch(() => undefined))
        .catch(() => undefined);
      return;
    }

    const safariVideo = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    safariVideo.webkitEnterFullscreen?.();
  };

  return (
    <div
      ref={frameRef}
      className="gallery-frame"
      style={{ "--media-ratio": ratio } as React.CSSProperties}
    >
      {item.type === "video" ? (
        <>
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              if (video.videoWidth && video.videoHeight) {
                setRatio(`${video.videoWidth} / ${video.videoHeight}`);
              }
            }}
            aria-label={`${projectTitle}: ${item.label}`}
          />
          <button
            type="button"
            className="video-fullscreen"
            onClick={openFullscreen}
            aria-label={`View ${item.label} fullscreen`}
          >
            FULLSCREEN
            <span aria-hidden="true">↗</span>
          </button>
        </>
      ) : (
        <img
          src={item.src}
          loading="lazy"
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalWidth && image.naturalHeight) {
              setRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
            }
          }}
          alt={`${projectTitle}: ${item.label}`}
        />
      )}
    </div>
  );
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeProjectRef = useRef(0);
  const shoeInspectingRef = useRef(false);
  const shoeViewResetRef = useRef(0);
  const inspectCloseRef = useRef<HTMLButtonElement>(null);
  const [projects, setProjects] = useState<Project[]>(() =>
    defaultProjects.map(resolveProjectAssets),
  );
  const [sortMode, setSortMode] = useState<"latest" | "impact">("latest");
  const [activeId, setActiveId] = useState(defaultProjects[0].id);
  const [selected, setSelected] = useState<Project | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [shoeModelReady, setShoeModelReady] = useState(false);
  const [shoeInspecting, setShoeInspecting] = useState(false);

  useEffect(() => {
    if (IS_PUBLIC_STATIC_BUILD) return;
    const controller = new AbortController();
    void fetch("/api/portfolio", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Portfolio settings are unavailable.");
        return response.json() as Promise<{ manifest?: { projects?: Project[] } }>;
      })
      .then((payload) => {
        const next = payload.manifest?.projects;
        if (!next?.length) return;
        setProjects(next.map(resolveProjectAssets));
        setActiveId(next[0].id);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });
    return () => controller.abort();
  }, []);

  const orderedProjects = useMemo(() => {
    if (sortMode === "impact") {
      return [...projects].sort((a, b) => a.impactRank - b.impactRank);
    }
    return [...projects].sort((a, b) => Number(b.year) - Number(a.year));
  }, [projects, sortMode]);

  useEffect(() => {
    activeProjectRef.current = Math.max(
      0,
      projects.findIndex((project) => project.id === activeId),
    );
  }, [activeId, projects]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIntroComplete(true), 1100);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    shoeInspectingRef.current = shoeInspecting;
    if (!shoeInspecting) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    inspectCloseRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShoeInspecting(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [shoeInspecting]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-project-id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setActiveId((visible.target as HTMLElement).dataset.projectId ?? projects[0]?.id ?? "");
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

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

    let shoePresentation: THREE.Group | null = null;
    let shoeMaterial: THREE.MeshPhysicalMaterial | null = null;
    let shoeWireMaterial: THREE.ShaderMaterial | null = null;
    let albedoTexture: THREE.Texture | null = null;
    let normalTexture: THREE.Texture | null = null;
    let shoeLoadCancelled = false;
    let inspectionBlend = 0;
    let inspectionYaw = 0.08;
    let inspectionPitch = 0.04;
    let inspectionZoom = 1;
    let lastResetSignal = shoeViewResetRef.current;
    let isDraggingShoe = false;
    let lastDragX = 0;
    let lastDragY = 0;
    let pinchDistance = 0;
    const activePointers = new Map<number, { x: number; y: number }>();

    const layoutShoe = () => {
      if (!shoePresentation) return;
      const isMobile = window.innerWidth < 720;
      const isTablet = window.innerWidth < 1100;
      const scale = isMobile ? 0.11 : isTablet ? 0.19 : 0.255;
      const x = isMobile ? 0.52 : isTablet ? 1.6 : 2.35;
      const y = isMobile ? 1.05 : isTablet ? 0.72 : 0.52;
      const z = isMobile ? 1.9 : 1.45;
      shoePresentation.scale.setScalar(scale);
      shoePresentation.position.set(x, y, z);
      shoePresentation.userData.heroScale = scale;
      shoePresentation.userData.heroX = x;
      shoePresentation.userData.baseY = y;
      shoePresentation.userData.heroZ = z;
      shoePresentation.userData.inspectScale = isMobile ? 0.14 : isTablet ? 0.225 : 0.3;
      shoePresentation.userData.inspectY = isMobile ? 0.15 : 0.05;
      shoePresentation.userData.inspectZ = isMobile ? 0.45 : 0.9;
    };

    const disposeFbx = (root: THREE.Object3D) => {
      root.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material?.dispose();
        }
      });
    };

    const textureLoader = new THREE.TextureLoader();
    const fbxLoader = new FBXLoader();
    void Promise.all([
      fbxLoader.loadAsync(assetUrl("/models/evo-ar/evo-ar.fbx") ?? ""),
      textureLoader.loadAsync(assetUrl("/models/evo-ar/evo-albedo.jpg") ?? ""),
      textureLoader.loadAsync(assetUrl("/models/evo-ar/evo-normal.jpg") ?? ""),
    ])
      .then(([fbx, albedo, normal]) => {
        if (shoeLoadCancelled) {
          disposeFbx(fbx);
          albedo.dispose();
          normal.dispose();
          return;
        }

        albedoTexture = albedo;
        normalTexture = normal;
        albedo.colorSpace = THREE.SRGBColorSpace;
        normal.colorSpace = THREE.NoColorSpace;
        const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        albedo.anisotropy = anisotropy;
        normal.anisotropy = anisotropy;

        shoeMaterial = new THREE.MeshPhysicalMaterial({
          map: albedo,
          normalMap: normal,
          normalMapType: THREE.TangentSpaceNormalMap,
          normalScale: new THREE.Vector2(0.72, 0.72),
          color: 0xffffff,
          roughness: 0.58,
          metalness: 0.02,
          clearcoat: 0.16,
          clearcoatRoughness: 0.72,
          emissive: new THREE.Color(0x17220a),
          emissiveIntensity: 0.02,
          transparent: true,
        });

        fbx.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const previousMaterials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          previousMaterials.forEach((material) => material?.dispose());
          mesh.material = shoeMaterial as THREE.MeshPhysicalMaterial;
          mesh.frustumCulled = false;
        });

        const bounds = new THREE.Box3().setFromObject(fbx);
        const center = bounds.getCenter(new THREE.Vector3());
        fbx.position.sub(center);
        fbx.rotation.y = Math.PI / 2;

        shoeWireMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uFocus: { value: 0 },
          },
          vertexShader: `
            varying vec3 vObjectPosition;
            void main() {
              vObjectPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float uTime;
            uniform float uFocus;
            varying vec3 vObjectPosition;
            void main() {
              float band = fract(vObjectPosition.x * 0.065 - uTime * 0.18);
              float scan = pow(max(0.0, 1.0 - abs(band - 0.5) * 7.5), 3.0);
              float flicker = 0.72 + sin(uTime * 3.0 + vObjectPosition.z * 0.18) * 0.28;
              float spectrum = 0.5 + 0.5 * sin(vObjectPosition.x * 0.12 + uTime);
              vec3 cyan = vec3(0.22, 0.82, 1.0);
              vec3 volt = vec3(0.84, 1.0, 0.20);
              vec3 color = mix(cyan, volt, spectrum);
              float alpha = (0.045 + scan * 0.68) * mix(0.28, 1.0, uFocus) * flicker;
              gl_FragColor = vec4(color, alpha);
            }
          `,
          wireframe: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        const wireframeFbx = fbx.clone(true);
        wireframeFbx.scale.setScalar(1.004);
        wireframeFbx.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.material = shoeWireMaterial as THREE.ShaderMaterial;
          mesh.renderOrder = 4;
        });

        shoePresentation = new THREE.Group();
        shoePresentation.name = "EVO_AR_HERO";
        shoePresentation.add(fbx, wireframeFbx);
        scene.add(shoePresentation);
        layoutShoe();
        setShoeModelReady(true);
      })
      .catch(() => {
        if (!shoeLoadCancelled) setShoeModelReady(false);
      });

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
    const modelSkyLight = new THREE.HemisphereLight(0xdde9ff, 0x17120f, 1.15);
    scene.add(modelSkyLight);
    const modelKeyLight = new THREE.DirectionalLight(0xfff5e7, 4.2);
    modelKeyLight.position.set(5.5, 7, 7);
    scene.add(modelKeyLight);
    const modelFillLight = new THREE.DirectionalLight(0x9cbcff, 1.8);
    modelFillLight.position.set(-4, 1.5, 5);
    scene.add(modelFillLight);
    const modelEdgeLight = new THREE.PointLight(0xd7ff34, 17, 18, 1.8);
    modelEdgeLight.position.set(-3.5, 3.5, 2.5);
    scene.add(modelEdgeLight);
    const keyLight = new THREE.PointLight(0xd7ff34, 16, 22);
    keyLight.position.set(3.5, 4, 6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xff3e7d, 10, 20);
    rimLight.position.set(-5, -3, 3);
    scene.add(rimLight);

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      if (shoeInspectingRef.current && activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (activePointers.size === 2) {
          const [first, second] = Array.from(activePointers.values());
          const nextDistance = Math.hypot(second.x - first.x, second.y - first.y);
          if (pinchDistance > 0) {
            inspectionZoom = THREE.MathUtils.clamp(
              inspectionZoom * (nextDistance / pinchDistance),
              0.72,
              1.75,
            );
          }
          pinchDistance = nextDistance;
        } else if (isDraggingShoe) {
          const deltaX = event.clientX - lastDragX;
          const deltaY = event.clientY - lastDragY;
          inspectionYaw += deltaX * 0.008;
          inspectionPitch = THREE.MathUtils.clamp(
            inspectionPitch + deltaY * 0.006,
            -0.72,
            0.72,
          );
          lastDragX = event.clientX;
          lastDragY = event.clientY;
        }
        return;
      }
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!shoeInspectingRef.current) return;
      canvas.setPointerCapture(event.pointerId);
      activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      isDraggingShoe = true;
      lastDragX = event.clientX;
      lastDragY = event.clientY;
      if (activePointers.size === 2) {
        const [first, second] = Array.from(activePointers.values());
        pinchDistance = Math.hypot(second.x - first.x, second.y - first.y);
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      activePointers.delete(event.pointerId);
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      pinchDistance = 0;
      isDraggingShoe = activePointers.size > 0;
      const remaining = Array.from(activePointers.values())[0];
      if (remaining) {
        lastDragX = remaining.x;
        lastDragY = remaining.y;
      }
    };
    const onWheel = (event: WheelEvent) => {
      if (!shoeInspectingRef.current) return;
      event.preventDefault();
      inspectionZoom = THREE.MathUtils.clamp(
        inspectionZoom * Math.exp(event.deltaY * -0.0012),
        0.72,
        1.75,
      );
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      layoutShoe();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

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

      if (shoePresentation && shoeMaterial) {
        const inspecting = shoeInspectingRef.current;
        inspectionBlend += ((inspecting ? 1 : 0) - inspectionBlend) * 0.085;
        if (lastResetSignal !== shoeViewResetRef.current) {
          lastResetSignal = shoeViewResetRef.current;
          inspectionYaw = 0.08;
          inspectionPitch = 0.04;
          inspectionZoom = 1;
        }

        const heroProgress = window.scrollY / Math.max(1, window.innerHeight);
        const fade = 1 - THREE.MathUtils.smoothstep(heroProgress, 0.48, 1.02);
        shoeMaterial.opacity = Math.max(fade, inspectionBlend);
        shoeMaterial.emissiveIntensity =
          0.02 + inspectionBlend * (0.035 + Math.sin(time * 2.1) * 0.012);
        shoePresentation.visible = fade > 0.01 || inspectionBlend > 0.01;
        const heroScale = Number(shoePresentation.userData.heroScale ?? 0.255);
        const inspectScale = Number(shoePresentation.userData.inspectScale ?? 0.3);
        const heroX = Number(shoePresentation.userData.heroX ?? 2.35);
        const baseY = Number(shoePresentation.userData.baseY ?? 0.52);
        const heroZ = Number(shoePresentation.userData.heroZ ?? 1.45);
        const inspectY = Number(shoePresentation.userData.inspectY ?? 0.05);
        const inspectZ = Number(shoePresentation.userData.inspectZ ?? 0.9);
        const floatOffset = reduceMotion ? 0 : Math.sin(time * 0.72) * 0.075;
        const heroY = baseY + floatOffset - heroProgress * 0.34;
        shoePresentation.position.x = THREE.MathUtils.lerp(heroX, 0, inspectionBlend);
        shoePresentation.position.y = THREE.MathUtils.lerp(heroY, inspectY, inspectionBlend);
        shoePresentation.position.z = THREE.MathUtils.lerp(heroZ, inspectZ, inspectionBlend);
        const targetScale = THREE.MathUtils.lerp(
          heroScale,
          inspectScale * inspectionZoom,
          inspectionBlend,
        );
        shoePresentation.scale.setScalar(targetScale);

        const heroPitch = reduceMotion ? 0.035 : pointer.y * 0.075 + 0.035;
        const heroYaw = reduceMotion ? 0 : pointer.x * 0.17;
        const heroRoll = reduceMotion ? -0.055 : pointer.x * -0.045 - 0.055;
        const targetPitch = THREE.MathUtils.lerp(heroPitch, inspectionPitch, inspectionBlend);
        const targetYaw = THREE.MathUtils.lerp(heroYaw, inspectionYaw, inspectionBlend);
        const targetRoll = THREE.MathUtils.lerp(heroRoll, 0, inspectionBlend);
        shoePresentation.rotation.x +=
          (targetPitch - shoePresentation.rotation.x) * (inspecting ? 0.13 : 0.035);
        shoePresentation.rotation.y +=
          (targetYaw - shoePresentation.rotation.y) * (inspecting ? 0.13 : 0.035);
        shoePresentation.rotation.z +=
          (targetRoll - shoePresentation.rotation.z) * (inspecting ? 0.13 : 0.035);
        if (shoeWireMaterial) {
          shoeWireMaterial.uniforms.uTime.value = time;
          shoeWireMaterial.uniforms.uFocus.value = inspectionBlend;
        }
      }
      world.visible = inspectionBlend < 0.82;
      dust.visible = inspectionBlend < 0.82;

      nodes.forEach((node, index) => {
        const active = index === activeProjectRef.current;
        const pulse = active && !reduceMotion ? 1 + Math.sin(time * 4) * 0.12 : 1;
        const targetScale = (active ? 2.25 : 1) * pulse;
        node.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        const material = node.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity += ((active ? 2.2 : 0.65) - material.emissiveIntensity) * 0.08;
      });

      const cameraPointerInfluence = 1 - inspectionBlend;
      camera.position.x +=
        ((reduceMotion ? 0 : pointer.x * 0.35 * cameraPointerInfluence) - camera.position.x) *
        0.02;
      camera.position.y +=
        ((reduceMotion ? 0.2 : -pointer.y * 0.22 * cameraPointerInfluence + 0.2) -
          camera.position.y) *
        0.02;
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      shoeLoadCancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      dustGeometry.dispose();
      nodeGeometry.dispose();
      route.geometry.dispose();
      sculpt.geometry.dispose();
      nodes.forEach((node) => (node.material as THREE.Material).dispose());
      (route.material as THREE.Material).dispose();
      (sculpt.material as THREE.Material).dispose();
      (dust.material as THREE.Material).dispose();
      if (shoePresentation) {
        scene.remove(shoePresentation);
        disposeFbx(shoePresentation);
      }
      albedoTexture?.dispose();
      normalTexture?.dispose();
      shoeWireMaterial?.dispose();
      renderer.dispose();
    };
  }, [projects]);

  const changeSort = (mode: "latest" | "impact") => {
    setSortMode(mode);
    const next =
      mode === "latest"
        ? [...projects].sort((a, b) => Number(b.year) - Number(a.year))[0]
        : [...projects].sort((a, b) => a.impactRank - b.impactRank)[0];
    if (next) setActiveId(next.id);
  };

  return (
    <main
      className={`${introComplete ? "site is-ready" : "site"} ${
        shoeInspecting ? "is-inspecting" : ""
      }`}
    >
      <div className="intro-wipe" aria-hidden="true">
        <span>WS / NIKE ARCHIVE</span>
      </div>
      <div className="cursor-orb" aria-hidden="true" />
      <canvas ref={canvasRef} className="webgl-stage" aria-hidden="true" />
      {shoeInspecting ? (
        <>
          <div className="shoe-inspector-backdrop" aria-hidden="true" />
          <section
            className="shoe-inspector-hud"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shoe-inspector-title"
          >
            <div className="shoe-inspector-index">
              <span>OBJECT / 001</span>
              <span>REALTIME SCAN</span>
            </div>
            <div className="shoe-inspector-heading">
              <p>NIKE AIR MAX EVO</p>
              <h2 id="shoe-inspector-title">INSPECT THE OBJECT</h2>
              <span>DRAG TO ROTATE / SCROLL OR PINCH TO ZOOM</span>
            </div>
            <div className="shoe-inspector-actions">
              <button
                type="button"
                onClick={() => {
                  shoeViewResetRef.current += 1;
                }}
              >
                RESET VIEW
              </button>
              <button
                ref={inspectCloseRef}
                type="button"
                onClick={() => setShoeInspecting(false)}
              >
                CLOSE / ESC
              </button>
            </div>
            <div className="shoe-inspector-reticle" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </section>
        </>
      ) : null}
      <div className="noise" aria-hidden="true" />
      <div className="ascii-field" aria-hidden="true">
        <span>░▒▓ WS_SYS / 3D / VFX / AI / 2020-25 ▓▒░</span>
        <span>010101 :: R&amp;D → IMPLEMENTATION :: 101010</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Will Selviz: back to top">
          W/S<span>®</span>
        </a>
        <p>AI CREATIVE TECHNOLOGIST</p>
        <nav aria-label="Primary navigation">
          <a href="#role-fit">Role Fit</a>
          <a href="#projects">Projects</a>
          <a href="#origin">Origin</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">
          <span>NIKE PROJECT UNIVERSE</span>
          <span>2020-2025</span>
        </div>
        <div className={`hero-model-readout ${shoeModelReady ? "is-ready" : ""}`}>
          <span>
            <i aria-hidden="true" />
            {shoeModelReady ? "LIVE 3D OBJECT" : "LOADING 3D OBJECT"}
          </span>
          <strong>EVO / AIR MAX DAY</strong>
          <small>TAP OBJECT TO ISOLATE / ALBEDO + NORMAL SCAN</small>
        </div>
        <button
          type="button"
          className={`hero-shoe-trigger ${shoeModelReady ? "is-ready" : ""}`}
          onClick={() => {
            if (shoeModelReady) setShoeInspecting(true);
          }}
          disabled={!shoeModelReady}
          aria-label="Open the Nike Air Max EVO interactive 3D viewer"
        >
          <span>CLICK / TAP TO INSPECT</span>
        </button>
        <div className="hero-title-wrap">
          <p className="hero-number">
            {String(projects.length).padStart(2, "0")} / CONFIRMED
          </p>
          <h1>
            THE WORK
            <br />
            <span>IN MOTION.</span>
          </h1>
        </div>
        <div className="hero-lower">
          <p>
            Will Selviz builds the pipelines between 3D, VFX, AI, and emerging
            tools, turning R&amp;D into repeatable production.
          </p>
          <a href="#projects" className="round-link" aria-label="Enter the project timeline">
            <span>ENTER</span>
            <span>THE TIMELINE ↓</span>
          </a>
        </div>
        <div className="hero-stats" aria-label="Hiring highlights">
          <span>
            <b>9+</b> YEARS BUILDING CREATIVE SYSTEMS
          </span>
          <span>
            <b>14</b> AI + VFX WORKFLOWS OPTIMIZED
          </span>
          <span>
            <b>6+</b> YEARS DELIVERING NIKE WORK
          </span>
        </div>
      </section>

      <section className="role-fit" id="role-fit" aria-labelledby="role-fit-title">
        <div className="role-fit-copy">
          <p className="section-label">01 / WHY WILL × NIKE</p>
          <h2 id="role-fit-title">
            BUILT FOR THE
            <br />
            <span>GENERATIVE STUDIO.</span>
          </h2>
          <p>
            Nike is looking for a designer who can build tools, connect creative
            and engineering teams, and move experimental AI into real footwear
            workflows. That intersection has been my practice for nine years.
          </p>
          <a
            className="role-link"
            href="https://careers.nike.com/generative-ai-lead-designer/job/R-88358"
            target="_blank"
            rel="noreferrer"
          >
            VIEW ROLE R-88358 <ArrowIcon />
          </a>
        </div>

        <div className="skill-orbit" aria-label="Six reasons Will Selviz matches the role">
          <div className="skill-orbit-rings" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="skill-core">
            <span>W/S</span>
            <b>DESIGNER</b>
            <b>+</b>
            <b>TOOL BUILDER</b>
            <small>CLICK A SIGNAL</small>
          </div>
          <div className="skill-node-list">
            {roleFitSignals.map((signal, index) => (
              <a
                key={signal.label}
                href={signal.href}
                className="skill-node"
                style={
                  {
                    "--angle": `${index * 60 - 30}deg`,
                    "--reverse-angle": `${30 - index * 60}deg`,
                  } as React.CSSProperties
                }
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{signal.label}</strong>
                <small>{signal.detail}</small>
              </a>
            ))}
          </div>
          <span className="skill-orbit-ascii" aria-hidden="true">
            ░▒▓ INPUT → PROTOTYPE → PIPELINE → ADOPTION ▓▒░
          </span>
        </div>
      </section>

      <section className="origin-exposure" aria-labelledby="origin-exposure-title">
        <div className="origin-exposure-copy">
          <p className="section-label">02 / ORIGIN FILES</p>
          <h2 id="origin-exposure-title">
            The work started
            <br />
            <span>as a shoe.</span>
          </h2>
          <p>
            Before the campaigns, Autodesk selected me to develop{" "}
            <em>Solely</em>, a sustainable 3D-printed sneaker thesis, inside its
            Advanced Research Labs in Toronto. The work turned sketches, scans,
            fabrication, and material experiments into a method I still use:
            explore the impossible, build the pipeline, then make it real.
          </p>
          <div className="origin-exposure-meta" aria-label="Origin archive details">
            <span>AUTODESK RESEARCH / THESIS / PROTOTYPES</span>
            <span>TORONTO / ORIGIN</span>
          </div>
        </div>

        <div className="origin-collage" aria-label="A collage of Will Selviz's early thesis work">
          <figure className="origin-tile origin-tile-board">
            <img
              src={assetUrl("/origin/thesis-board.webp")}
              loading="lazy"
              alt="Solely thesis board with sneaker sketches, renders, and prototypes"
            />
            <figcaption>THESIS BOARD / 001</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-motion">
            <img
              src={assetUrl("/origin/motion-study.webp")}
              loading="lazy"
              alt="Digital particle study of a sneaker form"
            />
            <figcaption>FORM STUDY / 002</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-studio">
            <img
              src={assetUrl("/origin/studio-01.webp")}
              loading="lazy"
              alt="Will Selviz working with a desktop fabrication machine"
            />
            <figcaption>MAKING / 003</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-sole">
            <img
              src={assetUrl("/origin/studio-02.webp")}
              loading="lazy"
              alt="Hand holding a 3D-printed sneaker sole prototype"
            />
            <figcaption>PROTOTYPE / 004</figcaption>
          </figure>
          <figure className="origin-tile origin-tile-upcycle">
            <video
              data-auto-video
              src={assetUrl("/origin/upcycle-loop.mp4")}
              poster={assetUrl("/origin/upcycle-poster.webp")}
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
              src={assetUrl("/origin/scan-loop.mp4")}
              poster={assetUrl("/origin/scan-poster.webp")}
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

      <section className="origin-path" id="origin-path" aria-labelledby="origin-path-title">
        <div className="origin-path-head">
          <p className="section-label">02.1 / FROM SPEC TO SWOOSH</p>
          <h2 id="origin-path-title">
            A SELF-STARTED
            <br />
            <span>FOOTWEAR PRACTICE.</span>
          </h2>
          <p>
            The recap is the connective tissue: sustainable footwear research,
            self-initiated Nike concepts, and the campaign work that followed.
          </p>
        </div>

        <figure className="origin-recap">
          <video
            data-auto-video
            src={assetUrl("/origin/nike-origin-recap.mp4")}
            poster={assetUrl("/origin/thesis-board.webp")}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="Recap of Will Selviz's footwear design and Nike campaign work"
          />
          <figcaption>
            <span>NIKE_1 / ORIGIN RECAP</span>
            <span>LEAD FILE / PLAY WITH SOUND</span>
          </figcaption>
        </figure>

        <div className="origin-path-story">
          <article>
            <span>01</span>
            <h3>SELECTED BY AUTODESK</h3>
            <p>
              Autodesk brought the sustainable 3D-printing thesis into its
              Advanced Research Labs in Toronto. Errolson Hugh of ACRONYM
              advised the thesis alongside Nike designers, grounding the
              experiment in both technical rigor and footwear culture.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>SPEC WORK BECAME A LAB</h3>
            <p>
              I kept designing Nike sneakers and making self-initiated ads, not
              as mock campaigns, but as repeatable experiments in 3D, materials,
              motion, scanning, and image-making.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>NIKE TOOK NOTICE</h3>
            <p>
              That body of work led Nike to hire me for a CGI launch film for
              the Canada National Soccer Team kit. It became the first chapter
              in an ongoing campaign relationship.
            </p>
            <a href="#project-canada">OPEN CANADA SOCCER CASE STUDY <ArrowIcon /></a>
          </article>
          <article>
            <span>04</span>
            <h3>CANADA → THE WORLD</h3>
            <p>
              In 2022, I was chosen to represent Canada in Nike&apos;s global
              Air Max Day campaign, <em>Bring the Future to Light</em>.
            </p>
            <a href="#project-amd">OPEN GLOBAL CAMPAIGN <ArrowIcon /></a>
          </article>
        </div>

        <div className="origin-object-grid" aria-label="Solely 3D-printed sneaker details">
          <figure className="origin-object origin-object-main">
            <video
              src={assetUrl("/origin/solely-animation-recap.mp4")}
              poster={assetUrl("/origin/solely-side.jpg")}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              data-auto-video
              aria-label="Solely sustainable 3D-printed sneaker animation recap"
            />
            <figcaption>SOLELY / ANIMATION RECAP</figcaption>
          </figure>
          <figure className="origin-object">
            <img
              src={assetUrl("/origin/solely-cage.jpg")}
              loading="lazy"
              alt="Close-up of the Solely sneaker's 3D-printed heel cage"
            />
            <figcaption>PRINTED HEEL CAGE</figcaption>
          </figure>
          <figure className="origin-object">
            <img
              src={assetUrl("/origin/solely-print.jpg")}
              loading="lazy"
              alt="Fresh resin print of the Solely heel structure in a fabrication studio"
            />
            <figcaption>RESIN PRINT / PROCESS</figcaption>
          </figure>
        </div>

        <a
          className="solely-primary-link"
          href="https://solelythesis.webflow.io/"
          target="_blank"
          rel="noreferrer"
        >
          <span>SOLELY</span>
          <strong>OPEN THE FULL THESIS</strong>
          <ArrowIcon />
        </a>
      </section>

      <section className="manifesto" id="practice" aria-labelledby="manifesto-title">
        <p className="section-label">03 / PRACTICE</p>
        <h2 id="manifesto-title">
          More than an image.
          <br />
          <span>A system that makes the image possible.</span>
        </h2>
        <div className="manifesto-copy">
          <p>
            My job is to create pipelines and workflows that let teams do more
            with what they already have, then explore the tools, materials, and
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
            <p className="section-label">04 / PROJECT INDEX</p>
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
          <p className="section-label">05 / THE ORIGIN</p>
          <h2 id="origin-title">Before the campaigns, there was a printed shoe.</h2>
          <p>
            The practice began with <em>Solely</em>, a sustainable 3D-printed
            sneaker thesis selected for development inside Autodesk&apos;s
            Advanced Research Labs in Toronto and advised by Errolson Hugh of
            ACRONYM alongside Nike designers. It established the pattern that
            still drives the work: test the material, build the system, move the
            idea into practice.
          </p>
          <a
            className="origin-thesis-link"
            href="https://solelythesis.webflow.io/"
            target="_blank"
            rel="noreferrer"
          >
            OPEN SOLELY / FULL THESIS <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="contact" id="contact">
        <p className="section-label">06 / NEXT</p>
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

      {selected ? (
        <ProjectDialog
          project={selected}
          position={Math.max(1, projects.findIndex((project) => project.id === selected.id) + 1)}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </main>
  );
}
