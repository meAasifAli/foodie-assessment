
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { sizedImageUrl } from "../../lib/images";

export default function FoodImage({ src, alt, width = 640, className = "", imgClassName = "" }) {
    const [failed, setFailed] = useState(false);
    const url = sizedImageUrl(src, width);

    return (
        <div className={["relative overflow-hidden bg-surface-muted", className].join(" ")}>
            {url && !failed ? (
                <img
                    src={url}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    className={["h-full w-full object-cover", imgClassName].join(" ")}
                />
            ) : (
                <div
                    role="img"
                    aria-label={alt}
                    className="flex h-full w-full items-center justify-center text-muted-light"
                >
                    <ImageOff size={24} aria-hidden="true" />
                </div>
            )}
        </div>
    );
}
