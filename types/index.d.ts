declare module '*.svg' {
  import * as React from "react";

  const svgString: string;
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };

  export default svgString;
}