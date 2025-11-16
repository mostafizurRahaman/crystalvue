// // components/layout/Footer.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Link from "next/link";
// import Image from "next/image";
// import { Typography } from "@/components/typography";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   Facebook,
//   Instagram,
//   Twitter,
//   Linkedin,
//   Youtube,
//   Send,
//   ArrowUpRight,
//   Sparkles,
//   ChevronRight,
//   MessageCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useSettings } from "../../../hooks/useSettings";

// gsap.registerPlugin(ScrollTrigger);

// const Footer = () => {
//   const footerRef = useRef<HTMLElement>(null);
//   const { data: settings, isLoading } = useSettings();

//   // Default values as fallback
//   const siteTitle = settings?.siteTitle || "";
//   const siteDescription = settings?.siteDescription || "";
//   const contactAddress = settings?.officeAddress || "";
//   const contactPhone = settings?.contactPhone || "";
//   const contactEmail = settings?.contactEmail || "";
//   const contactWhatsApp = settings?.contactWhatsApp || "";
//   const businessHours = settings?.businessHours?.openingText && settings?.businessHours?.closeText
//     ? `${settings.businessHours.openingText}\n${settings.businessHours.closeText}`
//     : "";
//   const logoImage = settings?.logoImage;
//   const socialMediaLinks = settings?.socialMediaLinks;

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Animate footer sections on scroll
//       gsap.fromTo(
//         ".footer-section",
//         {
//           y: 30,
//           opacity: 0,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           duration: 0.6,
//           stagger: 0.1,
//           ease: "power2.out",
//           scrollTrigger: {
//             trigger: footerRef.current,
//             start: "top 90%",
//             once: true,
//           },
//         }
//       );

//       // Animate social icons
//       gsap.fromTo(
//         ".social-icon",
//         {
//           scale: 0,
//           rotation: -180,
//         },
//         {
//           scale: 1,
//           rotation: 0,
//           duration: 0.5,
//           stagger: 0.05,
//           ease: "back.out(1.7)",
//           scrollTrigger: {
//             trigger: ".social-icons-container",
//             start: "top 95%",
//             once: true,
//           },
//         }
//       );

//       // Float animation for decorative element
//       gsap.to(".float-decoration", {
//         y: -10,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "power1.inOut",
//       });

//       // Hover animations for links
//       const links = gsap.utils.toArray(".footer-link");
//       links.forEach((link: any) => {
//         link.addEventListener("mouseenter", () => {
//           gsap.to(link, { x: 5, duration: 0.3, ease: "power2.out" });
//         });
//         link.addEventListener("mouseleave", () => {
//           gsap.to(link, { x: 0, duration: 0.3, ease: "power2.out" });
//         });
//       });
//     }, footerRef);

//     return () => ctx.revert();
//   }, []);

//   const currentYear = new Date().getFullYear();

//   const quickLinks = [
//     { href: "/about", label: "About Us" },
//     { href: "/services", label: "Services" },
//     { href: "/gallery", label: "Gallery" },
//     { href: "/portfolio", label: "Portfolio" },
//     { href: "/contact", label: "Contact" },
//     { href: "/blog", label: "Blog" },
//   ];

//   const services = [
//     "Glass Installation",
//     "Aluminium Works",
//     "UPVC Solutions",
//     "Window Repair",
//     "Shower Enclosures",
//     "Glass Doors & Partitions",
//   ];

//   const socialLinks = [
//     { Icon: Facebook, href: socialMediaLinks?.facebook || "", label: "Facebook" },
//     { Icon: Instagram, href: socialMediaLinks?.instagram || "", label: "Instagram" },
//     { Icon: Twitter, href: socialMediaLinks?.twitter || "", label: "Twitter" },
//     { Icon: Linkedin, href: socialMediaLinks?.linkedin || "", label: "LinkedIn" },
//     { Icon: Youtube, href: "", label: "YouTube" },
//   ];

//   // Skeleton loading state
//   if (isLoading) {
//     return (
//       <footer className="relative bg-card border-t border-border overflow-hidden">
//         {/* Decorative gradient orb skeleton */}
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse"></div>
        
//         <div className="container mx-auto px-4 py-12 relative z-10">
//           <div className="animate-pulse space-y-8">
//             {/* Header skeleton */}
//             <div className="text-center space-y-4">
//               <div className="h-10 w-40 mx-auto bg-muted rounded-full"></div>
//               <div className="h-6 w-64 mx-auto bg-muted rounded-lg"></div>
//             </div>
            
