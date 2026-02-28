import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, PlayCircle, CheckSquare, FileText, 
  Settings, Search, ShieldCheck, BrainCircuit, Database, X,
  Clock, Activity, AlertTriangle, CheckCircle2, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Send, Bot, User, Plus,
  RotateCcw, XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import AIOpsWorkbenchRequestCreateModal from '@/components/AIOpsWorkbenchRequestCreateModal';

const STAGES = [
  { 
    id: 'A', name: '数据源配置', icon: Settings, status: 'COMPLETED', time: '2m 15s',
    summary: '已成功连接到 db-prod-hr.internal',
    metrics: [{ label: 'Connection', value: 'OK', status: 'success' }]
  },
  { 
    id: 'B', name: '扫描与画像', icon: Search, status: 'COMPLETED', time: '5m 30s',
    summary: '完成 128 张表的扫描与画像提取',
    metrics: [{ label: 'Completeness', value: '98%', status: 'success' }]
  },
  { 
    id: 'C', name: '质量规则与检测', icon: ShieldCheck, status: 'COMPLETED', time: '1m 45s',
    summary: '生成 45 条规则，发现 15 处违规',
    metrics: [
      { label: 'Rules', value: '45', status: 'neutral' },
      { label: 'Violations', value: '15', status: 'warning' }
    ]
  },
  { 
    id: 'D', name: '语义理解结果', icon: BrainCircuit, status: 'SOFT_BLOCKED', time: 'Running...',
    summary: '发现 3 个语义冲突需要人工确认',
    metrics: [{ label: 'Routes', value: '3 Conflicted', status: 'warning' }]
  },
  { 
    id: 'E', name: '候选对象', icon: Database, status: 'PENDING', time: '--',
    summary: '等待上游阶段完成',
    metrics: [{ label: 'Candidates', value: '--', status: 'neutral' }]
  },
];

const MOCK_REQUESTS = [
  { id: 'REQ-20260227-001', title: '解析 HR 域表结构与语义', status: 'IN_PROGRESS' },
  { id: 'REQ-20260226-042', title: '梳理 Sales 数据血缘', status: 'PENDING' },
  { id: 'REQ-20260225-089', title: '生成财务指标定义', status: 'COMPLETED' },
  { id: 'REQ-20260225-090', title: '用户行为日志异常检测', status: 'FAILED' },
];

type MessageType = 'user' | 'plan' | 'progress' | 'blocker' | 'result' | 'deliverable';

interface Message {
  id: string;
  type: MessageType;
  content?: string;
  role?: 'user' | 'ai';
  stages?: any[];
  stageId?: string;
  stageName?: string;
  status?: string;
  summary?: string;
  blockerType?: 'hard' | 'soft';
  taskId?: string;
  deliverables?: any[];
}

