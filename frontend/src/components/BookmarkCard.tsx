import { useState } from 'react';
import type { Bookmark } from '../types';
import './BookmarkCard.css';

// Each card gets a vibrant background color based on its ID
const CARD_COLORS = [
  'var(--card-yellow)',
  'var(--card-blue)',
  'var(--card-pink)',
  'var(--card-green)',
  'var(--card-lavender)',
  'var(--card-orange)',
  'var(--card-cyan)',
  'var(--card-peach)',
];

function getCardColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CARD_COLORS[Math.abs(hash) % CARD_COLORS.length];
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000
  );
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
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

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const cardColor = getCardColor(bookmark._id);

  return (
    <div
      className={`bookmark-card ${isDeleting ? 'bookmark-card--deleting' : ''}`}
      style={{ ...style, backgroundColor: cardColor }}
      id={`bookmark-${bookmark._id}`}
    >
      {/* Title */}
      <h3 className="bookmark-card__title">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          id={`link-${bookmark._id}`}
        >
          {bookmark.title}
        </a>
      </h3>

      {/* URL — monospace */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bookmark-card__url mono"
      >
        {getDomain(bookmark.url)}
      </a>

      {/* Description */}
      {bookmark.description && (
        <p className="bookmark-card__desc">{bookmark.description}</p>
      )}

      {/* Footer: tags + actions */}
      <div className="bookmark-card__footer">
        {bookmark.tags.length > 0 && (
          <div className="bookmark-card__tags">
            {bookmark.tags.map((tag) => (
              <span key={tag._id} className="tag-pill">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="bookmark-card__meta">
          <span className="bookmark-card__time mono">
            {timeAgo(bookmark.createdAt)}
          </span>
          <button
            className="btn-icon bookmark-card__delete"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete bookmark"
            id={`delete-${bookmark._id}`}
          >
            {isDeleting ? (
              <div className="spinner" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
