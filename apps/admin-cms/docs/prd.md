## Product Requirements Document (PRD): Professional Glass & Aluminium Website & CMS

**Version:** 1.2 (Final) **Date:** October 24, 2025

#### **Revision History**

- **v1.2 (Oct 24, 2025):** Finalized display logic for "Repairing Service"
  categories to appear in the main section with a visual tag, not in a separate
  section.
- **v1.1 (Oct 24, 2025):** Updated User Roles, confirmed Testimonial star
  ratings, and clarified notification/image requirements.
- **v1.0 (Oct 24, 2025):** Initial document creation.

### 1. Introduction & Overview

#### 1.1. Project Purpose

This project is to develop a modern, professional, and high-performance website
for the "Professional Glass & Aluminium Company." The project consists of two
core components:

1.  **A Public-Facing Website (Client App):** To showcase the company's
    services, portfolio, and expertise, with the primary goal of generating
    qualified leads through a service quotation/contact form.
2.  **An Admin CMS (Controller App):** A secure, password-protected dashboard
    for company administrators to manage all content on the public website
    without needing technical expertise.

#### 1.2. Business Goals

- **Establish a Strong Online Presence:** Create a visually appealing and
  trustworthy digital storefront that reflects the quality of the company's
  work.
- **Increase Lead Generation:** Streamline the process for potential clients to
  request free measurements and quotes, capturing their information directly
  into a manageable system.
- **Showcase Expertise & Build Trust:** Effectively display the company's 10+
  years of experience, project portfolio, and client testimonials to build
  credibility.
- **Centralize Content Management:** Empower the administrative team to easily
  update services, projects, and promotional content, ensuring the website
  remains current.

#### 1.3. Target Audience

- **Homeowners:** Individuals looking for glass and aluminium solutions for
  renovations or new constructions.
- **Business Owners & Office Managers:** Decision-makers seeking solutions for
  commercial spaces.
- **Architects & Contractors:** Professionals looking for reliable partners for
  sourcing and installing glass, aluminium, and UPVC components.

### 2. User Roles & Permissions

This system will have three distinct roles with the following permissions
structure:

| Role            | Description                                                  | Key Permissions                                                                                                                                                                                                                                                                                         |
| :-------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public User** | Any anonymous visitor to the website.                        | ▸ Browse all public pages.<br>▸ Submit the Contact/Quote form.                                                                                                                                                                                                                                          |
| **Admin**       | A logged-in content manager with full content control.       | ▸ **Full CRUD (Create, Read, Update, Delete) on ALL content modules:**<br> - Hero Sliders<br> - Categories & Services<br> - Gallery Projects<br> - Testimonials<br> - About Us Page Content<br> - Global Settings (Logo, Banners, Social Links)<br>▸ Can view and manage all submitted inquiries/forms. |
| **Super Admin** | The primary administrator with full system and user control. | ▸ **All Admin permissions.**<br>▸ **PLUS the exclusive ability to perform User Management:**<br> - Create new Admin or Super Admin accounts.<br> - Edit existing user details and roles.<br> - Block or delete user accounts.                                                                           |

### 3. Functional Requirements - Public Website

#### 3.1. Homepage

- **Hero Section:**
  - **Background:** Full-width cinematic video loop or a high-quality static
    photo of modern interiors with glass elements.
  - **Headline:** "Transform Your Space with Premium Glass, Aluminium & UPVC
    Solutions." (with Bengali translation).
  - **Subheadline:** "From modern glass doors to heavy-duty aluminium frames —
    we deliver quality craftsmanship built to last."
  - **CTA Buttons:** "Get Free Measurement" and "See Our Projects".
- **Trust Row:**
     - A bar below the CTAs displaying: "10+ Years Experience |
    Certified Technicians | On-time Delivery | 24/7 Support".
- **Our Services Section:**
  - **Layout:** A tabbed or card-based interface with three main options:
    **Glass | Aluminium | UPVC**.
  - **Content:** This section will display all active service categories
    together. All categories, including those marked as "Repairing Service,"
    will be integrated into this single display area.
- **Conversion Pro Tip:** A "Get a Quote" button will be present at the bottom
  of every major section.

#### 3.2. Services & Categories

- **Logic & Visual Distinction:**
  - All categories, regardless of their type, will be displayed together in the
    primary services sections.
  - To distinguish repair services, any category where the `isRepairingService`
    flag is set to `true` in the CMS will have a small, non-intrusive **visual
    badge or tag** (e.g., "Repair Service") displayed on its card.
