import { IconX } from "@tabler/icons-react";

export default function Modal({
    open,
    setOpen,
    title,
    children,
}: {
    open: boolean;
    setOpen: (val: boolean) => void;
    title: string;
    children: JSX.Element;
}) {
    return (
        open && (
            <div
                onClick={() => setOpen(false)}
                className="z-[20] fixed flex left-0 top-0 bg-black/50 justify-center w-full h-screen"
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="flex flex-col bg-b-secondary dark:bg-db-secondary py-4 px-6 mt-10 rounded-lg drop-shadow-md max-w-[700px] h-fit"
                >
                    <div className="flex flex-row justify-between items-center space-x-6 mb-4">
                        <h3>{title}</h3>
                        <button onClick={() => setOpen(false)}>
                            <IconX />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        )
    );
}
