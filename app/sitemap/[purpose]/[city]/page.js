import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITEMAP_API =
  "https://api.meetowner.in/listings/v1/getSitemapData";

export default async function CitySitemap({ params }) {
  const { purpose, city } = await params;

  let sitemap = [];
  try {
    const response = await fetch(SITEMAP_API, { cache: "no-store" });
    if (!response.ok) {
      console.error("Failed to fetch sitemap data:", response.status);
      return notFound();
    }
    const result = await response.json();
    sitemap = Array.isArray(result?.sitemap) ? result.sitemap : [];
  } catch (error) {
    console.error("Sitemap API unavailable:", error);
    return notFound();
  }

  const cityData = sitemap.find((item) => item.city === city);
  if (!cityData) return notFound();

  const subTypes = cityData[purpose]?.subTypes || [];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>
        Properties for {purpose} in {city.replace(/-/g, " ")}
      </h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {subTypes.map((subType) => (
          <li key={subType}>
            <Link href={`/sitemap/${purpose}/${city}/${subType}`}>
              {subType.replace(/-/g, " ").toUpperCase()} for {purpose} in{" "}
              {city.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
