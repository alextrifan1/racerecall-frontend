/*
 * The A.T. mark (from the Dotline design system): a T of five dots on a 3x3
 * grid. The top-centre dot is always --signal red; the four empty spots are
 * thin unlit rings. Ink follows currentColor, so it is white on dark and
 * black on light.
 *
 * Pass `decorative` when a visible name sits next to it (it's then hidden
 * from screen readers); otherwise it announces `label`.
 */
export const Mark = ({ size = 24, decorative = false, label = 'A.T.', className }) => {
    const a11y = decorative ? { 'aria-hidden': 'true' } : { role: 'img', 'aria-label': label };

    return (
        <svg
            className={className}
            viewBox="0 0 30 30"
            width={size}
            height={size}
            fill="currentColor"
            {...a11y}
        >
            {/* The T: top row, then down the middle */}
            <circle cx="5" cy="5" r="4" />
            <circle cx="15" cy="5" r="4" fill="var(--signal, #e02c24)" />
            <circle cx="25" cy="5" r="4" />
            <circle cx="15" cy="15" r="4" />
            <circle cx="15" cy="25" r="4" />

            {/* The four unlit spots */}
            <g fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="5" cy="15" r="3.5" />
                <circle cx="25" cy="15" r="3.5" />
                <circle cx="5" cy="25" r="3.5" />
                <circle cx="25" cy="25" r="3.5" />
            </g>
        </svg>
    );
};
