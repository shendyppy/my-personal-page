"use client";

import { useEffect, useRef } from "react";

/**
 * Drag-to-spin icosahedron with soft vertex wobble and inertia — the "things
 * that move" toy. Ported from the design's playground scene. Three.js is
 * dynamically imported so it stays out of the first-paint bundle; a static
 * accent glow (rendered by the parent) shows through on failure / reduced
 * motion.
 */
export const PlaygroundIsland = () => {
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
        const wrap = host.parentElement as HTMLElement | null;
        if (!wrap) return;

        const fallback = wrap.querySelector<HTMLElement>("[data-play-fallback]");
        if (fallback) fallback.style.opacity = "0";

        let w = host.clientWidth || 1;
        let h = host.clientHeight || 1;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        cam.position.z = 5.4;

        const geo = new THREE.IcosahedronGeometry(1.85, 24);
        const base = geo.attributes.position.array.slice();
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(readAccent()),
          metalness: 0.35,
          roughness: 0.28,
          flatShading: true,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const wire = new THREE.Mesh(
          new THREE.IcosahedronGeometry(2.05, 3),
          new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff,
            transparent: true,
            opacity: 0.06,
          })
        );
        const group = new THREE.Group();
        group.add(mesh);
        group.add(wire);
        scene.add(group);
        scene.add(new THREE.AmbientLight(0xffffff, 0.55));
        const l1 = new THREE.PointLight(0xffffff, 120);
        l1.position.set(4, 5, 5);
        scene.add(l1);
        const l2 = new THREE.PointLight(new THREE.Color(readAccent()), 90);
        l2.position.set(-5, -3, 2);
        scene.add(l2);

        // Lerp toward the destination colour (carried in the event detail) so
        // accent / theme changes crossfade instead of snapping, and so we never
        // read a mid-transition `--accent` (which returns a stale value). The
        // hero particle ball uses the same pattern.
        const targetColor = new THREE.Color(readAccent());
        const onAccent = (e: Event) => {
          const color = (e as CustomEvent<{ color?: string }>).detail?.color;
          if (color) targetColor.set(color);
        };
        window.addEventListener("accent-change", onAccent);
        window.addEventListener("theme-change", onAccent);

        let dragging = false;
        let lx = 0;
        let ly = 0;
        let vx = 0;
        let vy = 0;
        let rx = 0;
        let ry = 0;
        const down = (e: PointerEvent) => {
          dragging = true;
          lx = e.clientX;
          ly = e.clientY;
          wrap.style.cursor = "grabbing";
        };
        const move = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - lx;
          const dy = e.clientY - ly;
          lx = e.clientX;
          ly = e.clientY;
          vy = dx * 0.006;
          vx = dy * 0.006;
          ry += vy;
          rx += vx;
        };
        const up = () => {
          dragging = false;
          wrap.style.cursor = "grab";
        };
        wrap.addEventListener("pointerdown", down);
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);

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
              0.1 * Math.sin(bx * 1.6 + t * 0.8) * Math.cos(by * 1.8 + t * 0.6) +
              0.05 * Math.sin(bz * 2.2 + t * 1.0);
            pos.array[ix] = bx * d;
            pos.array[ix + 1] = by * d;
            pos.array[ix + 2] = bz * d;
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
          if (!dragging) {
            ry += 0.0035;
            vx *= 0.94;
            vy *= 0.94;
            rx += vx;
            ry += vy;
          }
          group.rotation.y = ry;
          group.rotation.x = rx;
          wire.rotation.y = -ry * 0.5;
          mat.color.lerp(targetColor, 0.08);
          l2.color.lerp(targetColor, 0.08);
          renderer.render(scene, cam);
          raf = requestAnimationFrame(loop);
        };
        loop();

        cleanup = () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("accent-change", onAccent);
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          wrap.removeEventListener("pointerdown", down);
          ro.disconnect();
          renderer.dispose();
          geo.dispose();
          mat.dispose();
          if (renderer.domElement.parentNode === host)
            host.removeChild(renderer.domElement);
        };
      } catch {
        /* fallback glow stays */
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
};
