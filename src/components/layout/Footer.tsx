export default function Footer() {
    function renderCurrentYear() {
        const year = new Date();
        return year.getFullYear();
    }

    return (
        <div className="flex flex-col mt-16 pt-4 border-t border-divider">
            <div className="flex flex-col md:flex-row items-start md:justify-between py-2">
                <p className="font-mono text-[11px] tracking-wide text-text-very-faint">
                    Marshall Blatz {renderCurrentYear()}
                </p>
                <a
                    href="https://mblatz.com"
                    target="_blank"
                    className="font-mono text-[11px] tracking-wide text-text-faint hover:text-accent"
                >
                    mblatz.com
                </a>
            </div>
        </div>
    );
}
