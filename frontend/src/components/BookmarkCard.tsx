import { useState } from 'react';
import type { Bookmark } from '../types';
import './BookmarkCard.css';

// Generate a consistent color for each tag based on its name
function getTagColor(name: string): string {
  const colors = [
    'var(--tag-1)',
    'var(--tag-2)',
    'var(--tag-3)',
    'var(--tag-4)',
    'var(--tag-5)',
    'var(--tag-6)',
    'var(--tag-7)',
    'var(--tag-8)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  style,
}: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this bookmark?')) return;
    setIsDeleting(true);
    try {
      await onDelete(bookmark._id);
    } catch {
      setIsDeleting(false);
    }
  };

  // Extract domain from URL for display
  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div
      className={`bookmark-card glass-card ${isDeleting ? 'bookmark-card-deleting' : ''}`}
      style={style}
      id={`bookmark-${bookmark._id}`}
    >
      <div className="bookmark-card-header">
        <div className="bookmark-card-favicon">
          <img
            src={`https://www.google.com/s2/favicons?domain=${getDomain(bookmark.url)}&sz=32`}
            alt=""
            width="16"
            height="16"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <span className="bookmark-card-domain">{getDomain(bookmark.url)}</span>
        <button
          className="btn-icon bookmark-delete"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete bookmark"
          id={`delete-${bookmark._id}`}
        >
          {isDeleting ? (
            <div className="spinner" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          )}
        </button>
      </div>

      <h3 className="bookmark-card-title">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          id={`link-${bookmark._id}`}
        >
          {bookmark.title}
        </a>
      </h3>

      {bookmark.description && (
        <p className="bookmark-card-desc">{bookmark.description}</p>
      )}

      <div className="bookmark-card-footer">
        {bookmark.tags.length > 0 && (
          <div className="bookmark-card-tags">
            {bookmark.tags.map((tag) => (
              <span
                key={tag._id}
                className="tag-pill"
                style={{
                  backgroundColor: `color-mix(in srgb, ${getTagColor(tag.name)} 18%, transparent)`,
                  color: getTagColor(tag.name),
                  border: `1px solid color-mix(in srgb, ${getTagColor(tag.name)} 25%, transparent)`,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <span className="bookmark-card-date">
          {formatDate(bookmark.createdAt)}
        </span>
      </div>
    </div>
  );
}
