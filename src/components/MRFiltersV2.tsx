import React from 'react';
import { Card, Space, Spin, Select, Checkbox } from 'antd';

const { Option } = Select;

interface Label {
  id: string;
  title: string;
  color: string;
  description?: string;
}

interface MRFiltersProps {
  isLoadingLabels: boolean;
  projectLabels: Label[];
  selectedLabels: string[];
  handleLabelChange: (label: string, checked: boolean) => void;
}

const MRFilters: React.FC<MRFiltersProps> = ({ isLoadingLabels, projectLabels, selectedLabels, handleLabelChange }) => {
  return (
    <Card className="mb-4">
      <Space direction="vertical" size="middle" className="w-full">
        <div>
          <h4 className="mb-2 font-medium">Labels</h4>
          {isLoadingLabels ? (
            <Spin />
          ) : (
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select labels"
              value={selectedLabels}
              onChange={(values) => {
                values.forEach(value => {
                  if (!selectedLabels.includes(value)) {
                    handleLabelChange(value, true);
                  }
                });
                selectedLabels.forEach(value => {
                  if (!values.includes(value)) {
                    handleLabelChange(value, false);
                  }
                });
              }}
              showSearch
              optionFilterProp="children"
            >
              {projectLabels.map(label => (
                <Option key={label.id} value={label.title}>
                  <div className="inline-flex items-center gap-1">
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
                </Option>
              ))}
            </Select>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default MRFilters;