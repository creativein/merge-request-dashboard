import React from 'react';
import { Card, DatePicker, Space, Button, Checkbox, Spin } from 'antd';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { FilterParams, ProjectLabel } from '../types/gitlab';

const { RangePicker } = DatePicker;

interface MRFiltersProps {
  selectedLabels: string[];
  onFilterChange: (filters: FilterParams) => void;
  onFetchData: () => void;
  projectLabels: ProjectLabel[];
  isLoadingLabels: boolean;
}

export const MRFilters: React.FC<MRFiltersProps> = ({
  selectedLabels,
  onFilterChange,
  onFetchData,
  projectLabels,
  isLoadingLabels,
}) => {
  const handleLabelChange = (label: string, checked: boolean) => {
    const newLabels = checked
      ? [...selectedLabels, label]
      : selectedLabels.filter(l => l !== label);

    onFilterChange({
      labels: newLabels,
      startDate: null,
      endDate: null,
    });
  };

  const handleDateChange = (dates: any) => {
    onFilterChange({
      labels: selectedLabels,
      startDate: dates?.[0]?.toISOString() || null,
      endDate: dates?.[1]?.toISOString() || null,
    });
  };

  return (
    <Card className="mb-4">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <h4 className="mb-2 font-medium">Labels</h4>
          {isLoadingLabels ? (
            <Spin />
          ) : (
            <div className="flex flex-wrap gap-2">
              {projectLabels.map(label => (
                <div
                  key={label.id}
                  className="inline-flex items-center gap-1 border rounded-md px-2 py-1"
                  style={{ borderColor: `${label.color}40` }}
                >
                  <Checkbox
                    checked={selectedLabels.includes(label.title)}
                    onChange={e => handleLabelChange(label.title, e.target.checked)}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: label.color }}
                  />
                  <span>{label.title}</span>
                  {label.description && (
                    <span className="text-gray-400 text-sm" title={label.description}>
                      ℹ️
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Space wrap>
          <RangePicker onChange={handleDateChange} />
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={onFetchData}
          >
            Fetch Data
          </Button>
        </Space>
      </Space>
    </Card>
  );
};