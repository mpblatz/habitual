import { useRef } from "react";
import { generateGridData } from "../../lib/grid";
import { getRgbColor } from "../../lib/color";
import Cell from "./Cell";

export default function Grid() {
    const scrollableRef = useRef<HTMLDivElement | null>(null);

    function scrollToRight() {
        if (scrollableRef.current) {
            const scrollableContainer = scrollableRef.current;
            scrollableContainer.scrollLeft = scrollableContainer.scrollWidth - scrollableContainer.clientWidth;
        }
    }
    scrollToRight();

    function renderGrid() {
        let data = generateGridData();
        console.log(data);
        let rgbValues = getRgbColor("purple");
        return data.map((item, index) => <Cell key={index} {...item} rgbValues={rgbValues} />);
    }

    return (
        <>
            <h3>Chart</h3>
            <hr />
            <div className="bg-white flex justify-center rounded-md drop-shadow py-4">
                <div
                    ref={scrollableRef}
                    className="relative overflow-x-scroll flex flex-col flex-wrap h-[113px] w-[94%]"
                >
                    {/* pt-[100px] mt-[-100px] */}
                    {renderGrid()}
                </div>
            </div>
        </>
    );
}
