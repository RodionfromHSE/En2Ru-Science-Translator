import "./App.css";
import TranslationModule from "@/components/TranslationModule.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";

function App() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-blue-500 dark:bg-secondary py-4 text-white">
        <div className="container mx-auto">
          <h1 className="text-2xl font-semibold">
            En2Ru Scientific Translator
          </h1>
        </div>
      </header>
      <TranslationModule />
      <HoverCard>
        <HoverCardTrigger asChild>
          <p>Meow</p>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">
                The React Framework – created and maintained by @vercel.
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

export default App;
