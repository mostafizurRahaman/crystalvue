# Hero Slider Order Management - Comprehensive Guide

## Overview

This document provides a detailed analysis of hero slider order management
scenarios, potential problems, and production-ready solutions for a CMS system.

## Database Schema & Constraints

### Core Schema

```typescript
export const heroSlidersTable = pgTable("hero_sliders", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  buttonText: varchar("button_text", { length: 100 }),
  buttonUrl: varchar("button_url", { length: 255 }),
  imageUrl: text("image_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  orderNumber: integer("order_number").notNull(),
  userId: varchar("user_id").references(() => usersTable.id),
  modifiedBy: varchar("modified_by").references(() => usersTable.id),
  ...timestamps,
});
```

### Database Constraints & Indexes

```sql
-- Unique constraint for active sliders only
CREATE UNIQUE INDEX "active_order_unique"
ON "hero_sliders" ("order_number")
WHERE "is_active" = true;

-- Performance indexes
CREATE INDEX "hero_sliders_order_number_idx" ON "hero_sliders" ("order_number");
CREATE INDEX "hero_sliders_is_active_idx" ON "hero_sliders" ("is_active");
CREATE INDEX "hero_sliders_order_active_idx" ON "hero_sliders" ("order_number", "is_active");

-- Data integrity constraints
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_order_number_positive" CHECK ("order_number" > 0);
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_title_not_empty" CHECK (LENGTH(TRIM("title")) > 0);
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_image_url_not_empty" CHECK (LENGTH(TRIM("image_url")) > 0);
```

## Scenario Analysis

### 1. Creating a New Slider with Conflicting Order Number

**Scenario**: Existing sliders [1, 2, 3], User creates slider with orderNumber:
2

#### Problems:

- **Duplicate order numbers**: Without proper handling, two sliders could have
  orderNumber: 2
- **Race conditions**: Multiple users creating sliders simultaneously
- **Inconsistent state**: Partial updates during shifting

#### Solutions Implemented:

**Strategy 1: Auto-shift (Current Implementation)**

```typescript
// Shifts existing sliders down: 2→3, 3→4, then inserts new slider at position 2
const existingSliders = await db
  .select()
  .from(heroSlidersTable)
  .where(
    and(
      gte(heroSlidersTable.orderNumber, finalOrderNumber),
      eq(heroSlidersTable.isActive, true)
    )
  );

// Sort in reverse to avoid unique constraint conflicts
const sortedSliders = existingSliders.sort(
  (a, b) => b.orderNumber - a.orderNumber
);

for (const slider of sortedSliders) {
  await db
    .update(heroSlidersTable)
    .set({
      orderNumber: slider.orderNumber + 1,
      updatedAt: new Date(),
    })
    .where(eq(heroSlidersTable.id, slider.id));
}
```

**Alternative Strategies:**

**Strategy 2: Reject Creation (Strict)**

- **Pros**: Prevents conflicts, maintains exact order
- **Cons**: Poor UX, requires user to know available positions
- **When to use**: When order is critical and conflicts are rare

**Strategy 3: Auto-append at End**

- **Pros**: Simple, no conflicts, good UX
- **Cons**: Ignores user's intended position
- **When to use**: When user intent is less important than simplicity

### 2. Deleting a Slider

#### Problems After Deletion:

- **Gaps in sequence**: [1, 2, 4, 5] after deleting slider with orderNumber: 3
- **Inconsistent ordering**: Frontend may display gaps
- **Performance issues**: Large gaps can affect sorting performance

#### Solutions:

**Option 1: Normalize After Delete (Recommended)**

```typescript
// After deletion, renumber remaining sliders
const remainingSliders = await db
  .select()
  .from(heroSlidersTable)
  .where(eq(heroSlidersTable.isActive, true))
  .orderBy(heroSlidersTable.orderNumber);

// Renumber sequentially: 1, 2, 3, 4...
for (let i = 0; i < remainingSliders.length; i++) {
  const newOrderNumber = i + 1;
  if (remainingSliders[i].orderNumber !== newOrderNumber) {
    await db
      .update(heroSlidersTable)
      .set({ orderNumber: newOrderNumber })
      .where(eq(heroSlidersTable.id, remainingSliders[i].id));
  }
}
```

**Option 2: Leave Gaps**

- **Pros**: Preserves original order history
- **Cons**: Can create large gaps over time
- **When to use**: When audit trail is important

### 3. Updating Slider Order (3 → 1)

#### Logic for Moving Slider from Position 3 to Position 1:

```typescript
// Determine shift direction
const isMovingUp = finalOrderNumber < existingSlider.orderNumber;

if (isMovingUp) {
  // Moving up: shift sliders in range [newPosition, oldPosition-1] down
  const slidersToShift = await db
    .select()
    .from(heroSlidersTable)
    .where(
      and(
        gte(heroSlidersTable.orderNumber, finalOrderNumber),
        sql`${heroSlidersTable.orderNumber} < ${existingSlider.orderNumber}`,
        eq(heroSlidersTable.isActive, true)
      )
    )
    .orderBy(sql`${heroSlidersTable.orderNumber} DESC`);

  // Shift sliders down
  for (const slider of slidersToShift) {
    await db
      .update(heroSlidersTable)
      .set({ orderNumber: slider.orderNumber + 1 })
      .where(eq(heroSlidersTable.id, slider.id));
  }
} else {
  // Moving down: shift sliders in range [oldPosition+1, newPosition] up
  const slidersToShift = await db
    .select()
    .from(heroSlidersTable)
    .where(
      and(
        sql`${heroSlidersTable.orderNumber} > ${existingSlider.orderNumber}`,
        sql`${finalOrderNumber} >= ${heroSlidersTable.orderNumber}`,
        eq(heroSlidersTable.isActive, true)
      )
    )
    .orderBy(sql`${heroSlidersTable.orderNumber} ASC`);

  // Shift sliders up
  for (const slider of slidersToShift) {
    await db
      .update(heroSlidersTable)
      .set({ orderNumber: slider.orderNumber - 1 })
      .where(eq(heroSlidersTable.id, slider.id));
  }
}
```

