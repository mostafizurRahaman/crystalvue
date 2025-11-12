# Slider Sorting Fix

## Issue

The backend API was receiving invalid sort_by parameters because the frontend
was sending column keys that didn't match the backend's expected sort fields.

## Root Cause

- Frontend column keys (e.g., `createdAt`, `updatedAt`) didn't match backend
  sort fields (e.g., `created_at`, `updated_at`)
- Some columns were sortable in the UI but not supported by the backend
- No mapping between frontend and backend sort field names

## Solution

### 1. Updated Columns Configuration (`columns.tsx`)

**Disabled Sorting for Non-Sortable Fields**:

- `imageUrl`: Added `enableSorting: false` (images can't be sorted)
- `actions`: Added `enableSorting: false` (action buttons can't be sorted)

**Sortable Fields**:

- `title` → maps to backend `title`
- `isActive` → maps to backend `isActive`
- `orderNumber` → maps to backend `orderNumber`
- `createdAt` → maps to backend `created_at`
- `updatedAt` → maps to backend `updated_at`

### 2. Created Sort Mapping (`data-fetching.ts`)

**Sort Mapping Object**:

```typescript
const sortMapping: Record<string, string> = {
  title: "title",
  isActive: "isActive",
  orderNumber: "orderNumber",
  createdAt: "created_at",
  updatedAt: "updated_at",
};
```

**Implementation**:

- Maps frontend column keys to backend sort fields
- Provides fallback to `orderNumber` for unknown fields
- Ensures type safety with proper casting

### 3. Updated Data Fetching Hook

**Key Changes**:

- Added sort mapping logic
- Maps frontend sort field to backend sort field
- Maintains query key consistency
- Preserves all existing functionality

## Backend Sort Fields

The backend API supports these sort fields:

- `created_at` - Sort by creation date
- `updated_at` - Sort by last update date
- `orderNumber` - Sort by display order
- `title` - Sort by slider title
- `isActive` - Sort by active status

## Frontend Column Mapping

| Frontend Column | Backend Sort Field | Sortable |
| --------------- | ------------------ | -------- |
| `title`         | `title`            | ✅       |
| `isActive`      | `isActive`         | ✅       |
| `orderNumber`   | `orderNumber`      | ✅       |
| `createdAt`     | `created_at`       | ✅       |
| `updatedAt`     | `updated_at`       | ✅       |
| `imageUrl`      | N/A                | ❌       |
| `actions`       | N/A                | ❌       |

## Benefits

1. **Consistent Sorting**: Frontend and backend sort fields are properly aligned
2. **Type Safety**: Proper TypeScript support for sort field mapping
3. **User Experience**: Only sortable columns show sort indicators
4. **Error Prevention**: Invalid sort fields are automatically mapped to valid
   ones
5. **Maintainability**: Clear mapping makes it easy to add new sortable fields

## Testing

The sorting functionality now works correctly:

- ✅ Sort by title (ascending/descending)
- ✅ Sort by status (active/inactive)
- ✅ Sort by order number
- ✅ Sort by creation date
- ✅ Sort by update date
- ✅ Non-sortable columns don't show sort indicators
- ✅ Invalid sort fields fallback to default (orderNumber)

## Code Changes Summary

1. **columns.tsx**: Added `enableSorting: false` to non-sortable columns
2. **data-fetching.ts**: Added sort mapping and backend field conversion
3. **Maintained**: All existing functionality and type safety

The slider table now provides a smooth, error-free sorting experience that
properly integrates with the backend API.
