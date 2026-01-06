import { MouseEvent, useEffect, useRef, useState } from "react";

export default function ColorPicker({ color, setColor }: { color: string; setColor: (newColor: string) => void }) {
    const [open, setOpen] = useState(false);

    // the reference and useEffect are used to handle the closing of the color picker
    let popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        let handler = (e: Event) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        };
    });

    const handleColorChange = (event: MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget.value);
        setColor(event.currentTarget.value);
    };

    return (
        <div ref={popupRef}>
            <button
                type="button"
                className={`${color} rounded-full border-b-tertiary dark:border-db-tertiary border-[4px] h-[30px] w-[30px] relative`}
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div className="absolute left-[280px] mt-[-65px] bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md p-2">
                    <div className="flex flex-row">
                        <button
                            type="button"
                            value="red"
                            className="bg-red-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="orange"
                            className="bg-orange-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="yellow"
                            className="bg-yellow-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                    </div>
                    <div className="flex flex-row">
                        <button
                            type="button"
                            value="green"
                            className="bg-green-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="blue"
                            className="bg-blue-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="purple"
                            className="bg-purple-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                    </div>
                    <div className="flex flex-row">
                        <button
                            type="button"
                            value="pink"
                            className="bg-pink-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="brown"
                            className="bg-brown-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                        <button
                            type="button"
                            value="grey"
                            className="bg-grey-1 m-1 rounded-full h-[20px] w-[20px]"
                            onClick={handleColorChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
