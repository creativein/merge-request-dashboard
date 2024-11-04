import React from "react";
import { Card, DatePicker, Space, Button, Checkbox, Spin, Select } from "antd";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import type { FilterParams, ProjectLabel } from "../types/gitlab";

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
      : selectedLabels.filter((l) => l !== label);

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
      <Space wrap size="middle" className="w-full">
        <>
          <span className="mb-2 font-medium">Labels</span>
          {isLoadingLabels ? (
            <Spin />
          ) : (
          <>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "400px" }}
              placeholder="Select labels"
              value={selectedLabels}
              onChange={(values: string[]) => {
                onFilterChange({
                  labels: values,
                  startDate: null,
                  endDate: null,
                });
              }}
              filterOption={(input, option) =>
                option?.children
                  ?.toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {projectLabels.map((label) => (
                <Select.Option key={label.id} value={label.title}>
                  {/* <Checkbox
                    checked={selectedLabels.includes(label.title)}
                    onChange={(e) =>
                      handleLabelChange(label.title, e.target.checked)
                    }
                  /> */}
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: label.color,
                      display: "inline-block",
                      marginRight: "8px",
                    }}
                  />
                  {label.title}
                  {label.description && (
                    <span
                      className="text-gray-400 text-sm"
                      title={label.description}
                    >
                      ℹ️
                    </span>
                  )}
                </Select.Option>
              ))}
            </Select>
              <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={onFetchData}
            >
              Fetch Data
            </Button>
          </>
          )}
        </>

        {/* <Space wrap>
          <RangePicker onChange={handleDateChange} />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={onFetchData}
          >
            Fetch Data
          </Button>
        </Space> */}
      </Space>
    </Card>
  );
};
