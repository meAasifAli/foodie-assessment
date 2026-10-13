
export default function Separator({ className = "" }) {
    return (
        <div
            aria-hidden="true"
            className={["h-px w-full bg-border", className].join(" ")}
        />
    );
}
