"use client";

import { useEffect, useRef } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { openApiSpec } from "@/lib/openapi";

export default function ApiDocsPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const style = document.createElement("style");
    style.textContent = `
      .swagger-ui {
        color: #e4e4e7;
      }
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #fafafa; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info p, .swagger-ui .info li { color: #a1a1aa; }
      .swagger-ui .scheme-container { background: #18181b; box-shadow: none; border: 1px solid #27272a; border-radius: 8px; }
      .swagger-ui .opblock-tag { color: #fafafa; border-bottom: 1px solid #27272a; }
      .swagger-ui .opblock-tag:hover { background: #18181b; }
      .swagger-ui .opblock { border-radius: 8px; border: 1px solid #27272a; background: #18181b; margin: 0 0 12px; }
      .swagger-ui .opblock .opblock-summary { border: none; }
      .swagger-ui .opblock .opblock-summary-description { color: #a1a1aa; }
      .swagger-ui .opblock.opblock-get { border-color: #3b82f6; }
      .swagger-ui .opblock.opblock-post { border-color: #22c55e; }
      .swagger-ui .opblock.opblock-patch { border-color: #eab308; }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #3b82f6; }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #22c55e; }
      .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #eab308; }
      .swagger-ui .opblock-body { background: #18181b; }
      .swagger-ui .opblock-body pre { background: #0a0a0b; color: #e4e4e7; border-radius: 6px; }
      .swagger-ui .opblock-body .opblock-section-header { background: #27272a; border: none; box-shadow: none; }
      .swagger-ui .opblock-body .opblock-section-header h4 { color: #fafafa; }
      .swagger-ui table thead tr td, .swagger-ui table thead tr th { border-bottom: 1px solid #27272a; color: #a1a1aa; }
      .swagger-ui table tbody tr td { border-bottom: 1px solid #27272a; color: #e4e4e7; }
      .swagger-ui .model-box { background: #0a0a0b; border-radius: 6px; }
      .swagger-ui .model { color: #e4e4e7; }
      .swagger-ui .model-title { color: #fafafa; }
      .swagger-ui .model-container { background: #0a0a0b; border-radius: 6px; border: 1px solid #27272a; }
      .swagger-ui .btn { border-radius: 6px; }
      .swagger-ui .btn.execute { background: #22c55e; border-color: #22c55e; }
      .swagger-ui select { background: #27272a; color: #e4e4e7; border-color: #3f3f46; }
      .swagger-ui input[type=text] { background: #27272a; color: #e4e4e7; border-color: #3f3f46; }
      .swagger-ui textarea { background: #0a0a0b; color: #e4e4e7; border-color: #27272a; }
      .swagger-ui .response-controls { background: #18181b; }
      .swagger-ui .response-col_status { color: #e4e4e7; }
      .swagger-ui .response-col_links { color: #a1a1aa; }
      .swagger-ui .responses-inner h4, .swagger-ui .responses-inner h5 { color: #fafafa; }
      .swagger-ui .parameter__name { color: #e4e4e7; }
      .swagger-ui .parameter__type { color: #a1a1aa; }
      .swagger-ui .parameter__in { color: #a1a1aa; }
      .swagger-ui .markdown p, .swagger-ui .markdown li { color: #a1a1aa; }
      .swagger-ui .loading-container { padding: 40px 0; }
      .swagger-ui .loading-container .loading { color: #a1a1aa; }
      .swagger-ui section.models { border: 1px solid #27272a; border-radius: 8px; }
      .swagger-ui section.models.is-open h4 { border-bottom: 1px solid #27272a; }
      .swagger-ui .model-box .model .brace { color: #a1a1aa; }
      .swagger-ui .model-box .model .prop { color: #e4e4e7; }
      .swagger-ui .model-box .model .prop .prop-type { color: #3b82f6; }
      .swagger-ui .prop-type { color: #22c55e; }
      .swagger-ui .response-col_description__inner div.markdown p { color: #e4e4e7; }
    `;
    wrapperRef.current.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] px-4 py-8" ref={wrapperRef}>
      <div className="max-w-7xl mx-auto">
        <SwaggerUI spec={openApiSpec} />
      </div>
    </div>
  );
}
