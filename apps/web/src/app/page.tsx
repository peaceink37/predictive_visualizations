"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Code, Group, Text } from "@mantine/core";
import { Navigation } from "../components/navigation";

type PingState =
  | { status: "idle" | "loading"; data: null; error: null }
  | { status: "success"; data: unknown; error: null }
  | { status: "error"; data: null; error: string };

function usePing(url: string) {
  const [state, setState] = useState<PingState>({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setState({ status: "loading", data: null, error: null });

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Ping failed: ${res.status} ${res.statusText}`);
        }

        const json = (await res.json()) as unknown;
        if (!cancelled) setState({ status: "success", data: json, error: null });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (!cancelled) setState({ status: "error", data: null, error: msg });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

function useFitCanvasToParent(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const cssW = Math.max(0, Math.floor(rect.width));
      const cssH = Math.max(0, Math.floor(rect.height));

      // CSS size
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      // Backing size
      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));

      // Placeholder “alive” draw (remove once your renderer lands)
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.font = "16px system-ui, -apple-system, Segoe UI, Roboto";
      ctx.fillText("Canvas ready (placeholder)", 16, 28);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      ro.disconnect();
    };
  }, [canvasRef]);
}

export default function HomePage() {
  const pingUrl = useMemo(() => "http://localhost:8001/v1/ping", []);
  const ping = usePing(pingUrl);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useFitCanvasToParent(canvasRef);

  return (
    <Box
      style={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Your responsive nav (top on small, side on large, per your component) */}
      <Navigation />

      {/* Main content: canvas fills remaining space */}
      <Box style={{ flex: 1, minHeight: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      </Box>

      {/* Footer: 2rem tall, full width */}
      <Box
        style={{
          height: "2rem",
          width: "100%",
          borderTop: "1px solid var(--mantine-color-gray-3)",
          display: "flex",
          alignItems: "center",
        }}
        px="md"
      >
        <Group gap="sm" wrap="nowrap" style={{ width: "100%" }}>
          <Text size="sm" c="dimmed">
            ping:
          </Text>

          <Box style={{ flex: 1, overflow: "hidden" }}>
            {ping.status === "error" ? (
              <Text size="sm" c="red" truncate>
                {ping.error}
              </Text>
            ) : (
              <Code
                style={{
                  background: "transparent",
                  padding: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
              >
                {ping.status === "loading"
                  ? "loading..."
                  : JSON.stringify(ping.data)}
              </Code>
            )}
          </Box>
        </Group>
      </Box>
    </Box>
  );
}
