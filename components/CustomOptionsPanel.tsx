// CustomOptionsPanel.tsx
// code co-authored by Claude Sonnet 4
import React, { useState } from 'react';
import ImagePreviewModal from './ImagePreviewModal';

export interface OptionalPatch {
  id: string;
  name: string;
  description: string;
  filename: string;
  data: Uint8Array;
  category?: string;
  defaultChoice?: string;
  previewImage?: string;
}

export interface PatchCategory {
  id: string;
  title: string;
  description?: string;
  patches: OptionalPatch[];
  allowMultiple?: boolean; // If false, radio button behavior; if true, checkbox behavior
  defaultChoice?: string; // styling feature for baseline options, only one per category
}

interface CustomOptionsPanelProps {
  categories: PatchCategory[];
  selectedPatches: string[]; // Array of patch IDs
  onSelectionChange: (selectedPatchIds: string[]) => void;
  onPreviewImage?: (imageSrc: string, title: string, description: string) => void;
  isDisabled?: boolean;
}

const CustomOptionsPanel: React.FC<CustomOptionsPanelProps> = ({
  categories,
  selectedPatches,
  onSelectionChange,
  onPreviewImage,
  isDisabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<{
    src: string;
    title: string;
    description: string;
    manifestPath: string;
  } | null>(null);

  const handlePreviewClick = (patch: OptionalPatch) => {
  // if (patch.previewImage) {
  // Creates manifest path for fonts category
  const manifestPath = ( patch.category === 'difficulty' ||
                  patch.category === 'graphics' ||
                  patch.category === 'options' )
    ? `/manifests/${patch.name}.txt`  // Pattern for patch.id matches manifest title
    : ``;
  console.log(`Generated ${manifestPath} for manifest text file name.`)
  if (patch.previewImage) {
    setModalProps({
      src: patch.previewImage,
      title: patch.name,
      description: patch.description,
      manifestPath: manifestPath
    });
    setModalOpen(true);
  } else {
    setModalProps({
      src: '/placeholder-image.png',
      title: patch.name,
      description: patch.description,
      manifestPath: manifestPath
    });
    setModalOpen(true);
  }
};

  const handlePatchToggle = (patchId: string, categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    let newSelection = [...selectedPatches];

    if (!category.allowMultiple) {
      // Radio button behavior - only one patch per category
      const categoryPatchIds = category.patches.map(p => p.id);
      newSelection = newSelection.filter(id => !categoryPatchIds.includes(id));
      
      if (!selectedPatches.includes(patchId)) {
        newSelection.push(patchId);
      }
    } else {
      // Checkbox behavior - multiple patches allowed
      if (selectedPatches.includes(patchId)) {
        newSelection = newSelection.filter(id => id !== patchId);
      } else {
        newSelection.push(patchId);
      }
    }

    onSelectionChange(newSelection);
  };

  const isPatchSelected = (patchId: string) => selectedPatches.includes(patchId);
  const getSelectedCount = () => selectedPatches.length;

  if (categories.length === 0) {
    return null;
  }

  // string of defaultChoice debugging
  React.useEffect(() => {
    console.log('=== DEBUG: Categories and Default Choices ===');
    categories.forEach(category => {
      console.log(`Category: ${category.id} (${category.title})`);
      console.log(`  defaultChoice: "${category.defaultChoice}"`);
      console.log(`  patches in this category:`);
      category.patches.forEach(patch => {
        console.log(`    patch.id: "${patch.id}"`);
        console.log(`    patch.name: "${patch.name}"`);
        console.log(`    matches defaultChoice: ${category.defaultChoice === patch.id}`);
      });
      console.log('---');
    });
  }, [categories]);


  return (
    <div className="w-full max-w-2xl ">

        <div className="flex items-center justify-between p-2">
          <h3>Number of Custom Options</h3>
          <div className="flex items-center space-x-2">
            {getSelectedCount() > 0 && (
              <span className="px-2 py-1 text-sm">
                {getSelectedCount()} selected
              </span>
            )}
          </div>
        </div>
 
      {/* Options Panel */}
      {isExpanded && (
        <div className="">
          <div className="p-3 m-2">
            {categories.map((category) => (
              <div key={category.id} className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.title}
                </h3>
                
                {category.description && (
                  <p className="text-gray-300 text-sm mb-3">
                    {category.description}
                  </p>
                )}

                <div className="d-flex flex-row flex-wrap justify-content-evenly">
                  
                  {category.patches.map((patch) => {
                    const isDefaultPatch = category.defaultChoice === patch.name;
                    const isSelected = isPatchSelected(patch.id);
                    // exquisitiely conditional CSS madness
                    const classes = [
                      'p-2', 'd-flex', 'flex-column', 'option-box',
                      isSelected ? 'chosen-box' : 'unchosen-box',
                      isDefaultPatch ? 'default-option' : '',
                      isDisabled ? 'cursor-not-allowed opacity-50' : ''
                    ].filter(Boolean).join(' ');

                    return (
                      <label 
                        key={patch.id}
                        className={classes}
                      >
                        <input
                          type={category.allowMultiple ? "checkbox" : "radio"}
                          name={category.allowMultiple ? undefined : `category-${category.id}`}
                          checked={isPatchSelected(patch.id)}
                          onChange={() => handlePatchToggle(patch.id, category.id)}
                          disabled={isDisabled}
                          className={category.allowMultiple ? "hidden-checkbox" : "hidden-radio"}
                        />
                        
                        <div className="">
                          <div className="font-medium text-white">
                            {patch.name}
                          </div>
                          {/* <div className="text-sm text-gray-300 mt-1">
                            {patch.description}

                            // this may end up not getting used
                          
                          </div> */}
                        </div>
                        {/* UX Select button, with duplicate actions from the hidden <input> above*/}
                        <button
                          onClick={(e) => {
                              e.preventDefault();
                              handlePatchToggle(patch.id, category.id);
                            }}
                          disabled={isDisabled}
                          className="mx-auto px-5 py-2 text-white nicer-btn"
                        >
                          Select
                        </button>
                        {/* Preview button, loaded from public/previews */}
                        {patch.previewImage && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePreviewClick(patch);
                            }}
                            disabled={isDisabled}
                            className="mx-auto px-2 py-2 text-white nicer-btn"
                          >
                            Info
                          </button>
                        )}
                      </label>
                    );
                  })}
                </div>

                {category.patches.length === 0 && (
                  <p className="text-gray-400 italic">No options available in this category.</p>
                )}
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          {getSelectedCount() > 0 && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => onSelectionChange([])}
                disabled={isDisabled}
                className="mx-auto px-2 py-2 text-white nicer-btn"
              >
                Clear All Selections
              </button>
            </div>
          )}

          {/* Image Preview Modal
          moot until preview button is enabled again, line 165
          */}
            {modalOpen && modalProps && (
              <ImagePreviewModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                src={modalProps.src}
                imageAlt={modalProps.title}
                title={modalProps.title}
                manifestPath={modalProps.manifestPath}
                // description={modalProps.description} unused currently
              />
            )}

        </div>
      )}
    </div>
  );
};

export default CustomOptionsPanel;