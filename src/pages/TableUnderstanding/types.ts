export interface GateMetrics {
  must: number;
  coverage: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TableContext {
  lvId: string;
  tableName: string;
  qualifiedName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  gateMetrics: GateMetrics;
}

export interface TableType {
  top1: string;
  top2: string;
  confidence: number;
}

export interface Summary {
  tableType: TableType;
  grain: string;
  description: string;
  tags: string[];
  explain: string;
}

export interface PKCandidate {
  fields: string[];
  confidence: number;
  evidence: string;
  validator: 'PASS' | 'WARN';
  reason?: string;
}

export interface FKCandidate {
  field: string;
  target: string;
  matchScore: number;
  evidence: string;
}

export interface Structure {
  pkCandidates: PKCandidate[];
  fkCandidates: FKCandidate[];
}

export interface SemanticType {
  type: string;
  count: number;
}

export interface Role {
  role: string;
  count: number;
}

export interface Composition {
  semanticTypes: SemanticType[];
  roles: Role[];
  keyFields: string[];
  anomalies: string[];
}

export interface Usage {
  downstreams: number;
  usageSummary: string[];
  sensitiveFields: number;
  impactNodes: number;
  explain: string;
}

export interface Issue {
  id: string;
  title: string;
  action: string;
}

export interface Issues {
  must: Issue[];
  review: Issue[];
}

export interface TableStrategy {
  summary: Summary;
  structure: Structure;
  composition: Composition;
  usage: Usage;
  issues: Issues;
}

export interface EditingState {
  isEditingName: boolean;
  tableName: string;
  isEditingGrain: boolean;
  grain: string;
  isEditingDesc: boolean;
  description: string;
}

export type BottomTabType = 'preview' | 'audit';
