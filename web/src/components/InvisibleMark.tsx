import { TokenProbScore } from "@/highlighting/dataclasses.ts";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card.tsx";
import SynonymsList from "@/components/SynonymsList.tsx";
import { useEffect, useState } from "react";
import { Controller } from "@/highlighting/Controller.ts";

export class MarkId {
  constructor(index: number, pos: number) {
    this.index = index;
    this.pos = pos;
  }

  index: number;
  pos: number;

  toInt() {
    const sign = this.index == 0 ? 1 : -1;
    return sign * (this.pos + 1);
  }

  equals(other: MarkId) {
    return this.index == other.index && this.pos == other.pos;
  }
}

export default function InvisibleMark(
  synonyms: TokenProbScore[] | undefined,
  mark_id: MarkId,
  controller: Controller,
) {
  return (props: any) => {
    let isOpened = false;
    let isHovered = false;

    const [isKilled, setIsKilled] = useState(false);

    function updateHighlights() {
      if (isOpened || isHovered) {
        controller.activateMark(mark_id);
      } else {
        controller.deactivateMark(mark_id);
      }
    }

    const baseClassName = "my-invisible text-primary";
    const [className, setClassName] = useState(baseClassName);

    function setAttention(attn_style: string) {
      if (attn_style == "killed") {
        setIsKilled(true);
      }
      setClassName(baseClassName + " " + attn_style);
    }

    useEffect(() => {
      controller.registerMark(mark_id, setAttention);
    }, []);

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
              className={className}
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
          {synonyms && !isKilled && (
            <HoverCardContent className="w-50">
              <SynonymsList synonyms={synonyms} />
            </HoverCardContent>
          )}
        </HoverCard>
      </>
    );
  };
}
