"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TranslationTextarea from "./TranslationTextarea";
import { Controller } from "@/highlighting/Controller.ts";
import { TranslationData } from "@/highlighting/dataclasses.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { GradioTranslation } from "@/service/gradio-translation.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";

export default function TranslationModule() {
  const [inputValue, inputSetValue] = useState("");
  const [inputHighlight, inputSetHighlight] = useState("");

  const [outputValue, outputSetValue] = useState("");
  const [outputHighlight, outputSetHighlight] = useState("");

  const [isTranslated, setIsTranslated] = useState(false);

  const [controller, _] = useState(
    new Controller(
      [inputSetValue, outputSetValue],
      [inputSetHighlight, outputSetHighlight],
    ),
  );

  const [isLoading, setIsLoading] = useState(false);
  const translationService = new GradioTranslation();

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function translate() {
    if (inputValue === "" || isLoading) {
      return;
    }
    console.log("To be translated: " + inputValue);
    setIsLoading(true);

    // Translation
    const result = translationService.predict(inputValue);
    result
      .then((tokens) => {
        console.log("Translated: " + tokens);
        setIsLoading(false);
        setIsTranslated(true);
        const translationData = new TranslationData(tokens);
        controller.setTranslationData(translationData);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsAlertOpen(true);
      });
  }

  function clearInput() {
    inputSetValue("");
    inputSetHighlight("");
    outputSetValue("");
    outputSetHighlight("");
    setIsTranslated(false);
  }

  function handleInput(inputText: string) {
    inputSetValue(inputText);
    if (isTranslated && inputText !== inputValue) {
      controller.sendGlobalKill();
    }
  }

  return (
    <>
      <AlertDialog open={isAlertOpen}>
        {/*<AlertDialogTrigger>Open</AlertDialogTrigger>*/}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unable to translate</AlertDialogTitle>
            <AlertDialogDescription>
              Sorry, we were unable to process your request. Please try again
              later or try to translate a shorter text.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsAlertOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Content */}
      <div className="container mx-auto p-4 md:flex">
        {/* Left Column */}
        <div className="w-full md:w-1/2 md:pr-4 mb-3">
          <Label>Text to Translate</Label>
          <TranslationTextarea
            highlight={inputHighlight}
            value={inputValue}
            onChange={handleInput}
            elementId={"textToTranslate"}
            placeholder={"Enter text here..."}
            readOnly={isLoading}
          />
          <div className="mt-4">
            <Button
              className="primary"
              onClick={translate}
              disabled={isLoading}
            >
              Translate
            </Button>{" "}
            <Button
              variant="outline"
              onClick={() => {
                clearInput();
              }}
              disabled={inputValue === "" || isLoading}
            >
              Clear
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
              placeholder={"Translation will appear here..."}
              elementId={"translatedText"}
              readOnly={true}
            />
          )}
          {/*  add skeleton */}
          {isLoading && <Skeleton className={"w-full h-[13em] rounded-3"} />}
        </div>
      </div>
    </>
  );
}
