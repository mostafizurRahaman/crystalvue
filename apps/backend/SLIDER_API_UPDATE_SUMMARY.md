# Slider API Update Summary

## Overview

Updated the backend slider API to follow the data table API standards as defined
in the project documentation. This ensures consistent API patterns for CRUD
operations, filtering, sorting, pagination, and error handling.

## Changes Made

### 1. Updated Get All Sliders Endpoint (`/api/sliders/get-all`)

**File**: `backend/src/app/routes/sliders/get-all-sliders.ts`

**New Query Parameters**:

- `search`: Text search across title, subtitle, and buttonText fields
- `from_date`: Start date filter (ISO format)
- `to_date`: End date filter (ISO format)
- `sort_by`: Field to sort by (`created_at`, `updated_at`, `orderNumber`,
  `title`, `isActive`)
- `sort_order`: Sort direction (`asc` or `desc`)
- `page`: Page number (1-based, default: 1)
- `limit`: Items per page (default: 10)
- `active_only`: Filter for active sliders only (`true`/`false`)

**New Response Format**:

```json
{
  "success": true,
  "message": "Sliders retrieved successfully",
  "data": [...sliders],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_pages": 5,
    "total_items": 50
  }
}
```

**Features Added**:

- Zod schema validation for query parameters
- Search functionality across multiple fields
- Date range filtering
- Flexible sorting options
- Standardized pagination response
- Proper error handling with validation messages

### 2. Added Batch Fetch Endpoint

**File**: `backend/src/app/routes/sliders/get-sliders-batch.ts`

**Endpoints**:

- `GET /api/sliders/batch?ids=1,2,3` - Fetch sliders by comma-separated IDs
- `POST /api/sliders/batch` - Fetch sliders by array of IDs in request body

**Request Body (POST)**:

```json
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response Format**:

```json
{
  "success": true,
  "message": "Sliders retrieved successfully",
  "data": [...sliders]
}
```

**Features**:

- Batch processing for large ID sets (50 IDs per batch)
- Support for both GET and POST methods
- Proper error handling
- TypeScript type safety

### 3. Updated Response Interface

**File**: `backend/src/app/types/response.ts`

**Changes**:

- Updated `IPagination` interface to use `total_items` instead of `total_counts`
- Maintains consistency with data table standards

### 4. Updated Route Registration

**File**: `backend/src/app/routes/sliders/index.ts`

**Changes**:

- Added batch fetch route registration
- Maintained existing route structure

## API Endpoints Summary

| Method | Endpoint                       | Description                                         | Auth Required          |
| ------ | ------------------------------ | --------------------------------------------------- | ---------------------- |
| GET    | `/api/sliders/get-all`         | Get all sliders with filtering, sorting, pagination | No                     |
| GET    | `/api/sliders/batch?ids=1,2,3` | Get sliders by IDs (query params)                   | No                     |
| POST   | `/api/sliders/batch`           | Get sliders by IDs (request body)                   | No                     |
| GET    | `/api/sliders/:id`             | Get single slider by ID                             | No                     |
| POST   | `/api/sliders/create`          | Create new slider                                   | Yes (admin/superadmin) |
| PUT    | `/api/sliders/:id`             | Update slider                                       | Yes (admin/superadmin) |
| DELETE | `/api/sliders/:id`             | Delete slider                                       | Yes (admin/superadmin) |
| POST   | `/api/sliders/bulk-delete`     | Delete multiple sliders                             | Yes (admin/superadmin) |
| PUT    | `/api/sliders/reorder`         | Reorder sliders                                     | Yes (admin/superadmin) |

## Frontend Integration

The updated API now fully supports the frontend data table component with:

1. **Server-side pagination**: Efficient handling of large datasets
2. **Search functionality**: Text search across multiple fields
3. **Date filtering**: Filter by creation date ranges
4. **Flexible sorting**: Sort by any field in ascending or descending order
5. **Batch operations**: Support for selecting and operating on multiple items
6. **Consistent response format**: Standardized success/error responses

## Error Handling

All endpoints now follow consistent error handling patterns:

```json
{
  "success": false,
  "message": "Error description",
  "data": "Additional error details"
}
```

## Validation

- All query parameters are validated using Zod schemas
- Proper type coercion for numeric parameters
- Default values for optional parameters
- Clear error messages for invalid inputs

## Performance Considerations

- Efficient database queries with proper indexing
- Batch processing for large ID sets
- Pagination to limit result sets
- Optimized includes for related data

## Testing

The updated API maintains backward compatibility while adding new features.
Existing frontend implementations will continue to work, and new data table
features can be gradually adopted.
