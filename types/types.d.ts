// types.d.ts
export {};

declare module "#app" {
  interface NuxtApp {
    $api: typeof $fetch;
  }
}
