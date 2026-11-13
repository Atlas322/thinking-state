import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type UploadItem = {
    id: string;
    name: string;
    size: number;
    status: "uploading" | "done" | "error";
    progress: number;
    error?: string;
    file?: File;
};
export type DropzoneProps = {
    accept?: string[];
    maxSize?: number;
    onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>;
    onChange?: (items: UploadItem[]) => void;
    hint?: string;
    autoplay?: boolean;
    className?: string;
};
export declare function Dropzone({ accept, maxSize, onUpload, onChange, hint, autoplay, className, }: DropzoneProps): React.JSX.Element;
export default Demo;
export declare function Demo(): React.JSX.Element;
