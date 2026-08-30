/**
 * BackgroundGlow
 * Ambient radial glow + faint diagonal light rays used behind every page,
 * echoing the "scanning a codebase" idea with soft, slow-moving light.
 */
export default function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Base radial glow */}
      <div className="absolute inset-0 bg-radial-fade" />

      {/* Diagonal rays, reminiscent of light hitting a terminal */}
      <div
        className="absolute -top-1/3 left-0 h-[140%] w-[140%] opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(115deg, #d9b95a 0px, #d9b95a 1px, transparent 1px, transparent 120px)",
        }}
      />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}