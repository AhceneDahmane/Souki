declare module "swagger-ui-react" {
  import { ReactElement } from "react";

  interface SwaggerUIProps {
    spec?: Record<string, unknown>;
    url?: string;
    [key: string]: unknown;
  }

  export default function SwaggerUI(props: SwaggerUIProps): ReactElement;
}
