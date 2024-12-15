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
import FolderStructure from "./ui/FolderStructure";

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
          description="Create a project with a well-organized folder structure"
          codeSnippet={`<span class="text-green-500">$</span> npx create-next2app my-app
<span class="text-green-500">$</span> cd my-app
<span class="text-green-500">$</span> npm install`}
          features={[
            {
              title: "No App Setup needed",
              description:
                "No need to setup anything, we already did it for you",
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
          leftSide={
            <div className="space-y-4">
              <MockDevice />
            </div>
          }
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="2. Develop with Next.js"
          description="Yup. With Next.js that you already know and love"
          codeSnippet={`📁 my-app/
├── 📁 app/
│   ├── layout.tsx
│   └── page.tsx 
├── 📁 components/
│   └── ...
├── ...
├── package.json
└── next.config.js`}
          features={[
            {
              title: "No learning curve",
              description: "Use your knowledge of Next.js",
            },
            {
              title: "Develop what matters",
              description: "No more app setup, develop what matters right away",
            },
            {
              title: "Fast development",
              description:
                "Use your knowledge that you already have to add feature fast",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="3. Test it with your phone"
          description="Test your application right away on your phone"
          codeSnippet={`<span class="text-green-500">$</span> npx next2app dev`}
          features={[
            {
              title: "Download 'next2app' app",
              description: "Download the app from App Store or Google Play",
            },
            {
              title: "Scan QR code",
              description:
                "Scan the QR code from your phone and boom! You are ready to test",
            },
            {
              title: "No more setup",
              description: "No more setup to testing your app. It just works",
            },
          ]}
          leftSide={<MockDevice />}
        />
      </motion.div>

      <motion.div {...fadeIn}>
        <Feature
          title="4. Build & Deploy"
          codeSnippet={`<span class="text-green-500">$</span> npx next2app build`}
          description="Build your app with a single command"
          features={[
            {
              title: "Next.js like experience",
              description:
                "Build your app with a single command, just like you do with Next.js",
            },
            {
              title: "No need to learn deployment",
              description:
                "We simplify deployment as much as we can. All you need to do is just follow the documentation",
            },
            {
              title: "Detail documentation",
              description:
                "I know how deployment is intimidating for web developer. We have detailed documentation for you",
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
