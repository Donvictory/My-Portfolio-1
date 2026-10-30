import { Fragment } from "react";

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
