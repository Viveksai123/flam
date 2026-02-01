// Bezier curve point calculation for smooth drawing
export function calculateBezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      mt3 * p0.x +
      3 * mt2 * t * p1.x +
      3 * mt * t2 * p2.x +
      t3 * p3.x,
    y:
      mt3 * p0.y +
      3 * mt2 * t * p1.y +
      3 * mt * t2 * p2.y +
      t3 * p3.y,
  };
}

// Smooth line drawing using Catmull-Rom interpolation
export function getSmoothPoints(
  points: { x: number; y: number }[],
  tension: number = 0.5
): { x: number; y: number }[] {
  if (points.length < 3) return points;

  const smoothPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < points.length - 2; i++) {
    const p0 = i === 0 ? points[i] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 =
      i === points.length - 2 ? points[i + 1] : points[i + 2];

    for (let t = 0; t < 1; t += 0.1) {
      smoothPoints.push(calculateBezierPoint(t, p0, p1, p2, p3));
    }
  }

  smoothPoints.push(points[points.length - 1]);
  return smoothPoints;
}

// Distance calculation
export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Simplify points using Ramer-Douglas-Peucker algorithm
export function simplifyPoints(
  points: { x: number; y: number }[],
  epsilon: number = 2
): { x: number; y: number }[] {
  if (points.length < 3) return points;

  let maxDistance = 0;
  let maxIndex = 0;

  const p1 = points[0];
  const p2 = points[points.length - 1];

  // Calculate distance from each point to the line between first and last
  for (let i = 1; i < points.length - 1; i++) {
    const d = pointToLineDistance(points[i], p1, p2);
    if (d > maxDistance) {
      maxDistance = d;
      maxIndex = i;
    }
  }

  if (maxDistance > epsilon) {
    const leftPoints = simplifyPoints(
      points.slice(0, maxIndex + 1),
      epsilon
    );
    const rightPoints = simplifyPoints(
      points.slice(maxIndex),
      epsilon
    );
    return leftPoints.slice(0, -1).concat(rightPoints);
  } else {
    return [p1, p2];
  }
}

// Point to line distance for simplification
function pointToLineDistance(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const numerator = Math.abs(
    (lineEnd.y - lineStart.y) * point.x -
      (lineEnd.x - lineStart.x) * point.y +
      lineEnd.x * lineStart.y -
      lineEnd.y * lineStart.x
  );

  const denominator = Math.sqrt(
    (lineEnd.y - lineStart.y) ** 2 + (lineEnd.x - lineStart.x) ** 2
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

// Get canvas coordinates from mouse/touch event
export function getCanvasCoordinates(
  event: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } | null {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let clientX: number;
  let clientY: number;

  if (event instanceof TouchEvent) {
    if (event.touches.length === 0) return null;
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

// Resize canvas while preserving content
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvas.width = width;
  canvas.height = height;

  ctx.putImageData(imageData, 0, 0);
}

// Performance optimized stroke drawing
export function drawStrokeOptimized(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  color: string,
  width: number
) {
  if (points.length === 0) return;

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    // Use quadratic curves for smoother lines
    const currentPoint = points[i];
    const midPoint = {
      x: (points[i - 1].x + currentPoint.x) / 2,
      y: (points[i - 1].y + currentPoint.y) / 2,
    };
    ctx.quadraticCurveTo(
      points[i - 1].x,
      points[i - 1].y,
      midPoint.x,
      midPoint.y
    );
  }

  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.stroke();
}

// Check if two rectangles intersect (for partial redraws)
export function rectsIntersect(
  rect1: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  rect2: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Get bounding box for a stroke
export function getStrokeBoundingBox(
  points: { x: number; y: number }[]
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  points.forEach((point) => {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

// Draw rectangle
export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  width: number
) {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeRect(x, y, w, h);
}

// Draw circle
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  start: { x: number; y: number },
  end: { x: number; y: number },
  color: string,
  width: number
) {
  const radius = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

// Erase area with circular eraser
export function eraseArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
}