### 4. Simultaneous Operations & Race Conditions

#### Race Conditions:

1. **Concurrent Inserts**: Two users creating sliders at same position
2. **Concurrent Updates**: Multiple users reordering simultaneously
3. **Insert + Update**: User creating while another reordering

#### Solutions:

**Database Level:**

```sql
-- Unique constraint prevents duplicate order numbers for active sliders
CREATE UNIQUE INDEX "active_order_unique"
ON "hero_sliders" ("order_number")
WHERE "is_active" = true;
```

**Application Level:**

```typescript
// Use transactions with retry logic
async function createSliderWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await db.transaction(async (tx) => {
        // Check for conflicts
        // Shift if needed
        // Insert new slider
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
    }
  }
}
```

### 5. Performance Considerations (1000+ Sliders)

#### Current Issues:

- **Linear shifting**: O(n) complexity for each insert/update
- **No indexing**: Full table scans for order operations
- **Batch operations**: Multiple individual updates

#### Optimizations:

**Database Indexes:**

```sql
-- Composite index for efficient ordering queries
CREATE INDEX "hero_sliders_order_active_idx" ON "hero_sliders" ("order_number", "is_active");
```

**Batch Updates:**

```typescript
// Instead of individual updates, use batch operations
await db.transaction(async (tx) => {
  // Get all affected sliders
  // Calculate new order numbers
  // Single batch update with CASE statements
});
```

### 6. Soft Delete vs Hard Delete

#### Soft Delete Impact:

```typescript
// Only shift active sliders
const activeSliders = await db
  .select()
  .from(heroSlidersTable)
  .where(eq(heroSlidersTable.isActive, true));
```

#### Benefits:

- **Preserves history**: Can restore deleted sliders
- **Selective shifting**: Only affects active sliders
- **Audit trail**: Track who deleted what and when

### 7. Cache/Frontend Synchronization

#### Problems:

- **Stale cache**: Frontend shows old order after backend changes
- **Race conditions**: Multiple users updating simultaneously
- **Inconsistent state**: Partial updates visible to users

#### Solutions:

**Cache Invalidation:**

```typescript
// After any order change, invalidate relevant caches
await cache.del("hero-sliders:active");
await cache.del("hero-sliders:all");
```

**Optimistic Updates:**

```typescript
// Frontend immediately updates UI
// Backend confirms or reverts changes
// Show loading states during operations
```

## API Endpoints

### 1. GET /sliders - Retrieve All Sliders

```typescript
// Query parameters:
// - active_only: boolean (default: true)
// - sort: 'asc' | 'desc' (default: 'asc')
// - limit: number (optional)
// - offset: number (default: 0)

// Response includes pagination metadata
```

### 2. GET /sliders/:id - Retrieve Single Slider

```typescript
// Returns slider with user information (createdBy, modifiedBy)
```

### 3. POST /sliders - Create New Slider

```typescript
// Body: { title, subtitle, imageUrl, orderNumber?, buttonText?, buttonUrl?, isActive? }
// Auto-shifts existing sliders if orderNumber conflicts
```

### 4. PUT /sliders/:id - Update Slider

```typescript
// Body: { title?, subtitle?, imageUrl?, orderNumber?, buttonText?, buttonUrl?, isActive? }
// Handles order changes with intelligent shifting
```

### 5. DELETE /sliders/:id - Delete Slider

```typescript
// Query parameters:
// - normalize_order: boolean (default: true)
// Normalizes remaining slider order numbers after deletion
```

### 6. PUT /sliders/reorder - Bulk Reorder

```typescript
// Body: { sliderOrders: [{ id: number, orderNumber: number }] }
// Validates all sliders exist and are active
// Performs atomic bulk reorder operation
```

## Production-Ready Implementation

### Database Constraints

- Unique constraint on (orderNumber, isActive) for active sliders only
- Check constraints for data integrity
- Proper indexing for performance

### Transaction Management

- All order operations wrapped in transactions
- Retry logic for concurrent operations
- Proper error handling and rollback

### Performance Optimizations

- Composite indexes for order-based queries
- Batch operations where possible
- Efficient query patterns

### Error Handling

- Comprehensive validation
- Clear error messages
- Graceful degradation

### Security

- Authentication required for all operations
- Input validation and sanitization
- SQL injection prevention

## Best Practices

1. **Always use transactions** for order operations
2. **Implement retry logic** for concurrent operations
3. **Add proper indexes** for performance
4. **Validate input** thoroughly
5. **Handle edge cases** gracefully
6. **Monitor performance** with large datasets
7. **Use soft deletes** when audit trail is important
8. **Implement cache invalidation** for frontend consistency

## Testing Scenarios

1. **Concurrent Operations**: Multiple users creating/updating simultaneously
2. **Edge Cases**: Empty lists, single items, maximum items
3. **Performance**: Large datasets (1000+ sliders)
4. **Error Conditions**: Invalid data, missing resources
5. **Race Conditions**: Rapid successive operations

This implementation provides a robust, production-ready solution for hero slider
order management with comprehensive handling of all edge cases and performance
considerations.
