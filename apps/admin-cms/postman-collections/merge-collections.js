#!/usr/bin/env node

/**
 * MOP Backend Postman Collections Merger
 *
 * This script automatically merges all individual Postman collections
 * into a single master collection with organized folders.
 *
 * Usage: node merge-collections.js
 */

const fs = require("fs");
const path = require("path");

// Collection files to merge (in order)
const collectionFiles = [
  "01-Authentication.postman_collection.json",
  "02-Users.postman_collection.json",
  "03-Sliders.postman_collection.json",
  "04-Categories.postman_collection.json",
  "05-Category-Add-ons.postman_collection.json",
  "06-Services.postman_collection.json",
  "07-Services-Add-ons.postman_collection.json",
  "08-Contact-Us.postman_collection.json",
  "09-Testimonials.postman_collection.json",
  "10-Gallery.postman_collection.json",
  "11-About.postman_collection.json",
  "12-Settings.postman_collection.json",
  "13-Uploads.postman_collection.json",
];

// Module descriptions
const moduleDescriptions = {
  "01-Authentication":
    "API endpoints for user authentication including sign-up, sign-in, and access token management",
  "02-Users":
    "API endpoints for user management including CRUD operations and user profile management",
  "03-Sliders":
    "API endpoints for hero slider management including CRUD operations and reordering",
  "04-Categories":
    "API endpoints for category management including CRUD operations and add-ons",
  "05-Category-Add-ons": "API endpoints for managing category add-ons",
  "06-Services":
    "API endpoints for service management including CRUD operations and add-ons",
  "07-Services-Add-ons": "API endpoints for managing service add-ons",
  "08-Contact-Us":
    "API endpoints for contact form management and inquiry handling",
  "09-Testimonials": "API endpoints for testimonial management",
  "10-Gallery": "API endpoints for gallery management",
  "11-About": "API endpoints for about page content management",
  "12-Settings": "API endpoints for global settings management",
  "13-Uploads":
    "API endpoints for image management and cloud storage operations",
};

