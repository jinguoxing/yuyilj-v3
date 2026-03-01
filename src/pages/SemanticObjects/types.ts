export type ViewMode = 'object' | 'table';
export type SplitStrategy = 'sensitivity' | 'frequency';
export type AttributeType = 'IDENTIFIER' | 'ATTRIBUTE' | 'MEASURE';
export type FieldGroup = 'UNASSIGNED' | 'IGNORED' | 'CONFLICT' | 'TECHNICAL';

export interface Attribute {
  id: string;
  name: string;
  type: AttributeType;
  mappedField: string;
  evidence?: string;
  status: 'SUGGESTED' | 'CONFIRMED';
  qualityRules: any[];
}

export interface BusinessObject {
  id: string;
  name: string;
  type: string;
  description?: string;
  fieldCount: number;
  attributes: Attribute[];
}

export interface UnassignedField {
  id: string;
  name: string;
  dataType: string;
  reason?: string;
  group: FieldGroup;
}

export interface SemanticData {
  tableName: string;
  qualifiedName: string;
  objects: BusinessObject[];
  unassignedFields: UnassignedField[];
  confidence: number;
  relationships?: any[];
}
