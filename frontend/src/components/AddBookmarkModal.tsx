import { useState, type FormEvent } from 'react';
import { createBookmark } from '../services/api';
import './AddBookmarkModal.css';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBookmarkModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setTagsInput('');
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await createBookmark({
        title: title.trim(),
        url: url.startsWith('http') ? url : `https://${url}`,
        description: description.trim(),
        tags: tags.length > 0 ? tags : undefined,
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create bookmark');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="add-bookmark-modal">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Bookmark</h2>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close modal"
            id="close-modal"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="bookmark-title">Title</label>
            <input
              id="bookmark-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome link"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookmark-url">URL</label>
            <input
              id="bookmark-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookmark-description">Description</label>
            <textarea
              id="bookmark-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this bookmark about? (optional)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookmark-tags">Tags</label>
            <input
              id="bookmark-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, tutorial, javascript"
            />
            <span className="form-hint">Separate tags with commas</span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              id="submit-bookmark"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Saving...
                </>
              ) : (
                <>
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Save Bookmark
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
