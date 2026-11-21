// Text that rolls up and back into place when its parent link/button is hovered.
// mode="word": the whole label rolls as one. mode="letters": each letter rolls with a small stagger.
const STAGGER_MS = 18;

export default function RollText({ text, mode = "word" }) {
  const units = mode === "letters" ? Array.from(text) : [text];

  return (
    <span className="roll-text">
      <span className="sr-only">{text}</span>
      <span className="roll-track" aria-hidden="true">
        {units.map((unit, i) => {
          const glyph = unit === " " ? " " : unit;
          return (
            <span
              key={i}
              className="roll-unit"
              data-text={glyph}
              style={mode === "letters" ? { transitionDelay: `${i * STAGGER_MS}ms` } : undefined}
            >
              {glyph}
            </span>
          );
        })}
      </span>
    </span>
  );
}
