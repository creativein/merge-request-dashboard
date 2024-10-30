import React from 'react';
import { Card, Tag, Avatar, Typography, Space, Collapse } from 'antd';
import { UserOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { MergeRequest } from '../types/gitlab';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface MRCardProps {
  mergeRequest: MergeRequest;
}

export const MRCard: React.FC<MRCardProps> = ({ mergeRequest }) => {
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

  return (
    <Card className="mb-4">
      <Space direction="vertical" className="w-full">
        <Space className="w-full justify-between">
          <Title level={4}>{mergeRequest.title}</Title>
          {getStateIcon(mergeRequest.state)}
        </Space>

        <Text type="secondary">
          Created {dayjs(mergeRequest.createdAt).format('MMM D, YYYY')}
        </Text>

        <Space wrap>
          {mergeRequest.labels.nodes.map(label => (
            <Tag key={label.id} color={label.color}>
              {label.title}
            </Tag>
          ))}
        </Space>

        <Space className="mt-4">
          <Text strong>Assignees:</Text>
          <Avatar.Group>
            {mergeRequest.assignees.nodes.map(assignee => (
              <Avatar
                key={assignee.id}
                src={assignee.avatarUrl}
                icon={<UserOutlined />}
                title={assignee.name}
              />
            ))}
          </Avatar.Group>
        </Space>

        <Space className="mt-2">
          <Text strong>Reviewers:</Text>
          <Avatar.Group>
            {mergeRequest.reviewers.nodes.map(reviewer => (
              <Avatar
                key={reviewer.id}
                src={reviewer.avatarUrl}
                icon={<UserOutlined />}
                title={reviewer.name}
              />
            ))}
          </Avatar.Group>
        </Space>

        <Collapse className="mt-4">
          <Panel header="Description" key="1">
            <Text>{mergeRequest.description}</Text>
          </Panel>
          <Panel header="Review Comments" key="2">
            {mergeRequest.discussions.nodes.map(discussion => (
              discussion.notes.nodes.map(note => (
                <Card key={note.id} size="small" className="mb-2">
                  <Space>
                    <Avatar src={note.author.avatarUrl} icon={<UserOutlined />} />
                    <Text strong>{note.author.name}</Text>
                    <Text type="secondary">
                      {dayjs(note.createdAt).format('MMM D, YYYY HH:mm')}
                    </Text>
                  </Space>
                  <Text className="block mt-2">{note.body}</Text>
                </Card>
              ))
            ))}
          </Panel>
        </Collapse>
      </Space>
    </Card>
  );
};