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
                    style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)" }}
                    className="flex flex-col py-5 px-6 mt-10 rounded-xl max-w-[700px] h-fit"
                >
                    <div className="flex flex-row justify-between items-center space-x-6 mb-4">
                        <h3 className="font-heading font-bold">{title}</h3>
                        <button onClick={() => setOpen(false)} className="text-text-faint hover:text-text">
                            <IconX size={18} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        )
    );
}
