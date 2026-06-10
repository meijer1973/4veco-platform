// Golden Ticket graph renderer for the 1.1.3 exit-ticket proof route.

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.GoldenTicketGraph = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VIEW_BOX = { width: 680, height: 430 };
  var PLOT = { x: 78, y: 32, width: 540, height: 330 };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function attr(value) {
    return escapeHtml(value);
  }

  function numberAttr(value) {
    return String(Number(value));
  }

  function formatTick(value, axis) {
    var numeric = Number(value);
    var decimals = Number(axis && axis.tickDecimals);
    var text;
    if (Number.isFinite(decimals) && decimals > 0) {
      text = numeric.toFixed(decimals);
      text = text.replace(/0+$/, '').replace(/\.$/, '');
    } else {
      text = String(numeric);
    }
    if (axis && axis.tickFormat === 'decimal_comma') {
      text = text.replace('.', ',');
    }
    return text;
  }

  function normalizePoint(point) {
    return {
      x: Number(point && point.x),
      y: Number(point && point.y),
      label: point && point.label ? String(point.label) : ''
    };
  }

  function graphIdFor(data) {
    var raw = data && data.layout && data.layout.graphId
      ? data.layout.graphId
      : data && data.parNr
        ? 'golden-ticket-' + String(data.parNr).replace(/[^a-z0-9]/gi, '')
        : 'golden-ticket-workbench';
    return String(raw || 'golden-ticket-workbench');
  }

  function buildGraphSpec(data) {
    var tasks = data && Array.isArray(data.tasks) ? data.tasks : [];
    var graphTask = tasks
      .map(function (task) { return task && task.taskShell; })
      .find(function (taskShell) { return taskShell && taskShell.family === 'graph_construction_substitute'; });
    if (!graphTask) {
      return null;
    }
    var interaction = graphTask.interaction || {};
    var expected = graphTask.expected || {};
    var axes = interaction.axes || {};
    var sourcePoints = Array.isArray(expected.acceptedTablePoints) && expected.acceptedTablePoints.length
      ? expected.acceptedTablePoints
      : expected.points || [];
    return {
      graph_id: graphIdFor(data),
      x_axis: axes.x || {},
      y_axis: axes.y || {},
      points: sourcePoints.map(normalizePoint),
      expected_points: (expected.points || []).map(normalizePoint),
      line_or_shape: expected.lineShape || 'decreasing',
      snap_tolerance_px: Number(interaction.pointSnapTolerancePx || 72)
    };
  }

  function valueToX(spec, value) {
    var axis = spec.x_axis;
    return PLOT.x + ((Number(value) - Number(axis.min)) / (Number(axis.max) - Number(axis.min))) * PLOT.width;
  }

  function valueToY(spec, value) {
    var axis = spec.y_axis;
    return PLOT.y + PLOT.height - ((Number(value) - Number(axis.min)) / (Number(axis.max) - Number(axis.min))) * PLOT.height;
  }

  function svgToValueX(spec, svgX) {
    var axis = spec.x_axis;
    return Number(axis.min) + ((svgX - PLOT.x) / PLOT.width) * (Number(axis.max) - Number(axis.min));
  }

  function svgToValueY(spec, svgY) {
    var axis = spec.y_axis;
    return Number(axis.min) + ((PLOT.y + PLOT.height - svgY) / PLOT.height) * (Number(axis.max) - Number(axis.min));
  }

  function clampPlotPoint(svgX, svgY) {
    return {
      x: Math.max(PLOT.x, Math.min(PLOT.x + PLOT.width, svgX)),
      y: Math.max(PLOT.y, Math.min(PLOT.y + PLOT.height, svgY))
    };
  }

  function nearestSourcePoint(spec, svgX, svgY, tolerancePx) {
    var best = null;
    (spec.points || []).forEach(function (point) {
      var px = valueToX(spec, point.x);
      var py = valueToY(spec, point.y);
      var distance = Math.sqrt(Math.pow(px - svgX, 2) + Math.pow(py - svgY, 2));
      if (!best || distance < best.distance) {
        best = { distance: distance, point: point };
      }
    });
    if (best && best.distance <= tolerancePx) {
      return { x: best.point.x, y: best.point.y, label: best.point.label || '' };
    }
    return {
      x: Math.round(svgToValueX(spec, svgX)),
      y: Math.round(svgToValueY(spec, svgY) * 4) / 4,
      label: ''
    };
  }

  function nearestRenderedPointIndex(spec, points, svgX, svgY) {
    var best = { index: -1, distance: Infinity };
    (points || []).forEach(function (point, index) {
      var px = valueToX(spec, point.x);
      var py = valueToY(spec, point.y);
      var distance = Math.sqrt(Math.pow(px - svgX, 2) + Math.pow(py - svgY, 2));
      if (distance < best.distance) {
        best = { index: index, distance: distance };
      }
    });
    return best.index;
  }

  function expectedPointAttr(spec) {
    return (spec.points || []).map(function (point) {
      return numberAttr(point.x) + ',' + numberAttr(point.y);
    }).join(';');
  }

  function renderTicks(spec, axisKey, visible) {
    var axis = axisKey === 'x' ? spec.x_axis : spec.y_axis;
    var ticks = Array.isArray(axis.ticks) ? axis.ticks : [];
    return ticks.map(function (tick) {
      if (axisKey === 'x') {
        var x = valueToX(spec, tick);
        return '<g class="ge-tick ge-tick-x" data-value="' + attr(tick) + '">' +
          '<line class="ge-graph-grid" x1="' + x + '" y1="' + PLOT.y + '" x2="' + x + '" y2="' + (PLOT.y + PLOT.height) + '"></line>' +
          '<text class="ge-tick-label" x="' + x + '" y="' + (PLOT.y + PLOT.height + 24) + '" text-anchor="middle">' + (visible ? escapeHtml(formatTick(tick, axis)) : '') + '</text>' +
        '</g>';
      }
      var y = valueToY(spec, tick);
      return '<g class="ge-tick ge-tick-y" data-value="' + attr(tick) + '">' +
        '<line class="ge-graph-grid" x1="' + PLOT.x + '" y1="' + y + '" x2="' + (PLOT.x + PLOT.width) + '" y2="' + y + '"></line>' +
        '<text class="ge-tick-label" x="' + (PLOT.x - 12) + '" y="' + (y + 4) + '" text-anchor="end">' + (visible ? escapeHtml(formatTick(tick, axis)) : '') + '</text>' +
      '</g>';
    }).join('');
  }

  function renderPoints(spec, points) {
    return (points || []).map(function (point, index) {
      var x = valueToX(spec, point.x);
      var y = valueToY(spec, point.y);
      return '<g class="ge-graph-point-group">' +
        '<circle class="ge-graph-point" cx="' + x + '" cy="' + y + '" r="7" data-x="' + attr(point.x) + '" data-y="' + attr(point.y) + '"></circle>' +
        '<text class="ge-graph-point-label" x="' + (x + 10) + '" y="' + (y - 8) + '">P' + (index + 1) + '</text>' +
      '</g>';
    }).join('');
  }

  function renderLine(spec, points, shouldDraw) {
    if (!shouldDraw || !points || points.length < 2) return '';
    var ordered = points.slice().sort(function (a, b) { return Number(a.x) - Number(b.x); });
    var linePoints = ordered.map(function (point) {
      return valueToX(spec, point.x) + ',' + valueToY(spec, point.y);
    }).join(' ');
    return '<polyline class="ge-graph-line" points="' + linePoints + '" data-line-or-shape="' + attr(spec.line_or_shape) + '"></polyline>';
  }

  function renderSvgString(spec, options) {
    options = options || {};
    var visibleAxes = options.axesVisible === true;
    var xLabel = visibleAxes ? (options.xLabel || spec.x_axis.label || '') : 'Horizontale as';
    var yLabel = visibleAxes ? (options.yLabel || spec.y_axis.label || '') : 'Verticale as';
    var points = (options.points || []).map(normalizePoint);
    return '<svg class="ge-graph" data-graph-id="' + attr(spec.graph_id) + '" ' +
      'data-expected-x-label="' + attr(spec.x_axis.label || '') + '" ' +
      'data-expected-y-label="' + attr(spec.y_axis.label || '') + '" ' +
      'data-expected-points="' + attr(expectedPointAttr(spec)) + '" ' +
      'data-line-or-shape="' + attr(spec.line_or_shape) + '" ' +
      'viewBox="0 0 ' + VIEW_BOX.width + ' ' + VIEW_BOX.height + '" role="img" aria-label="Interactief grafiekwerkvlak">' +
      '<rect class="ge-graph-bg" x="0" y="0" width="' + VIEW_BOX.width + '" height="' + VIEW_BOX.height + '"></rect>' +
      '<rect class="ge-graph-plot" x="' + PLOT.x + '" y="' + PLOT.y + '" width="' + PLOT.width + '" height="' + PLOT.height + '"></rect>' +
      '<g class="ge-axis ge-axis-x" data-label="' + attr(spec.x_axis.label || '') + '">' + renderTicks(spec, 'x', visibleAxes) + '</g>' +
      '<g class="ge-axis ge-axis-y" data-label="' + attr(spec.y_axis.label || '') + '">' + renderTicks(spec, 'y', visibleAxes) + '</g>' +
      '<line class="ge-axis-line" x1="' + PLOT.x + '" y1="' + (PLOT.y + PLOT.height) + '" x2="' + (PLOT.x + PLOT.width) + '" y2="' + (PLOT.y + PLOT.height) + '"></line>' +
      '<line class="ge-axis-line" x1="' + PLOT.x + '" y1="' + PLOT.y + '" x2="' + PLOT.x + '" y2="' + (PLOT.y + PLOT.height) + '"></line>' +
      '<text class="ge-axis-label ge-axis-label-x" x="' + (PLOT.x + PLOT.width / 2) + '" y="414" text-anchor="middle">' + escapeHtml(xLabel) + '</text>' +
      '<text class="ge-axis-label ge-axis-label-y" x="20" y="' + (PLOT.y + PLOT.height / 2) + '" text-anchor="middle" transform="rotate(-90, 20, ' + (PLOT.y + PLOT.height / 2) + ')">' + escapeHtml(yLabel) + '</text>' +
      renderLine(spec, points, options.lineVisible === true) +
      renderPoints(spec, points) +
    '</svg>';
  }

  return {
    VIEW_BOX: VIEW_BOX,
    PLOT: PLOT,
    buildGraphSpec: buildGraphSpec,
    clampPlotPoint: clampPlotPoint,
    graphIdFor: graphIdFor,
    nearestRenderedPointIndex: nearestRenderedPointIndex,
    nearestSourcePoint: nearestSourcePoint,
    renderSvgString: renderSvgString,
    valueToX: valueToX,
    valueToY: valueToY
  };
});
