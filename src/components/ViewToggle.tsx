import React from 'react';
import { Radio } from 'antd';
import { TableOutlined, AppstoreOutlined } from '@ant-design/icons';

interface ViewToggleProps {
  view: 'card' | 'table';
  onChange: (view: 'card' | 'table') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onChange }) => {
  return (
    <Radio.Group 
      value={view} 
      onChange={e => onChange(e.target.value)}
      buttonStyle="solid"
      className="mb-4"
    >
      <Radio.Button value="table">
        <TableOutlined className="mr-1" />
        Table View
      </Radio.Button>
      <Radio.Button value="card">
        <AppstoreOutlined className="mr-1" />
        Card View
      </Radio.Button>
    </Radio.Group>
  );
};