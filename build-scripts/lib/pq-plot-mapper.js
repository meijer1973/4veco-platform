const DEFAULT_PQ_PLOT = {
  width: 420,
  height: 250,
  left: 58,
  right: 374,
  top: 34,
  bottom: 206,
};

function roundCoord(value) {
  return Math.round(value * 100) / 100;
}

function assertFiniteNumber(name, value) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
}

function assertRange(name, min, max) {
  assertFiniteNumber(`${name}.min`, min);
  assertFiniteNumber(`${name}.max`, max);
  if (max <= min) {
    throw new Error(`${name}.max must be greater than ${name}.min`);
  }
}

function resolvePqConfig(config = {}) {
  const plot = { ...DEFAULT_PQ_PLOT, ...(config.plot || {}) };
  const qMin = config.qMin ?? config.quantityMin ?? 100;
  const qMax = config.qMax ?? config.quantityMax ?? 500;
  const pMin = config.pMin ?? config.priceMin ?? 1;
  const pMax = config.pMax ?? config.priceMax ?? 3;

  assertRange('quantity', qMin, qMax);
  assertRange('price', pMin, pMax);
  for (const key of ['width', 'height', 'left', 'right', 'top', 'bottom']) {
    assertFiniteNumber(`plot.${key}`, plot[key]);
  }
  if (plot.right <= plot.left) throw new Error('plot.right must be greater than plot.left');
  if (plot.bottom <= plot.top) throw new Error('plot.bottom must be greater than plot.top');

  return { ...config, plot, qMin, qMax, pMin, pMax };
}

function mapPqPoint(point, config = {}) {
  const resolved = resolvePqConfig(config);
  const quantity = Number(point.quantity ?? point.q);
  const price = Number(point.price ?? point.p);
  assertFiniteNumber('quantity', quantity);
  assertFiniteNumber('price', price);

  const { plot, qMin, qMax, pMin, pMax } = resolved;
  const x = plot.left + ((quantity - qMin) / (qMax - qMin)) * (plot.right - plot.left);
  const y = plot.bottom - ((price - pMin) / (pMax - pMin)) * (plot.bottom - plot.top);

  return {
    ...point,
    quantity,
    price,
    x: roundCoord(x),
    y: roundCoord(y),
  };
}

function mapPqSeries(points, config = {}) {
  return [...points]
    .map(point => mapPqPoint(point, config))
    .sort((a, b) => a.quantity - b.quantity);
}

function mapPqTicks(values, axis, config = {}) {
  const resolved = resolvePqConfig(config);
  if (axis === 'quantity') {
    return values.map(value => {
      const mapped = mapPqPoint({ quantity: Number(value), price: resolved.pMin }, resolved);
      return { value: Number(value), x: mapped.x, y: resolved.plot.bottom };
    });
  }
  if (axis === 'price') {
    return values.map(value => {
      const mapped = mapPqPoint({ quantity: resolved.qMin, price: Number(value) }, resolved);
      return { value: Number(value), x: resolved.plot.left, y: mapped.y };
    });
  }
  throw new Error(`Unknown P-Q axis: ${axis}`);
}

function formatDutchDecimal(value, digits = 2) {
  return Number(value).toFixed(digits).replace('.', ',');
}

function formatEuro(value) {
  return `\u20ac${formatDutchDecimal(value)}`;
}

function formatQuantity(value) {
  return String(Number(value));
}

module.exports = {
  DEFAULT_PQ_PLOT,
  resolvePqConfig,
  mapPqPoint,
  mapPqSeries,
  mapPqTicks,
  formatDutchDecimal,
  formatEuro,
  formatQuantity,
};
