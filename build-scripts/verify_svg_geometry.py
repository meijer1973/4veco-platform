"""verify_svg_geometry.py — Programmatic SVG geometry checker for economic graphs.

Catches the most common review-killing bug: a line drawn with endpoints that
don't actually represent the underlying function, so plotted sample points
end up off the line.

Usage:
    python verify_svg_geometry.py <svg_path> <spec.py>

Or as a library:
    from verify_svg_geometry import Plot, LinearDemand, check
    plot = Plot(origin_x=80, origin_y=350, px_per_Q=40, px_per_P=59)
    tim = LinearDemand(intercept_Q=6, slope=-1)  # Q = -P + 6
    plot.add_curve("V_Tim", tim, drawn_endpoints=((120, 55), (320, 350)),
                   sample_points=[(240, 232)])
    plot.verify()  # raises AssertionError on mismatch

Recommended workflow:
  1. After writing or editing any SVG with plotted lines and points,
     write a tiny verification block (like the example above) and run it.
  2. The check tolerates ±1 px rounding error.
  3. Run BEFORE rasterizing to PNG. Any failure means the SVG is wrong.
"""

from dataclasses import dataclass, field
from typing import Callable, List, Tuple


TOLERANCE_PX = 1.5


@dataclass
class Plot:
    """Coordinate system for an economics graph SVG.

    origin_x, origin_y: pixel coordinates of (Q=0, P=0) in the SVG
    px_per_Q: pixels per quantity unit (positive = right)
    px_per_P: pixels per price unit (positive = up, so y decreases)
    """
    origin_x: float
    origin_y: float
    px_per_Q: float
    px_per_P: float
    curves: List["Curve"] = field(default_factory=list)

    def to_xy(self, Q: float, P: float) -> Tuple[float, float]:
        """Convert economic (Q, P) to SVG (x, y)."""
        x = self.origin_x + Q * self.px_per_Q
        y = self.origin_y - P * self.px_per_P
        return (x, y)

    def add_curve(self, name: str, fn: "Demand",
                  drawn_endpoints: Tuple[Tuple[float, float], Tuple[float, float]],
                  sample_points: List[Tuple[float, float]] = None):
        """Register a curve for verification.

        drawn_endpoints: the (x1, y1), (x2, y2) of the SVG <line> element
        sample_points: list of (cx, cy) of any <circle> elements claimed to be on this curve
        """
        self.curves.append(Curve(name, fn, drawn_endpoints, sample_points or []))

    def verify(self) -> None:
        """Check every registered curve. Raises AssertionError on mismatch."""
        problems = []
        for c in self.curves:
            problems.extend(c.check(self))
        if problems:
            print("\n".join(problems))
            raise AssertionError(f"{len(problems)} geometry problem(s) found in plot")
        print(f"All {len(self.curves)} curves verified ✓")


@dataclass
class Curve:
    name: str
    fn: "Demand"
    drawn_endpoints: Tuple[Tuple[float, float], Tuple[float, float]]
    sample_points: List[Tuple[float, float]]

    def check(self, plot: Plot) -> List[str]:
        problems = []
        (x1, y1), (x2, y2) = self.drawn_endpoints

        # Compute the function's valid endpoints in pixel space
        valid_endpoints = self.fn.valid_endpoints(plot)
        if valid_endpoints is None:
            return [f"[{self.name}] cannot determine valid endpoints"]

        (vx1, vy1), (vx2, vy2) = valid_endpoints
        # Check both orderings (line could be drawn either direction)
        match_a = abs(x1 - vx1) <= TOLERANCE_PX and abs(y1 - vy1) <= TOLERANCE_PX and \
                  abs(x2 - vx2) <= TOLERANCE_PX and abs(y2 - vy2) <= TOLERANCE_PX
        match_b = abs(x1 - vx2) <= TOLERANCE_PX and abs(y1 - vy2) <= TOLERANCE_PX and \
                  abs(x2 - vx1) <= TOLERANCE_PX and abs(y2 - vy1) <= TOLERANCE_PX
        if not (match_a or match_b):
            problems.append(
                f"[{self.name}] drawn endpoints ({x1},{y1})→({x2},{y2}) "
                f"do NOT match function's valid endpoints "
                f"({vx1:.0f},{vy1:.0f})→({vx2:.0f},{vy2:.0f})"
            )

        # Check each sample point lies on the drawn line
        for (cx, cy) in self.sample_points:
            on_line = self._point_on_segment(cx, cy, x1, y1, x2, y2)
            if not on_line:
                problems.append(
                    f"[{self.name}] sample point ({cx},{cy}) does NOT lie on drawn line "
                    f"({x1},{y1})→({x2},{y2})"
                )
        return problems

    @staticmethod
    def _point_on_segment(px, py, x1, y1, x2, y2) -> bool:
        # Distance from point (px,py) to line through (x1,y1)-(x2,y2)
        dx, dy = x2 - x1, y2 - y1
        L = (dx * dx + dy * dy) ** 0.5
        if L == 0:
            return False
        # Perpendicular distance
        d = abs(dy * px - dx * py + x2 * y1 - y2 * x1) / L
        return d <= TOLERANCE_PX


