export enum ColumnValueType {
  string = "string",
  boolean = "boolean",
  number = "number",
}

export type ColumnType = {
  key: string;
  value: ColumnValueType;
};
