import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import BookmarkCard from '../components/BookmarkCard';
import AddBookmarkModal from '../components/AddBookmarkModal';
import {
  getBookmarks,
  deleteBookmark,
  searchBookmarks,
} from '../services/api';
import type { Bookmark } from '../types';
import './DashboardPage.css';

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch {
      setError('Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      // Empty query → fetch all
      setIsLoading(true);
      try {
        const data = await getBookmarks();
        setBookmarks(data);
      } catch {
        setError('Failed to load bookmarks');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await searchBookmarks(query);
      setBookmarks(data);
    } catch {
      setError('Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteBookmark(id);
        setBookmarks((prev) => prev.filter((b) => b._id !== id));
      } catch {
        setError('Failed to delete bookmark');
      }
    },
    []
  );

  const handleBookmarkAdded = useCallback(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {/* Hero / Toolbar */}
        <div className="dashboard-toolbar">
          <div className="dashboard-toolbar-left">
            <h1 className="dashboard-title">
              Your Bookmarks
              {!isLoading && (
                <span className="dashboard-count">{bookmarks.length}</span>
              )}
            </h1>
            {searchQuery && (
              <p className="dashboard-search-info">
                Showing results for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
          <div className="dashboard-toolbar-right">
            <SearchBar onSearch={handleSearch} />
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
              id="add-bookmark-button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Bookmark
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="dashboard-error">
            <div className="error-message">
              <span>{error}</span>
              <button
                className="btn btn-ghost"
                onClick={fetchBookmarks}
                style={{ marginLeft: 'auto', padding: '0.25rem 0.75rem' }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="dashboard-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bookmark-skeleton"
              >
                <div className="skeleton skeleton-line skeleton-sm" />
                <div className="skeleton skeleton-line skeleton-lg" />
                <div className="skeleton skeleton-line skeleton-md" />
                <div className="skeleton-tags">
                  <div className="skeleton skeleton-tag" />
                  <div className="skeleton skeleton-tag" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && bookmarks.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔖</div>
            <h3>
              {searchQuery
                ? 'No bookmarks found'
                : 'No bookmarks yet'}
            </h3>
            <p>
              {searchQuery
                ? 'Try a different search term'
                : 'Click "Add Bookmark" to save your first link'}
            </p>
            {!searchQuery && (
              <button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                style={{ marginTop: '0.75rem' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Bookmark
              </button>
            )}
          </div>
        )}

        {/* Bookmarks grid */}
        {!isLoading && bookmarks.length > 0 && (
          <div className="dashboard-grid">
            {bookmarks.map((bookmark, index) => (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                onDelete={handleDelete}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBookmarkAdded}
      />
    </div>
  );
}
