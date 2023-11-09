import { TokenProbScore } from "@/highlighting/context.ts";

export default function SynonymsList({
  synonyms,
}: {
  synonyms: TokenProbScore[];
}) {
  return (
    <div className={"syn-list text-sm"}>
      <div className="font-semibold text-md">Synonyms:</div>
      <br />
      <ul>
        {synonyms.map((synonym, index) => (
          <li key={index}>
            {/*synonym bold, dash, probability as a horizontal bar of corresponding length*/}
            <span className="font-semibold">{synonym.tokenText}</span>
            <span className="text-muted-foreground"> – </span>
            <span className="text-muted-foreground">
              {synonym.prob.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
