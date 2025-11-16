"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  Send,
  User,
  MessageSquare,
  Briefcase,
  Upload,
  ChevronRight,
} from "lucide-react";
import { useSettings } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AsyncSearchableSelect } from "@/components/async-searchable-select";
import { ContactFormData, ContactFormSchema } from "@/api/types/contact.types";
import { createContactUsForm } from "@/api";
import { getAllCategories } from "@/api";
import { getAllServices } from "@/api";
import { MultipleImageUpload } from "@/components/ui/image-uploader";
import type { GalleryImage } from "@/api";
import { cn } from "@/lib/utils";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: settings, isLoading } = useSettings();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      parentCategoryId: "",
      serviceId: "",
      message: "",
      status: "PENDING",
      images: [],
    },
  });

  const fetchCategories = async (searchQuery?: string) => {
    try {
      const response = await getAllCategories({
        search: searchQuery,
        isActive: true,
        limit: 50,
      });
      return {
        data: response.data.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })),
        success: true,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { data: [], success: true };
    }
  };

  const fetchServices = async (searchQuery?: string) => {
    if (!selectedCategory) {
      return { data: [], success: true };
    }
    try {
      const response = await getAllServices({
        search: searchQuery,
        categoryId: selectedCategory,
        isActive: true,
        limit: 50,
      });

      // response.data is already an array of services
      const servicesData = response.data || [];

      const options = {
        data: servicesData
          .filter((service) => service)
          .map((service) => ({
            value: service.id,
            label: service.name || `Service ${service.id}`,
          })),
        success: true,
      };
      return options;
    } catch (error) {
      console.error("Error fetching services:", error);
      return { data: [], success: true };
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setValue("parentCategoryId", categoryId);
    setValue("serviceId", "");
  };

  const onSubmit = async (values: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await createContactUsForm(values);

      if (response.success) {
        toast.success("Your request has been submitted successfully!");
        reset({
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          parentCategoryId: "",
          serviceId: "",
          message: "",
          status: "PENDING",
          images: [],
        });
        setUploadedImages([]);
        setSelectedCategory("");
      } else {
        toast.error(response.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit form");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office",
      content: settings?.officeAddress || "",
      action: "",
      isClickable: false,
    },
    {
      icon: Mail,
      title: "Email",
      content: settings?.contactEmail || "",
      action: settings?.contactEmail ? `mailto:${settings.contactEmail}` : "",
      isClickable: true,
    },
    {
      icon: Phone,
      title: "Phone",
      content: settings?.contactPhone || "",
      action: settings?.contactPhone
        ? `tel:${settings.contactPhone.replace(/\s/g, "")}`
        : "",
      isClickable: true,
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      content: settings?.contactWhatsApp || "",
      action: settings?.contactWhatsApp
        ? `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, "")}`
        : "",
      isClickable: true,
    },
    {
      icon: Clock,
      title: "Hours",
      content: settings?.businessHours?.openingText || "",
      content2: settings?.businessHours?.closeText || "",
      action: "",
      isClickable: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Skeleton */}
        <section className="py-20 gradient-hero">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-pulse">
              <div className="h-14 w-64 mx-auto bg-background/20 rounded-lg" />
              <div className="h-7 w-96 mx-auto bg-background/20 rounded-md" />
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Skeleton */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="space-y-3 animate-pulse">
                    <div className="h-7 w-48 bg-muted rounded-md" />
                    <div className="h-5 w-80 bg-muted/60 rounded-md" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                      <div className="h-5 w-40 bg-muted/60 rounded-md" />
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-muted/60 rounded-md" />
                            <div className="h-10 w-full bg-muted rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Service Information Section */}
                    <div className="space-y-4">
                      <div className="h-5 w-40 bg-muted/60 rounded-md" />
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-20 bg-muted/60 rounded-md" />
                            <div className="h-10 w-full bg-muted rounded-md" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Message Section */}
                    <div className="space-y-4">
                      <div className="h-5 w-32 bg-muted/60 rounded-md" />
                      <div className="space-y-2">
                        <div className="h-4 w-28 bg-muted/60 rounded-md" />
                        <div className="h-32 w-full bg-muted rounded-md" />
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-4">
                      <div className="h-5 w-36 bg-muted/60 rounded-md" />
                      <div className="h-24 w-full bg-muted/40 rounded-lg border-2 border-dashed border-muted" />
                    </div>

                    {/* Submit Button */}
                    <div className="h-12 w-full bg-muted rounded-md" />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Skeleton */}
              <div className="space-y-4">
                {/* Contact Info Cards Skeleton */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="size-9 bg-muted rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-16 bg-muted/60 rounded-md" />
                          <div className="h-4 w-32 bg-muted rounded-md" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Quick Help Card Skeleton */}
                <Card className="bg-muted/50 animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-6 w-40 bg-muted rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="h-4 w-full bg-muted/60 rounded-md" />
                      <div className="h-4 w-3/4 bg-muted/60 rounded-md" />
                    </div>
                    <div className="h-10 w-full bg-muted rounded-md" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Hero Section */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/90">
              Get in touch with us for any inquiries or support
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you
                    within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <User className="w-4 h-4" />
                        Personal Information
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Controller
                            name="fullName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="fullName"
                                placeholder="John Doe"
                                className={
                                  errors.fullName ? "border-destructive" : ""
                                }
                              />
                            )}
                          />
                          {errors.fullName && (
                            <p className="text-sm text-destructive">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number *</Label>
                          <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="phoneNumber"
                                placeholder="+1 (555) 000-0000"
                                className={
                                  errors.phoneNumber ? "border-destructive" : ""
                                }
                              />
                            )}
                          />
                          {errors.phoneNumber && (
                            <p className="text-sm text-destructive">
                              {errors.phoneNumber.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className={
                                  errors.email ? "border-destructive" : ""
                                }
                              />
                            )}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="address"
                                placeholder="123 Main St"
                                className={
                                  errors.address ? "border-destructive" : ""
                                }
                              />
                            )}
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive">
                              {errors.address.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Service Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        Service Information
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <AsyncSearchableSelect
                            placeholder="Select category"
                            searchPlaceholder="Search..."
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                            fetchOptions={fetchCategories}
                            className={
                              errors.parentCategoryId
                                ? "border-destructive"
                                : ""
                            }
                          />
                          <Controller
                            name="parentCategoryId"
                            control={control}
                            render={({ field }) => (
                              <input type="hidden" {...field} />
                            )}
                          />
                          {errors.parentCategoryId && (
                            <p className="text-sm text-destructive">
                              {errors.parentCategoryId.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="service">Service *</Label>
                          <AsyncSearchableSelect
                            placeholder={
                              selectedCategory
                                ? "Select service"
                                : "Select category first"
                            }
                            searchPlaceholder="Search..."
                            value={watch("serviceId") || ""}
                            onValueChange={(value) =>
                              setValue("serviceId", value)
                            }
                            fetchOptions={fetchServices}
                            disabled={!selectedCategory}
                            className={
                              errors.serviceId ? "border-destructive" : ""
                            }
                          />
                          <Controller
                            name="serviceId"
                            control={control}
                            render={({ field }) => (
                              <input type="hidden" {...field} />
                            )}
                          />
                          {errors.serviceId && (
                            <p className="text-sm text-destructive">
                              {errors.serviceId.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message *</Label>
                        <Controller
                          name="message"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              id="message"
                              placeholder="Tell us about your project..."
                              rows={5}
                              className={cn(
                                "resize-none",
                                errors.message ? "border-destructive" : ""
                              )}
                            />
                          )}
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      {/* File Upload */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Upload className="w-4 h-4" />
                          Attachments (Optional)
                        </div>
                        <MultipleImageUpload
                          onImagesChange={(images) => {
                            const galleryImages: GalleryImage[] = images.map(
                              (img) => ({
                                id: img.id,
                                url: img.url,
                                publicId: img.publicId,
                                altText: img.altText,
                                width: img.width,
                                height: img.height,
                                format: img.format,
                              })
                            );
                            setUploadedImages(galleryImages);
                            setValue(
                              "images",
                              images.map((img) => img.url)
                            );
                          }}
                          initialImages={uploadedImages.map((img) => ({
                            id: img.id,
                            url: img.url,
                            publicId: img.publicId,
                            altText: img.altText,
                            width: img.width,
                            height: img.height,
                            format: img.format,
                            size: 0,
                            folder: "contact-forms",
                          }))}
                          maxImages={5}
                          maxSizeMB={5}
                          folder="contact-forms"
                          title=""
                          description="Upload up to 5 images (PNG, JPG, GIF - Max 5MB each)"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full gradient-primary"
                      size="lg"
                      disabled={isSubmitting || formSubmitting}
                    >
                      {isSubmitting || formSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-4">
              {/* Contact Info Cards */}
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className={cn(
                    "group hover:shadow-md transition-shadow",
                    info.isClickable && info.action && "cursor-pointer"
                  )}
                  onClick={() => {
                    if (info.isClickable && info.action) {
                      // For WhatsApp, open in new tab; for email and phone, use default behavior
                      if (info.action.startsWith("https://")) {
                        window.open(info.action, "_blank");
                      } else {
                        window.location.href = info.action;
                      }
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {info.title}
                        </p>
                        <div className="space-y-0.5">
                          {info.content && (
                            <p
                              className={cn(
                                "text-sm font-medium",
                                info.isClickable &&
                                  info.action &&
                                  "text-primary hover:underline",
                                !("content2" in info && info.content2) &&
                                  "truncate"
                              )}
                            >
                              {info.content}
                            </p>
                          )}
                          {"content2" in info && info.content2 && (
                            <p
                              className={cn(
                                "text-sm font-medium",
                                info.isClickable &&
                                  info.action &&
                                  "text-primary hover:underline"
                              )}
                            >
                              {info.content2}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Quick Help Card */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Need immediate help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is available 24/7 to assist you with any
                    urgent matters.
                  </p>
                  {settings?.contactWhatsApp ? (
                    <Button
                      variant="secondary"
                      className="w-full group"
                      onClick={() => {
                        if (settings.contactWhatsApp) {
                          const whatsappLink = `https://wa.me/${settings.contactWhatsApp.replace(/\D/g, "")}`;
                          window.open(whatsappLink, "_blank");
                        }
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact on WhatsApp
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      className="w-full group"
                      disabled
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
