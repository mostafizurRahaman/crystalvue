Backend Business Logic Document

1. Core Backend Principles All API logic must adhere to the following principles
   to ensure data integrity and system security. 1.1. Zod Validation
   (Pre-Processing) Mandate: Every API endpoint that accepts a payload (POST,
   PUT) must immediately validate the request body against a dedicated Zod
   schema before any business logic or database/file operation is executed.
   Response: Validation failures must return a 400 Bad Request response with
   explicit validation error messages. 1.2. Atomic Operations (Prisma
   Transactions) Mandate: Any operation involving both a database write (Prisma)
   and an external file operation (Cloudinary Delete) must be wrapped in a
   prisma.$transaction. Goal: Guarantee that either all steps succeed (DB
   updated, file deleted) or all steps fail (transaction rollback, no DB
   change), preventing data drift (e.g., a record deleted but its image orphaned
   in Cloudinary). 1.3. Authorization and Auditing (Middleware) Authorization:
   Middleware will be used on all protected routes to verify the JWT and enforce
   the role (admin or superadmin) as defined in Section 2. Auditing: For all
   major content CRUD operations, the server must automatically populate the
   userId (creator) and/or modifiedBy fields using the data from the
   authenticated user's JWT payload.
2. System Operations (User & Auth Logic) Endpoint Access Logic Execution Flow
   POST /api/auth/login Public 1. Validate credentials via Zod.<br>2. Use Prisma
   to query User by email.<br>3. Verify password hash using bcrypt or similar
   library.<br>4. If valid, generate JWT payload { userId, role } and
   sign.<br>5. Return JWT. (No DB write) POST /api/users Super Admin Only 1.
   Super Admin Middleware Check.<br>2. Validate input (name, email, role,
   password) via Zod.<br>3. Hash the provided password.<br>4. Use
   prisma.user.create() to create the new account with the hashed password and
   specified role.<br>5. Business Constraint: If the Super Admin role is used,
   ensure the system can handle multiple Super Admins if needed, but typically
   limit creation. PUT /api/users/:id Super Admin Only 1. Super Admin Middleware
   Check.<br>2. Validate input. If a new password is provided, re-hash it before
   update.<br>3. Use prisma.user.update().
3. Atomic Media & CRUD Logic This logic is implemented in middleware and
   controllers to ensure data consistency between PostgreSQL and Cloudinary.
   3.1. Atomic Image-Parent Creation (POST Logic) Applies to: HeroSlider,
   Category, Service, Testimonial, Gallery, and About sections. Backend receives
   image metadata (publicId, url, etc.) from the frontend (which pre-uploaded to
   Cloudinary) and the entity's data. Start
   prisma.$transaction.
Step 1: Use prisma.image.create() to store the metadata. Get the new imageId.
Step 2: Use prisma.[ParentModel].create() and link the new entity using the imageId from Step 1.
Commit transaction. (If either step fails, both records are rolled back.)
3.2. Atomic Image-Parent Deletion (DELETE Logic)
Applies to: Deleting any entity with an associated Image record.
Start prisma.$transaction.
   Step 1 (DB Read): Query the entity to be deleted and select its associated
   Image records to retrieve the Cloudinary publicId(s). Step 2 (External): Use
   Cloudinary SDK to asynchronously delete the file(s) using the publicId(s).
   (Wait for success). Step 3 (DB Write): Use prisma.[ParentModel].delete().
   Prisma's cascade logic automatically deletes the linked Image record(s).
   Commit transaction. (If Cloudinary deletion fails, the transaction is rolled
   back; if DB deletion fails, it is rolled back.) 3.3. Atomic Image-Parent
   Update (PUT Logic with Image Change) Backend receives new data, including a
   new image's metadata, and the ID of the entity to update. Start
   prisma.$transaction. Step 1 (DB Read): Retrieve the old publicId from the
   current Image record linked to the entity. Step 2 (External Delete): Use
   Cloudinary SDK to delete the old file using its publicId. (Wait for success).
   Step 3 (DB Write): Delete the old Image record. Step 4 (DB Write): Create the
   new Image record using the metadata received from the client. Get the
   newImageId. Step 5 (DB Write): Update the entity record, setting its imageId
   to newImageId. Commit transaction.
4. Content Management Specific Logic Model API Read Logic (Public) API
   Write/Update Logic (Admin/SuperAdmin) HeroSlider where: { isActive: true },
   orderBy: { orderNumber: 'asc' }. CRUD must enforce orderNumber
   uniqueness/gaps upon creation/update. Must be done atomically. Category
   where: { isActive: true }. CRUD must handle up to two image links
   (cardImageId, detailsImageId). Logic must support the isRepairingService
   boolean flag. Service where: { isActive: true, parentCategoryId: <id> }. CRUD
   ensures parentCategoryId is a valid, existing Category ID. Testimonial where:
   { isActive: true }. CRITICAL: Zod validation must ensure rating is an integer
   and 1 ≤ rating ≤ 5. Gallery where: { isActive: true, categoryId:
   <optional_id> }. CRUD handles linking an image to an optional Category.
   AboutBlock Public read: Fetch two distinct records where type: VISION and
   type: MISSION. CRITICAL: Create/Update logic must fail if trying to create a
   second block of the same type (enforced by the unique constraint on the type
   field). GlobalSetting Public read: Simple GET /api/settings (always returns
   id: 1). All CRUD (which is effectively just Update) operations target the
   single record with id: 1.
5. Lead Management Logic Endpoint Access Logic Execution Flow POST
   /api/contact-us Public 1. Validate payload (including parentCategoryId and
   serviceId) via Zod.<br>2. Business Constraint: Confirm parentCategoryId and
   serviceId exist in DB.<br>3. Use prisma.contactUs.create() to save the
   entry.<br>4. Automatically set status to PENDING by default.<br>5. CRITICAL:
   No email/SMS or external API call is initiated upon successful save (as per
   requirement). GET /api/contact-us Admin/SuperAdmin 1. Fetch all ContactUs
   entries with filtering/pagination/sorting options.<br>2. Must include
   relations to fetch the Category and Service names for context. PUT
   /api/contact-us/:id Admin/SuperAdmin Update the status field (PENDING,
   APPROVED, REJECTED) and any other internal notes.
