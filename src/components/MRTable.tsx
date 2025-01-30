import React, { useState } from 'react';
import { Table, Tag, Tooltip, Space } from 'antd';
import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { MergeRequest } from '../types/gitlab';

interface MRTableProps {
  mergeRequests: MergeRequest[];
}

export const MRTable: React.FC<MRTableProps> = ({ mergeRequests }) => {
  const [sortedData, setSortedData] = useState(mergeRequests);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

  const handleSort = () => {
    const order = sortOrder === 'ascend' ? 'descend' : 'ascend';
    const sorted = [...sortedData].sort((a, b) =>
      order === 'ascend'
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state)
    );
    setSortedData(sorted);
    setSortOrder(order);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'merged':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'opened':
        return <SyncOutlined className="text-blue-500" spin />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: MergeRequest) => (
        <a href={record.webUrl} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (_: any, record: MergeRequest) => (
        <Space wrap>
          {record.labels.nodes.map(label => (
            <Tag key={label.id} color={label.color}>
              {label.title}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: (
        <span onClick={handleSort} style={{ cursor: 'pointer' }}>
          State {sortOrder === 'ascend' ? '↑' : sortOrder === 'descend' ? '↓' : ''}
        </span>
      ),
      dataIndex: 'state',
      key: 'state',
      render: (state: string) => (
        <Space>
          {getStateIcon(state)}
          <span className="capitalize">{state}</span>
        </Space>
      ),
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (_: any, record: MergeRequest) => (
        <Space wrap>
          {record.assignees.nodes.map((assignee, index) => (
            <Tooltip key={assignee.id} title={assignee.name}>
              <article>
                {assignee.name}
                {index < record.assignees.nodes.length - 1 && <span>, </span>}
              </article>
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: 'Reviewers',
      dataIndex: 'reviewers',
      key: 'reviewers',
      render: (_: any, record: MergeRequest) => (
        <Space wrap>
          {record.reviewers.nodes.map((reviewer, index) => (
            <Tooltip key={reviewer.id} title={reviewer.name}>
              <article>
                {reviewer.name}
                {index < record.reviewers.nodes.length - 1 && <span>, </span>}
              </article>
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: 'Approved By',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      render: (_: any, record: MergeRequest) => (
        <Space wrap>
          {record.approvedBy.nodes.map((approver, index) => (
            <Tooltip key={approver.id} title={approver.name}>
              <article>
                {approver.name}
                {index < record.approvedBy.nodes.length - 1 && <span>, </span>}
              </article>
            </Tooltip>
          ))}
        </Space>
      ),
    },
    {
      title: 'Resolvable Comments',
      dataIndex: 'resolvableComments',
      key: 'resolvableComments',
      render: (_: any, record: MergeRequest) => {
        const count = record.discussions.nodes.reduce((acc, discussion) => {
          return acc + discussion.notes.nodes.filter(note => note.resolvable).length;
        }, 0);
        return count > 0 ? <Tag color="blue">{count}</Tag> : '0';
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={sortedData}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: true }}
    />
  );
};