import { Button } from "@/components/ui/button";
import Link from "next/link";

const cta = () => {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Space?
        </h2>
        <p className="text-xl mb-8 text-white/90">
          Get a free consultation and quote today
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact-us">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Get Free Quote
            </Button>
          </Link>
          <Link href="/contact-us">
            <Button
              size="lg"
              variant="outline"
              className="glass-button text-white border-white/30"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
