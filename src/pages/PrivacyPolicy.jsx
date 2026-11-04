import React from "react";
import { Link } from "react-router-dom";
import { UserRound, Sparkles, UserCheck, Lock, Baby, RefreshCw, FileText } from "lucide-react";
import LegalLayout, { LegalSection } from "@/components/site/LegalLayout";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro="What Ganita collects, why it is collected, and the control you have over your own study data — in plain language."
      updated="4 November 2026"
    >
      <LegalSection
        icon={FileText}
        title="1. Who this policy covers"
        paragraphs={[
          "Ganita is a maths learning app for students in Classes 6 to 12. This policy explains how we handle personal information when you use the website, practise questions, review your progress, or ask doubts to the AI study buddy.",
        ]}
      />

      <LegalSection
        icon={UserRound}
        title="2. Information we collect"
        paragraphs={["We only collect what is needed to teach you well."]}
        list={[
          {
            label: "Account details",
            text: "Your name and email address, plus the sign-in details managed by our authentication provider. We never see or store your password.",
          },
          {
            label: "Study profile",
            text: "The class, board, state, school (optional), preferred language, learning goal, stream and daily study time you share during onboarding — used to choose the right syllabus and difficulty.",
          },
          {
            label: "Learning activity",
            text: "The practice sets you attempt, your answers, scores, topics and time spent. This is what powers your progress report and tells us which chapters need work.",
          },
          {
            label: "AI study buddy conversations",
            text: "The doubts you type, questions in uploaded photos, and transcripts of your voice notes, together with the tutor's replies — saved so you can revisit a conversation later.",
          },
          {
            label: "Technical information",
            text: "Basic device and browser details and error logs used to keep the app secure and working. We do not use this to advertise to you.",
          },
        ]}
      />

      <LegalSection
        icon={Sparkles}
        title="3. How your doubts are processed by AI"
        paragraphs={[
          "When you send a doubt, the text, image or voice transcript is sent securely to an AI model through our backend to generate an explanation. Your API credentials never sit in the browser, and the answer comes back to your own chat only.",
          "Conversations are private to your account: another student cannot open them, and they are not published anywhere. We do not sell your questions or use them to build advertising profiles.",
        ]}
      />

      <LegalSection
        icon={Lock}
        title="4. How we protect your data"
        paragraphs={[
          "Your account data is visible only to you (and to the app's administrators for support and security). Uploaded question photos are stored privately — they are not on a public link and are only opened for you while you are signed in.",
          "Traffic to and from the app is encrypted, and access to stored data is restricted to what each feature genuinely needs.",
        ]}
      />

      <LegalSection
        icon={UserCheck}
        title="5. Your choices and rights"
        list={[
          {
            label: "Review and correct",
            text: "Your study profile can be edited at any time from onboarding, and you can always see every attempt in your progress page.",
          },
          {
            label: "Delete a conversation",
            text: "Open chat history in the AI study buddy and delete any conversation, or clear the current one. Deleting removes its messages from your account.",
          },
          {
            label: "Close your account",
            text: "Ask us to delete your account and we will remove your profile, practice history and chats, except where the law requires us to keep a record.",
          },
        ]}
      />

      <LegalSection
        icon={Baby}
        title="6. Students under 18"
        paragraphs={[
          "Most of our learners are minors. Ganita is meant to be used with the knowledge of a parent or guardian, and a guardian may contact us at any time to review or delete a student's information.",
        ]}
      />

      <LegalSection
        icon={RefreshCw}
        title="7. Changes to this policy"
        paragraphs={[
          "If we change how the app handles data, we will update this page and its date. Significant changes affecting your account will be communicated in the app.",
        ]}
      >
        <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-6 sm:p-8">
          <h2 className="font-display text-xl tracking-tight">Questions or a deletion request?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Write to the Ganita team with the email address on your account and tell us what you would like reviewed or
            removed. You can also read our{" "}
            <Link to="/cookies" className="font-medium text-foreground underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>
          <Button asChild className="mt-5">
            <Link to="/">Return to home</Link>
          </Button>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