//             {/* About section skeleton */}
//             <div className="text-center max-w-2xl mx-auto space-y-3">
//               <div className="h-5 w-32 mx-auto bg-muted rounded-lg"></div>
//               <div className="space-y-2">
//                 <div className="h-4 bg-muted rounded-full w-full"></div>
//                 <div className="h-4 bg-muted rounded-full w-5/6 mx-auto"></div>
//                 <div className="h-4 bg-muted rounded-full w-4/6 mx-auto"></div>
//               </div>
//             </div>
            
//             {/* Footer sections skeleton */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               <div className="space-y-4">
//                 <div className="h-6 w-32 bg-muted rounded-lg"></div>
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-32"></div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-36"></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="h-6 w-32 bg-muted rounded-lg"></div>
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-28"></div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-40"></div>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-24"></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="h-6 w-32 bg-muted rounded-lg"></div>
//                 <div className="space-y-3">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-32"></div>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-4">
//                 <div className="h-6 w-32 bg-muted rounded-lg"></div>
//                 <div className="space-y-3">
//                   {/* Business hours skeleton */}
//                   <div className="flex items-center space-x-3">
//                     <div className="w-5 h-5 bg-muted rounded-md"></div>
//                     <div className="h-3 bg-muted rounded-full w-32"></div>
//                   </div>
//                   {/* Social media icons skeleton */}
//                   <div className="flex space-x-2">
//                     <div className="w-8 h-8 bg-muted rounded-full"></div>
//                     <div className="w-8 h-8 bg-muted rounded-full"></div>
//                     <div className="w-8 h-8 bg-muted rounded-full"></div>
//                     <div className="w-8 h-8 bg-muted rounded-full"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Bottom bar skeleton */}
//             <div className="border-t pt-6 mt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="h-4 bg-muted rounded-md w-64 mb-4 md:mb-0"></div>
//                 <div className="h-4 bg-muted rounded-md w-48"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     );
//   }

//   return (
//     <footer
//       ref={footerRef}
//       className="relative bg-card border-t border-border overflow-hidden"
//     >
//       {/* Decorative gradient orb */}
//       <div className="float-decoration absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

