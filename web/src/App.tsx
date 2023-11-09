import "./App.css";
import TranslationModule from "@/components/TranslationModule.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme={"system"} storageKey={"en2ru-ui-theme"}>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <header className="bg-blue-600 dark:bg-secondary py-4 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white mr-4">
                <img
                  src="/translator.jpg"
                  alt="logo"
                  className="w-full h-full rounded-full"
                />
              </div>
              <h1 className="text-2xl font-semibold">
                En2Ru Scientific Translator
              </h1>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className={"flex flex-col items-center"}>
          <TranslationModule />
          <Separator className="my-4" />
          <div className="flex h-5 items-center space-x-4 text-sm">
            <a
              href={"https://github.com/RodionfromHSE/En2Ru-Science-Translator"}
            >
              GitHub
            </a>
            <Separator orientation="vertical" />
            <a href={"https://huggingface.co/datasets/waleko/unarXive-en2ru"}>
              HuggingFace
            </a>
            <Separator orientation="vertical" />
            <div>Blog</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
