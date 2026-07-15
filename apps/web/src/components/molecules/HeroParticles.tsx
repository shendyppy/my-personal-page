"use client";

import { useEffect, useRef } from "react";

/**
 * Pointer-reactive particle icosahedron that sits behind the hero headline.
 * Ported from the "Portfolio Reimagined" design: a displaced point cloud plus a
 * faint wireframe core, tinted with the live brand `--accent`. Three.js is
 * dynamically imported so it never ships in the hero's first-paint bundle, and
 * the whole thing degrades to nothing (the static radial glow stays) on failure
 * or reduced-motion.
 */
export const HeroParticles = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    const readAccent = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#D7FF3E";

    (async () => {
      try {
        const THREE = await import("three");
        const host = hostRef.current;
        if (!host || disposed) return;

        let w = host.clientWidth || window.innerWidth;
        let h = host.clientHeight || window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
        cam.position.z = 7.5;

        const geo = new THREE.IcosahedronGeometry(2.7, 22);
        const base = geo.attributes.position.array.slice();
        const mat = new THREE.PointsMaterial({
          color: new THREE.Color(readAccent()),
          size: 0.02,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });
        const pts = new THREE.Points(geo, mat);
        const wire = new THREE.Mesh(
          new THREE.IcosahedronGeometry(1.7, 1),
          new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0x2a2a2e,
            transparent: true,
            opacity: 0.7,
          })
        );
        const group = new THREE.Group();
        group.add(pts);
        group.add(wire);
        scene.add(group);

        let tx = 0;
        let ty = 0;
        const onPointer = (e: PointerEvent) => {
          tx = (e.clientX / window.innerWidth - 0.5) * 0.9;
          ty = (e.clientY / window.innerHeight - 0.5) * 0.7;
        };
        window.addEventListener("pointermove", onPointer, { passive: true });

        // Lerp the particle colour toward `targetColor` each frame so accent /
        // theme changes crossfade smoothly in-step with the CSS --accent
        // transition, instead of snapping. `theme-change` matters because
        // light/dark carry different accent values.
        const targetColor = new THREE.Color(readAccent());
        // Read the DESTINATION colour from the event detail (ThemeProvider
        // dispatches the resolved hex) — never `getComputedStyle(--accent)`,
        // which returns a mid-transition value because `--accent` is animated.
        const onAccent = (e: Event) => {
          const color = (e as CustomEvent<{ color?: string }>).detail?.color;
          if (color) targetColor.set(color);
        };
        window.addEventListener("accent-change", onAccent);
        window.addEventListener("theme-change", onAccent);

        const ro = new ResizeObserver(() => {
          w = host.clientWidth;
          h = host.clientHeight;
          if (w && h) {
            renderer.setSize(w, h);
            cam.aspect = w / h;
            cam.updateProjectionMatrix();
          }
        });
        ro.observe(host);

        const pos = geo.attributes.position;
        const clock = new THREE.Clock();
        const loop = () => {
          const t = clock.getElapsedTime();
          for (let i = 0; i < pos.count; i++) {
            const ix = i * 3;
            const bx = base[ix];
            const by = base[ix + 1];
            const bz = base[ix + 2];
            const d =
              1 +
              0.06 *
                Math.sin(bx * 2.1 + t * 0.9) *
                Math.sin(by * 2.3 + t * 0.7) *
                Math.sin(bz * 1.9 + t * 1.1);
            pos.array[ix] = bx * d;
            pos.array[ix + 1] = by * d;
            pos.array[ix + 2] = bz * d;
          }
          pos.needsUpdate = true;
          group.rotation.y += (tx * 1.4 - group.rotation.y) * 0.04 + 0.0012;
          group.rotation.x += (ty * 1.0 - group.rotation.x) * 0.04;
          wire.rotation.y -= 0.003;
          mat.color.lerp(targetColor, 0.08);
          renderer.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        loop();

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onPointer);
          window.removeEventListener("accent-change", onAccent);
          window.removeEventListener("theme-change", onAccent);
          ro.disconnect();
          renderer.dispose();
          geo.dispose();
          mat.dispose();
          if (renderer.domElement.parentNode === host)
            host.removeChild(renderer.domElement);
        };
      } catch {
        /* silent — static radial glow remains */
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0 z-0" />;
};
