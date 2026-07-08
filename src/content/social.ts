export const social = [
  { url: "mailto:me@Khoi-hckh.com", name: "mail" },
  { url: "https://github.com/Khoihckh", name: "github" },
  { url: "https://www.linkedin.com/in/Khoi-Can Duc/", name: "linkedin" },
  { url: "https://x.com/KhoiHckh", name: "x" },
  //{ url: "https://www.instagram.com/Khoihckh/", name: "instagram" },
] as const satisfies { url: string; name: "mail" | "github" | "instagram" | "linkedin" | "x" }[];
