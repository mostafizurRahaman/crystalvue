-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'superadmin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'blocked', 'pending');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AboutBlockType" AS ENUM ('VISION', 'MISSION');

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "folder" VARCHAR(255),
    "alt_text" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "format" VARCHAR(10),
    "size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "profileUrl" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'user',
    "user_status" "UserStatus" NOT NULL DEFAULT 'pending',
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_sliders" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "button_text" VARCHAR(100),
    "button_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,
    "modified_by" TEXT,
    "image_id" TEXT,

    CONSTRAINT "hero_sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tagline" TEXT,
    "description" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isRepairingService" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isShowHome" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,
    "card_image_id" TEXT,
    "details_image_id" TEXT,

    CONSTRAINT "parent_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "parentCategoryId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image_id" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_addons" (
    "id" UUID NOT NULL,
    "parentCategoryId" UUID NOT NULL,
    "addonText" VARCHAR(255) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_addons" (
    "id" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "addonText" VARCHAR(255) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_us" (
    "id" UUID NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "address" TEXT NOT NULL,
    "parentCategoryId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'PENDING',
    "images" TEXT[],
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "position" VARCHAR(255),
    "company" VARCHAR(255),
    "image_id" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" TEXT NOT NULL,
    "categoryId" UUID,
    "imageId" TEXT NOT NULL,
    "caption" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_page" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "intro_title" VARCHAR(255),
    "intro_subtitle" TEXT,
    "banner_image_id" TEXT,
    "hero_text" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "vision_block_id" TEXT,
    "mission_block_id" TEXT,

    CONSTRAINT "about_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_story" (
    "id" TEXT NOT NULL,
    "about_page_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT NOT NULL,
    "left_image_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_blocks" (
    "id" TEXT NOT NULL,
    "type" "AboutBlockType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "image_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "global_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "site_title" VARCHAR(255) NOT NULL,
    "site_description" TEXT,
    "logo_image_id" TEXT,
    "favicon_image_id" TEXT,
    "meta_image_id" TEXT,
    "contact_email" VARCHAR(255) NOT NULL,
    "contact_phone" VARCHAR(50) NOT NULL,
    "contact_whatsapp" VARCHAR(50),
    "office_address" TEXT NOT NULL,
    "google_map_embed_code" TEXT,
    "social_media_links" JSONB,
    "business_hours" JSONB,
    "seo_meta_title" VARCHAR(255),
    "seo_meta_description" TEXT,
    "seo_keywords" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToHeroSlider" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryToHeroSlider_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "images_public_id_key" ON "images"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "hero_sliders_order_number_idx" ON "hero_sliders"("order_number");

-- CreateIndex
CREATE INDEX "hero_sliders_is_active_idx" ON "hero_sliders"("is_active");

-- CreateIndex
CREATE INDEX "hero_sliders_image_id_idx" ON "hero_sliders"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_categories_name_key" ON "parent_categories"("name");

-- CreateIndex
CREATE INDEX "parent_categories_isActive_idx" ON "parent_categories"("isActive");

-- CreateIndex
CREATE INDEX "parent_categories_isPremium_idx" ON "parent_categories"("isPremium");

-- CreateIndex
CREATE INDEX "parent_categories_isRepairingService_idx" ON "parent_categories"("isRepairingService");

-- CreateIndex
CREATE INDEX "parent_categories_sortOrder_idx" ON "parent_categories"("sortOrder");

-- CreateIndex
CREATE INDEX "categories_card_image_id_idx" ON "parent_categories"("card_image_id");

-- CreateIndex
CREATE INDEX "categories_details_image_id_idx" ON "parent_categories"("details_image_id");

-- CreateIndex
CREATE INDEX "services_parentCategoryId_idx" ON "services"("parentCategoryId");

-- CreateIndex
CREATE INDEX "services_isActive_idx" ON "services"("isActive");

-- CreateIndex
CREATE INDEX "services_image_id_idx" ON "services"("image_id");

-- CreateIndex
CREATE INDEX "category_addons_parentCategoryId_idx" ON "category_addons"("parentCategoryId");

-- CreateIndex
CREATE INDEX "category_addons_isActive_idx" ON "category_addons"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "category_addons_parentCategoryId_addonText_key" ON "category_addons"("parentCategoryId", "addonText");

-- CreateIndex
CREATE INDEX "service_addons_serviceId_idx" ON "service_addons"("serviceId");

-- CreateIndex
CREATE INDEX "service_addons_isActive_idx" ON "service_addons"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "service_addons_serviceId_addonText_key" ON "service_addons"("serviceId", "addonText");

-- CreateIndex
CREATE INDEX "contact_us_created_at_idx" ON "contact_us"("created_at");

-- CreateIndex
CREATE INDEX "contact_us_parentCategoryId_idx" ON "contact_us"("parentCategoryId");

-- CreateIndex
CREATE INDEX "contact_us_serviceId_idx" ON "contact_us"("serviceId");

-- CreateIndex
CREATE INDEX "contact_us_status_idx" ON "contact_us"("status");

-- CreateIndex
CREATE INDEX "testimonials_isActive_idx" ON "testimonials"("isActive");

-- CreateIndex
CREATE INDEX "gallery_categoryId_idx" ON "gallery"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "company_story_about_page_id_key" ON "company_story"("about_page_id");

-- CreateIndex
CREATE UNIQUE INDEX "about_blocks_type_key" ON "about_blocks"("type");

-- CreateIndex
CREATE INDEX "_CategoryToHeroSlider_B_index" ON "_CategoryToHeroSlider"("B");

-- AddForeignKey
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_sliders" ADD CONSTRAINT "hero_sliders_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_categories" ADD CONSTRAINT "parent_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_categories" ADD CONSTRAINT "parent_categories_card_image_id_fkey" FOREIGN KEY ("card_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_categories" ADD CONSTRAINT "parent_categories_details_image_id_fkey" FOREIGN KEY ("details_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "parent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_addons" ADD CONSTRAINT "category_addons_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "parent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_addons" ADD CONSTRAINT "service_addons_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "parent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_us" ADD CONSTRAINT "contact_us_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "parent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_banner_image_id_fkey" FOREIGN KEY ("banner_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_vision_block_id_fkey" FOREIGN KEY ("vision_block_id") REFERENCES "about_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_page" ADD CONSTRAINT "about_page_mission_block_id_fkey" FOREIGN KEY ("mission_block_id") REFERENCES "about_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_story" ADD CONSTRAINT "company_story_about_page_id_fkey" FOREIGN KEY ("about_page_id") REFERENCES "about_page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_story" ADD CONSTRAINT "company_story_left_image_id_fkey" FOREIGN KEY ("left_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "about_blocks" ADD CONSTRAINT "about_blocks_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_settings" ADD CONSTRAINT "global_settings_logo_image_id_fkey" FOREIGN KEY ("logo_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_settings" ADD CONSTRAINT "global_settings_favicon_image_id_fkey" FOREIGN KEY ("favicon_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "global_settings" ADD CONSTRAINT "global_settings_meta_image_id_fkey" FOREIGN KEY ("meta_image_id") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToHeroSlider" ADD CONSTRAINT "_CategoryToHeroSlider_A_fkey" FOREIGN KEY ("A") REFERENCES "parent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToHeroSlider" ADD CONSTRAINT "_CategoryToHeroSlider_B_fkey" FOREIGN KEY ("B") REFERENCES "hero_sliders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
