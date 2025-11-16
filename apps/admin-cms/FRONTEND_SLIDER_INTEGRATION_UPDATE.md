# Frontend Slider Integration Update

## Overview

Updated the frontend slider integration to work with the new backend API that
follows data table standards. This ensures seamless integration between the
frontend data table component and the updated backend slider API.

## Changes Made

### 1. Updated Slider Schema (`src/schema/sliders/index.ts`)

**Response Format Changes**:

- Updated `slidersResponseSchema` to match new backend API structure
- Changed pagination from `{ total, limit, offset, hasMore }` to
  `{ page, limit, total_pages, total_items }`
- Updated data structure to be a direct array instead of nested object

**Parameter Interface Updates**:

- Updated `GetSlidersParams` to include new query parameters:
  - `search`: Text search across multiple fields
  - `from_date`: Start date filter
  - `to_date`: End date filter
  - `sort_by`: Field to sort by
  - `sort_order`: Sort direction
  - `page`: Page number (1-based)
  - `limit`: Items per page
  - `active_only`: Filter for active sliders

### 2. Updated API Functions (`src/api/sliders/`)

**Enhanced Get All Sliders** (`get-all-sliders.ts`):

- Updated to use new query parameters
- Supports search, date filtering, and flexible sorting
- Maintains backward compatibility

**Added Batch Fetch API** (`get-sliders-batch.ts`):

- `getSlidersBatch()`: GET endpoint for comma-separated IDs
- `getSlidersBatchPost()`: POST endpoint for array of IDs
- Batch processing for large ID sets (50 IDs per batch)
- Full TypeScript support

**Updated API Index** (`index.ts`):

- Added export for batch fetch functions

### 3. Created Data Fetching Hook (`src/app/(application)/sliders/utils/data-fetching.ts`)

**React Query Integration**:

- `useSlidersData()`: Custom hook following data table standards
- Supports all new query parameters
- Includes proper caching and placeholder data
- Optimized for performance with React Query

**Features**:

- Automatic query key generation
- Preprocessed search terms
- Placeholder data for smooth transitions
- Type-safe parameter handling

### 4. Updated Main Table Component (`src/app/(application)/sliders/index.tsx`)

**Data Table Integration**:

- Updated to use new data fetching hook
- Simplified component structure
- Removed manual state management
- Added batch fetch support for selection across pages

**Key Changes**:

- Uses `useSlidersData` hook for data fetching
- Implements `getSlidersBatch` for batch operations
- Updated toolbar integration
- Enhanced type safety

### 5. Updated Toolbar Options (`src/app/(application)/sliders/components/toolbar-options.tsx`)

**Simplified Interface**:

- Removed status filter (handled by data table)
- Removed swap dialog (not needed with new approach)
- Updated props to match data table standards
- Cleaner component structure

**Features**:

- Create slider dialog
- Bulk delete functionality
- Proper selection handling
- Type-safe props

## API Integration Features

### 1. Advanced Filtering

- **Text Search**: Search across title, subtitle, and buttonText fields
- **Date Filtering**: Filter by creation date ranges
- **Status Filtering**: Filter by active/inactive status
- **Combined Filters**: All filters work together seamlessly

### 2. Flexible Sorting

- Sort by any field: `created_at`, `updated_at`, `orderNumber`, `title`,
  `isActive`
- Ascending or descending order
- Maintains sort state across page changes

### 3. Server-side Pagination

- Efficient handling of large datasets
- Configurable page sizes: 10, 20, 50, 100
- URL state persistence
- Smooth page transitions

### 4. Batch Operations

- Select items across multiple pages
- Batch fetch for export operations
- Efficient API calls with batching

## Data Table Configuration

```typescript
config={{
  enableRowSelection: true,      // Allow row selection
  enableSearch: true,           // Enable search functionality
  enableDateFilter: true,       // Enable date range filtering
  enableColumnVisibility: true, // Allow column toggling
  enableUrlState: true,         // Persist state in URL
  columnResizingTableId: "sliders-table", // Column resizing
}}
```

## Export Configuration

The slider table supports full export functionality:

- **CSV Export**: Flattened data structure
- **Excel Export**: With proper column widths
- **Column Mapping**: Human-readable headers
- **Batch Processing**: Efficient for large selections

## Performance Optimizations

1. **React Query Caching**: Automatic data caching and background updates
2. **Batch API Calls**: Efficient handling of large ID sets
3. **Placeholder Data**: Smooth transitions between page changes
4. **Optimized Queries**: Only fetch necessary data
5. **Debounced Search**: Reduced API calls during typing

## Type Safety

- Full TypeScript support throughout
- Zod schema validation
- Type-safe API calls
- Proper error handling
- IntelliSense support

## Backward Compatibility

The updated integration maintains backward compatibility:

- Existing slider data structures preserved
- API endpoints remain the same
- Gradual migration path available
- No breaking changes for existing functionality

## Usage Example

```typescript
// The slider table now automatically handles:
// - Server-side pagination
// - Search across multiple fields
// - Date range filtering
// - Flexible sorting
// - Batch operations
// - Export functionality

<SlidersTable />
```

## Benefits

1. **Consistent UX**: Follows established data table patterns
2. **Better Performance**: Server-side processing and caching
3. **Enhanced Features**: Advanced filtering and sorting
4. **Type Safety**: Full TypeScript support
5. **Maintainability**: Clean, standardized code structure
6. **Scalability**: Efficient handling of large datasets

The updated frontend integration provides a robust, performant, and
user-friendly interface for managing sliders while maintaining consistency with
the project's data table standards.
