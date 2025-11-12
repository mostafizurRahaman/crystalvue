### 1. Data Relationship & Schema Document

This document explains the purpose of each data model and the relationships
between them, as defined in your Prisma schema. Understanding these
relationships is fundamental to building the application logic.

#### 1.1. Core Models & Purpose

- **`User`**: Represents individuals who can log into the Admin CMS. The `role`
  enum (`admin`, `superadmin`) dictates their access level.
- **`Image`**: A centralized table for all uploaded images. Storing Cloudinary
  metadata (`publicId`, `url`, `folder`, etc.) here allows for efficient
  management and prevents data duplication.
- **`ContactUs`**: Stores every submission from the public-facing contact/quote
  form. It acts as the primary lead generation table.

#### 1.2. Relationship Mapping

The entire system is designed around a set of clear, relational data structures.

**A. User & Content Creation**

- **`User` to `HeroSlider`, `Category`**: A **One-to-Many** relationship. One
  `User` can create or modify many content items. This is primarily for auditing
  purposes (e.g., `createdBy`, `modifiedBy`).

**B. The Central `Image` Model**

The `Image` model acts as a central repository and has multiple relationships,
mostly **One-to-One** from the perspective of the content model.

- **`Image` to `HeroSlider`**: One `HeroSlider` has one `Image`.
- **`Image` to `Category`**: One `Category` has two optional `Image`s (one for
  the `cardImage` and one for the `detailsImage`).