export default function AIOpsWorkbenchRequestDetail() {
  const { requestId, stageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLeftRailOpen, setIsLeftRailOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rightTab, setRightTab] = useState('runs');
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

  useEffect(() => {
    if (location.pathname.includes('/stages/')) {
      setRightTab('runs');
    }
  }, [location.pathname]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const closeDrawer = () => {
    navigate(`/aiops/workbench/requests/${requestId}`);
  };

  const openStage = (id: string) => {
    navigate(`/aiops/workbench/requests/${requestId}/stages/${id}`);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { 
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

  const handleCreateRequest = (start: boolean) => {
    setIsCreateModalOpen(false);
    const newId = `REQ-20260227-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    navigate(`/aiops/workbench/requests/${newId}`);
  };

  return (
    <div className="flex-1 flex bg-slate-950 overflow-hidden relative">
      
      {/* Left Rail: Request Mini List */}
      <AnimatePresence initial={false}>
        {isLeftRailOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 overflow-hidden z-10"
          >
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
              <span className="font-bold text-slate-200 text-sm">最近需求</span>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title="新建需求"
                >
                  <Plus size={18} />
                </button>
                <button 
                  onClick={() => setIsLeftRailOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <PanelLeftClose size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {MOCK_REQUESTS.map(req => (
                <div 
                  key={req.id}
                  onClick={() => navigate(`/aiops/workbench/requests/${req.id}`)}
                  className={cn(
                    "p-3 rounded-xl cursor-pointer transition-colors border",
                    req.id === requestId 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-100" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  )}
                >
                  <div className="text-xs font-mono mb-1 opacity-70">{req.id}</div>
                  <div className="text-sm font-medium truncate">{req.title}</div>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      req.status === 'COMPLETED' ? "bg-emerald-500" :
                      req.status === 'IN_PROGRESS' ? "bg-blue-500 animate-pulse" :
                      req.status === 'FAILED' ? "bg-red-500" : "bg-yellow-500"
                    )} />
                    <span className="text-[10px] uppercase tracking-wider opacity-70">{req.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Column: Chat & Plan */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
        {/* Header */}
        <div className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm flex items-center px-4 shrink-0 z-10">
          {!isLeftRailOpen && (
            <button 
              onClick={() => setIsLeftRailOpen(true)}
              className="p-1.5 mr-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <h1 className="text-base font-bold text-slate-100 truncate">{requestId}: 解析 HR 域表结构与语义</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider shrink-0">
              运行中
            </span>
          </div>
        </div>

        {/* ContextBar */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">业务域: HR</span>
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">数据库: hr_core_db</span>
            <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700 whitespace-nowrap">资产: employees</span>
            <div className="h-4 w-px bg-slate-700 mx-1 shrink-0" />
            <div className="flex items-center space-x-1 px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded text-xs border border-indigo-500/20 whitespace-nowrap">
              <Bot size={12} className="mr-1" />
              <span className="font-medium">Data Steward AI</span>
              <span className="text-[10px] bg-indigo-500/20 px-1 rounded ml-1">v1.2</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded ml-1">L2</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 ml-4">
            <button className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors whitespace-nowrap">
              设为默认版本
            </button>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors flex items-center whitespace-nowrap">
              <Database size={12} className="mr-1" />
              查看台账
            </button>
          </div>
        </div>

        {/* Chat Area (MessageStream) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-950/50">
          {messages.map((msg) => {
            if (msg.type === 'user') {
              return (
                <div key={msg.id} className="flex space-x-3 max-w-[85%] ml-auto flex-row-reverse space-x-reverse">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-slate-700 text-slate-300">
                    <User size={18} />
                  </div>
                  <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-indigo-600 text-white rounded-tr-sm">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex space-x-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 bg-indigo-600 text-white shadow-lg shadow-indigo-900/20">
                  <Bot size={18} />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  {msg.type === 'plan' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center">
                        <Activity size={16} className="mr-2 text-indigo-400" />
                        执行计划 (Execution Plan)
                      </h4>
                      <div className="space-y-3">
                        {msg.stages?.map((stage, idx) => (
                          <div key={stage.id} className="flex items-center space-x-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center border text-xs shrink-0",
                              stage.status === 'COMPLETED' ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" :
                              stage.status === 'IN_PROGRESS' ? "bg-blue-500/20 border-blue-500 text-blue-400" :
                              "bg-slate-800 border-slate-700 text-slate-500"
                            )}>
                              {stage.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : idx + 1}
                            </div>
                            <div className="flex-1 flex items-center justify-between bg-slate-950 border border-slate-800/50 rounded-lg px-3 py-2">
                              <span className="text-sm text-slate-300">{stage.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{stage.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.type === 'progress' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-start space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        msg.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                      )}>
                        {msg.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Activity size={16} className="animate-pulse" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 mb-1">阶段 {msg.stageId}: {msg.stageName}</div>
                        <div className="text-sm text-slate-200">{msg.summary}</div>
                      </div>
                    </div>
                  )}

                  {msg.type === 'blocker' && (
                    <div className={cn(
                      "border rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-start space-x-3",
                      msg.blockerType === 'hard' ? "bg-red-500/5 border-red-500/20" : "bg-yellow-500/5 border-yellow-500/20"
                    )}>
                      <div className={cn(
                        "p-2 rounded-lg shrink-0",
                        msg.blockerType === 'hard' ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        <AlertTriangle size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className={cn(
                            "text-xs font-bold",
                            msg.blockerType === 'hard' ? "text-red-400" : "text-yellow-500"
                          )}>
                            {msg.blockerType === 'hard' ? '硬阻塞' : '软任务'}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{msg.taskId}</span>
                        </div>
                        <div className="text-sm text-slate-200 mb-3">{msg.summary}</div>
                        <button className={cn(
                          "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
                          msg.blockerType === 'hard' ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                        )}>
                          去处理 (Resolve)
                        </button>
                      </div>
                    </div>
                  )}

                  {msg.type === 'result' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <div className="text-xs font-bold text-slate-400 mb-2">阶段 {msg.stageId} 结果摘要</div>
                      <div className="text-sm text-slate-200">{msg.summary}</div>
                    </div>
                  )}

                  {msg.type === 'deliverable' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                       <div className="flex items-center space-x-2 mb-3">
                         <FileText size={16} className="text-indigo-400" />
                         <span className="text-sm font-bold text-slate-200">交付物已生成</span>
                       </div>
                       <div className="space-y-2">
                         {msg.deliverables?.map((d, i) => (
                           <div key={i} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2 rounded-lg">
                             <span className="text-xs text-slate-300">{d.name}</span>
                             <button className="text-[10px] text-indigo-400 hover:text-indigo-300">查看</button>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Composer (Input Area) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col space-y-3">
            {/* Intent Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1">
              {['解析表结构', '提取血缘', '生成指标', '质量检测'].map(intent => (
                <button key={intent} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-full whitespace-nowrap transition-colors border border-slate-700">
                  {intent}
                </button>
              ))}
            </div>
            
            <div className="relative flex items-end bg-slate-950 border border-slate-700 rounded-xl overflow-hidden focus-within:border-indigo-500 transition-colors shadow-inner">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="输入指令干预执行计划，或询问当前进度..."
                className="w-full bg-transparent border-none resize-none pl-4 pr-2 py-3 text-sm text-slate-200 focus:outline-none min-h-[44px] max-h-32 custom-scrollbar"
                rows={1}
              />
              <div className="flex items-center space-x-2 p-2 shrink-0">
                <label className="flex items-center space-x-1.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-6 h-6 rounded hover:bg-slate-800 transition-colors">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="w-4 h-4 rounded border border-slate-500 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 flex items-center justify-center transition-colors">
                      <CheckSquare size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none whitespace-nowrap">附带上下文</span>
                </label>
                
                <button className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg transition-colors flex items-center space-x-1">
                  <PlayCircle size={16} />
                  <span className="text-xs font-medium pr-1">恢复执行</span>
                </button>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:text-white/50 text-white rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Console Tabs */}
      <div className="w-[400px] border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0 z-10">
        <div className="flex items-center border-b border-slate-800 shrink-0 bg-slate-900/80 backdrop-blur-sm">
          {[
            { id: 'runs', label: '运行进度', icon: PlayCircle },
            { id: 'actions', label: '待处理', icon: AlertTriangle },
            { id: 'deliverables', label: '交付物', icon: FileText },
            { id: 'replay', label: '执行回放', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRightTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-medium border-b-2 transition-colors",
                rightTab === tab.id 
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" 
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {rightTab === 'runs' && (
            <div className="flex flex-col h-full">
              {/* RunHeader */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-slate-200">RUN-8924</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-wider">
                      软阻塞
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors" title="恢复执行">
                      <PlayCircle size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors" title="重试阶段">
                      <RotateCcw size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" title="取消">
                      <XCircle size={14} />
                    </button>
                    <button onClick={() => setRightTab('replay')} className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors" title="打开回放">
                      <Activity size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex flex-col space-y-1">
                    <span className="text-slate-500">开始时间</span>
                    <span className="text-slate-300 font-mono">2026-02-28 00:15:00</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-slate-500">耗时</span>
                    <span className="text-slate-300 font-mono">10m 24s</span>
                  </div>
                  <div className="flex flex-col space-y-1 col-span-2 mt-1">
                    <span className="text-slate-500">消耗</span>
                    <span className="text-slate-300 font-mono">12.4k tokens / 8 tool calls</span>
                  </div>
                </div>
              </div>

              {/* StageStepper & StageCards */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                {/* Vertical Line for Stepper */}
                <div className="absolute left-8 top-8 bottom-8 w-px bg-slate-800 z-0" />
                
                {STAGES.map((stage, index) => (
                  <div key={stage.id} className="relative z-10 flex items-start space-x-4">
                    {/* Stepper Node */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 mt-2 bg-slate-950",
                      stage.status === 'COMPLETED' ? "border-emerald-500 text-emerald-400" :
                      stage.status === 'IN_PROGRESS' ? "border-blue-500 text-blue-400" :
                      stage.status === 'SOFT_BLOCKED' ? "border-yellow-500 text-yellow-500" :
                      stage.status === 'HARD_BLOCKED' ? "border-red-500 text-red-400" :
                      "border-slate-700 text-slate-500"
                    )}>
                      {stage.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : 
                       stage.status === 'SOFT_BLOCKED' ? <AlertTriangle size={14} /> :
                       <span className="text-xs font-bold">{stage.id}</span>}
                    </div>
                    
                    {/* Stage Card */}
                    <div className={cn(
                      "flex-1 bg-slate-900 border rounded-xl overflow-hidden transition-all",
                      stageId === stage.id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-800 hover:border-slate-700"
                    )}>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <stage.icon size={14} className="text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-200">阶段 {stage.id}: {stage.name}</h3>
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            stage.status === 'COMPLETED' ? "text-emerald-500" :
                            stage.status === 'IN_PROGRESS' ? "text-blue-400" :
                            stage.status === 'SOFT_BLOCKED' ? "text-yellow-500" :
                            stage.status === 'HARD_BLOCKED' ? "text-red-400" :
                            "text-slate-500"
                          )}>
                            {stage.status === 'COMPLETED' ? '已完成' : stage.status === 'IN_PROGRESS' ? '运行中' : stage.status === 'SOFT_BLOCKED' ? '软阻塞' : stage.status === 'HARD_BLOCKED' ? '硬阻塞' : '未开始'}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-400 mb-3">{stage.summary}</p>
                        
                        {/* Metrics */}
                        {stage.metrics && stage.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {stage.metrics.map((metric, i) => (
                              <div key={i} className="flex items-center space-x-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[10px]">
                                <span className="text-slate-500">{metric.label}:</span>
                                <span className={cn(
                                  "font-mono font-medium",
                                  metric.status === 'success' ? "text-emerald-400" :
                                  metric.status === 'warning' ? "text-yellow-400" :
                                  metric.status === 'error' ? "text-red-400" :
                                  "text-slate-300"
                                )}>{metric.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                          <span className="text-xs text-slate-500 flex items-center"><Clock size={12} className="mr-1"/> {stage.time}</span>
                          <button 
                            onClick={() => openStage(stage.id)}
                            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightTab === 'actions' && (
            <div className="p-4 space-y-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-bold uppercase tracking-wider border border-red-500/20">硬阻塞</span>
                  <span className="text-xs font-mono text-slate-500">TSK-001</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">数据源连接失败，需检查凭证</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center"><CheckCircle2 size={12} className="mr-1"/> 已解决</span>
                  <span className="text-slate-500">10分钟前</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer border-l-2 border-l-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">软任务</span>
                  <span className="text-xs font-mono text-slate-500">TSK-002</span>
                </div>
                <p className="text-sm text-slate-300 mb-3">发现 3 个语义冲突需要人工确认</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-500 flex items-center"><Clock size={12} className="mr-1"/> 待处理</span>
                  <span className="text-slate-500">刚刚</span>
                </div>
              </div>
            </div>
          )}

          {rightTab === 'deliverables' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <FileText size={24} className="text-slate-600" />
              </div>
              <p className="text-sm">交付物将在所有阶段完成后生成</p>
            </div>
          )}

          {rightTab === 'replay' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 p-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Activity size={24} className="text-slate-600" />
              </div>
              <p className="text-sm">执行回放功能开发中...</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Drawer for Stage Details */}
      <AnimatePresence>
        {stageId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[500px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 bg-slate-950/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    {STAGES.find(s => s.id === stageId)?.icon && React.createElement(STAGES.find(s => s.id === stageId)!.icon, { size: 16 })}
                  </div>
                  <h2 className="text-base font-bold text-slate-100">
                    阶段 {stageId}: {STAGES.find(s => s.id === stageId)?.name}
                  </h2>
                </div>
                <button 
                  onClick={closeDrawer}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {/* Stage Specific Content Mock */}
                {stageId === 'A' && (
                  <div className="space-y-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-slate-300 mb-4">数据源连接信息</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">类型</span><span className="text-slate-200">MySQL 8.0</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Host</span><span className="text-slate-200">db-prod-hr.internal</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Database</span><span className="text-slate-200">hr_core_db</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">状态</span><span className="text-emerald-400 flex items-center"><CheckCircle2 size={14} className="mr-1"/> 连接成功</span></div>
                      </div>
                    </div>
                  </div>
                )}
                {stageId === 'B' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-400 mb-1">128</div>
                        <div className="text-xs text-slate-500">扫描表数量</div>
                      </div>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-400 mb-1">4,592</div>
                        <div className="text-xs text-slate-500">扫描字段数量</div>
                      </div>
                    </div>
                  </div>
                )}
                {stageId === 'C' && (
                  <div className="space-y-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-sm font-bold text-slate-300 mb-4">质量检测结果</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">空值率超标字段</span>
                          <span className="text-yellow-400">12 个</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">枚举值异常字段</span>
                          <span className="text-red-400">3 个</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {stageId === 'D' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center h-32 bg-slate-950 border border-slate-800 rounded-xl">
                      <div className="flex flex-col items-center space-y-3">
                        <Activity size={24} className="text-blue-400 animate-pulse" />
                        <span className="text-sm text-slate-400">大模型正在进行语义推断...</span>
                      </div>
                    </div>
                  </div>
                )}
                {stageId === 'E' && (
                  <div className="flex items-center justify-center h-32 text-slate-500">
                    等待上游阶段完成
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AIOpsWorkbenchRequestCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRequest}
      />
    </div>
  );
}
