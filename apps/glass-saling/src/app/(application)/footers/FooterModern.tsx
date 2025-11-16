// // components/layout/FooterModern.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Link from "next/link";
// import Image from "next/image";
// import { Typography } from "@/components/typography";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
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
//   ArrowRight,
//   Sparkles,
//   Zap,
//   Globe,
//   MessageSquare,
//   ExternalLink,
//   Heart,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useSettings } from "../../../../hooks/useSettings";

// gsap.registerPlugin(ScrollTrigger);

// const FooterModern = () => {
//   const footerRef = useRef<HTMLElement>(null);
//   const { data: settings, isLoading } = useSettings();

//   // Default values as fallback
//   const siteTitle = settings?.siteTitle || "";
//   const siteDescription = settings?.siteDescription || "";
//   const contactPhone = settings?.contactPhone || "";
//   const contactEmail = settings?.contactEmail || "";
//   const contactWhatsApp = settings?.contactWhatsApp || "";
//   const businessHours = settings?.businessHours?.openingText && settings?.businessHours?.closeText
//     ? `${settings.businessHours.openingText}\n${settings.businessHours.closeText}`
//     : "";
//   const logoImage = settings?.logoImage;

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // Wave animation
//       gsap.to(".wave-path", {
//         attr: {
//           d: "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
//         },
//         duration: 3,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });

//       // Cards entrance animation
//       gsap.fromTo(
//         ".contact-card",
//         {
//           y: 50,
//           opacity: 0,
//           rotateY: -30,
//           transformPerspective: 1000,
//         },
//         {
//           y: 0,
//           opacity: 1,
//           rotateY: 0,
//           duration: 0.8,
//           stagger: 0.15,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: ".cards-container",
//             start: "top 85%",
//             once: true,
//           },
//         }
//       );

//       // Pulse animation for CTA
//       gsap.to(".pulse-ring", {
//         scale: 1.5,
//         opacity: 0,
//         duration: 2,
//         repeat: -1,
//         ease: "power2.out",
//       });
//     }, footerRef);

//     return () => ctx.revert();
//   }, []);

//   const contactCards = [
//     {
//       icon: Phone,
//       title: "Call Us",
//       content: contactPhone,
//       action: `tel:${contactPhone.replace(/[^\d+]/g, "")}`,
//       color: "from-primary/20 to-primary/5",
//     },
//     {
//       icon: MessageSquare,
//       title: "WhatsApp",
//       content: contactWhatsApp,
//       action: `https://wa.me/${contactWhatsApp.replace(/[^\d+]/g, "")}`,
//       color: "from-accent/20 to-accent/5",
//     },
//     {
//       icon: Mail,
//       title: "Email Us",
//       content: contactEmail,
//       action: `mailto:${contactEmail}`,
//       color: "from-secondary/20 to-secondary/5",
//     },
//   ];

//   // Skeleton loading state
//   if (isLoading) {
//     return (
//       <footer className="relative bg-background overflow-hidden">
//         <div className="relative pt-32 pb-16 gradient-hero">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               {/* Badge skeleton */}
//               <div className="mb-4 h-8 w-40 mx-auto bg-background/20 rounded-full animate-pulse" />
              
//               {/* Title skeleton */}
//               <div className="mb-4 h-12 w-96 mx-auto bg-background/20 rounded-lg animate-pulse" />
              
//               {/* Description skeleton */}
//               <div className="mb-8">
//                 <div className="h-6 w-2/3 mx-auto bg-background/20 rounded-lg animate-pulse mb-2" />
//                 <div className="h-6 w-1/2 mx-auto bg-background/20 rounded-lg animate-pulse" />
//               </div>

//               {/* Button skeleton */}
//               <div className="h-14 w-48 mx-auto bg-background/20 rounded-lg animate-pulse" />
//             </div>

//             {/* Contact cards skeleton */}
//             <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl p-6">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="w-10 h-10 bg-primary/20 rounded-lg animate-pulse" />
//                     <div>
//                       <div className="h-5 w-20 bg-background/20 rounded-md animate-pulse mb-1" />
//                       <div className="h-4 w-32 bg-background/20 rounded-md animate-pulse" />
//                     </div>
//                   </div>
//                   <div className="h-10 w-full bg-background/20 rounded-md animate-pulse" />
//                 </div>
//               ))}
//             </div>

//             {/* Wave skeleton */}
//             <div className="absolute bottom-0 left-0 right-0">
//               <div className="h-16 w-full bg-background/10 animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     );
//   }

//   return (
//     <footer ref={footerRef} className="relative bg-background overflow-hidden">
//       {/* CTA Section with Gradient */}
//       <div className="relative pt-32 pb-16 gradient-hero">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <Badge className="mb-4 bg-background/10 backdrop-blur-sm border-background/20 text-primary-foreground">
//               <Sparkles className="w-3 h-3 mr-1" />
//               Get Started Today
//             </Badge>
//             <Typography
//               variant="Bold_H2"
//               className="mb-4 text-primary-foreground"
//             >
//               Ready to Transform Your Space?
//             </Typography>
//             <Typography
//               variant="Regular_H5"
//               className="text-primary-foreground/90 max-w-2xl mx-auto mb-8"
//             >
//               Get professional glass, aluminium, and UPVC solutions with free
//               consultation
//             </Typography>

//             {/* CTA Button with Pulse Effect */}
//             <div className="relative inline-block">
//               <div className="pulse-ring absolute inset-0 rounded-full bg-background/20" />
//               <Link href="/get-quotation">
//                 <Button
//                   size="lg"
//                   className="relative bg-background text-foreground hover:bg-background/90 shadow-2xl"
//                 >
//                   <Typography variant="SemiBold_H5">Get Free Quote</Typography>
//                   <ArrowRight className="w-5 h-5 ml-2" />
//                 </Button>
//               </Link>
//             </div>
//           </div>

//           {/* Contact Cards */}
//           <div className="cards-container grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//             {contactCards.map((card, index) => (
//               <Card
//                 key={index}
//                 className={cn(
//                   "contact-card group cursor-pointer",
//                   "bg-gradient-to-br backdrop-blur-sm",
//                   "border-background/20 hover:border-background/40",
//                   "transition-all duration-300 hover:shadow-xl",
//                   card.color
//                 )}
//                 onClick={() => window.open(card.action, "_blank")}
//               >
//                 <div className="p-6 text-center">
//                   <div className="inline-flex p-3 rounded-full bg-background/50 mb-3 group-hover:scale-110 transition-transform">
//                     <card.icon className="w-6 h-6 text-primary-foreground" />
//                   </div>
//                   <Typography
//                     variant="SemiBold_H5"
//                     className="mb-1 text-primary-foreground"
//                   >
//                     {card.title}
//                   </Typography>
//                   <Typography
//                     variant="Regular_H6"
//                     className="text-primary-foreground/80"
//                   >
//                     {card.content}
//                   </Typography>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default FooterModern;
