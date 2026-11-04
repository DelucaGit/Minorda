"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { HangingGarment } from "@/app/lib/catalog";

// Three motions, stacked:
// 1. The rack slides sideways, like walking along a rail.
// 2. The piece nearest the middle turns to face you. The others stay angled.
// 3. A fast slide swings every piece from its hook, then the spring settles.

const MAX_FACE_DEGREES = 52;
const MAX_SWING_DEGREES = 14;
const COAST_FRICTION = 0.965;
const SNAP_PULL = 0.14;
const SNAP_DAMPING = 0.72;
const SWING_FROM_SPEED = 0.09;
const SWING_SPRING = 0.18;
const SWING_DAMPING = 0.74;

type Layout = {
  items: HTMLElement[];
  hangers: HTMLElement[];
  width: number;
  stride: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function HangerIcon() {
  return (
    <svg className="rail-hanger-icon" viewBox="0 0 200 58" aria-hidden="true">
      <path
        d="M108 14c0-8-14-10-14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M108 14c6 0 10 4 10 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M118 22v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M16 48 L100 26 L184 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M14 48h172"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ClothingRail({ garments }: { garments: HangingGarment[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const priceRef = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const goToRef = useRef<(index: number) => void>(() => {});
  const dragDistanceRef = useRef(0);
  const frontIndexRef = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || garments.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const items = [...track.querySelectorAll<HTMLElement>("[data-item]")];
    const hangers = items.map(
      (item) => item.querySelector<HTMLElement>("[data-hanger]")!,
    );

    function readLayout(): Layout {
      const width = items[0]?.offsetWidth ?? 200;
      const stride =
        items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : width;
      return { items, hangers, width, stride };
    }

    let layout = readLayout();

    function offsetFor(index: number) {
      const viewWidth = viewport!.clientWidth;
      const item = layout.items[index];
      if (!item) return 0;
      const itemCenter = item.offsetLeft + layout.width / 2;
      return viewWidth / 2 - itemCenter;
    }

    function nearestIndex(offset: number) {
      const viewCenter = viewport!.clientWidth / 2;
      let best = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (let index = 0; index < layout.items.length; index += 1) {
        const center =
          offset + layout.items[index].offsetLeft + layout.width / 2;
        const distance = Math.abs(center - viewCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
      return best;
    }

    let offset = offsetFor(Math.min(2, garments.length - 1));
    let velocity = 0;
    let aim: number | null = Math.min(2, garments.length - 1);
    let dragging = false;
    let lastPointerX = 0;
    let lastPointerTime = 0;
    let announcedIndex = -1;
    const swing = new Array(garments.length).fill(0);
    const swingVelocity = new Array(garments.length).fill(0);
    let frame = 0;

    function showFront(index: number) {
      frontIndexRef.current = index;
      layout.items.forEach((item, itemIndex) => {
        item.classList.toggle("is-front", itemIndex === index);
      });
      if (announcedIndex === index) return;
      announcedIndex = index;
      const garment = garments[index];
      if (!garment) return;
      if (titleRef.current) titleRef.current.textContent = garment.title;
      if (priceRef.current) priceRef.current.textContent = garment.price;
      if (countRef.current) {
        countRef.current.textContent = `${index + 1} / ${garments.length}`;
      }
      if (liveRef.current) {
        liveRef.current.textContent = `${garment.title}, ${garment.price}`;
      }
    }

    function paint(currentOffset: number) {
      track!.style.transform = `translate3d(${currentOffset}px, 0, 0)`;
      const viewCenter = viewport!.clientWidth / 2;

      layout.hangers.forEach((hanger, index) => {
        const center =
          currentOffset + layout.items[index].offsetLeft + layout.width / 2;
        const delta = center - viewCenter;
        const facing = reducedMotion
          ? 0
          : clamp(
              (-delta / Math.max(layout.stride, 1)) * 42,
              -MAX_FACE_DEGREES,
              MAX_FACE_DEGREES,
            );
        const closeness =
          1 - Math.min(1, Math.abs(delta) / (viewport!.clientWidth * 0.62));
        const scale = 0.9 + closeness * 0.12;
        const swingDegrees = reducedMotion ? 0 : swing[index];
        hanger.style.transform = `rotateZ(${swingDegrees}deg) rotateY(${facing}deg) scale(${scale})`;
        layout.items[index].style.zIndex = String(Math.round(closeness * 30));
      });

      showFront(nearestIndex(currentOffset));
    }

    function stepSprings() {
      for (let index = 0; index < swing.length; index += 1) {
        swingVelocity[index] += -velocity * SWING_FROM_SPEED;
        swingVelocity[index] += -swing[index] * SWING_SPRING;
        swingVelocity[index] *= SWING_DAMPING;
        swing[index] = clamp(
          swing[index] + swingVelocity[index],
          -MAX_SWING_DEGREES,
          MAX_SWING_DEGREES,
        );
      }
    }

    function tick() {
      const maxOffset = offsetFor(0);
      const minOffset = offsetFor(garments.length - 1);

      if (!dragging) {
        if (aim === null && Math.abs(velocity) < 0.55) {
          aim = nearestIndex(offset);
        }

        if (aim !== null) {
          const target = offsetFor(aim);
          velocity += (target - offset) * SNAP_PULL;
          velocity *= SNAP_DAMPING;
          if (Math.abs(target - offset) < 0.35 && Math.abs(velocity) < 0.35) {
            offset = target;
            velocity = 0;
            aim = null;
          }
        } else {
          velocity *= COAST_FRICTION;
          if (offset > maxOffset) velocity += (maxOffset - offset) * 0.12;
          if (offset < minOffset) velocity += (minOffset - offset) * 0.12;
        }

        offset += velocity;
      }

      if (!reducedMotion) stepSprings();
      paint(offset);
      viewport!.classList.add("is-ready");
      frame = window.requestAnimationFrame(tick);
    }

    function goTo(index: number) {
      aim = clamp(index, 0, garments.length - 1);
      velocity *= 0.4;
    }

    goToRef.current = goTo;

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      dragging = true;
      aim = null;
      lastPointerX = event.clientX;
      lastPointerTime = performance.now();
      dragDistanceRef.current = 0;
      velocity = 0;
      viewport!.setPointerCapture(event.pointerId);
      viewport!.classList.add("is-grabbing");
    }

    function onPointerMove(event: PointerEvent) {
      if (!dragging) return;
      const now = performance.now();
      const dx = event.clientX - lastPointerX;
      const dt = Math.max(8, now - lastPointerTime);
      lastPointerX = event.clientX;
      lastPointerTime = now;
      dragDistanceRef.current += Math.abs(dx);
      offset += dx;
      velocity = (dx / dt) * 16;
    }

    function onPointerUp(event: PointerEvent) {
      if (!dragging) return;
      dragging = false;
      viewport!.classList.remove("is-grabbing");

      // Pointer capture retargets the event to the rack, so the button's
      // click often never fires. A short press still means "bring this piece forward".
      if (dragDistanceRef.current > 12) return;
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const item = hit?.closest<HTMLElement>("[data-item]");
      if (!item) return;
      const index = layout.items.indexOf(item);
      if (index >= 0) {
        aim = index;
        velocity *= 0.2;
      }
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      aim = null;
      offset -= delta;
      velocity = -delta * 0.18;
    }

    function onResize() {
      layout = readLayout();
    }

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      goToRef.current = () => {};
    };
  }, [garments]);

  const startingIndex = Math.min(2, garments.length - 1);
  const starting = garments[startingIndex];

  return (
    <section className="rail-section" aria-labelledby="rail-heading">
      <div className="rail-stage">
        <div className="rail-rod" aria-hidden="true">
          <span className="rail-bracket rail-bracket-left" />
          <span className="rail-rod-bar" />
          <span className="rail-bracket rail-bracket-right" />
        </div>

        <div
          ref={viewportRef}
          className="rail-viewport"
          aria-describedby="rail-help"
        >
          <div ref={trackRef} className="rail-track">
            {garments.map((garment, index) => (
              <button
                key={garment.id}
                type="button"
                data-item
                className={
                  index === startingIndex ? "rail-item is-front" : "rail-item"
                }
                aria-label={`${garment.title}, ${garment.price}`}
                onClick={() => {
                  if (dragDistanceRef.current > 8) return;
                  goToRef.current(index);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    goToRef.current(Math.min(garments.length - 1, index + 1));
                  }
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    goToRef.current(Math.max(0, index - 1));
                  }
                }}
              >
                <span data-hanger className="rail-hanger">
                  <HangerIcon />
                  <span className="rail-card">
                    <Image
                      src={garment.imageUrl}
                      alt={garment.imageAlt}
                      width={garment.imageWidth}
                      height={garment.imageHeight}
                      sizes="240px"
                      priority={index < 4}
                      draggable={false}
                      className="rail-photo"
                    />
                    <span className="rail-tag">{garment.price}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rail-controls">
        <button
          type="button"
          className="rail-step"
          onClick={() => goToRef.current(frontIndexRef.current - 1)}
        >
          Previous
        </button>
        <p ref={countRef} className="rail-count">
          {startingIndex + 1} / {garments.length}
        </p>
        <button
          type="button"
          className="rail-step"
          onClick={() => goToRef.current(frontIndexRef.current + 1)}
        >
          Next
        </button>
      </div>

      <div className="rail-detail">
        <p className="rail-kicker">In front of you</p>
        <h2 ref={titleRef} id="rail-heading" className="rail-title">
          {starting?.title}
        </h2>
        <p ref={priceRef} className="rail-detail-price">
          {starting?.price}
        </p>
        <p id="rail-help" className="rail-help">
          Drag the rack, or scroll while the pointer is over it. The piece in
          the middle turns toward you. Arrow keys work when a piece is
          focused.
        </p>
      </div>
      <p ref={liveRef} className="sr-only" aria-live="polite" />
    </section>
  );
}
