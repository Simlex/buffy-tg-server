import { forwardRef, TextareaHTMLAttributes } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, placeholder, ...props }, ref) => {
        return (
            <textarea
                className={`w-full min-h-28 rounded-md border-gray-200 outline-none pe-10 shadow-sm sm:text-sm ${className}`}
                placeholder={placeholder}
                ref={ref}
                {...props}
            />
        );
    }
);

TextArea.displayName = "TextArea";

export default TextArea;
