
export default function Buttonfive({
  label = "EXPLORE YOUR ROADMAP",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type="button"
      className={`btn-five ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {/* Background Shape */}
      <svg
        className="btn-five__shape"
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="btn-five__shape-fill"
          d="
            M 11 1
            H 275
            L 299 24
            L 275 47
            H 11
            Q 1 47 1 37
            V 11
            Q 1 1 11 1
            Z
          "
        />
      </svg>

      {/* Content */}
      <span className="btn-five__content">
        <span className="btn-five__label">{label}</span>

        <svg
          className="btn-five__arrow"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 12H19"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M14 7L19 12L14 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <style>{`
        .btn-five {
          --btn5-bg: #fafaf8;
          --btn5-border: #181818;
          --btn5-text: #181818;
          --btn5-accent: #163b26;

          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 48px;
          padding: 0 38px 0 25px;

          border: 0;
          outline: 0;
          background: transparent;

          cursor: pointer;
          user-select: none;
          white-space: nowrap;

          isolation: isolate;

          transition:
            transform 220ms cubic-bezier(.2,.8,.2,1),
            opacity 180ms ease;
        }

        /* --------------------------------
           SVG SHAPE
        -------------------------------- */

        .btn-five__shape {
          position: absolute;
          inset: 0;

          width: 100%;
          height: 100%;

          z-index: -1;
          overflow: visible;

          pointer-events: none;
        }

        .btn-five__shape-fill {
          fill: var(--btn5-bg);
          stroke: var(--btn5-border);
          stroke-width: 1.5;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;

          transition:
            fill 220ms ease,
            stroke 220ms ease;
        }

        /* --------------------------------
           CONTENT
        -------------------------------- */

        .btn-five__content {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
        }

        .btn-five__label {
          color: var(--btn5-text);

          font-family:
            "Poppins",
            "Montserrat",
            "Helvetica Neue",
            Arial,
            sans-serif;

          font-size: 12px;
          font-weight: 700;
          line-height: 1;

          letter-spacing: 0.075em;
          text-transform: uppercase;
        }

        /* --------------------------------
           ARROW
        -------------------------------- */

        .btn-five__arrow {
          width: 18px;
          height: 18px;

          flex: 0 0 18px;

          color: var(--btn5-accent);

          transition:
            transform 280ms cubic-bezier(.2,.8,.2,1);
        }

        /* --------------------------------
           HOVER
        -------------------------------- */

        .btn-five:hover {
          transform: translateX(3px);
        }

        .btn-five:hover .btn-five__shape-fill {
          fill: #f3f3ef;
        }

        .btn-five:hover .btn-five__arrow {
          transform: translateX(4px);
        }

        /* --------------------------------
           ACTIVE
        -------------------------------- */

        .btn-five:active {
          transform: translateX(1px) scale(0.985);
        }

        .btn-five:active .btn-five__shape-fill {
          fill: #eaeae5;
        }

        /* --------------------------------
           FOCUS
        -------------------------------- */

        .btn-five:focus-visible {
          outline: 2px solid var(--btn5-border);
          outline-offset: 5px;
        }

        /* --------------------------------
           DISABLED
        -------------------------------- */

        .btn-five:disabled {
          cursor: not-allowed;
          opacity: 0.45;
          transform: none;
        }

        .btn-five:disabled .btn-five__arrow {
          transform: none;
        }

        /* --------------------------------
           REDUCED MOTION
        -------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .btn-five,
          .btn-five__shape-fill,
          .btn-five__arrow {
            transition: none;
          }
        }

        /* --------------------------------
           MOBILE
        -------------------------------- */

        @media (max-width: 480px) {
          .btn-five {
            min-height: 44px;
            padding: 0 33px 0 20px;
          }

          .btn-five__label {
            font-size: 10.5px;
            letter-spacing: 0.065em;
          }

          .btn-five__content {
            gap: 8px;
          }

          .btn-five__arrow {
            width: 16px;
            height: 16px;
            flex-basis: 16px;
          }
        }
      `}</style>
    </button>
  );
}