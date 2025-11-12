# Gallery Data Transform Functions

This directory contains comprehensive data transformation utilities for the
Gallery data table component. These functions ensure that raw API data is
properly formatted and displayed in the UI.

## Overview

The transform functions handle:

- **Data Flattening**: Converting nested API responses into flat objects
  suitable for table display
- **Data Sanitization**: Ensuring data integrity and handling edge cases
- **Display Formatting**: Converting raw data into user-friendly formats
- **Export Preparation**: Preparing data for CSV/Excel export
- **Bulk Operations**: Supporting bulk operations with proper data handling

## Files Structure

```
galleries/
├── components/
│   ├── data-transform.ts          # Core transform functions
│   ├── columns.tsx                 # Updated to use transform functions
│   ├── gallery-table-example.tsx   # Usage examples
│   └── index.ts                    # Export all utilities
├── utils/
│   ├── data-fetching.ts           # Updated with transform integration
│   ├── export-config.ts           # Export configuration
│   └── bulk-operations.ts         # Bulk operation utilities
```

## Core Transform Functions

### `transformGalleryData(galleries: Gallery[]): GalleryExportData[]`

Converts raw gallery data from API into format suitable for data table display.

**Features:**

- Flattens nested `image` and `category` objects
- Converts dates to ISO strings
- Adds computed display fields
- Handles null/undefined values gracefully

**Example:**

```typescript
import { transformGalleryData } from "./components/data-transform";

const rawGalleries = await getAllGalleries();
const transformedData = transformGalleryData(rawGalleries.data);
```

### `transformGalleryDataForExport(galleries: Gallery[]): Partial<GalleryExportData>[]`

Prepares gallery data specifically for CSV/Excel export.

**Features:**

- Removes unnecessary fields
- Ensures clean data for export
- Handles missing values appropriately

### `sanitizeGalleryData(gallery: GalleryExportData): GalleryExportData`

Validates and sanitizes gallery data before display.

**Features:**

- Ensures proper data types
- Handles edge cases
- Provides fallback values

## Display Helper Functions

### `getGalleryCaptionText(caption: string | null): string`

Returns display-friendly caption text with fallback.

### `getGalleryCategoryText(categoryName: string | null): string`

Returns display-friendly category text with fallback.

### `formatGalleryDate(date: string | Date): string`

Formats dates for consistent display.

### `hasValidImageData(gallery: GalleryExportData): boolean`

Checks if gallery has valid image data.

### `getFallbackImageUrl(): string`

Returns fallback image URL for galleries without images.

## Usage Examples

### Basic Data Transformation

```typescript
import {
  transformGalleryData,
  sanitizeGalleryData,
} from "./components/data-transform";

// Transform API data
const rawData = await fetchGalleries();
const transformedData = transformGalleryData(rawData);

// Sanitize for display
const sanitizedData = transformedData.map(sanitizeGalleryData);
```

### Using in Data Table

```typescript
import { useGalleriesData } from "./utils/data-fetching";
import { getColumns } from "./components/columns";

// The data fetching hook automatically transforms data
const { data, isLoading, error } = useGalleriesData(
  page,
  pageSize,
  search,
  dateRange,
  sortBy,
  sortOrder
);

// Columns use transform functions for proper display
const columns = getColumns(handleRowDeselection);
```

### Export Configuration

```typescript
import { useGalleryExportConfig } from "./utils/export-config";

const exportConfig = useGalleryExportConfig();
// Returns: { columnMapping, columnWidths, headers, entityName, transformForExport }
```

### Bulk Operations

```typescript
import { fetchGalleriesByIds } from "./utils/bulk-operations";

// Fetch specific galleries by IDs
const selectedGalleries = await fetchGalleriesByIds(["1", "2", "3"]);
```

## Integration with Data Table

The transform functions are integrated into the data table workflow:

1. **Data Fetching**: `useGalleriesData` automatically transforms raw API data
2. **Column Rendering**: Column definitions use transform functions for display
3. **Export**: Export configuration uses transform functions for clean data
4. **Bulk Operations**: Bulk operation utilities handle data transformation

## Data Flow

```
API Response → transformGalleryData() → sanitizeGalleryData() → Table Display
     ↓
Export Config → transformGalleryDataForExport() → CSV/Excel Export
     ↓
Bulk Operations → fetchGalleriesByIds() → Bulk Actions
```

## Error Handling

All transform functions include proper error handling:

- **Null/Undefined Values**: Graceful fallbacks provided
- **Invalid Dates**: Default to current date
- **Missing Images**: Fallback image URL provided
- **Type Safety**: Proper TypeScript types enforced

## Performance Considerations

- **Memoization**: Export config uses `useMemo` for performance
- **Batch Processing**: Bulk operations handle large datasets efficiently
- **Lazy Loading**: Data is transformed only when needed

## Best Practices

1. **Always Transform Data**: Use transform functions before displaying data
2. **Sanitize Input**: Use `sanitizeGalleryData` for user-facing data
3. **Handle Edge Cases**: Transform functions handle null/undefined values
4. **Type Safety**: Use proper TypeScript types throughout
5. **Performance**: Use memoization for expensive operations

## Troubleshooting

### Common Issues

1. **Data Not Displaying**: Ensure data is properly transformed before rendering
2. **Export Issues**: Use `transformGalleryDataForExport` for clean export data
3. **Type Errors**: Ensure proper TypeScript types are used
4. **Performance Issues**: Use memoization for expensive operations

### Debug Tips

```typescript
// Check raw data
console.log("Raw data:", rawGalleries);

// Check transformed data
const transformed = transformGalleryData(rawGalleries);
console.log("Transformed data:", transformed);

// Check sanitized data
const sanitized = transformed.map(sanitizeGalleryData);
console.log("Sanitized data:", sanitized);
```

## Future Enhancements

- **Date Filtering**: Backend support for date range filtering
- **Advanced Filtering**: More sophisticated filtering options
- **Caching**: Implement data caching for better performance
- **Real-time Updates**: WebSocket integration for real-time data updates
