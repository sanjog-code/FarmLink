"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Tractor,
  ShoppingCart,
  ArrowLeftRight,
  Truck,
  Shield,
  Star,
  Leaf,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Leaf className="h-4 w-4" />
                Smart India Hackathon 2026
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                From Farm to Your{" "}
                <span className="text-primary">Table</span>, Fresh & Fast
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                FarmLink connects farmers directly with consumers and bulk buyers.
                AI-powered produce grading, smart logistics, and fair pricing
                for India&apos;s agricultural ecosystem.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Browse Marketplace
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { value: "500+", label: "Active Farmers", icon: <Tractor className="h-5 w-5 text-primary" /> },
                { value: "2,000+", label: "Products Listed", icon: <ShoppingCart className="h-5 w-5 text-primary" /> },
                { value: "10,000+", label: "Happy Customers", icon: <Users className="h-5 w-5 text-primary" /> },
                { value: "50+", label: "Districts Covered", icon: <MapPin className="h-5 w-5 text-primary" /> },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="text-center">
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose FarmLink?
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto">
                We leverage technology to transform India&apos;s agricultural supply chain
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Star className="h-6 w-6" />,
                  title: "AI-Powered Grading",
                  description:
                    "Our AI system automatically grades produce quality, ensuring transparency and trust between farmers and buyers.",
                },
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Smart Distance Matching",
                  description:
                    "Find the freshest produce nearest to you. Our ranking algorithm considers quality, distance, and price.",
                },
                {
                  icon: <ArrowLeftRight className="h-6 w-6" />,
                  title: "Bulk Trading Platform",
                  description:
                    "Wholesalers and bulk buyers can directly negotiate with farmers for large orders with competitive pricing.",
                },
                {
                  icon: <Truck className="h-6 w-6" />,
                  title: "Real-time Logistics",
                  description:
                    "Track your orders from farm to doorstep with our integrated logistics tracking system.",
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Secure Payments",
                  description:
                    "Safe and transparent payment system with UPI integration and transaction history.",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Fair Pricing",
                  description:
                    "No middlemen. Farmers set their own prices, ensuring they get fair value for their produce.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="card p-6 hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground">
                Simple steps to start buying or selling fresh produce
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  step: "01",
                  title: "Register",
                  description: "Create your account as a Farmer, Consumer, or Bulk Buyer in minutes.",
                },
                {
                  step: "02",
                  title: "List or Browse",
                  description: "Farmers list their produce. Buyers browse and filter by quality, distance, and price.",
                },
                {
                  step: "03",
                  title: "Order & Deliver",
                  description: "Place orders, track logistics in real-time, and enjoy fresh farm produce.",
                },
              ].map((item) => (
                <motion.div key={item.step} variants={fadeUp} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-primary rounded-2xl p-8 md:p-16 text-center text-primary-foreground"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Agriculture?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers and buyers already using FarmLink
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                    Join as Farmer
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Join as Buyer
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