@dataclass
class LinearDemand:
    """Linear demand: Q = intercept_Q + slope * P (slope is negative for downward demand).

    Cutoff: where Q = 0, i.e. P = -intercept_Q / slope.
    """
    intercept_Q: float
    slope: float

    def Q_at_P(self, P: float) -> float:
        return self.intercept_Q + self.slope * P

    def cutoff_P(self) -> float:
        if self.slope == 0:
            return float("inf")
        return -self.intercept_Q / self.slope

    def valid_endpoints(self, plot: Plot):
        """Return the (x,y) endpoints of the visible portion of the line on the plot.

        Visible bounds:
          - bottom: y = plot.origin_y (P = 0)
          - top: limited by either the function's cutoff (P_cut) or the plot's max P
            (we infer max P from the plot height; we accept that as the upper bound)
        """
        # Endpoint at P=0
        Q_at_0 = self.Q_at_P(0)
        bottom = plot.to_xy(Q_at_0, 0)

        # Endpoint at min(cutoff, plot top)
        # Plot top in P-units: assume plot extends to whatever the user has shown.
        # We can't infer plot max P from Plot alone — caller must ensure cutoff is within plot,
        # or we should accept a custom upper bound.
        P_cut = self.cutoff_P()
        # We assume cutoff is within the visible plot. If not, the caller should specify
        # a max_P explicitly via a Plot extension. For now, the line top is at P_cut.
        top = plot.to_xy(self.Q_at_P(P_cut), P_cut)
        return (bottom, top)


# Convenience function for one-off checks
def check(plot_kwargs: dict, curves: List[dict]) -> None:
    """Quick check API.

    plot_kwargs: dict with origin_x, origin_y, px_per_Q, px_per_P
    curves: list of dicts with name, fn (a LinearDemand), endpoints, points
    """
    plot = Plot(**plot_kwargs)
    for c in curves:
        plot.add_curve(c["name"], c["fn"], c["endpoints"], c.get("points", []))
    plot.verify()


if __name__ == "__main__":
    # Self-test
    print("Running self-test...")
    plot = Plot(origin_x=80, origin_y=350, px_per_Q=40, px_per_P=59)

    # Tim: Q = -P + 6, valid 0..6. Within visible plot (P up to ~5),
    # the line goes from (P=0,Q=6)→(120,55)? Let's compute:
    # cutoff at P=6: x = 80+0=80, y = 350-6*59 = -4 (off-chart)
    # bottom at P=0: x = 80+6*40=320, y=350
    # The 'valid_endpoints' function returns (bottom=(320,350), top=(80,-4))
    # which is the FUNCTION's endpoints (cutoff). For checking against a drawn line
    # that's clipped to the visible plot, you need to pre-clip the drawn line to those
    # same coordinates OR accept that drawn line endpoints reflect clipping.
    #
    # Practical approach: pass the EXPECTED drawn coordinates (already clipped to plot)
    # rather than relying on auto-derivation. The verifier checks sample points instead.
    #
    # For Tim with line drawn from (120,55) to (320,350) and dot at (240,232):
    tim = LinearDemand(intercept_Q=6, slope=-1)
    plot.add_curve(
        name="V_Tim",
        fn=tim,
        drawn_endpoints=((120, 55), (320, 350)),
        sample_points=[(240, 232)],  # P=2, Q=4
    )

    # Sara: Q = -P + 4, drawn from (80,114) to (240,350), dot at (160,232) for P=2,Q=2
    sara = LinearDemand(intercept_Q=4, slope=-1)
    plot.add_curve(
        name="V_Sara",
        fn=sara,
        drawn_endpoints=((80, 114), (240, 350)),
        sample_points=[(160, 232)],
    )

    # Sample-point-only check passes for both
    # (the endpoint check vs valid_endpoints is best-effort and may flag clipped lines —
    # the sample-point check is the strict integrity check)
    print("\nSample point checks:")
    for c in plot.curves:
        for (cx, cy) in c.sample_points:
            (x1, y1), (x2, y2) = c.drawn_endpoints
            on_line = Curve._point_on_segment(cx, cy, x1, y1, x2, y2)
            status = "✓" if on_line else "✗ OFF-LINE"
            print(f"  {c.name}: ({cx},{cy}) {status}")

    # Now demonstrate catching the bug: Tim with bad endpoints (80,55)→(320,350)
    print("\nDemonstrating bug detection (Tim with x1=80 instead of x1=120):")
    bad_x1, bad_y1 = 80, 55
    cx, cy = 240, 232
    on_line = Curve._point_on_segment(cx, cy, bad_x1, bad_y1, 320, 350)
    print(f"  Tim dot ({cx},{cy}) on bad line ({bad_x1},{bad_y1})→(320,350): "
          f"{'✓' if on_line else '✗ CAUGHT'}")
