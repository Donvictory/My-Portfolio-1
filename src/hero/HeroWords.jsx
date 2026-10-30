import { Fragment } from "react";

// Wraps each word of the headline in an inline span so the intro can reveal it in place.
// Spaces stay plain text and hyphenated words split after the hyphen ("high-" | "performance"),
// so the browser breaks lines exactly as it does for the unwrapped text. The heading keeps its
// full text for screen readers throughout.
export default function HeroWords({ text }) {
  return text.split(/(\s+)/).map((token, i) =>
    /^\s+$/.test(token) ? (
      token
    ) : (
      <Fragment key={i}>
        {token.split(/(?<=-)/).map((part, j) => (
          <span key={j} className="hero-word">
            {part}
          </span>
        ))}
      </Fragment>
    )
  );
}
