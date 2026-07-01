import NavBar from '@/components/NavBar';
import LikedBooksWrapper from './LikedBooksWrapper';

async function getBooks() {
  try {
    const res = await fetch('http://localhost:8080/api/books', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

export default async function LikedBooksPage() {
  const allBooks = await getBooks();

  return (
    <div className="min-h-screen bg-background pb-xxl">
      <NavBar />
      
      <main className="pt-[120px] max-w-container-max mx-auto px-lg md:px-xl">
        <header className="mb-xl text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Your Liked Books</h1>
          <p className="font-body-lg text-secondary max-w-2xl mx-auto">
            A collection of your favorite literary adventures.
          </p>
        </header>

        <LikedBooksWrapper allBooks={allBooks} />
      </main>
    </div>
  );
}