//       {/* Newsletter Section */}
//       {/* <div className="bg-muted/30 border-b border-border">
//         <div className="container mx-auto px-4 py-8">
//           <div className="footer-section flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="text-center md:text-left">
//               <Typography variant="SemiBold_H4" className="mb-1">
//                 Stay Updated
//               </Typography>
//               <Typography
//                 variant="Regular_H6"
//                 className="text-muted-foreground"
//               >
//                 Subscribe to get latest updates and offers
//               </Typography>
//             </div>
//             <div className="flex gap-3">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="px-4 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none transition-colors min-w-[250px]"
//               />
//               <Button className="gradient-primary text-primary-foreground group">
//                 Subscribe
//                 <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Main Footer Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
//           {/* Company Info - Spans 2 columns on lg */}
//           <div className="footer-section lg:col-span-2 space-y-4">
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 {logoImage ? (
//                   <div className="relative w-12 h-12 rounded-xl shadow-lg">
//                     <Image
//                       src={logoImage.url}
//                       alt={logoImage.altText || siteTitle}
//                       fill
//                       className="object-contain rounded-xl"
//                     />
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
//                       <Typography
//                         variant="Bold_H4"
//                         className="text-primary-foreground"
//                       >
//                         GS
//                       </Typography>
//                     </div>
//                     <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
//                   </div>
//                 )}
//                 <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
//               </div>
//               <div>
//                 <Typography
//                   variant="Bold_H4"
//                   className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
//                 >
//                   {siteTitle}
//                 </Typography>
//                 <Typography
//                   variant="Regular_H7"
//                   className="text-muted-foreground"
//                 >
//                   Transforming Spaces Since 2014
//                 </Typography>
//               </div>
//             </div>

//             {/* Tagline */}
//             <Typography
//               variant="Regular_H6"
//               className="text-muted-foreground leading-relaxed"
//             >
//               {siteDescription}
//             </Typography>

//             {/* Social Icons */}
//             <div className="social-icons-container">
//               <Typography variant="Medium_H6" className="mb-3">
//                 Follow Us
//               </Typography>
//               <div className="flex gap-2">
//                 {socialLinks.map(({ Icon, href, label }, index) => (
//                   <Link
//                     key={index}
//                     href={href}
//                     aria-label={label}
//                     className="social-icon"
//                   >
//                     <div className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all duration-300 group">
//                       <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="footer-section">
//             <Typography
//               variant="SemiBold_H5"
//               className="mb-4 flex items-center gap-2"
//             >
//               <ChevronRight className="w-4 h-4 text-primary" />
//               Quick Links
//             </Typography>
//             <ul className="space-y-2">
//               {quickLinks.map((link, index) => (
//                 <li key={index}>
//                   <Link
//                     href={link.href}
//                     className="footer-link inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
//                   >
//                     <Typography variant="Regular_H6">{link.label}</Typography>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Services */}
//           <div className="footer-section">
//             <Typography
//               variant="SemiBold_H5"
//               className="mb-4 flex items-center gap-2"
//             >
//               <ChevronRight className="w-4 h-4 text-primary" />
//               Our Services
//             </Typography>
//             <ul className="space-y-2">
//               {services.map((service, index) => (
//                 <li key={index}>
//                   <Typography
//                     variant="Regular_H6"
//                     className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
//                   >
//                     {service}
//                   </Typography>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="footer-section">
//             <Typography
//               variant="SemiBold_H5"
//               className="mb-4 flex items-center gap-2"
//             >
//               <ChevronRight className="w-4 h-4 text-primary" />
//               Contact Us
//             </Typography>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-2 group cursor-pointer">
//                 <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <Typography
//                   variant="Regular_H6"
//                   className="text-muted-foreground group-hover:text-foreground transition-colors whitespace-pre-line"
//                 >
//                   {contactAddress}
//                 </Typography>
//               </li>
//               <li className="flex items-start gap-2 group cursor-pointer">
//                 <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <Typography
//                   variant="Regular_H6"
//                   className="text-muted-foreground group-hover:text-foreground transition-colors"
//                 >
//                   {contactPhone}
//                 </Typography>
//               </li>
//               <li className="flex items-start gap-2 group cursor-pointer">
//                 <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <Typography
//                   variant="Regular_H6"
//                   className="text-muted-foreground group-hover:text-foreground transition-colors"
//                 >
//                   {contactWhatsApp} (WhatsApp)
//                 </Typography>
//               </li>
//               <li className="flex items-start gap-2 group cursor-pointer">
//                 <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <Typography
//                   variant="Regular_H6"
//                   className="text-muted-foreground group-hover:text-foreground transition-colors"
//                 >
//                   {contactEmail}
//                 </Typography>
//               </li>
//               <li className="flex items-start gap-2">
//                 <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <Typography
//                   variant="Regular_H6"
//                   className="text-muted-foreground whitespace-pre-line"
//                 >
//                   {businessHours}
//                 </Typography>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Map Section */}
//         <div className="footer-section mt-12 rounded-xl overflow-hidden border border-border">
//           <div className="relative h-64 bg-muted">
//             {/* Replace with actual map */}
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115776.71566917506!2d51.424935!3d25.2854473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c534ffdce5fb%3A0x44d9319f78cfd4b1!2sDoha%2C%20Qatar!5e0!3m2!1sen!2s!4v1234567890"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//               className="opacity-90"
//             />
//             <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
//               <Typography
//                 variant="SemiBold_H6"
//                 className="flex items-center gap-2"
//               >
//                 <MapPin className="w-4 h-4 text-primary" />
//                 Find Us Here
//               </Typography>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <Separator className="my-8 opacity-50" />

//         <div className="footer-section flex flex-col md:flex-row items-center justify-between gap-4">
//           <Typography
//             variant="Regular_H6"
//             className="text-muted-foreground text-center md:text-left"
//           >
//             © {currentYear} {siteTitle}. All rights reserved.
//           </Typography>

//           <div className="flex flex-wrap items-center gap-4 text-center">
//             <Link href="/privacy">
//               <Typography
//                 variant="Regular_H6"
//                 className="text-muted-foreground hover:text-primary transition-colors"
//               >
//                 Privacy Policy
//               </Typography>
//             </Link>
//             <span className="text-muted-foreground">•</span>
//             <Link href="/terms">
//               <Typography
//                 variant="Regular_H6"
//                 className="text-muted-foreground hover:text-primary transition-colors"
//               >
//                 Terms of Service
//               </Typography>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Back to top button */}
//       <button
//         onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//         className="fixed bottom-8 right-8 w-12 h-12 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center opacity-0 hover:scale-110 transition-all duration-300 z-50"
//         style={{ opacity: 1 }}
//       >
//         <ArrowUpRight className="w-5 h-5" />
//       </button>
//     </footer>
//   );
// };

// export default Footer;
