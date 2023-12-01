import "./App.css";
import TranslationModule from "@/components/TranslationModule.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

import "bulma/css/bulma.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme={"light"}>
      {/*<ModeToggle/>*/}
      <section className="hero">
        <div className="hero-body">
          <div className="container is-max-desktop">
            <div className="columns is-centered">
              <div className="column has-text-centered">
                <h1 className="title is-1 publication-title">
                  En2Ru: Scientific Translator
                </h1>
                <div className="is-size-5 publication-authors">
                  <span className="author-block">
                    <a href="https://github.com/RodionfromHSE">
                      Rodion Khvorostov
                    </a>
                    ,
                  </span>{" "}
                  <span className="author-block">
                    <a href="https://github.com/waleko">Alexander Kovrigin</a>
                  </span>
                </div>
                <div className="is-size-5publication-authors">
                  <span className="author-block">Constructor University</span>
                </div>
                <div className="column has-text-centered">
                  <div className="publication-links">
                    <span className="link-block">
                      <a
                        href="https://github.com/RodionfromHSE/En2Ru-Science-Translator"
                        className="external-link button is-normal is-rounded is-dark"
                      >
                        <span className="icon">
                          <FontAwesomeIcon icon={faGithub} />
                        </span>
                        <span>Code</span>
                      </a>
                    </span>{" "}
                    <span className="link-block">
                      <a
                        href="https://huggingface.co/datasets/waleko/unarXive-en2ru"
                        className="external-link button is-normal is-rounded is-dark"
                      >
                        <span className="icon">🤗</span>
                        <span>Dataset</span>
                      </a>
                    </span>{" "}
                    <span className="link-block">
                      <a
                        href="https://huggingface.co/under-tree/transformer-en-ru"
                        className="external-link button is-normal is-rounded is-dark"
                      >
                        <span className="icon">🤗</span>
                        <span>Model</span>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container is-max-desktop mb-3">
        <div className="columns is-centered">
          <div className="column is-four-fifths">
            <TranslationModule />
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3">Key Features</h2>
              <div className={"columns flex"}>
                <div className={"column flex-1"}>
                  <Card className={"h-full"}>
                    <CardHeader>
                      <CardTitle>Scientific Specificity</CardTitle>
                    </CardHeader>
                    <CardContent className={"p-1"}>
                      <img
                        src={"/media/translation.png"}
                        alt={"Scientific translation"}
                      />
                    </CardContent>

                    <CardFooter className={"p-4"}>
                      <p>
                        Our translator is specialized for scientific content,
                        handling LaTeX expressions and terminology from arXiv
                        papers.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
                <div className={"column flex-1"}>
                  <Card className={"h-full"}>
                    <CardHeader>
                      <CardTitle>Cross-attention visualization</CardTitle>
                    </CardHeader>
                    <CardContent className={"p-0"}>
                      <img
                        src={"/media/attention.png"}
                        alt={"Cross-attention visualized"}
                      />
                    </CardContent>

                    <CardFooter className={"p-4"}>
                      <p>
                        Dynamic hover-highlighting reveals word-to-word
                        connections between original and translated text. This
                        feature helps you compare and validate translations
                        visually, enhancing comprehension between languages.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
                <div className={"column"}>
                  <Card className={"h-full"}>
                    <CardHeader>
                      <CardTitle>Synonyms suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className={"p-0"}>
                      <img
                        src={"/media/synonyms.png"}
                        alt={"Synonyms Visualized"}
                      />
                    </CardContent>

                    <CardFooter className={"p-4"}>
                      <p>
                        Hover over translated words to uncover synonyms. Unveil
                        the model's comprehension, revealing alternate terms and
                        offering a glimpse into the model's linguistic choices.
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3">About</h2>
              <div className="content has-text-justified">
                <p>
                  Welcome to our scientific translation tool designed
                  specifically for English to Russian translations, focusing on
                  scientific content extracted from arXiv papers. Our tool
                  adeptly handles LaTeX formulas and accurately translates
                  scientific terms with precision, surpassing other models in
                  quality.
                </p>
                <p>
                  Our model is based on the{" "}
                  <a
                    href="https://huggingface.co/Helsinki-NLP/opus-mt-en-ru"
                    className="text-blue-500 hover:text-blue-800"
                  >
                    Helsinki-NLP/opus-mt-en-ru
                  </a>{" "}
                  foundation. We have fine-tuned the model with data from{" "}
                  <a
                    href="https://huggingface.co/datasets/saier/unarXive_citrec"
                    className="text-blue-500 hover:text-blue-800"
                  >
                    saier/unarXive_citrec
                  </a>
                  . We've generated reference translations through knowledge
                  distillation using the OpenAI GPT-3.5-Turbo model.
                </p>
                <p>
                  Our model's proficiency is validated through BLEU scoring
                  against reference translations, achieving a commendable BLEU
                  score of 67.20, showcasing its reliability and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <a
              className="icon-link external-link"
              href="https://github.com/keunhong"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
          <div className="columns is-centered">
            <div className="column is-8">
              <div className="content my-footer">
                <p>
                  This website is licensed under a{" "}
                  <a
                    rel="license"
                    className={"text-blue-500 hover:text-blue-800"}
                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                  >
                    Creative Commons Attribution-ShareAlike 4.0 International
                    License
                  </a>
                </p>
                <p>
                  The template was adopted from{" "}
                  <a
                    href={"https://nerfies.github.io/"}
                    className={"text-blue-500 hover:text-blue-800"}
                  >
                    Nerfies
                  </a>{" "}
                  and{" "}
                  <a
                    href={"https://commit-chronicle.github.io/"}
                    className={"text-blue-500 hover:text-blue-800"}
                  >
                    commit-chronicle
                  </a>{" "}
                  and uses{" "}
                  <a
                    href={"https://bulma.io"}
                    className={"text-blue-500 hover:text-blue-800"}
                  >
                    Bulma
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </ThemeProvider>
  );
}

export default App;
