# MOP Backend Postman Collections - Import Instructions

## Quick Import (Recommended)

### Option 1: Import Master Collection
1. Open Postman
2. Click "Import" button
3. Select `MOP-Backend-Complete.postman_collection.json`
4. Import `MOP-Backend-Environment.postman_environment.json`
5. Set your environment variables

### Option 2: Import Individual Collections
1. Open Postman
2. Click "Import" button
3. Select all `*.postman_collection.json` files
4. Import `MOP-Backend-Environment.postman_environment.json`
5. Set your environment variables

## Environment Setup

### Required Variables
- `base_url`: Your API base URL (default: http://localhost:3000)
- `access_token`: JWT access token for authenticated requests
- `refresh_token`: JWT refresh token for token renewal

### Optional Variables (Auto-populated during testing)
- `user_id`: User ID for user-specific operations
- `slider_id`: Slider ID for slider operations
- `category_id`: Category ID for category operations
- `service_id`: Service ID for service operations
- `contact_id`: Contact ID for contact operations
- `testimonial_id`: Testimonial ID for testimonial operations
- `gallery_id`: Gallery ID for gallery operations
- `public_id`: Public ID for image operations

## Authentication Workflow

1. Use the Authentication collection to sign up/sign in
2. Copy the `accessToken` from the response
3. Set the `access_token` environment variable
4. All protected endpoints will automatically use this token

## Usage Tips

- Start with the Authentication module to get your access token
- Use the Users module to manage user accounts (Super Admin only)
- Test public endpoints first (Testimonials, Gallery, About, Settings)
- Use the Uploads module to manage cloud storage images
- All collections include example requests and responses

## Support

For API documentation or support, refer to the main project documentation or contact the development team.
