import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, Alert } from 'antd';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_MERGE_REQUESTS, GET_PROJECT_LABELS } from './graphql/queries';
import { MRFilters } from './components/MRFilters';
import { MRCard } from './components/MRCard';
import type { FilterParams, MergeRequest, ProjectLabel } from './types/gitlab';
import { GitMergeIcon } from 'lucide-react';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [filters, setFilters] = useState<FilterParams>({
    labels: [],
    startDate: null,
    endDate: null,
  });

  const projectPath = import.meta.env.VITE_GITLAB_PROJECT_PATH;

  const { data: labelsData, loading: labelsLoading, error: labelsError } = useQuery(GET_PROJECT_LABELS, {
    variables: { projectPath },
  });

  const [getMergeRequests, { loading, error, data }] = useLazyQuery(GET_MERGE_REQUESTS);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleFetchData = () => {
    getMergeRequests({
      variables: {
        labels: filters.labels,
        startDate: filters.startDate,
        endDate: filters.endDate,
        projectPath,
      },
    });
  };

  const projectLabels: ProjectLabel[] = labelsData?.project.labels.nodes || [];

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center bg-white shadow">
        <GitMergeIcon className="mr-2" />
        <Title level={3} className="m-0">GitLab MR Dashboard</Title>
      </Header>
      <Content className="p-8">
        {labelsError && (
          <Alert
            message="Error"
            description={`Failed to load project labels: ${labelsError.message}`}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <MRFilters
          selectedLabels={filters.labels}
          onFilterChange={handleFilterChange}
          onFetchData={handleFetchData}
          projectLabels={projectLabels}
          isLoadingLabels={labelsLoading}
        />

        {error && (
          <Alert
            message="Error"
            description={`Failed to load merge requests: ${error.message}`}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : (
          data?.project.mergeRequests.nodes.map((mr: MergeRequest) => (
            <MRCard key={mr.id} mergeRequest={mr} />
          ))
        )}
      </Content>
    </Layout>
  );
}

export default App;