- **`Image` to `Service`**: One `Service` has one optional `Image`.
- **`Image` to `Testimonial`**: One `Testimonial` has one optional `Image` (for
  the client's photo).
- **`Image` to `Gallery`**: The link is through the `Gallery` model. One
  `Gallery` entry has one required `Image`.
- **`Image` to `AboutPage` & Sections**: The `AboutPage`, `CompanyStory`, and
  `AboutBlock` models each have an optional One-to-One relationship with an
  `Image`.

**C. Content Hierarchy (Categories & Services)**

This is the core structure for your service offerings.

- **`Category` to `Service`**: A classic **One-to-Many** relationship. A
  `Category` (e.g., "Glass Works") can contain many `Service`s (e.g., "Glass
  Door," "Shower Enclosure"). The `onDelete: Cascade` rule ensures that if a
  category is deleted, all of its associated services are also deleted.
- **`Category` to `CategoryAddon`**: A **One-to-Many** relationship.
- **`Service` to `ServiceAddon`**: A **One-to-Many** relationship.

**D. Gallery Structure**

- **`Category` to `Gallery`**: A **One-to-Many** relationship. One `Category`
  can have multiple `Gallery` image entries, creating a filterable portfolio.

**E. Lead Capture Structure**

- **`ContactUs` to `Category` & `Service`**: A **Many-to-One** relationship. A
  `ContactUs` submission is linked to the specific `Category` and `Service` the
  user was viewing or selected, providing valuable context for the sales team.

**F. About Us Page Structure**

This is a **One-to-One composition**.

- **`AboutPage` to `CompanyStory`**: The `AboutPage` (which always has `id: 1`)
  has exactly one `CompanyStory`. The `unique` constraint on `aboutPageId` in
  the `CompanyStory` model enforces this.
- **`AboutPage` to `AboutBlock`**: The `AboutPage` has exactly one `AboutBlock`
  of `type: VISION` and one of `type: MISSION`. This is enforced by linking them
  via foreign keys and having a `unique` constraint on the `type` column in
  `AboutBlock`.

#### 1.3. Relational Diagram Overview

```
+------------+       +----------------+       +--------------+
|    User    |------>|   HeroSlider   |------>|     Image    |
+------------+   |   +----------------+       +--------------+
                 |                              ^      ^
                 |                              |      |
+------------+   |   +----------------+       +--------------+
|  Category  |<-+-->|    Service     |------>| ServiceAddon |
+------------+       +----------------+       +--------------+
     |   ^                 |       ^
     |   |                 |       |
     |   +-----------------+-------+----------+
     |                     |                  |
     v                     v                  v
+--------------+      +-----------+      +-------------+
| CategoryAddon|      | ContactUs |      |   Gallery   |
+--------------+      +-----------+      +-------------+
```

---

### 2. Business Logic & API Operations Document

This document outlines the operational logic for each feature, tailored to your
specified tech stack. The guiding principle is **atomicity**: operations that
involve multiple steps (like database writes and file deletions) must succeed or
fail as a single unit.

#### 2.1. Authentication & Authorization (Backend: Express.js, TypeScript)

1.  **Login (`POST /api/auth/login`)**:
    - Receives `email` and `password`.
    - Uses Prisma to find a `User` with the given email.
    - Compares the provided password against the hashed password in the database
      using a library like `bcrypt`.
    - If successful, generates a JSON Web Token (JWT) containing the `userId`
      and `role`.
    - Returns the JWT to the client.
2.  **Authorization Middleware**:
    - All protected admin routes will use this middleware.
    - It will extract the JWT from the `Authorization` header.
    - It will verify the JWT's signature.
    - If valid, it decodes the payload (`userId`, `role`) and attaches it to the
      `request` object for use in subsequent controllers.
    - For Super Admin routes (e.g., `POST /api/users`), the middleware will
      perform an additional check to ensure `req.user.role === 'superadmin'`.

#### 2.2. Image Management (FE: Cloudinary SDK, BE: Cloudinary SDK)

This is a critical, multi-step process.

1.  **Image Upload (Atomic Creation Logic)**:

    - **Step 1 (FE):** When a user selects a file in the CMS, the frontend
      requests a signature from the backend (`GET /api/images/signature`).
    - **Step 2 (BE):** The backend generates a signed token using the Cloudinary
      Node.js SDK and sends it back to the frontend.
    - **Step 3 (FE):** The frontend uses the signature to upload the file
      directly to Cloudinary. This offloads the bandwidth from your server.
    - **Step 4 (FE):** Upon successful upload, Cloudinary returns a JSON
      response with the `public_id`, `url`, `format`, etc.
    - **Step 5 (FE):** When the admin submits the main form (e.g., "Create
      Category"), the frontend includes this Cloudinary JSON object along with
      other form data (name, tagline, etc.).
    - **Step 6 (BE):** The backend API endpoint (e.g., `POST /api/categories`)
      receives the data. Inside a `prisma.$transaction`, it will: a. Create a
      new record in the `Image` table using the data from Cloudinary. b. Create
      the new record in the `Category` table, linking it to the newly created
      `Image` record's ID.
    - This ensures that an image record is only created in your database if the
      corresponding category is also created successfully.

2.  **Image Deletion (Atomic Deletion Logic)**:
    - This logic applies whenever an entity with an image is deleted (e.g.,
      `DELETE /api/categories/:id`).
    - **Step 1 (BE):** Inside the API controller, start a `prisma.$transaction`.
    - **Step 2 (BE):** First, fetch the category to be deleted and its
      associated `Image` relations to get the `public_id`(s).
    - **Step 3 (BE):** Use the Cloudinary Node.js SDK's `destroy` method to
      delete the image from Cloudinary using its `public_id`.
    - **Step 4 (BE):** If the Cloudinary deletion is successful, proceed to
      delete the `Category` record from your database using
      `prisma.category.delete()`. The relation in Prisma will handle the cascade
      deletion of the `Image` record from your own database.
    - **Step 5 (BE):** If any step fails (e.g., Cloudinary API is down), the
      transaction will be rolled back, and no changes will be made to your
      database, preventing orphaned images or records.

#### 2.3. Content CRUD Operations (Backend: Zod, Prisma; Frontend: Tanstack Query)

This pattern applies to Sliders, Categories, Services, Testimonials, etc.

1.  **Create (`POST /api/[content-type]`)**:
    - Backend receives request body.
    - **Zod Validation:** The first step is to parse the request body against a
      predefined Zod schema. If validation fails, a 400 Bad Request response is
      returned immediately.
    - Handles image upload logic as described in 2.2.1.
    - Uses `prisma.[model].create()` to save the new entity.
    - **Frontend (Tanstack Query):** After a successful mutation, the frontend
      will invalidate the corresponding query key (e.g.,
      `queryClient.invalidateQueries(['categories'])`) to automatically refetch
      the list and update the UI.
2.  **Read (`GET /api/[content-type]`)**:
    - **Public Routes:** Will use Prisma queries with
      `where: { isActive: true }` and `orderBy` clauses to fetch only active,
      sorted content for the Next.js frontend.
    - **Admin Routes:** Will fetch all records, regardless of `isActive` status,
      for display in the CMS.
3.  **Update (`PUT /api/[content-type]/:id`)**:
    - Similar to Create, but uses `prisma.[model].update()`.
    - If a new image is uploaded, it must first delete the old image (using the
      logic in 2.2.2) before linking the new one. This entire process must be
      wrapped in a `prisma.$transaction`.
4.  **Delete (`DELETE /api/[content-type]/:id`)**:
    - Follows the atomic image deletion logic described in 2.2.2.

#### 2.4. Lead Generation & Inquiry Form (FE: React Hook Form, Zod; BE: Prisma)

1.  **Frontend Logic**:
    - The form will be managed by `React Hook Form` for optimal performance.
    - Client-side validation will be handled by integrating `React Hook Form`
      with a Zod schema using `@hookform/resolvers/zod`. This provides instant
      feedback to the user.
2.  **Backend Logic (`POST /api/contact-us`)**:
    - The backend will re-validate the incoming data using the same (or a
      similar) Zod schema to ensure data integrity.
    - Upon successful validation, it will use `prisma.contactUs.create()` to
      save the inquiry.
    - The `status` field will automatically default to `PENDING`.
    - No email logic is required as per your specifications. The data is simply
      stored for viewing in the CMS.
