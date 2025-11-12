# Postman API Collections

This directory contains comprehensive Postman collections for all API endpoints
in the MOP Backend application. Each collection is organized by module and
includes detailed request/response examples.

## Collections Overview

### 1. Authentication Module (`01-Authentication.postman_collection.json`)

- **User Sign Up** - Register new user accounts
- **User Sign In** - Authenticate users and get access tokens
- **Get Access Token** - Refresh access tokens using refresh tokens

### 2. Users Module (`02-Users.postman_collection.json`)

- **Get Current User** - Get authenticated user information
- **Get All Users** - Retrieve all users with pagination (Super Admin only)
- **Create User** - Create new user accounts (Super Admin only)
- **Get User Details** - Get specific user by ID (Super Admin only)
- **Update User** - Update user information (Super Admin only)
- **Delete User** - Delete user by ID (Super Admin only)

### 3. Sliders Module (`03-Sliders.postman_collection.json`)

- **Get All Sliders** - Retrieve sliders with filtering, sorting, and pagination
- **Get Slider by ID** - Get single slider details
- **Get Sliders Batch** - Get multiple sliders by IDs (query params or body)
- **Create Slider** - Create new hero slider (Admin/Super Admin only)
- **Update Slider** - Update slider by ID (Admin/Super Admin only)
- **Delete Slider** - Delete slider by ID (Admin/Super Admin only)
- **Bulk Delete Sliders** - Delete multiple sliders (Admin/Super Admin only)
- **Reorder Sliders** - Update slider order numbers (Admin/Super Admin only)

### 4. Categories Module (`04-Categories.postman_collection.json`)

- **Get All Categories** - Retrieve categories with filtering and pagination
- **Get Category Details** - Get single category with services and add-ons
- **Create Category** - Create new category (Admin/Super Admin only)
- **Update Category** - Update category by ID (Admin/Super Admin only)
- **Delete Category** - Delete category by ID (Admin/Super Admin only)
- **Get Bulk Categories for Export** - Get selected categories for export
  (Admin/Super Admin only)

### 5. Category Add-ons Module (`05-Category-Add-ons.postman_collection.json`)

- **Add Category Add-ons** - Add add-ons to a category (Admin/Super Admin only)
- **Remove Category Add-ons** - Remove add-ons from a category (Admin/Super
  Admin only)

### 6. Services Module (`06-Services.postman_collection.json`)

- **Get All Services** - Retrieve services with filtering and pagination
- **Get Service Details** - Get single service with add-ons
- **Create Service** - Create new service (Admin/Super Admin only)
- **Update Service** - Update service by ID (Admin/Super Admin only)
- **Delete Service** - Delete service by ID (Admin/Super Admin only)
- **Get Bulk Services for Export** - Get selected services for export
  (Admin/Super Admin only)

### 7. Services Add-ons Module (`07-Services-Add-ons.postman_collection.json`)

- **Add Service Add-on** - Add add-on to a service (Admin/Super Admin only)
- **Remove Service Add-on** - Remove service add-on by ID (Admin/Super Admin
  only)

### 8. Contact Us Module (`08-Contact-Us.postman_collection.json`)

- **Create Contact Inquiry** - Submit new contact form
- **Get All Contact Inquiries** - Retrieve contact inquiries with filtering
- **Get Contact Details** - Get single contact inquiry details
- **Update Contact Status** - Update inquiry status (Admin/Super Admin only)
- **Get Contacts by Status** - Filter contacts by status
- **Get Bulk Contacts for Export** - Get selected contacts for export
- **Delete Contact** - Delete contact inquiry (Admin/Super Admin only)

### 9. Testimonials Module (`09-Testimonials.postman_collection.json`)

- **Get All Testimonials** - Retrieve all testimonials (public access)
- **Get Testimonial Details** - Get single testimonial details
- **Create Testimonial** - Create new testimonial (Admin/Super Admin only)
- **Update Testimonial** - Update testimonial by ID (Admin/Super Admin only)
- **Delete Testimonial** - Delete testimonial by ID (Admin/Super Admin only)

### 10. Gallery Module (`10-Gallery.postman_collection.json`)

- **Get All Gallery** - Retrieve all gallery entries (public access)
- **Get Gallery Details** - Get single gallery entry details
- **Create Gallery Entry** - Create new gallery entry (Admin/Super Admin only)
- **Update Gallery Entry** - Update gallery entry by ID (Admin/Super Admin only)
- **Delete Gallery Entry** - Delete gallery entry by ID (Admin/Super Admin only)

