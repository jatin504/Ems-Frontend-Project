export interface WidgetDataSource {
  devices: {
    patterns: string[];
    ids: string[];
    keys: { key: string; alias: string }[];
    isRealTime: boolean;
    pollInterval: number;
    executorType: string;
    execute: string;
    returnDataName: string;
  };
}

export interface WidgetLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  id: string;
  title: string;
  type: string;
  dataSource: WidgetDataSource;
  layout: WidgetLayout;
}

export interface DashboardConfiguration {
  widgets: Record<string, WidgetConfig>;
}

export interface CustomDashboard {
  id: string;
  title: string;
  config: DashboardConfiguration;
}