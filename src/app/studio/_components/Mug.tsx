import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { button, useControls } from "leva";
import { useEffect, useState, useRef, useMemo } from "react";
import { CanvasTexture } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  canvasRef: any;
}

export function Mug(props: Props) {
  const [t, setT] = useState("/assets/images/image1.png");

  const { nodes, materials } = useGLTF("/models/mug.glb");

  const texture = useMemo(() => {
    return new CanvasTexture(props.canvasRef.current);
  }, []);

  const materialRef = useRef(null);
  const meshRef = useRef(null);
  const [pos, setPos] = useState([0, 1.8, 1]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [scale, setScale] = useState([1.5, 1.5, 1.5]);

  useFrame(() => {
    texture.offset.x = 0;
    texture.needsUpdate = true;
  });

  useControls({
    button: button(
      () => {
        {
          console.log(texture);
          texture.needsUpdate = true;
        }
      },
      { disabled: false }
    ),
    angle: {
      min: degToRad(60),
      max: degToRad(300),
      value: Math.PI / 4,
      step: 0.01,
      onChange: (value) => {
        const x = Math.cos(value);
        const z = Math.sin(value);
        const rot = Math.atan2(x, z);
        setRotation(() => [0, rot, 0]);
        setPos((pos) => [x, pos[1], z]);
      },
    },
    posY: {
      min: 0,
      max: 3,
      value: 1.8,
      step: 0.01,
      onChange: (value) => {
        setPos((pos) => [pos[0], value, pos[2]]);
      },
    },
    scale: {
      min: 0.5,
      max: 3,
      value: 1.5,
      step: 0.01,
      onChange: (value) => {
        setScale(() => [value, value, 1.5]);
      },
    },
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Arc001_1.geometry}
        material={materials["01___Default-2"]}
      />
      <mesh
        geometry={nodes.Arc001_1_1.geometry}
        material={materials["02___Default-2"]}
      />
      <mesh
        geometry={nodes.Arc001_1_2.geometry}
        material={materials["02___Default"]}
      />
      <mesh
        geometry={nodes.Arc001_1_3.geometry}
        material={materials["01___Default"]}
      />
      <mesh geometry={nodes.Arc001_1_4.geometry}>
        <meshBasicMaterial transparent opacity={0} />

        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          toneMapped={false}
          transparent
          polygonOffset
          polygonOffsetFactor={-1} // The mesh should take precedence over the original
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/mug.glb");
