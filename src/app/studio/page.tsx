"use client";

import type { ReactNode, RefObject } from "react";

import {
  ContactShadows,
  OrbitControls,
  Environment,
  Float,
} from "@react-three/drei";
import { useEffect, useState, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as fabric from "fabric";
import Image from "next/image";

import { CaseStacker } from "./_components/CaseStacker";

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const c = new fabric.Canvas("canvas", {
      height: containerRef?.current?.clientHeight,
      width: containerRef?.current?.clientWidth,
    });

    // settings for all canvas in the app
    fabric.FabricObject.prototype.transparentCorners = false;
    fabric.FabricObject.prototype.cornerColor = "#2BEBC8";
    fabric.FabricObject.prototype.cornerStyle = "rect";
    fabric.FabricObject.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.FabricObject.prototype.cornerSize = 6;

    setCanvas(c);

    return () => {
      c.dispose();
    };
  }, []);

  const addRect = (canvas?: fabric.Canvas) => {
    const rect = new fabric.Rect({
      stroke: "#2BEBC8",
      height: 503,
      width: 143,
    });
    canvas?.add(rect);
    canvas?.requestRenderAll();
  };

  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-row">
        <div className="h-[1024] w-[1024]">
          <Canvas camera={{ position: [3, 3, 3], fov: 30 }} shadows>
            <color attach="background" args={["#ececec"]} />
            <OrbitControls />
            <Float>
              <CaseStacker canvasRef={canvasRef} />
            </Float>
            <Environment preset="sunset" background blur={4} />
            <ContactShadows position-y={-0.5} opacity={0.4} blur={2} />
          </Canvas>
        </div>
        <div className="h-[1024] w-[1024] bg-lime-100">
          <div className="relative h-full w-full" ref={containerRef}>
            <canvas ref={canvasRef} id="canvas" />
            <div>
              <button onClick={() => addRect(canvas)}>Square</button>
            </div>
            <div className="pointer-events-none inset-0 z-40 ">
              <Image
                src={`/models/svg/UV_In_Body.svg`}
                style={{ objectFit: "contain" }}
                alt={`Overlay`}
                className=""
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
