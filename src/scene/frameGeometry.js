import * as THREE from "three";

const HALF_PI = Math.PI / 2;

class RoundedRectCurve extends THREE.Curve {
  constructor(halfWidth, halfHeight, radius) {
    super();
    const sx = halfWidth - radius;
    const sy = halfHeight - radius;

    const line = (x0, y0, x1, y1) => {
      const length = Math.hypot(x1 - x0, y1 - y0);
      return {
        length,
        at: (s, v) => {
          const u = length ? s / length : 0;
          return v.set(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, 0);
        },
      };
    };
    const arc = (cx, cy, startAngle) => ({
      length: radius * HALF_PI,
      at: (s, v) => {
        const angle = startAngle + s / radius;
        return v.set(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, 0);
      },
    });

    this.segments = [
      line(halfWidth, 0, halfWidth, sy),
      arc(sx, sy, 0),
      line(sx, halfHeight, -sx, halfHeight),
      arc(-sx, sy, HALF_PI),
      line(-halfWidth, sy, -halfWidth, -sy),
      arc(-sx, -sy, Math.PI),
      line(-sx, -halfHeight, sx, -halfHeight),
      arc(sx, -sy, Math.PI * 1.5),
      line(halfWidth, -sy, halfWidth, 0),
    ];
    this.totalLength = this.segments.reduce((sum, segment) => sum + segment.length, 0);
  }

  getPoint(t, target = new THREE.Vector3()) {
    let distance = (t % 1) * this.totalLength;
    for (const segment of this.segments) {
      if (distance <= segment.length) return segment.at(distance, target);
      distance -= segment.length;
    }
    const last = this.segments[this.segments.length - 1];
    return last.at(last.length, target);
  }
}

export function createMorphingFrameGeometry({
  tube = 0.05,
  frameHalfWidth = 1.1,
  frameHalfHeight = 0.72,
  cornerRadius = 0.16,
} = {}) {
  const tubularSegments = 240;
  const radialSegments = 12;
  const ring = new THREE.TubeGeometry(new RoundedRectCurve(1, 1, 1), tubularSegments, tube, radialSegments, true);
  const frame = new THREE.TubeGeometry(
    new RoundedRectCurve(frameHalfWidth, frameHalfHeight, cornerRadius),
    tubularSegments,
    tube,
    radialSegments,
    true
  );

  ring.morphAttributes.position = [frame.attributes.position];
  ring.morphAttributes.normal = [frame.attributes.normal];
  frame.dispose();
  return ring;
}
