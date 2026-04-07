import { CSSProperties, useState } from "react";

export default function Cell({ rgbValues, date, progress, ph }: Cell) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const cellStyle: CSSProperties = {
        backgroundColor: `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${progress})`,
        visibility: ph ? "hidden" : "visible",
    };

    const tooltipStyle: CSSProperties = {
        visibility: tooltipVisible ? "visible" : "hidden",
        bottom: "150%",
        left: "50%",
        transform: "translateX(-50%)",
    };

    const handleMouseOver = () => {
        setTooltipVisible(true);
    };

    const handleMouseOut = () => {
        setTooltipVisible(false);
    };

    return (
        <>
            <div
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                className="relative w-3 h-3 m-0.5 rounded"
                style={cellStyle}
            >
                <div
                    className="z-10 absolute bg-card-bg border border-line shadow-card-hover p-2 rounded min-w-[130px] flex flex-col items-center"
                    style={tooltipStyle}
                >
                    <div>
                        <p className="font-mono text-[11px] text-text-muted">{date}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