### 11. About Module (`11-About.postman_collection.json`)

- **Get About Page** - Get complete about page data (public access)
- **Update About Page** - Update about page content (Admin/Super Admin only)
- **Get Company Story** - Get company story (public access)
- **Update Company Story** - Update company story (Admin/Super Admin only)
- **Get About Blocks** - Get vision and mission blocks (public access)
- **Update About Blocks** - Update vision and mission blocks (Admin/Super Admin
  only)

### 12. Settings Module (`12-Settings.postman_collection.json`)

- **Get Settings** - Get global settings (public access)
- **Update Settings** - Update global settings (Admin/Super Admin only)

### 13. Uploads Module (`13-Uploads.postman_collection.json`)

- **Delete Image** - Delete image from cloud storage by public ID
- **Delete Image - Not Found** - Handle deletion of non-existent images
- **Delete Image - Invalid Request** - Handle invalid deletion requests

## Setup Instructions

### Quick Import (Recommended)

#### Option 1: Import Master Collection

1. Open Postman
2. Click "Import" button
3. Select `MOP-Backend-Complete.postman_collection.json`
4. Import `MOP-Backend-Environment.postman_environment.json`
5. Set your environment variables

#### Option 2: Import Individual Collections

1. Open Postman
2. Click "Import" button
3. Select all `*.postman_collection.json` files
4. Import `MOP-Backend-Environment.postman_environment.json`
5. Set your environment variables

### Automated Import (Using Script)

Run the merge script to automatically create the master collection:

```bash
node merge-collections.js
```

This will create:

- `MOP-Backend-Complete.postman_collection.json` - Master collection with all
  modules
- `MOP-Backend-Environment.postman_environment.json` - Environment with all
  variables
- `IMPORT_INSTRUCTIONS.md` - Detailed import instructions

### Environment Variables

The environment file (`MOP-Backend-Environment.postman_environment.json`)
includes all necessary variables:

#### Required Variables

- `base_url`: Your API base URL (default: http://localhost:3000)
- `access_token`: JWT access token for authenticated requests
- `refresh_token`: JWT refresh token for token renewal

#### Optional Variables (Auto-populated during testing)

- `user_id`: User ID for user-specific operations
- `slider_id`: Slider ID for slider operations
- `category_id`: Category ID for category operations
- `service_id`: Service ID for service operations
- `contact_id`: Contact ID for contact operations
- `testimonial_id`: Testimonial ID for testimonial operations
- `gallery_id`: Gallery ID for gallery operations
- `public_id`: Public ID for image operations

### Authentication Workflow

1. Use the Authentication module to sign up/sign in
2. Copy the `accessToken` from the response
3. Set the `access_token` environment variable
4. All protected endpoints will automatically use this token

### Usage Tips

- Start with the Authentication module to get your access token
- Use the Users module to manage user accounts (Super Admin only)
- Test public endpoints first (Testimonials, Gallery, About, Settings)
- Use the Uploads module to manage cloud storage images
- All collections include example requests and responses

## API Features

### Common Query Parameters

Most GET endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `sort_by` - Field to sort by
- `sort_order` - Sort direction (asc/desc)
- `from_date` - Start date filter (ISO format)
- `to_date` - End date filter (ISO format)

### Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "pagination": {
    "page": number,
    "limit": number,
    "total_pages": number,
    "total_items": number
  }
}
```

### Authentication

- Public endpoints: No authentication required
- Protected endpoints: Require `Authorization: Bearer {access_token}` header
- Role-based access: Some endpoints require specific user roles (admin,
  superadmin)

### Image Handling

- All image uploads use Cloudinary
- Images include metadata: url, publicId, folder, altText, dimensions, format,
  size
- Use the Uploads collection to delete images from cloud storage

### Error Handling

- Validation errors return 400 status with detailed error messages
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## Usage Examples

### 1. Basic Workflow

1. Import all collections
2. Set up environment variables
3. Use Authentication collection to get access token
4. Use other collections with the access token

### 2. Testing CRUD Operations

1. Create resources using POST endpoints
2. Retrieve resources using GET endpoints
3. Update resources using PUT endpoints
4. Delete resources using DELETE endpoints

### 3. Bulk Operations

- Use batch endpoints for multiple operations
- Export endpoints for data export functionality
- Bulk delete endpoints for multiple deletions

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all entity IDs
- Image URLs are Cloudinary URLs
- Pagination is consistent across all list endpoints
- Error responses include helpful error messages
- All collections include example requests and responses

## Support

For API documentation or support, refer to the main project documentation or
contact the development team.
