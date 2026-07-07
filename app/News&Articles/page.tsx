import { permanentRedirect } from "next/navigation";

export default function LegacyNewsAndArticlesPage() {
  permanentRedirect("/news");
}
