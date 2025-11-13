// Export components explicitly to avoid type conflicts
export { SingleImageUpload } from "./single-image-uploader";
export { MultipleImageUpload } from "./multi-uploader";
export { ProfileImageUpload } from "./profile-image-uploader";

// Export shared ImageMetadata type from a single source
export type { ImageMetadata } from "@/types/shared";
