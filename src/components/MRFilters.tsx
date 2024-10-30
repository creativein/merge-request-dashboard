import React from 'react';
import { Card, DatePicker, Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { FilterParams } from '../types/gitlab';

const { RangePicker } = DatePicker;

interface MRFiltersProps {
  labels: string[];
  onFilterChange: (filters: FilterParams) => void;
  availableLabels: string[];
}

export const MRFilters: React.FC<MRFiltersProps> = ({
  labels,
  onFilterChange,
  availableLabels,
}) => {
  const handleLabelChange = (newLabels: string[]) => {
    onFilterChange({
      labels: newLabels,
      startDate: null,
      endDate: null,
    });
  };

  const handleDateChange = (dates: any) => {
    onFilterChange({
      labels,
      startDate: dates?.[0]?.toISOString() || null,
      endDate: dates?.[1]?.toISOString() || null,
    });
  };

  return (
    <Card className="mb-4">
      <Space direction="horizontal" size="middle">
        <Select
          mode="multiple"
          style={{ width: '300px' }}
          placeholder="Filter by labels"
          value={labels}
          onChange={handleLabelChange}
          options={availableLabels.map(label => ({ label, value: label }))}
          prefix={<FilterOutlined />}
        />
        <RangePicker onChange={handleDateChange} />
      </Space>
    </Card>
  );
};