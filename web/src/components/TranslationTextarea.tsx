"use client";

import HighlightWithinTextarea from "react-highlight-within-textarea";

import "./highlights.css";

export default function TranslationTextarea({
  value,
  onChange,
  highlight,
  elementId,
  readOnly = false,
}: {
  value: string;
  onChange: any;
  highlight: any;
  elementId: string;
  readOnly: boolean;
}) {
  return (
    <div
      className="w-full border rounded-lg py-2 px-3 border-input bg-background text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      id={elementId}
    >
      <HighlightWithinTextarea
        value={value}
        highlight={highlight}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={"Enter text here..."}
      />
    </div>
  );
}
