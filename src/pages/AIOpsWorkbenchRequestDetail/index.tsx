import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import AIOpsWorkbenchRequestCreateModal from '@/components/AIOpsWorkbenchRequestCreateModal';
import { FieldSemanticDrawer } from '@/components/FieldSemanticDrawer';

// Import components
import RequestMiniList from './components/RequestMiniList';
import RequestDetailHeader from './components/RequestDetailHeader';
import RequestDetailContextBar from './components/RequestDetailContextBar';
import ConversationPanel from './components/ConversationPanel';
import Composer from './components/Composer';
import RightRail from './components/RightRail';
import StageDetailDrawer from './components/StageDetailDrawer';

// Import types
import { Message, RequestStatus, RightTab, STAGES } from './types';

export default function AIOpsWorkbenchRequestDetail() {
  const { requestId, stageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [isLeftRailOpen, setIsLeftRailOpen] = useState(true);
  const [isRightRailOpen, setIsRightRailOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rightTab, setRightTab] = useState<RightTab>('runs');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'user', role: 'user', content: '帮我解析 hr_core_db.employees 表的结构，并推断其业务语义。' },
    { id: '2', type: 'plan', role: 'ai', stages: STAGES },
    { id: '3', type: 'progress', role: 'ai', stageId: 'A', stageName: '数据源配置', status: 'COMPLETED', summary: '成功连接到 MySQL 8.0 (db-prod-hr.internal)' },
    { id: '4', type: 'progress', role: 'ai', stageId: 'B', stageName: '扫描与画像', status: 'COMPLETED', summary: '完成扫描，共发现 128 张表，4592 个字段。' },
    { id: '5', type: 'blocker', role: 'ai', blockerType: 'soft', taskId: 'TSK-002', summary: '发现 3 个语义冲突需要人工确认。' },
    { id: '6', type: 'progress', role: 'ai', stageId: 'D', stageName: '语义理解结果', status: 'IN_PROGRESS', summary: '大模型正在进行语义推断...' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isFieldDrawerOpen, setIsFieldDrawerOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('IN_PROGRESS');

  useEffect(() => {
    if (location.pathname.includes('/stages/')) {
      setRightTab('runs');
    }
  }, [location.pathname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handlers
  const closeDrawer = () => {
    navigate(`/aiops/workbench/requests/${requestId}`);
  };

  const openStage = (id: string) => {
    navigate(`/aiops/workbench/requests/${requestId}/stages/${id}`);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), type: 'user', role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'progress',
        role: 'ai',
        stageId: 'D',
        stageName: '语义理解结果',
        status: 'IN_PROGRESS',
        summary: '收到您的反馈，已调整推断策略，正在重新生成...'
      }]);
    }, 1000);
  };

  const handleApprovePlan = () => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), type: 'user', role: 'user', content: '批准执行计划' }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'progress',
        role: 'ai',
        stageId: 'C',
        stageName: '语义推断',
        status: 'IN_PROGRESS',
        summary: '计划已批准，正在启动语义推断阶段...'
      }]);
    }, 800);
  };

  const handleModifyConfig = () => {
    setIsRightRailOpen(true);
    setRightTab('actions');
  };

  const handleIgnoreBlocker = (taskId: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), type: 'user', role: 'user', content: `忽略任务 ${taskId}` }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'progress',
        role: 'ai',
        status: 'COMPLETED',
        summary: `已忽略任务 ${taskId}，继续后续流程。`
      }]);
    }, 800);
  };

  const handleResume = () => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), type: 'user', role: 'user', content: '继续执行' }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'progress',
        role: 'ai',
        stageId: 'D',
        stageName: '语义理解结果',
        status: 'IN_PROGRESS',
        summary: '正在恢复执行...'
      }]);
    }, 1000);
  };

  const handleCreateRequest = (start: boolean) => {
    setIsCreateModalOpen(false);
    const newId = `REQ-20260227-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    navigate(`/aiops/workbench/requests/${newId}`);
  };

  const handleSetFieldAndOpenDrawer = (field: string) => {
    setSelectedField(field);
    setIsFieldDrawerOpen(true);
    openStage('D');
  };

  return (
    <div className="flex-1 flex bg-slate-950 overflow-hidden relative">
      {/* Left Rail: Request Mini List */}
      <RequestMiniList
        isOpen={isLeftRailOpen}
        onClose={() => setIsLeftRailOpen(false)}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        currentRequestId={requestId}
      />

      {/* Main Column: Chat & Plan */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {/* Header */}
        <RequestDetailHeader
          isLeftRailOpen={isLeftRailOpen}
          onOpenLeftRail={() => setIsLeftRailOpen(true)}
          requestStatus={requestStatus}
          onRequestStatusChange={setRequestStatus}
        />

        {/* ContextBar */}
        <RequestDetailContextBar />

        {/* Right Rail Toggle Handle */}
        <div
          className={cn(
            "fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300",
            isRightRailOpen ? "right-[400px]" : "right-0"
          )}
        >
          <button
            onClick={() => setIsRightRailOpen(!isRightRailOpen)}
            className="flex items-center justify-center w-6 h-24 bg-slate-800 border border-slate-700 rounded-l-2xl text-slate-400 hover:text-slate-200 shadow-2xl group"
          >
            <div className="flex flex-col items-center space-y-1">
              {isRightRailOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              <div className="w-1 h-8 bg-slate-600 rounded-full group-hover:bg-slate-500 transition-colors" />
            </div>
          </button>
        </div>

        {/* Chat Area */}
        <ConversationPanel
          messages={messages}
          onApprovePlan={handleApprovePlan}
          onModifyConfig={handleModifyConfig}
          onOpenStage={openStage}
          onIgnoreBlocker={handleIgnoreBlocker}
          onSetRightTab={(tab) => setRightTab(tab as RightTab)}
          chatEndRef={chatEndRef}
        />

        {/* Composer */}
        <Composer
          input={input}
          onInputChange={setInput}
          onSendMessage={handleSendMessage}
          onRequestStatusChange={setRequestStatus}
          requestStatus={requestStatus}
        />
      </div>

      {/* Right Panel */}
      <RightRail
        isOpen={isRightRailOpen}
        onClose={() => setIsRightRailOpen(false)}
        rightTab={rightTab}
        onRightTabChange={setRightTab}
        onOpenStage={openStage}
        onResume={handleResume}
        onSetFieldAndOpenDrawer={handleSetFieldAndOpenDrawer}
        selectedField={selectedField}
        isFieldDrawerOpen={isFieldDrawerOpen}
        onSetFieldDrawerOpen={setIsFieldDrawerOpen}
      />

      {/* Right Drawer for Stage Details */}
      <StageDetailDrawer
        stageId={stageId}
        onClose={closeDrawer}
        onSetSelectedField={setSelectedField}
        onSetFieldDrawerOpen={setIsFieldDrawerOpen}
      />

      {/* Modals */}
      <AIOpsWorkbenchRequestCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRequest}
      />

      <FieldSemanticDrawer
        isOpen={isFieldDrawerOpen}
        onClose={() => setIsFieldDrawerOpen(false)}
        fieldName={selectedField}
      />
    </div>
  );
}
