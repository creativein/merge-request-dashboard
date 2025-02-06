import React, { useState } from "react";
import { Table, Tag, Tooltip, Space, Input, message, Button } from "antd";
import { CheckOutlined, BranchesOutlined, EditOutlined, CloseOutlined, CommentOutlined, MergeOutlined } from "@ant-design/icons";
import moment from "moment";
import { useMutation } from '@apollo/client';
import type { MergeRequest } from "../types/gitlab";
import { UPDATE_MERGE_REQUEST_TITLE } from '../graphql/queries';
import { Sidebar } from './Sidebar';

const { Search } = Input;

interface MRTableProps {
  mergeRequests: MergeRequest[];
}

export const MRTable: React.FC<MRTableProps> = ({ mergeRequests }) => {
  const [searchText, setSearchText] = useState("");
  const [sortedData, setSortedData] = useState(() => {
    const openMRs = mergeRequests
      .filter((mr) => mr.state === "opened")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    const mergedMRs = mergeRequests
      .filter((mr) => mr.state === "merged")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    const closedMRs = mergeRequests
      .filter((mr) => mr.state === "closed")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return [...openMRs, ...mergedMRs, ...closedMRs];
  });
  const [sortOrder, setSortOrder] = useState<"ascend" | "descend" | null>(null);
  const [editingMR, setEditingMR] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [selectedMR, setSelectedMR] = useState<MergeRequest | null>(null);
  
  const [updateMRTitle] = useMutation(UPDATE_MERGE_REQUEST_TITLE);

  const handleSort = () => {
    const order = sortOrder === "ascend" ? "descend" : "ascend";
    const sorted = [...sortedData].sort((a, b) =>
      order === "ascend"
        ? a.state.localeCompare(b.state)
        : b.state.localeCompare(a.state)
    );
    setSortedData(sorted);
    setSortOrder(order);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredData = mergeRequests.filter((mr) =>
      mr.title.toLowerCase().includes(value.toLowerCase())
    );
    setSortedData(filteredData);
  };

  const handleEditTitle = async (record: MergeRequest) => {
    if (editingMR === record.id) {
      try {
        const projectPath = record.webUrl.split('/-/')[0].split('gitlab.com/')[1];
        const iid = record.webUrl.split('/-/merge_requests/')[1];
        
        await updateMRTitle({
          variables: {
            projectPath,
            iid,
            title: editTitle
          }
        });

        message.success('Merge request title updated successfully');
        setEditingMR(null);
      } catch (error) {
        message.error('Failed to update merge request title');
      }
    } else {
      setEditingMR(record.id);
      setEditTitle(record.title);
    }
  };

  const handleCancelEdit = () => {
    setEditingMR(null);
    setEditTitle('');
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "merged":
        return <MergeOutlined className="text-green-500" />;
      case "opened":
        return <BranchesOutlined className="text-blue-500"  />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "50%",
      render: (text: string, record: MergeRequest) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ width: '100%' }}>
            {editingMR === record.id ? (
              <>
                <Input.TextArea
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: '90%' }}
                  autoSize={{ minRows: 1, maxRows: 6 }}
                />
                <Space>
                  <CheckOutlined 
                    onClick={() => handleEditTitle(record)}
                    style={{ cursor: 'pointer', color: '#52c41a' }}
                  />
                  <CloseOutlined 
                    onClick={handleCancelEdit}
                    style={{ cursor: 'pointer', color: '#ff4d4f' }}
                  />
                </Space>
              </>
            ) : (
              <>
                <a href={record.webUrl} target="_blank" rel="noopener noreferrer">
                  <span style={{ color: "#1890ff" }}>
                    [#{record.webUrl.split("/").pop()}]
                  </span>{" "}
                  <span>{text}</span>
                </a>
                {/* <EditOutlined 
                  onClick={() => handleEditTitle(record)}
                  style={{ cursor: 'pointer' }}
                /> */}
              </>
            )}
          </Space>
          <Space wrap>
          <span style={{ color: "#888", fontSize: "0.7em" }}>
            Created:{" "}
            {moment(record.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </span>
          {record.state === "merged" && (
            <span style={{ color: "#888", fontSize: "0.7em", borderLeft: "1px solid #888", paddingLeft: "8px" }}>
              Merged On:{" "}
              {moment(record.mergedAt).format("MMMM Do YYYY, h:mm:ss a")}
            </span>
          )}
          </Space>
          <Space wrap>
            {record.labels.nodes.map((label) => (
              <Tag key={label.id} color={label.color}>
                {label.title}
              </Tag>
            ))}
          </Space>
        </Space>
      ),
    },
    {
      title: (
        <span onClick={handleSort} style={{ cursor: "pointer" }}>
          State{" "}
          {sortOrder === "ascend" ? "↑" : sortOrder === "descend" ? "↓" : ""}
        </span>
      ),
      dataIndex: "state",
      key: "state",
      render: (state: string) => (
        <Space>
          {getStateIcon(state)}
          <span className="capitalize">{state}</span>
        </Space>
      ),
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
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
      title: "Reviewers",
      dataIndex: "reviewers",
      key: "reviewers",
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
      title: "Approved By",
      dataIndex: "approvedBy",
      key: "approvedBy",
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
      title: "Discussions",
      key: "discussions",
      render: (_: any, record: MergeRequest) => {
        const resolvableDiscussionCount = record.discussions.nodes.filter(
          discussion => discussion.notes.nodes.some(note => note.resolvable)
        ).length;
        
        return (
          <Button
            icon={<CommentOutlined />}
            onClick={() => setSelectedMR(record)}
            type="text"
          >
            {resolvableDiscussionCount}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Search
        placeholder="Search by title"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
      <Sidebar
        mergeRequest={selectedMR}
        visible={!!selectedMR}
        onClose={() => setSelectedMR(null)}
      />
    </>
  );
};
