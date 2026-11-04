import React from "react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import FeatureGrid from "@/components/home/FeatureGrid";
import ClassRail from "@/components/home/ClassRail";
import ExamTracks from "@/components/home/ExamTracks";
import CtaBand from "@/components/home/CtaBand";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Reveal>
          <HowItWorks />
        </Reveal>
        <Reveal>
          <FeatureGrid />
        </Reveal>
        <Reveal>
          <ClassRail />
        </Reveal>
        <Reveal>
          <ExamTracks />
        </Reveal>
        <Reveal>
          <CtaBand />
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
