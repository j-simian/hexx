/** Convert hex coordinates to _world_ pixel coordinates */
export function hexToPixel(q, r, radius) {
  let x = (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
  var y = (3 / 2 * r)
  x = x * radius;
  y = y * radius;
  return { x, y }
}

function axial_round(q, r) {
  let xgrid = Math.round(q);
  let ygrid = Math.round(r)
  q -= xgrid; r -= ygrid // remainder
  if (Math.abs(q) >= Math.abs(r)) {
    return { q: xgrid + Math.round(q + 0.5 * r), r: ygrid }
  }
  else {
    return { q: xgrid, r: ygrid + Math.round(r + 0.5 * q) }
  }
}

/** Convert _world_ pixel coordinates to hex coordinates */
export function pixelToHex(x, y, radius) {
  let xa = x / radius;
  let ya = y / radius;
  let q = (Math.sqrt(3) / 3 * xa - 1 / 3 * ya)
  let r = (2 / 3 * ya);
  return axial_round(q, r)
}
