"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import * as THREE from "three";
import { useIsCoarsePointer } from "@/hooks/use-is-coarse-pointer";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * A photograph with a WebGL hover layer.
 *
 * The `next/image` underneath is always the real, indexable, LCP-eligible image.
 * The canvas is an enhancement that mounts lazily on first hover and fades in on
 * top; if WebGL is unavailable, the pointer is coarse, or the viewer has asked
 * for reduced motion, nothing extra is created and the plain photograph stands.
 *
 * The distortion is deliberately small — a slow ripple trailing the cursor plus a
 * sub-pixel channel split. Photography first.
 */
type DistortionImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  /** 0 = off. Around 1 is the house setting; 1.6 is the loudest used (editorial). */
  intensity?: number;
  quality?: number;
  /** CSS object-position, mirrored into the shader so the canvas crops identically. */
  objectPosition?: string;
};

const KEYWORDS: Record<string, number> = {
  left: 0,
  top: 0,
  center: 0.5,
  right: 1,
  bottom: 1,
};

/** Parses the subset of object-position used here: keywords and percentages. */
function parseObjectPosition(value: string): { x: number; y: number } {
  const parts = value.trim().toLowerCase().split(/\s+/);
  const read = (token: string | undefined, fallback: number) => {
    if (!token) return fallback;
    if (token in KEYWORDS) return KEYWORDS[token];
    const pct = Number.parseFloat(token);
    return Number.isFinite(pct) ? pct / 100 : fallback;
  };
  return { x: read(parts[0], 0.5), y: read(parts[1], 0.5) };
}

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform vec2 uFocus;
  uniform float uHover;
  uniform float uTime;
  uniform float uIntensity;

  varying vec2 vUv;

  // Replicates CSS object-fit: cover + object-position for the texture inside
  // the plane, so the canvas crops exactly like the <img> beneath it.
  // uFocus is already flipped to the texture's bottom-up Y.
  vec2 coverUv(vec2 uv) {
    float planeRatio = uPlane.x / uPlane.y;
    float imageRatio = uImage.x / uImage.y;
    vec2 scale = planeRatio > imageRatio
      ? vec2(1.0, planeRatio / imageRatio)
      : vec2(imageRatio / planeRatio, 1.0);
    return uv / scale + uFocus * (scale - 1.0) / scale;
  }

  void main() {
    vec2 uv = coverUv(vUv);

    vec2 toMouse = vUv - uMouse;
    // Correct for aspect so the ripple stays circular on wide crops.
    toMouse.x *= uPlane.x / uPlane.y;
    float dist = length(toMouse);

    float falloff = exp(-dist * 5.5);
    float ripple = sin(dist * 20.0 - uTime * 2.0) * falloff;
    vec2 dir = dist > 0.0001 ? normalize(toMouse) : vec2(0.0);

    float amount = ripple * 0.014 * uHover * uIntensity;
    vec2 offset = dir * amount;

    // Barely-there channel split, strongest at the cursor.
    float split = 0.0022 * uHover * uIntensity * falloff;

    float r = texture2D(uTexture, uv + offset + dir * split).r;
    float g = texture2D(uTexture, uv + offset).g;
    float b = texture2D(uTexture, uv + offset - dir * split).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

/**
 * The texture URL. Prefer the exact URL the sibling <img> already resolved from
 * its srcset — it is guaranteed to be a width/quality the image optimizer
 * accepts, and it is already in the browser cache, so the canvas costs nothing
 * extra. Falls back to the raw file if the <img> hasn't picked a candidate yet.
 */
function textureSrc(wrap: HTMLElement, src: string) {
  const img = wrap.querySelector("img");
  return img?.currentSrc || img?.src || src;
}

export function DistortionImage({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority,
  intensity = 1,
  quality = 80,
  objectPosition = "center",
}: DistortionImageProps) {
  const isCoarse = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const enabled = !isCoarse && !reducedMotion && intensity > 0;
  const focus = useMemo(() => parseObjectPosition(objectPosition), [objectPosition]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
    material: THREE.ShaderMaterial;
    geometry: THREE.PlaneGeometry;
    texture: THREE.Texture;
    frame: number;
    observer: ResizeObserver;
  } | null>(null);

  const target = useRef({ hover: 0, mx: 0.5, my: 0.5 });
  const failed = useRef(false);

  const teardown = useCallback(() => {
    const c = ctx.current;
    if (!c) return;
    cancelAnimationFrame(c.frame);
    c.observer.disconnect();
    c.geometry.dispose();
    c.material.dispose();
    c.texture.dispose();
    c.renderer.dispose();
    ctx.current = null;
  }, []);

  useEffect(() => teardown, [teardown]);

  const init = useCallback(() => {
    if (ctx.current || failed.current || !enabled) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      failed.current = true;
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const rect = wrap.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: false,
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uPlane: { value: new THREE.Vector2(rect.width, rect.height) },
        uImage: { value: new THREE.Vector2(1, 1) },
        // CSS Y runs top-down, the texture bottom-up.
        uFocus: { value: new THREE.Vector2(focus.x, 1 - focus.y) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uIntensity: { value: intensity },
      },
    });

    scene.add(new THREE.Mesh(geometry, material));

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const texture = loader.load(
      textureSrc(wrap, src),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        material.uniforms.uImage.value.set(tex.image.width, tex.image.height);
        material.uniforms.uTexture.value = tex;
        canvas.style.opacity = "1";
      },
      undefined,
      () => {
        failed.current = true;
        teardown();
      }
    );

    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      material.uniforms.uPlane.value.set(w, h);
    });
    observer.observe(wrap);

    const clock = new THREE.Clock();
    let current = { hover: 0, mx: 0.5, my: 0.5 };

    const tick = () => {
      const c = ctx.current;
      if (!c) return;
      const t = target.current;
      // Slow easing: the ripple should trail the cursor, never snap to it.
      current = {
        hover: current.hover + (t.hover - current.hover) * 0.045,
        mx: current.mx + (t.mx - current.mx) * 0.06,
        my: current.my + (t.my - current.my) * 0.06,
      };
      material.uniforms.uHover.value = current.hover;
      material.uniforms.uMouse.value.set(current.mx, current.my);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);

      if (current.hover < 0.002 && t.hover === 0) {
        canvas.style.opacity = "0";
        c.frame = 0;
        return;
      }
      c.frame = requestAnimationFrame(tick);
    };

    ctx.current = { renderer, scene, camera, material, geometry, texture, frame: 0, observer };
    ctx.current.frame = requestAnimationFrame(tick);

    const resume = () => {
      const c = ctx.current;
      if (c && c.frame === 0) {
        canvas.style.opacity = material.uniforms.uTexture.value ? "1" : "0";
        c.frame = requestAnimationFrame(tick);
      }
    };
    wrap.dataset.resume = "1";
    (wrap as HTMLDivElement & { __resume?: () => void }).__resume = resume;
  }, [enabled, focus.x, focus.y, intensity, src, teardown]);

  const onEnter = (e: React.PointerEvent) => {
    if (!enabled || e.pointerType !== "mouse") return;
    init();
    (wrapRef.current as (HTMLDivElement & { __resume?: () => void }) | null)?.__resume?.();
    target.current.hover = 1;
  };

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ctx.current) return;
    const rect = wrapRef.current!.getBoundingClientRect();
    target.current.mx = (e.clientX - rect.left) / rect.width;
    target.current.my = 1 - (e.clientY - rect.top) / rect.height;
  };

  const onLeave = () => {
    target.current.hover = 0;
  };

  return (
    <div
      ref={wrapRef}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn("object-cover", imageClassName)}
        style={{ objectPosition }}
      />
      {enabled && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500"
        />
      )}
    </div>
  );
}
