// import Link from "next/link";
// import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import Image from "next/image";
// import { useSettings } from "../../../hooks/useSettings";

// const Footer = () => {
//   const { data: settings, isLoading } = useSettings();

//   // Default values as fallback
//   const siteTitle = settings?.siteTitle || "";
//   const siteDescription = settings?.siteDescription || "";
//   const contactAddress = settings?.officeAddress || "";
//   const contactPhone = settings?.contactPhone || "";
//   const contactEmail = settings?.contactEmail || "";
//   const businessHours = settings?.businessHours?.openingText && settings?.businessHours?.closeText
//     ? `${settings.businessHours.openingText}\n${settings.businessHours.closeText}`
//     : "";
//   const logoImage = settings?.logoImage;

//   if (isLoading) {
//     return (
//       <footer className="bg-card border-t border-border">
//         <div className="container mx-auto px-4 py-12">
//           <div className="animate-pulse space-y-8">
//             {/* Company info skeleton */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               <div className="space-y-4">
//                 {/* Logo skeleton */}
//                 <div className="h-12 w-32 bg-muted rounded-lg"></div>
//                 {/* Description skeleton */}
//                 <div className="space-y-2">
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full w-5/6"></div>
//                   <div className="h-3 bg-muted rounded-full w-4/6"></div>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="h-5 bg-muted rounded-md w-24"></div>
//                 <div className="space-y-2">
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full"></div>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="h-5 bg-muted rounded-md w-24"></div>
//                 <div className="space-y-2">
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full"></div>
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <div className="h-5 bg-muted rounded-md w-24"></div>
//                 <div className="space-y-2">
//                   <div className="h-3 bg-muted rounded-full"></div>
//                   <div className="h-3 bg-muted rounded-full"></div>
//                 </div>
//                 {/* Social media icons skeleton */}
//                 <div className="flex space-x-2 pt-2">
//                   <div className="w-8 h-8 bg-muted rounded-full"></div>
//                   <div className="w-8 h-8 bg-muted rounded-full"></div>
//                   <div className="w-8 h-8 bg-muted rounded-full"></div>
//                   <div className="w-8 h-8 bg-muted rounded-full"></div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Bottom bar skeleton */}
//             <div className="border-t pt-6 mt-8">
//               <div className="flex flex-col md:flex-row justify-between items-center">
//                 <div className="h-4 bg-muted rounded-md w-64 mb-4 md:mb-0"></div>
//                 <div className="h-4 bg-muted rounded-md w-32"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     );
//   }

//   return (
//     <footer className="bg-card border-t border-border">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="space-y-4">
//             <div className="flex items-center space-x-2">
//               {logoImage ? (
//                 <div className="relative w-10 h-10">
//                   <Image
//                     src={logoImage.url}
//                     alt={logoImage.altText || siteTitle}
//                     fill
//                     className="rounded-lg object-cover"
//                   />
//                 </div>
//               ) : (
//                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                   <span className="text-white font-bold text-xl">GS</span>
//                 </div>
//               )}
//               <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 {siteTitle}
//               </span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               {siteDescription}
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link
//                   href="/about"
//                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   About Us
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/services"
//                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Services
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/gallery"
//                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Gallery
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact"
//                   className="text-sm text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Services */}
//           <div>
//             <h3 className="font-semibold mb-4 text-foreground">Our Services</h3>
//             <ul className="space-y-2">
//               <li className="text-sm text-muted-foreground">
//                 Glass Installation
//               </li>
//               <li className="text-sm text-muted-foreground">Window Repair</li>
//               <li className="text-sm text-muted-foreground">
//                 Shower Enclosures
//               </li>
//               <li className="text-sm text-muted-foreground">Glass Doors</li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="font-semibold mb-4 text-foreground">Contact Us</h3>
//             <ul className="space-y-3">
//               <li className="flex items-start space-x-2 text-sm text-muted-foreground">
//                 <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <span>{contactAddress}</span>
//               </li>
//               <li className="flex items-start space-x-2 text-sm text-muted-foreground">
//                 <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <span>{contactPhone}</span>
//               </li>
//               <li className="flex items-start space-x-2 text-sm text-muted-foreground">
//                 <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <span>{contactEmail}</span>
//               </li>
//               <li className="flex items-start space-x-2 text-sm text-muted-foreground">
//                 <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
//                 <span>{businessHours}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-border mt-8 pt-8 text-center">
//           <p className="text-sm text-muted-foreground">
//             © {new Date().getFullYear()} {siteTitle}. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
