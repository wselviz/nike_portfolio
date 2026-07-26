"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  MediaAspect,
  PortfolioManifest,
  PortfolioMedia,
  PortfolioProject,
} from "../portfolio-shared";

type StudioProps = {
  user: { displayName: string; email: string };
  signOutPath: string;
};

type ApiPayload = {
  manifest?: PortfolioManifest;
  error?: string;
};

export default function StudioClient({ user, signOutPath }: StudioProps) {
  const [manifest, setManifest] = useState<PortfolioManifest | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("Loading the live portfolio…");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadManifest = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/portfolio?admin=1", {
        cache: "no-store",
      });
      const payload = (await response.json()) as ApiPayload;
      if (!response.ok || !payload.manifest) {
        throw new Error(payload.error ?? "The portfolio could not be loaded.");
      }
      setManifest(payload.manifest);
      setSelectedId((current) =>
        payload.manifest?.projects.some((project) => project.id === current)
          ? current
          : payload.manifest.projects[0]?.id ?? "",
      );
      setDirty(false);
      setMessage("Synced with the live portfolio.");
    } catch (loadError) {
      setError(errorMessage(loadError));
      setMessage("Could not load the portfolio.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadManifest();
  }, [loadManifest]);

  useEffect(() => {
    const warnIfDirty = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnIfDirty);
    return () => window.removeEventListener("beforeunload", warnIfDirty);
  }, [dirty]);

  const selectedProject = useMemo(
    () => manifest?.projects.find((project) => project.id === selectedId) ?? null,
    [manifest, selectedId],
  );

  const updateManifest = (updater: (current: PortfolioManifest) => PortfolioManifest) => {
    setManifest((current) => (current ? updater(current) : current));
    setDirty(true);
    setMessage("Unsaved changes.");
    setError("");
  };

  const updateProject = (
    projectId: string,
    updater: (project: PortfolioProject) => PortfolioProject,
  ) => {
    updateManifest((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId ? updater(project) : project,
      ),
    }));
  };

  const moveProject = (projectId: string, direction: -1 | 1) => {
    updateManifest((current) => ({
      ...current,
      projects: moveItem(current.projects, projectId, direction),
    }));
  };

  const moveMedia = (projectId: string, mediaId: string, direction: -1 | 1) => {
    updateProject(projectId, (project) => ({
      ...project,
      gallery: moveItem(project.gallery, mediaId, direction),
    }));
  };

  const saveManifest = async () => {
    if (!manifest || !dirty || saving || uploading) return;
    setSaving(true);
    setError("");
    setMessage("Publishing portfolio settings…");
    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ manifest }),
      });
      const payload = (await response.json()) as ApiPayload;
      if (!response.ok || !payload.manifest) {
        throw new Error(payload.error ?? "Changes could not be saved.");
      }
      setManifest(payload.manifest);
      setDirty(false);
      setMessage("Published. The portfolio is now using this layout.");
    } catch (saveError) {
      setError(errorMessage(saveError));
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    if (!selectedProject) return;
    const accepted = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    );
    if (!accepted.length) {
      setError("Choose image, GIF, or video files.");
      return;
    }

    setUploading(accepted.length);
    setError("");
    setMessage(`Uploading ${accepted.length} asset${accepted.length === 1 ? "" : "s"}…`);
    const uploaded: PortfolioMedia[] = [];

    for (const file of accepted) {
      try {
        const asset = await uploadAsset(selectedProject.id, file, "gallery");
        uploaded.push(asset);
      } catch (uploadError) {
        setError(errorMessage(uploadError));
        break;
      } finally {
        setUploading((count) => Math.max(0, count - 1));
      }
    }

    if (uploaded.length) {
      updateProject(selectedProject.id, (project) => ({
        ...project,
        gallery: [...project.gallery, ...uploaded],
      }));
      setMessage(
        `${uploaded.length} asset${uploaded.length === 1 ? "" : "s"} uploaded. Save to place ${
          uploaded.length === 1 ? "it" : "them"
        } on the portfolio.`,
      );
    }
  };

  const uploadPoster = async (projectId: string, mediaId: string, file: File) => {
    setUploading((count) => count + 1);
    setError("");
    setMessage("Uploading video poster…");
    try {
      const poster = await uploadAsset(projectId, file, "poster");
      updateProject(projectId, (project) => ({
        ...project,
        gallery: project.gallery.map((item) =>
          item.id === mediaId ? { ...item, poster: poster.src } : item,
        ),
      }));
      setMessage("Poster uploaded. Save to publish it.");
    } catch (uploadError) {
      setError(errorMessage(uploadError));
    } finally {
      setUploading((count) => Math.max(0, count - 1));
    }
  };

  if (loading || !manifest) {
    return (
      <main className="studio-loading">
        <span>WS / PORTFOLIO STUDIO</span>
        <div />
        <p>{error || message}</p>
        {error ? <button onClick={() => void loadManifest()}>TRY AGAIN</button> : null}
      </main>
    );
  }

  const visibleProjects = manifest.projects.filter((project) => project.enabled).length;
  const totalAssets = manifest.projects.reduce(
    (count, project) => count + project.gallery.length,
    0,
  );
  const visibleAssets = manifest.projects.reduce(
    (count, project) => count + project.gallery.filter((item) => item.enabled).length,
    0,
  );

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <a href="/" aria-label="Return to portfolio">W/S<sup>®</sup></a>
          <span>PORTFOLIO STUDIO / OWNER MODE</span>
        </div>
        <div className="studio-actions">
          <span className={`save-state ${dirty ? "is-dirty" : ""}`}>
            {uploading
              ? `UPLOADING ${uploading}`
              : saving
                ? "PUBLISHING"
                : dirty
                  ? "CHANGES READY"
                  : "LIVE / SYNCED"}
          </span>
          <a href="/" target="_blank" rel="noreferrer">PREVIEW ↗</a>
          <button
            type="button"
            className="publish-button"
            disabled={!dirty || saving || uploading > 0}
            onClick={() => void saveManifest()}
          >
            {saving ? "PUBLISHING…" : "SAVE + PUBLISH"}
          </button>
        </div>
      </header>

      <section className="studio-intro">
        <div>
          <p>MEDIA CONTROL SYSTEM / 01</p>
          <h1>CONTROL THE<br /><em>ARCHIVE.</em></h1>
        </div>
        <div className="studio-summary">
          <p>
            Choose what is visible, move projects and media into the right order,
            and drop new files directly from your desktop.
          </p>
          <div>
            <span><b>{visibleProjects}</b> / {manifest.projects.length} PROJECTS LIVE</span>
            <span><b>{visibleAssets}</b> / {totalAssets} ASSETS LIVE</span>
          </div>
        </div>
      </section>

      <div className="studio-status" role="status">
        <span>{error ? "ERROR" : dirty ? "DRAFT" : "STATUS"}</span>
        <p className={error ? "is-error" : ""}>{error || message}</p>
        <small>Signed in as {user.email}</small>
      </div>

      <section className="studio-workspace">
        <aside className="project-panel">
          <div className="panel-heading">
            <span>PROJECT ORDER</span>
            <b>{String(manifest.projects.length).padStart(2, "0")}</b>
          </div>
          <div className="project-stack">
            {manifest.projects.map((project, index) => (
              <article
                className={`project-row ${
                  selectedId === project.id ? "is-selected" : ""
                } ${project.enabled ? "" : "is-hidden"}`}
                key={project.id}
              >
                <button
                  type="button"
                  className="project-select"
                  onClick={() => setSelectedId(project.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>
                    <b>{project.title}</b>
                    <small>{project.year} / {project.gallery.length} ASSETS</small>
                  </span>
                </button>
                <div className="row-controls">
                  <button
                    type="button"
                    aria-label={`Move ${project.title} up`}
                    disabled={index === 0}
                    onClick={() => moveProject(project.id, -1)}
                  >↑</button>
                  <button
                    type="button"
                    aria-label={`Move ${project.title} down`}
                    disabled={index === manifest.projects.length - 1}
                    onClick={() => moveProject(project.id, 1)}
                  >↓</button>
                  <VisibilityButton
                    enabled={project.enabled}
                    label={project.title}
                    onToggle={() =>
                      updateProject(project.id, (current) => ({
                        ...current,
                        enabled: !current.enabled,
                      }))
                    }
                  />
                </div>
              </article>
            ))}
          </div>
          <footer>
            <span>{user.displayName}</span>
            <a href={signOutPath}>SIGN OUT</a>
          </footer>
        </aside>

        <section className="media-panel">
          {selectedProject ? (
            <>
              <div className="media-heading">
                <div>
                  <p>{selectedProject.year} / {selectedProject.region}</p>
                  <h2>{selectedProject.title}</h2>
                  <span>{selectedProject.discipline}</span>
                </div>
                <VisibilityButton
                  enabled={selectedProject.enabled}
                  label={`${selectedProject.title} project`}
                  onToggle={() =>
                    updateProject(selectedProject.id, (current) => ({
                      ...current,
                      enabled: !current.enabled,
                    }))
                  }
                />
              </div>

              <button
                type="button"
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.currentTarget.classList.add("is-dragging");
                }}
                onDragLeave={(event) => event.currentTarget.classList.remove("is-dragging")}
                onDrop={(event) => {
                  event.preventDefault();
                  event.currentTarget.classList.remove("is-dragging");
                  void uploadFiles(event.dataTransfer.files);
                }}
              >
                <span>＋</span>
                <strong>DROP MEDIA FROM YOUR DESKTOP</strong>
                <small>Images, GIFs, MP4, WebM, MOV — up to 500 MB each</small>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={(event) => {
                  if (event.target.files) void uploadFiles(event.target.files);
                  event.target.value = "";
                }}
              />

              <div className="media-toolbar">
                <span>CAMPAIGN MEDIA</span>
                <b>
                  {selectedProject.gallery.filter((item) => item.enabled).length} LIVE /{" "}
                  {selectedProject.gallery.length} TOTAL
                </b>
              </div>

              <div className="media-grid">
                {selectedProject.gallery.map((item, index) => (
                  <MediaEditor
                    key={item.id}
                    project={selectedProject}
                    item={item}
                    index={index}
                    count={selectedProject.gallery.length}
                    onChange={(next) =>
                      updateProject(selectedProject.id, (project) => ({
                        ...project,
                        gallery: project.gallery.map((media) =>
                          media.id === item.id ? next : media,
                        ),
                      }))
                    }
                    onMove={(direction) =>
                      moveMedia(selectedProject.id, item.id, direction)
                    }
                    onSetCover={() =>
                      updateProject(selectedProject.id, (project) => ({
                        ...project,
                        media: item.src,
                        poster: item.poster,
                        coverType: item.type,
                      }))
                    }
                    onPoster={(file) =>
                      void uploadPoster(selectedProject.id, item.id, file)
                    }
                  />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function MediaEditor({
  project,
  item,
  index,
  count,
  onChange,
  onMove,
  onSetCover,
  onPoster,
}: {
  project: PortfolioProject;
  item: PortfolioMedia;
  index: number;
  count: number;
  onChange: (item: PortfolioMedia) => void;
  onMove: (direction: -1 | 1) => void;
  onSetCover: () => void;
  onPoster: (file: File) => void;
}) {
  const posterInput = useRef<HTMLInputElement>(null);
  const isCover = project.media === item.src;

  return (
    <article className={`media-card ${item.enabled ? "" : "is-hidden"}`}>
      <div className={`media-preview is-${item.aspect}`}>
        {item.type === "video" ? (
          <video
            src={item.src}
            poster={item.poster}
            muted
            playsInline
            controls
            preload="metadata"
          />
        ) : (
          <img src={item.src} alt="" loading="lazy" />
        )}
        <span>{String(index + 1).padStart(2, "0")}</span>
        {isCover ? <b>PROJECT COVER</b> : null}
      </div>
      <div className="media-editor">
        <label>
          <span>LABEL</span>
          <input
            value={item.label}
            maxLength={100}
            onChange={(event) => onChange({ ...item, label: event.target.value })}
          />
        </label>
        <div className="editor-row">
          <label>
            <span>FORMAT</span>
            <select
              value={item.aspect}
              onChange={(event) =>
                onChange({ ...item, aspect: event.target.value as MediaAspect })
              }
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
          </label>
          <VisibilityButton
            enabled={item.enabled}
            label={item.label}
            onToggle={() => onChange({ ...item, enabled: !item.enabled })}
          />
        </div>
        <div className="asset-actions">
          <button type="button" disabled={index === 0} onClick={() => onMove(-1)}>
            ↑ EARLIER
          </button>
          <button type="button" disabled={index === count - 1} onClick={() => onMove(1)}>
            ↓ LATER
          </button>
          <button type="button" className={isCover ? "is-cover" : ""} onClick={onSetCover}>
            {isCover ? "COVER ✓" : "SET COVER"}
          </button>
          {item.type === "video" ? (
            <>
              <button type="button" onClick={() => posterInput.current?.click()}>
                {item.poster ? "CHANGE POSTER" : "ADD POSTER"}
              </button>
              <input
                ref={posterInput}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) onPoster(file);
                  event.target.value = "";
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function VisibilityButton({
  enabled,
  label,
  onToggle,
}: {
  enabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`visibility-toggle ${enabled ? "is-live" : ""}`}
      aria-pressed={enabled}
      aria-label={`${enabled ? "Hide" : "Show"} ${label}`}
      onClick={onToggle}
    >
      <i />
      <span>{enabled ? "LIVE" : "HIDDEN"}</span>
    </button>
  );
}

async function uploadAsset(
  projectId: string,
  file: File,
  role: "gallery" | "poster",
): Promise<PortfolioMedia> {
  if (file.size > 500 * 1024 * 1024) {
    throw new Error(`${file.name} is larger than 500 MB.`);
  }
  const response = await fetch("/api/portfolio/upload", {
    method: "POST",
    headers: {
      "content-type": file.type || "application/octet-stream",
      "x-project-id": projectId,
      "x-file-name": encodeURIComponent(file.name),
      "x-media-role": role,
    },
    body: file,
  });
  const payload = (await response.json()) as {
    asset?: PortfolioMedia;
    error?: string;
  };
  if (!response.ok || !payload.asset) {
    throw new Error(payload.error ?? `${file.name} could not be uploaded.`);
  }
  return payload.asset;
}

function moveItem<T extends { id: string }>(
  items: T[],
  id: string,
  direction: -1 | 1,
) {
  const from = items.findIndex((item) => item.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}
