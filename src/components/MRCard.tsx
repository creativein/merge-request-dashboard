import React from 'react';
import { Card, Tag, Avatar, Typography, Space, Collapse, Button } from 'antd';
import { UserOutlined, CheckCircleOutlined, SyncOutlined, LinkOutlined } from '@ant-design/icons';
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
          <Space>
            <Title level={4}>{mergeRequest.title}</Title>
            {getStateIcon(mergeRequest.state)}
          </Space>
          <Button 
            type="link" 
            icon={<LinkOutlined />}
            href={mergeRequest.webUrl}
            target="_blank"
          >
            View in GitLab
          </Button>
        </Space>

        <Space className="w-full" wrap>
          <Text type="secondary">
            Created {dayjs(mergeRequest.createdAt).format('MMM D, YYYY')}
          </Text>
          {mergeRequest.mergedAt && (
            <Text type="secondary">
              • Merged {dayjs(mergeRequest.mergedAt).format('MMM D, YYYY')}
            </Text>
          )}
          {mergeRequest.draft && <Tag color="orange">Draft</Tag>}
        </Space>

        <Space wrap>
          {mergeRequest.labels.nodes.map(label => (
            <Tag key={label.id} color={label.color}>
              {label.title}
            </Tag>
          ))}
        </Space>

        <Space className="mt-2">
          <Text strong>Author:</Text>
          <Avatar src={mergeRequest.author.avatarUrl} icon={<UserOutlined />} />
          <Text>{mergeRequest.author.name}</Text>
        </Space>

        <Space className="mt-2">
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

        {mergeRequest.approvedBy.nodes.length > 0 && (
          <Space className="mt-2">
            <Text strong>Approved by:</Text>
            <Avatar.Group>
              {mergeRequest.approvedBy.nodes.map(approver => (
                <Avatar
                  key={approver.id}
                  src={approver.avatarUrl}
                  icon={<UserOutlined />}
                  title={approver.name}
                />
              ))}
            </Avatar.Group>
          </Space>
        )}

        <Space className="mt-2">
          <Text strong>Branches:</Text>
          <Text>{mergeRequest.sourceBranch} → {mergeRequest.targetBranch}</Text>
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
                    {note.resolvable && <Tag color="blue">Resolvable</Tag>}
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