function mergeCollections() {
  console.log("🚀 Starting MOP Backend Collections Merger...\n");

  const masterCollection = {
    info: {
      name: "MOP Backend - Complete API Collection",
      description:
        "Complete API collection for MOP Backend application including all modules: Authentication, Users, Sliders, Categories, Services, Contact Us, Testimonials, Gallery, About, Settings, and Uploads.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: [],
    variable: [
      {
        key: "base_url",
        value: "http://localhost:3000",
        type: "string",
      },
      {
        key: "access_token",
        value: "",
        type: "string",
      },
      {
        key: "user_id",
        value: "",
        type: "string",
      },
      {
        key: "slider_id",
        value: "",
        type: "string",
      },
      {
        key: "category_id",
        value: "",
        type: "string",
      },
      {
        key: "service_id",
        value: "",
        type: "string",
      },
      {
        key: "contact_id",
        value: "",
        type: "string",
      },
      {
        key: "testimonial_id",
        value: "",
        type: "string",
      },
      {
        key: "gallery_id",
        value: "",
        type: "string",
      },
      {
        key: "public_id",
        value: "",
        type: "string",
      },
    ],
  };

  let successCount = 0;
  let errorCount = 0;

  collectionFiles.forEach((filename, index) => {
    try {
      const filePath = path.join(__dirname, filename);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        errorCount++;
        return;
      }

      const collectionData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      // Extract module number and name
      const moduleNumber = filename.split("-")[0];
      const moduleName = filename
        .replace(".postman_collection.json", "")
        .replace(/^\d+-/, "");
      const folderName = `${moduleNumber} - ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1).replace(/-/g, " ")}`;

      // Create folder structure
      const folder = {
        name: folderName,
        description:
          moduleDescriptions[
            filename.replace(".postman_collection.json", "")
          ] || `API endpoints for ${moduleName} module`,
        item: collectionData.item || [],
      };

      masterCollection.item.push(folder);
      successCount++;

      console.log(
        `✅ Merged: ${folderName} (${collectionData.item?.length || 0} endpoints)`
      );
    } catch (error) {
      console.log(`❌ Error processing ${filename}: ${error.message}`);
      errorCount++;
    }
  });

  // Write the merged collection
  try {
    const outputPath = path.join(
      __dirname,
      "MOP-Backend-Complete.postman_collection.json"
    );
    fs.writeFileSync(outputPath, JSON.stringify(masterCollection, null, 2));

    console.log(`\n🎉 Successfully created master collection!`);
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   ✅ Successfully merged: ${successCount} collections`);
    console.log(`   ❌ Errors: ${errorCount} collections`);
    console.log(
      `   📋 Total endpoints: ${masterCollection.item.reduce((total, folder) => total + folder.item.length, 0)}`
    );
  } catch (error) {
    console.log(`❌ Error writing master collection: ${error.message}`);
  }
}

function createEnvironmentFile() {
  console.log("\n🔧 Creating environment file...");

  const environment = {
    id: "mop-backend-environment",
    name: "MOP Backend Environment",
    values: [
      {
        key: "base_url",
        value: "http://localhost:3000",
        type: "default",
        enabled: true,
      },
      {
        key: "access_token",
        value: "",
        type: "secret",
        enabled: true,
      },
      {
        key: "refresh_token",
        value: "",
        type: "secret",
        enabled: true,
      },
      {
        key: "user_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "slider_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "category_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "service_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "contact_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "testimonial_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "gallery_id",
        value: "",
        type: "default",
        enabled: true,
      },
      {
        key: "public_id",
        value: "",
        type: "default",
        enabled: true,
      },
    ],
    _postman_variable_scope: "environment",
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: "Postman/10.0.0",
  };

  try {
    const envPath = path.join(
      __dirname,
      "MOP-Backend-Environment.postman_environment.json"
    );
    fs.writeFileSync(envPath, JSON.stringify(environment, null, 2));
    console.log(`✅ Environment file created: ${envPath}`);
  } catch (error) {
    console.log(`❌ Error creating environment file: ${error.message}`);
  }
}

function createImportInstructions() {
  console.log("\n📖 Creating import instructions...");

  const instructions = `# MOP Backend Postman Collections - Import Instructions

## Quick Import (Recommended)

### Option 1: Import Master Collection
1. Open Postman
2. Click "Import" button
3. Select \`MOP-Backend-Complete.postman_collection.json\`
4. Import \`MOP-Backend-Environment.postman_environment.json\`
5. Set your environment variables

### Option 2: Import Individual Collections
1. Open Postman
2. Click "Import" button
3. Select all \`*.postman_collection.json\` files
4. Import \`MOP-Backend-Environment.postman_environment.json\`
5. Set your environment variables

## Environment Setup

### Required Variables
- \`base_url\`: Your API base URL (default: http://localhost:3000)
- \`access_token\`: JWT access token for authenticated requests
- \`refresh_token\`: JWT refresh token for token renewal

### Optional Variables (Auto-populated during testing)
- \`user_id\`: User ID for user-specific operations
- \`slider_id\`: Slider ID for slider operations
- \`category_id\`: Category ID for category operations
- \`service_id\`: Service ID for service operations
- \`contact_id\`: Contact ID for contact operations
- \`testimonial_id\`: Testimonial ID for testimonial operations
- \`gallery_id\`: Gallery ID for gallery operations
- \`public_id\`: Public ID for image operations

## Authentication Workflow

1. Use the Authentication collection to sign up/sign in
2. Copy the \`accessToken\` from the response
3. Set the \`access_token\` environment variable
4. All protected endpoints will automatically use this token

## Usage Tips

- Start with the Authentication module to get your access token
- Use the Users module to manage user accounts (Super Admin only)
- Test public endpoints first (Testimonials, Gallery, About, Settings)
- Use the Uploads module to manage cloud storage images
- All collections include example requests and responses

## Support

For API documentation or support, refer to the main project documentation or contact the development team.
`;

  try {
    const instructionsPath = path.join(__dirname, "IMPORT_INSTRUCTIONS.md");
    fs.writeFileSync(instructionsPath, instructions);
    console.log(`✅ Import instructions created: ${instructionsPath}`);
  } catch (error) {
    console.log(`❌ Error creating instructions: ${error.message}`);
  }
}

// Main execution
if (require.main === module) {
  mergeCollections();
  createEnvironmentFile();
  createImportInstructions();

  console.log("\n🎯 Next Steps:");
  console.log(
    "1. Import MOP-Backend-Complete.postman_collection.json into Postman"
  );
  console.log(
    "2. Import MOP-Backend-Environment.postman_environment.json into Postman"
  );
  console.log(
    "3. Set your environment variables (base_url, access_token, etc.)"
  );
  console.log("4. Start testing with the Authentication module");
  console.log("\n📚 Read IMPORT_INSTRUCTIONS.md for detailed setup guide");
}

module.exports = {
  mergeCollections,
  createEnvironmentFile,
  createImportInstructions,
};
