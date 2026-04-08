export default function Footer() {
    return (
        <div className="flex flex-col mt-16 pt-4 border-t border-divider">
            <div className="flex flex-col md:flex-row items-start md:justify-between py-2">
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
