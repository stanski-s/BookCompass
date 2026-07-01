"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import BookGallery from "@/components/BookGallery";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (q) queryParams.append("q", q);
        if (category) queryParams.append("category", category);
        
        const res = await fetch(`http://localhost:8080/api/search?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [q, category]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    const currentParams = new URLSearchParams(searchParams.toString());
    if (newCat) {
      currentParams.set("category", newCat);
    } else {
      currentParams.delete("category");
    }
    router.push(`/search?${currentParams.toString()}`);
  };

  return (
    <main className="max-w-container-max mx-auto px-lg md:px-xl pt-24 pb-xl min-h-screen">
      <div className="mb-lg">
        <h1 className="font-headline-md text-on-surface mb-2">Search Results</h1>
        <p className="font-body-lg text-secondary">
          {q ? `Showing results for "${q}"` : "All Books"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-lg">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-low rounded-xl p-md sticky top-24 shadow-sm">
            <h2 className="font-headline-sm mb-4">Filters</h2>
            <div className="mb-4">
              <label className="block font-label-md text-secondary mb-2">Category</label>
              <select 
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 outline-none focus:border-primary font-body-sm"
              >
                <option value="">All Categories</option>
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Programming">Programming</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
          </div>
        </aside>
        
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            </div>
          ) : books.length > 0 ? (
            <BookGallery books={books} />
          ) : (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl">
              <span className="material-symbols-outlined text-outline text-5xl mb-4">search_off</span>
              <h2 className="font-headline-sm text-on-surface mb-2">No results found</h2>
              <p className="font-body-md text-secondary">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
