import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
precision highp int;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_pixel_ratio;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                      -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 contour_fill(float x, float levels) {
  float c = floor(x*levels) / levels;
  vec3 color = vec3(.08 - c*0.08, pow(c, 3.0), .1 + c*.9);
  color = color * 0.9 + 0.1;
  return color;
}

void main() {
  vec2 mouse = vec2(u_mouse.x/u_resolution.x, 1.0 - u_mouse.y/u_resolution.y)*u_pixel_ratio;
  mouse.x *= u_resolution.x/u_resolution.y;

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

  vec3 color = vec3(0.0);
  vec2 pos = vec2(st*(2.0/u_pixel_ratio));

  float DF = 0.0;

  float a = 0.0;
  vec2 vel = vec2(u_time*.05);
  DF += snoise(pos+vel)*.25+.25;

  a = snoise(pos*vec2(cos(u_time*0.05),sin(u_time*0.05))*0.1)*3.1415;
  vel = vec2(cos(a),sin(a));
  DF += snoise(pos+vel)*0.25+ 0.25;

  float x = fract(DF);

  x -= 0.2*(1.0 - clamp(0.0, 1.0, distance(st, mouse)));

  color = contour_fill(x, 8.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function ShopShaderBackground({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 1.0 },
      u_pixel_ratio: { value: window.devicePixelRatio || 1 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      extensions: { derivatives: true },
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // Ensure we start clean if React remounts quickly
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      renderer.setSize(width, height, false);
      uniforms.u_resolution.value.set(width, height);
    };

    setSize();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => setSize());
      ro.observe(container);
    } else {
      window.addEventListener('resize', setSize);
    }

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      uniforms.u_mouse.value.x = e.clientX - rect.left;
      uniforms.u_mouse.value.y = e.clientY - rect.top;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const clock = new THREE.Clock();
    let rafId = 0;

    const render = () => {
      if (!reduceMotion) {
        uniforms.u_time.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      if (ro) {
        ro.disconnect();
      } else {
        window.removeEventListener('resize', setSize);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement?.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 ${className}`}
    />
  );
}
