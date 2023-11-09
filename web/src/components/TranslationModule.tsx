"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TranslationTextarea from "./TranslationTextarea";
import { Controller } from "@/highlighting/Controller.ts";
import { TranslationData } from "@/highlighting/context.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { MockTranslationService } from "@/service/mock-translation.ts";

export default function TranslationModule() {
  const [inputValue, inputSetValue] = useState("");
  const [inputHighlight, inputSetHighlight] = useState("");

  const [outputValue, outputSetValue] = useState(" ");
  const [outputHighlight, outputSetHighlight] = useState("");

  const [isTranslated, setIsTranslated] = useState(false);

  const controller = new Controller(
    [inputSetValue, outputSetValue],
    [inputSetHighlight, outputSetHighlight],
  );

  const [isLoading, setIsLoading] = useState(false);
  const translationService = new MockTranslationService();

  function translate() {
    console.log("To be translated: " + inputValue);
    setIsLoading(true);
    const result = translationService.predict(inputValue);
    result.then((tokens) => {
      setIsLoading(false);
      setIsTranslated(true);
      const translationData = new TranslationData(tokens, controller);
      translationData.updateDefault();
    });
  }

  return (
    <>
      {/* Content */}
      <div className="container mx-auto p-4 md:flex">
        {/* Left Column */}
        <div className="w-full md:w-1/2 md:pr-4">
          <Label>Text to Translate</Label>
          <TranslationTextarea
            highlight={inputHighlight}
            value={inputValue}
            onChange={inputSetValue}
            elementId={"textToTranslate"}
            readOnly={isTranslated}
          />
          <div className="mb-4">
            <Button className="bg-primary" onClick={translate}>
              Translate
            </Button>
          </div>
        </div>

        {/* Right Column (Translated Text) */}
        <div className="w-full md:w-1/2 md:pr-4">
          <Label>Translated Text</Label>
          {!isLoading && (
            <TranslationTextarea
              value={outputValue}
              onChange={outputSetValue}
              highlight={outputHighlight}
              elementId={"translatedText"}
              readOnly={true}
            />
          )}
          {/*  add skeleton */}
          {isLoading && <Skeleton className={"w-full h-[200px] rounded-3"} />}
        </div>
      </div>
    </>
  );
}
