import React from "react";
import { motion } from "framer-motion";
import NextMan from "./ui/NextMan";
import BoxMan from "./ui/BoxMan";
import PainSection from "./sections/PainSection";
import TextSection from "./sections/TextSection";
import FAQSection from "./sections/FAQSection";
import Navigation from "./sections/Navigation";
import HeroSection from "./sections/Hero";
import Feature from "./ui/Feature";
import MockDevice from "./ui/MockDevice";

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen max-w-screen-lg mx-auto">
      <Navigation />
      <HeroSection />

      <motion.div {...fadeIn}>
        <PainSection />
      </motion.div>

      <NextMan />
      <BoxMan />

      <motion.div {...fadeIn}>
        <TextSection />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="1. Create a project"
          description="Create a project and .... done"
          codeSnippet={`<span class="text-green-500">$</span> npx create-next2app my-app
<span class="text-green-500">$</span> cd my-app
<span class="text-green-500">$</span> npm install`}
          features={[
            {
              title: "Automatic App-related Setup",
              description: "You don't need to setup anything, we already did.",
            },
            {
              title: "Single codebase",
              description:
                "Build Web, IOS, Android apps with the same codebase",
            },
            {
              title: "Best practices for UX",
              description: "We applied best practices for UX",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="2. Start Development"
          description="Begin building your app with modern tools and best practices"
          features={[
            {
              title: "Type Safety",
              description: "Full TypeScript support out of the box",
            },
            {
              title: "Modern Development",
              description: "Hot reloading, automatic builds, and more",
            },
            {
              title: "Performance Optimized",
              description: "Built-in performance optimizations for production",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="3. Deploy Your App"
          description="Deploy your application with confidence"
          features={[
            {
              title: "Automatic Optimization",
              description:
                "Built-in performance optimizations for production builds",
            },
            {
              title: "Cross-Platform Deploy",
              description:
                "Deploy to web, iOS, and Android with a single command",
            },
            {
              title: "CI/CD Ready",
              description: "Seamless integration with popular CI/CD platforms",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="4. Monitor & Scale"
          description="Keep your app running smoothly as you grow"
          features={[
            {
              title: "Real-time Analytics",
              description:
                "Monitor your app's performance and usage in real-time",
            },
            {
              title: "Automatic Updates",
              description: "Push updates to your users seamlessly",
            },
            {
              title: "Scale with Confidence",
              description: "Built to handle growth from day one",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <FAQSection />
      </motion.div>
    </div>
  );
};

export default LandingPage;
