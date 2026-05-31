// code authored by Claude Sonnet 4
import React, { useEffect, useState } from 'react';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  manifestPath: string; // path to manifest file (required since all options have manifests)
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  manifestPath
}) => {
  const [manifestContent, setManifestContent] = useState<string | null>(null);
  const [loadingManifest, setLoadingManifest] = useState(false);
  const [manifestError, setManifestError] = useState(false);

  // Load manifest content when modal opens and manifestPath is provided
  useEffect(() => {
    if (!isOpen || !manifestPath) {
      setManifestContent(null);
      setManifestError(false);
      return;
    }

    const loadManifest = async () => {
      setLoadingManifest(true);
      setManifestError(false);
      
      try {
        console.log(`Loading manifest from: ${manifestPath}`);
        const response = await fetch(manifestPath);
        
        if (!response.ok) {
          throw new Error(`Failed to load manifest: ${response.status}`);
        }
        
        const content = await response.text();
        setManifestContent(content);
        console.log('Manifest loaded successfully');
      } catch (error) {
        console.error('Error loading manifest:', error);
        setManifestError(true);
        setManifestContent(null);
      } finally {
        setLoadingManifest(false);
      }
    };

    loadManifest();
  }, [isOpen, manifestPath]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'scroll';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button, lightly animated w local CSS */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
          </div>
        )}

        {/* Manifest content only */}
        <div className="modal-content">
          <div className="manifest-container">
            <div className="manifest-header">
              <h3>Patch Details</h3>
            </div>
            <div className="manifest-content">
              {loadingManifest ? (
                <div className="manifest-loading">
                  <div className="spinner"></div>
                  <p>Loading details...</p>
                </div>
              ) : manifestContent ? (
                <div className="manifest-text">
                  {manifestContent.split('\\n').map((line, index) => (
                    <div key={index}>{line || '\\u00A0'}</div>
                  ))}
                </div>
              ) : manifestError ? (
                <p className="manifest-error">Unable to load patch details</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 8999;
          padding: 20px;
          box-sizing: border-box;
        }

        .modal-container {
          position: relative;
          background: linear-gradient(#444,#444,#533608);
          border-radius: 12px;
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          overflow: overlay;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .modal-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 10;
          background: rgba(0, 0, 0, 0.7);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.2);
          border: 3px #ae7517 solid;
        }

        .modal-header {
          padding: 20px 20px 10px 20px;
          border-bottom: 1px solid #666666;
          text-align: center;
        }

        .modal-header h2 {
          margin: 0 0 8px 0;
          color: #e5e5e5;
          font-size: 1.5rem;
        }

        .modal-header p {
          margin: 0;
          color: #ddd;
          font-size: 0.95rem;
        }

        /* main content container */
        .modal-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: scroll;
        }

        /* manifest container - now the only content */
        .manifest-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          overflow: overlay;
        }

        .manifest-header {
          padding: 15px 20px 10px 20px;
          border-bottom: 1px solid #666;
          background: rgba(0, 0, 0, 0.2);
        }

        .manifest-header h3 {
          margin: 0;
          color: #e5e5e5;
          font-size: 1.1rem;
          text-align: center;
        }

        .manifest-content {
          flex: 1;
          padding: 15px 20px;
          overflow-y: scroll;
          overflow-x: scroll;
          min-height: 0; /* needed for flex shrinking */
          max-height: 100%; /* locked to parent element */
        }

        .manifest-text {
          color: white;
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          max-width: 100%;
          display: block;
          box-sizing: border-box;
        }
        .manifest-text div {
          margin: 0;
          padding: 0;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .manifest-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: left;
          height: 100px;
          color: #ccc;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #666;
          border-top: 2px solid #ae7517;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .manifest-error {
          color: #ff9999;
          font-style: italic;
          text-align: center;
          margin: 20px 0;
        }

        /* mobile responsive display */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 10px;
          }

          .modal-container {
            max-width: 98vw;
            max-height: 98vh;
          }

          .modal-header {
            padding: 15px 15px 8px 15px;
          }

          .modal-header h2 {
            font-size: 1.25rem;
          }

          .modal-close-btn {
            top: 10px;
            right: 10px;
            width: 35px;
            height: 35px;
          }

          .manifest-text {
            font-size: 0.75rem;
          }
        }

        /* ensures modal appears above everything */
        .modal-overlay {
          backdrop-filter: blur(4px);
        }

        /* scrollbar for manifest */
        .manifest-content::-webkit-scrollbar {
          width: 6px;
        }

        .manifest-content::-webkit-scrollbar-track {
          background: #333;
        }

        .manifest-content::-webkit-scrollbar-thumb {
          background: #666;
          border-radius: 3px;
        }

        .manifest-content::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
    </div>
  );
};

export default ImagePreviewModal;