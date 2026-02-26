import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import TopBar from './components/TopBar';
import SummaryCard from './components/SummaryCard';
import StructureCard from './components/StructureCard';
import CompositionCard from './components/CompositionCard';
import UsageCard from './components/UsageCard';
import IssuesCard from './components/IssuesCard';
import ConfirmationPanel from './components/ConfirmationPanel';
import BottomPanel from './BottomPanel';
import { MOCK_CONTEXT, MOCK_STRATEGY } from './constants';
import { useTableData } from './hooks/useTableData';
import { useEditingState } from './hooks/useEditingState';

export default function TableUnderstanding() {
  const { setIsCopilotOpen } = useOutletContext<any>();

  const {
    isSaving,
    isBottomPanelOpen,
    activeBottomTab,
    setIsBottomPanelOpen,
    setActiveBottomTab,
    handleConfirm
  } = useTableData();

  const editingState = useEditingState(
    MOCK_STRATEGY.summary.grain,
    MOCK_STRATEGY.summary.description
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans">
      {/* TopBar */}
      <TopBar
        context={MOCK_CONTEXT}
        onCopilotOpen={() => setIsCopilotOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
          {/* A. AI Table Summary Card */}
          <SummaryCard
            summary={MOCK_STRATEGY.summary}
            editingState={editingState}
            onToggleEditName={() => editingState.setEditingName(!editingState.isEditingName)}
            onTableNameChange={editingState.setTableName}
            onToggleEditGrain={() => editingState.setEditingGrain(!editingState.isEditingGrain)}
            onGrainChange={editingState.setGrain}
            onToggleEditDesc={() => editingState.setEditingDesc(!editingState.isEditingDesc)}
            onDescriptionChange={editingState.setDescription}
          />

          {/* B. Key Structure Card */}
          <StructureCard structure={MOCK_STRATEGY.structure} />

          {/* C & D in a row */}
          <div className="grid grid-cols-2 gap-6">
            {/* C. Field Composition Card */}
            <CompositionCard composition={MOCK_STRATEGY.composition} />

            {/* D. Usage & Impact Card */}
            <UsageCard usage={MOCK_STRATEGY.usage} />
          </div>

          {/* E. Issues & Blockers Panel */}
          <IssuesCard issues={MOCK_STRATEGY.issues} />
        </div>

        {/* Right Confirmation Panel */}
        <ConfirmationPanel
          summary={MOCK_STRATEGY.summary}
          structure={MOCK_STRATEGY.structure}
          tags={MOCK_STRATEGY.summary.tags}
          onOpenBottomPanel={() => setIsBottomPanelOpen(true)}
          onConfirm={handleConfirm}
          isSaving={isSaving}
        />
      </div>

      {/* Bottom Panel (Change Preview & Audit) */}
      <BottomPanel
        isOpen={isBottomPanelOpen}
        activeTab={activeBottomTab}
        onTabChange={setActiveBottomTab}
        onClose={() => setIsBottomPanelOpen(false)}
      />
    </div>
  );
}
