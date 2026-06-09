// MainPatcher.tsx developed with Claude Sonnet 4
import React, { useEffect, useMemo, useState } from 'react';
import SpinnerOverlay from '@/components/SpinnerOverlay';
import DownloadRomButton from '@/components/DownloadRomButton';
import RomVerifier from '@/components/RomVerifier';
import CustomOptionsPanel from '@/components/CustomOptionsPanel';
import { applyIPS } from '@/lib/patcher';
import computeCRC32 from '@/lib/crc32';
import { useOptionalPatches } from '@/hooks/useOptionalPatches';
import PlusTitle from "@/components/TitleScreen";

// Interface for ROM state mgmt
type RomState = {
  originalFile: File;
  processedRom: Uint8Array; // headerless, expanded ROM ready for patching
  originalCRC32: string;
};

// Valid ROM CRC32 checksums for verification
const VALID_ROM_CRC32S = ['58314182'];

export default function MainPatcher() {
  const [romState, setRomState] = useState<RomState | null>(null); // Stores ROM + patch info
  const [isPatching, setIsPatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptionalPatches, setSelectedOptionalPatches] = useState<string[]>([]);

  // Optional patches by category
  const optionalPatchesConfig = useMemo(() => ({
    categories : [
      {
        id: 'difficulty',
        title: 'Difficulty',
        description: 'Average < Veteran < Insane < Lunatic',
        allowMultiple: false,
        zipFile: 'Difficulty.zip',
        defaultChoice: 'Saga2_A_Haniwas_Contingency_v2.0_Average',
        hasManifest: true,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
      },
      {
        id: 'options',
        title: 'Options',
        description: 'Mechanics & Options (Can Choose Multiple)',
        allowMultiple: true,
        zipFile: 'Options.zip',
        defaultChoice: '',
        hasManifest: true,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
      },
      {
        id: 'characters',
        title: 'Default Characters',
        description: '',
        allowMultiple: false,
        zipFile: 'Characters.zip',
        defaultChoice: 'New_Characters',
        hasManifest: true,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'human_M',
        title: 'Human M',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Human M.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'human_F',
        title: 'Human F',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Human F.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'mutant_M',
        title: 'Mutant M',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Mutant M.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'mutant_F',
        title: 'Mutant F',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Mutant F.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'cyborg',
        title: 'Cyborg',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Cyborg.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      },
      {
        id: 'robot',
        title: 'Robot',
        description: 'Change this hero\'s sprites',
        allowMultiple: false,
        zipFile: 'Robot.zip',
        defaultChoice: '',
        hasManifest: false,
        manifestPath: (patchName: string) => `/manifests/${patchName}.txt`
        // filePattern: /Style/i // can be used filter a multi-catergory archive
      }
    ]
  }), []);

  const {
    categories: optionalCategories,
    loading: loadingOptional,
    error: optionalError,
    getSelectedPatches
  } = useOptionalPatches(optionalPatchesConfig);

  // Initialize selections with default choices when categories load
  useEffect(() => {
    if (optionalCategories.length > 0 && selectedOptionalPatches.length === 0) {
      const defaultSelections: string[] = [];
      optionalCategories.forEach(category => {
        if (category.defaultChoice) {
          // Compare against filename (minus .ips) since name gets transformed with spaces/caps
          const defaultPatch = category.patches.find(
            p => p.filename.replace(/\.ips$/i, '') === category.defaultChoice
          );
          if (defaultPatch) {
            defaultSelections.push(defaultPatch.id);
          }
        }
      });
      if (defaultSelections.length > 0) {
        setSelectedOptionalPatches(defaultSelections);
      }
    }
  }, [optionalCategories]);




  // Detects & removes SMC/SFC copier header if present
  const removeHeaderIfPresent = (romData: Uint8Array): Uint8Array => {
    if (romData.length % 1024 === 512) { // copier header is always 512 bytes
      console.log('ROM copier header detected, removing 512 bytes');
      return romData.slice(512);
    }
    return romData;
  };

  // Validates & prepares ROM
  const handleMatch = async (romFile: File) => {
    setIsPatching(true);
    setError(null);
    setRomState(null);

    try {
      // Loads ROM bytes
      const arrayBuffer = await romFile.arrayBuffer();
      const romBytes = new Uint8Array(arrayBuffer); // needed for specificity in Type
      // Checks, removes header if present
      const headerlessRom = removeHeaderIfPresent(romBytes);
      // Calculates original ROM CRC32
      const romCRC32 = computeCRC32(headerlessRom);
      console.log(`ROM CRC32: ${romCRC32}`); // debug log

      // Validates ROM CRC32 against known valid checksums
      if (!VALID_ROM_CRC32S.includes(romCRC32)) {
        throw new Error(`Invalid ROM. Expected CRC32: ${VALID_ROM_CRC32S.join(' or ')}, got: ${romCRC32}`);
      }
      console.log('ROM CRC32 verified successfully');

      // Expands uploaded rom to correct size for romhack
      // value in MB below: 6MB for FF6ASC ; 2MB for FF4UP ; 0.5 for AHC
      const finalSize = 0.5;
      const expandedRom = headerlessRom.length < finalSize * 1024 * 1024
        ? (() => {
            const newRom = new Uint8Array(finalSize * 1024 * 1024);
            newRom.set(headerlessRom);
            return newRom;
          })()
        : headerlessRom;

      // Stores ROM state; allows for optional patches to be added
      setRomState({
        originalFile: romFile,
        processedRom: expandedRom,
        originalCRC32: romCRC32
      });

      console.log('ROM validated and ready for patching');
    } catch (err: any) {
      console.error('Error during ROM validation:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsPatching(false);
    }
  };

  // Generates patched ROM (called by DownloadRomButton)
  const generatePatchedRom = async (): Promise<Uint8Array> => {
    if (!romState) {
      throw new Error('No ROM loaded');
    }
    console.log('Generating patched ROM...');
    // Starts with the processed ROM...
    let patchedRom = new Uint8Array(romState.processedRom.buffer.slice(0)); // snaps the Type into conformity! What madness!
    // Applies selected patches (in order of selection)
    const selectedPatches = getSelectedPatches(selectedOptionalPatches);
    for (const patch of selectedPatches) {
      console.log(`Applying patch: ${patch.name}`);
      patchedRom = applyIPS(patchedRom, patch.data);
    }
    console.log(`Final patched ROM generated with ${selectedPatches.length} patches`);
    return patchedRom;
  };

  // Control checks
  const hasValidRom = romState !== null;
  const isReady = !loadingOptional && optionalCategories.length > 0;
  const hasOptionalPatches = optionalCategories.length > 0;
  
  return (
  <>
    <div className="two-column-layout">
      <div className='d-flex justify-content-center align-items-center h-100'>
        <PlusTitle />
        <p className="text-center mb-2">
          Upload your FFL2 ROM file to create a copy of SaGa2 AHC.<br/>
          Choose alternate graphics, difficulty, & different options if you wish!
        </p>
        <DownloadRomButton
          onGenerateRom={generatePatchedRom}
          filename={`SaGa2 AHC.gb`}
          disabled={!hasValidRom || isPatching}
        />
      </div>

      <div className='d-flex justify-content-center align-items-center h-100'>
        {loadingOptional ? (
          <p>Loading patches...</p>
        ) : isReady ? (
          <RomVerifier onMatch={handleMatch} />
        ) : (
          <p className="text-danger">No patches could be loaded. Please refresh the page.</p>
        )}
      </div>
    </div>
{/* Optional Patches Panel */}
    <div className='d-flex justify-content-center align-items-center h-100'>
      {isReady && hasOptionalPatches && (
        <CustomOptionsPanel
          categories={optionalCategories}
          selectedPatches={selectedOptionalPatches}
          onSelectionChange={setSelectedOptionalPatches}
          isDisabled={isPatching || !hasValidRom}
        />
      )}
      {/* Loading state for optional patches */}
      {loadingOptional && (
        <p className="text-gray-400 text-sm">Loading optional patches...</p>
      )}
      {/* Errors */}
      {error && <p className="text-red-500 font-medium">{error}</p>}
      {optionalError && <p className="text-yellow-500 font-medium">Optional patches: {optionalError}</p>}
      
      {/* ROM Information */}
      {hasValidRom && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-2">ROM Ready:</h2>
          <p className="font-mono text-sm">
            Uploaded CRC32: {romState!.originalCRC32}
          </p>
          {selectedOptionalPatches.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-300">Selected options:</p>
              <ul className="text-xs text-gray-400 mt-1">
                {getSelectedPatches(selectedOptionalPatches).map(patch => (
                  <li key={patch.id}>{patch.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {isPatching && <SpinnerOverlay />}
    </div>
  </>
  );
}