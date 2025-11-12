# Image Viewer Component

A reusable image viewer modal component built with shadcn/ui that provides
advanced image viewing capabilities.

## Features

- **Zoom Controls**: Zoom in/out with mouse wheel or buttons
- **Pan & Drag**: Click and drag to move around the image
- **Rotation**: Rotate image in 90-degree increments
- **Fullscreen Mode**: Toggle fullscreen viewing
- **Download**: Download the image
- **Keyboard Support**: ESC key to exit fullscreen
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper ARIA labels and keyboard navigation

## Usage

### Basic Usage

```tsx
import { ImageViewerModal } from "@/components/image-viewer";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>View Image</Button>

      <ImageViewerModal
        open={isOpen}
        onOpenChange={setIsOpen}
        imageUrl="https://example.com/image.jpg"
        imageAlt="My Image"
        title="Image Viewer"
      />
    </>
  );
}
```

### Advanced Usage

```tsx
import { ImageViewerModal } from "@/components/image-viewer";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ImageViewerModal
      open={isOpen}
      onOpenChange={setIsOpen}
      imageUrl="https://example.com/image.jpg"
      imageAlt="My Image"
      title="Custom Image Viewer"
      showDownload={true} // Show download button (default: true)
      showFullscreen={true} // Show fullscreen button (default: true)
    />
  );
}
```

### With Image Cell Component

```tsx
import { ImageCell } from "@/components/image-viewer";

function DataTable() {
  return (
    <ImageCell imageUrl="https://example.com/image.jpg" title="My Image" />
  );
}
```

## Props

### ImageViewerModal Props

| Prop             | Type                      | Default          | Description                       |
| ---------------- | ------------------------- | ---------------- | --------------------------------- |
| `open`           | `boolean`                 | -                | Whether the modal is open         |
| `onOpenChange`   | `(open: boolean) => void` | -                | Callback when modal state changes |
| `imageUrl`       | `string`                  | -                | URL of the image to display       |
| `imageAlt`       | `string`                  | `"Image"`        | Alt text for the image            |
| `title`          | `string`                  | `"Image Viewer"` | Title of the modal                |
| `showDownload`   | `boolean`                 | `true`           | Whether to show download button   |
| `showFullscreen` | `boolean`                 | `true`           | Whether to show fullscreen button |

### ImageCell Props

| Prop       | Type     | Default | Description                  |
| ---------- | -------- | ------- | ---------------------------- |
| `imageUrl` | `string` | -       | URL of the image to display  |
| `title`    | `string` | -       | Title/alt text for the image |

## Keyboard Shortcuts

- **ESC**: Exit fullscreen mode
- **Mouse Wheel**: Zoom in/out
- **Click & Drag**: Pan around the image

## Styling

The component uses Tailwind CSS classes and follows the shadcn/ui design system.
All colors are semantic and will adapt to your theme automatically.

## Examples

### In Data Tables

```tsx
// columns.tsx
import { ImageCell } from "./image-cell";

export const columns = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <ImageCell imageUrl={row.original.imageUrl} title={row.original.title} />
    ),
  },
];
```

### In Cards

```tsx
import { ImageViewerModal } from "@/components/image-viewer";

function ImageCard({ imageUrl, title }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <img
        src={imageUrl}
        alt={title}
        onClick={() => setIsViewerOpen(true)}
        className="cursor-pointer"
      />

      <ImageViewerModal
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        imageUrl={imageUrl}
        imageAlt={title}
        title={`${title} - Full Size`}
      />
    </>
  );
}
```

## Customization

The component is built with shadcn/ui components and can be customized by:

1. **Modifying the component directly** for global changes
2. **Using CSS variables** for theme customization
3. **Extending the component** for specific use cases

## Dependencies

- `@radix-ui/react-dialog`
- `lucide-react` (for icons)
- `next/image` (for optimized images)
- `@/components/ui/*` (shadcn/ui components)
