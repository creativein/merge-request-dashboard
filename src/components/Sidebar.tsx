import React from 'react';
import { Drawer, Space, Avatar, Typography, Divider } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import moment from 'moment';
import parse from 'html-react-parser';
import type { MergeRequest } from '../types/gitlab';

const { Text, Paragraph } = Typography;

interface DiscussionNote {
  id: string;
  body: string;
  resolvable: boolean;
  author: {
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
  discussionId: string;
}

interface ThreadedDiscussion {
  id: string;
  mainNote: DiscussionNote;
  replies: DiscussionNote[];
}

interface SidebarProps {
  mergeRequest: MergeRequest | null;
  visible: boolean;
  onClose: () => void;
}

const formatContent = (content: string) => {
  try {
    return parse(content);
  } catch (error) {
    return content;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ mergeRequest, visible, onClose }) => {
  if (!mergeRequest) return null;

  const organizeDiscussions = (): ThreadedDiscussion[] => {
    const threadMap = new Map<string, ThreadedDiscussion>();

    mergeRequest.discussions.nodes
      // Only consider discussions where the first note (parent) is resolvable
      .filter(discussion => discussion.notes.nodes.length > 0 && discussion.notes.nodes[0].resolvable)
      .forEach(discussion => {
        const notes = discussion.notes.nodes.map(note => ({
          ...note,
          discussionId: discussion.id
        }));

        const mainNote = notes[0];
        const replies = notes.slice(1);

        threadMap.set(discussion.id, {
          id: discussion.id,
          mainNote,
          replies
        });
      });

    return Array.from(threadMap.values());
  };

  const threads = organizeDiscussions();
  const resolvableParentCount = threads.length;

  const renderNote = (note: DiscussionNote, isReply: boolean = false) => (
    <div 
      key={note.id} 
      className={`border-b pb-4 ${isReply ? 'ml-8 mt-2 border-l-2 pl-4' : ''}`}
      style={{ borderColor: isReply ? '#f0f0f0' : '#e8e8e8' }}
    >
      <Space align="start">
        <Avatar src={note.author.avatarUrl} />
        <div className="flex-1">
          <div className="flex justify-between">
            <Text strong>{note.author.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {moment(note.createdAt).fromNow()}
            </Text>
          </div>
          <div 
            style={{ 
              marginTop: '8px',
              padding: '8px',
              background: '#fafafa',
              borderRadius: '4px'
            }}
          >
            {formatContent(note.body)}
          </div>
          {note.resolvable && (
            <div className="mt-2">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <CommentOutlined /> Resolvable comment
              </Text>
            </div>
          )}
        </div>
      </Space>
    </div>
  );

  return (
    <Drawer
      title={
        <div>
          <Text strong>{mergeRequest.title}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              !{mergeRequest.webUrl.split('/').pop()}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
              ({resolvableParentCount} resolvable thread{resolvableParentCount !== 1 ? 's' : ''})
            </Text>
          </div>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={600}
    >
      <div className="space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="mb-6">
              {renderNote(thread.mainNote)}
              {thread.replies.length > 0 && (
                <div className="mt-2">
                  {thread.replies.map(reply => renderNote(reply, true))}
                </div>
              )}
            </div>
          ))
        ) : (
          <Text type="secondary">No discussions yet</Text>
        )}
      </div>
    </Drawer>
  );
};
