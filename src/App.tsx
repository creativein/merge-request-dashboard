import React, { useState } from 'react';
import { Layout, Typography, Spin, Alert } from 'antd';
import { useQuery } from '@apollo/client';
import { GET_MERGE_REQUESTS } from './graphql/queries';
import { MRFilters } from './components/MRFilters';
import { MRCard } from './components/MRCard';
import type { FilterParams, MergeRequest } from './types/gitlab';
import { GitMergeIcon } from 'lucide-react';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [filters, setFilters] = useState<FilterParams>({
    labels: [],
    startDate: null,
    endDate: null,
  });

  const { loading, error, data } = useQuery(GET_MERGE_REQUESTS, {
    variables: {
      labels: filters.labels,
      after: null,
    },
  });

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const filterMRsByDate = (mrs: MergeRequest[]) => {
    if (!filters.startDate && !filters.endDate) return mrs;

    return mrs.filter(mr => {
      const createdAt = new Date(mr.createdAt);
      const isAfterStart = !filters.startDate || createdAt >= new Date(filters.startDate);
      const isBeforeEnd = !filters.endDate || createdAt <= new Date(filters.endDate);
      return isAfterStart && isBeforeEnd;
    });
  };

  const availableLabels = Array.from(
    new Set(
      data?.project.mergeRequests.nodes
        .flatMap(mr => mr.labels.nodes.map(label => label.title)) || []
    )
  );

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center bg-white shadow">
        <GitMergeIcon className="mr-2" />
        <Title level={3} className="m-0">GitLab MR Dashboard</Title>
      </Header>
      <Content className="p-8">
        <MRFilters
          labels={filters.labels}
          onFilterChange={handleFilterChange}
          availableLabels={availableLabels}
        />

        {error && (
          <Alert
            message="Error"
            description="Failed to load merge requests. Please check your token and try again."
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
          filterMRsByDate(data?.project.mergeRequests.nodes || []).map(
            (mr: MergeRequest) => <MRCard key={mr.id} mergeRequest={mr} />
          )
        )}
      </Content>
    </Layout>
  );
}

export default App;