- **Category Page:** A dedicated page for each main category (Glass Works,
  Aluminium Works, etc.). It will display a category banner and list all
  services available under it.
- **Service Detail Page:** A page for each individual service (e.g., Glass
  Door). This will contain a detailed description, more photos, and the
  universal contact/quote form.

#### 3.3. Project Gallery

- **Layout:** A grid or masonry-style layout.
- **Filtering:** Users can filter projects using buttons: **Glass | Aluminium |
  UPVC | Kitchen | Balcony | Facade**.
- **Interaction:**
  - Hovering over a project image reveals a "Before / After" overlay.
  - Each project image will have a tag underneath: "Client Location + Project
    Type".
  - Clicking a project opens a lightbox modal with a larger view, project
    description, and completion time.

#### 3.4. About Us Page

- **Banner:** A full-width banner image at the top of the page.
- **Introduction:** "We are a professional installation team..." intro text.
- **Company Story:** A section with a title, detailed content, and an image
  aligned to the left.
- **Vision Block:** A dedicated block with a title ("Our Vision"), descriptive
  content, and an associated image.
- **Mission Block:** A dedicated block with a title ("Our Mission"), descriptive
  content, and an associated image.
- **Trust Badges:** Icons/text for "ISO Certified Materials | 1-Year Warranty |
  Free Site Visit | Transparent Billing".

#### 3.5. Contact / Quote Section

- **Unified Form:** A single form will be used for general contact and
  service-specific quotes.
- **Form Fields:** Full Name (Required), Phone (Required), Location, Material
  Type (Dropdown: Glass / Aluminium / UPVC), Upload Photo (Optional), Message
  (Required).
- **Form Submission Logic:** When a form is submitted, the data will be stored
  in the database and become visible in the Admin CMS. **No email
  notifications** will be sent to either the admin or the user.
- **Contact Information (Displayed beside the form):** Office Address, Phone
  Number, WhatsApp Chat Button (fixed bottom-right), Working Hours, Embedded
  Google Map.

#### 3.6. Footer

- **Content:** Business logo, short tagline, links (Services, Gallery, About,
  Contact), contact info (phone, WhatsApp, email), map, and social media icons.
- **Copyright:** "Copyright © {Current Year} | All Rights Reserved".

### 4. Functional Requirements - Admin CMS

| Module               | Features                                                                                                                      | Managed By           |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| **Authentication**   | Secure login/logout for Admin and Super Admin roles.                                                                          | System               |
| **Dashboard**        | An overview of recent inquiries and site activity.                                                                            | Admin, Super Admin   |
| **Hero Slider Mgt.** | CRUD for homepage sliders.                                                                                                    | Admin, Super Admin   |
| **Category Mgt.**    | CRUD for categories. Includes a boolean toggle (`isRepairingService`) which will trigger the "Repair" badge on the front end. | Admin, Super Admin   |
| **Service Mgt.**     | CRUD for services under each category.                                                                                        | Admin, Super Admin   |
| **Gallery Mgt.**     | Upload and manage gallery images and their assignments.                                                                       | Admin, Super Admin   |
| **Testimonial Mgt.** | CRUD for client testimonials. The creation/edit form **must include a field to set a star rating from 1 to 5.**               | Admin, Super Admin   |
| **About Page Mgt.**  | A dedicated interface to update all content for the About Us page.                                                            | Admin, Super Admin   |
| **Inquiry Viewer**   | View, filter, and manage all form submissions.                                                                                | Admin, Super Admin   |
| **Global Settings**  | Manage site-wide elements (logo, social URLs, contact info, etc.).                                                            | Admin, Super Admin   |
| **User Management**  | **Exclusive Module:** CRUD for user accounts (invite, edit role, delete).                                                     | **Super Admin Only** |

### 5. Non-Functional Requirements

- **Performance:** All uploaded images must be automatically optimized
  (compressed and resized where appropriate) by the backend to ensure fast page
  load times.
- **Security:** The Admin CMS must be protected against common web
  vulnerabilities (XSS, CSRF). All form submissions must be sanitized.
- **Responsive Design:** The public website must be fully functional and
  visually appealing across all major devices (desktops, tablets, and mobile
  phones).
- **SEO:** The website should be built with SEO best practices, including
  semantic HTML, meta tags, and a sitemap.
- **Usability:** The Admin CMS interface must be clean, logical, and easy for
  non-technical staff to use.
- **Image Handling:** While there are no strict aspect ratio or resolution
  requirements, the front end should gracefully handle various image sizes to
  avoid distorted or broken layouts.
