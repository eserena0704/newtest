/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ELFSIGHT_INSTAGRAM_WIDGET_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
