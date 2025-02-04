import React, { useState } from "react";
import { Table, Tag, Tooltip, Space, Collapse, Input } from "antd";
import { CheckOutlined, BranchesOutlined } from "@ant-design/icons";
import moment from "moment";
import type { MergeRequest } from "../types/gitlab";

const { Panel } = Collapse;
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

  const getStateIcon = (state: string) => {
    switch (state) {
      case "merged":
        return <CheckOutlined className="text-green-500" />;
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
        <Space direction="vertical">
          <a href={record.webUrl} target="_blank" rel="noopener noreferrer">
            <span style={{ color: "#1890ff" }}>
              [#{record.webUrl.split("/").pop()}]
            </span>{" "}
            <span>{text}</span>
          </a>
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
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    //   render: (_: any, record: MergeRequest) => (
    //     <Collapse>
    //       <Panel header="Show Description" key="1">
    //         {record.description}
    //         {/* <ReactMarkdown>{record.description}</ReactMarkdown> */}
    //       </Panel>
    //     </Collapse>
    //   ),
    // },
    // {
    //   title: 'Resolvable Comments',
    //   dataIndex: 'resolvableComments',
    //   key: 'resolvableComments',
    //   render: (_: any, record: MergeRequest) => {
    //     const resolvableDiscussions = record.discussions.nodes.filter(discussion =>
    //       discussion.notes.nodes.some(note => note.resolvable)
    //     );
    //     return (
    //       <Collapse>
    //         <Panel header={`Show Resolvable Comments (${resolvableDiscussions.length})`} key="1">
    //           {resolvableDiscussions.length > 0 ? (
    //             resolvableDiscussions.map(discussion => (
    //               <div key={discussion.id} style={{ marginBottom: '16px' }}>
    //                 {discussion.notes.nodes.map(comment => (
    //                   <div key={comment.id} style={{ marginBottom: '8px' }}>
    //                     <div style={{
    //                       background: '#f1f1f1',
    //                       padding: '8px',
    //                       borderRadius: '8px',
    //                       maxWidth: '80%',
    //                       wordBreak: 'break-word',
    //                       position: 'relative'
    //                     }}>
    //                       {comment.body}
    //                       <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
    //                         - {comment.author.name}
    //                       </div>
    //                       {comment.resolved && (
    //                         <CheckCircleOutlined
    //                           style={{ color: 'green', position: 'absolute', top: '8px', right: '8px' }}
    //                         />
    //                       )}
    //                     </div>
    //                   </div>
    //                 ))}
    //               </div>
    //             ))
    //           ) : (
    //             'No resolvable comments'
    //           )}
    //         </Panel>
    //       </Collapse>
    //     );
    //   },
    // },
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
    </>
  );
};
