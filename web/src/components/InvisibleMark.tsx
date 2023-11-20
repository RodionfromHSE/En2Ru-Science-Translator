import { TokenProbScore, TranslationData } from "@/highlighting/context.ts";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import SynonymsList from "@/components/SynonymsList.tsx";

export default function InvisibleMark(
  synonyms: TokenProbScore[] | undefined,
  translationData: TranslationData,
  highlight_other: any | undefined,
  translation_index: number,
) {
  return (props: any) => {
    let isOpened = false;
    let isHovered = false;

    // FIXME: still buggy
    function updateHighlights() {
      console.log("updateHighlights: " + isOpened + " " + isHovered);
      if (isOpened || isHovered) {
        if (highlight_other) {
          translationData.controller.setHighlights[1 - translation_index](
            highlight_other,
          );
        }
      } else {
        translationData.updateDefault();
      }
    }

    return (
      <>
        <HoverCard
          onOpenChange={(open) => {
            isOpened = open;
            updateHighlights();
          }}
        >
          <HoverCardTrigger asChild>
            <mark
              className={"my-invisible text-primary"}
              onMouseOver={() => {
                isHovered = true;
                updateHighlights();
              }}
              onMouseLeave={() => {
                isHovered = false;
                updateHighlights();
              }}
            >
              {props.children}
            </mark>
          </HoverCardTrigger>
          {synonyms && (
            <HoverCardContent className="w-50">
              <SynonymsList synonyms={synonyms} />
            </HoverCardContent>
          )}
        </HoverCard>
      </>
    );
  };
}
