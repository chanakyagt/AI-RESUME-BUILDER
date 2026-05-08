"use client";

import { ResumeData } from "@/lib/types";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

interface Props {
  data: ResumeData;
  forPrint?: boolean;
}

export default function ResumePreview({ data, forPrint }: Props) {
  const template = data.template || "modern";
  const cls = forPrint ? "" : "shadow-2xl shadow-black/50 rounded-lg overflow-hidden";

  return (
    <div id="resume-preview" className={cls}>
      {template === "modern" && <ModernTemplate data={data} />}
      {template === "minimal" && <MinimalTemplate data={data} />}
      {template === "classic" && <ClassicTemplate data={data} />}
    </div>
  );
}
