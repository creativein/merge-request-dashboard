import { useState } from 'react';
import { Layout, Typography, Spin, Alert } from 'antd';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_MERGE_REQUESTS, GET_PROJECT_LABELS } from './graphql/queries';
import { MRFilters } from './components/MRFilters';
import { MRCard } from './components/MRCard';
import { MRTable } from './components/MRTable';
import type { FilterParams, MergeRequest, ProjectLabel } from './types/gitlab';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [view, setView] = useState<'card' | 'table'>('table');
  const [filters, setFilters] = useState<FilterParams>({
    labels: [],
    startDate: null,
    endDate: null,
  });

  const projectPath = import.meta.env.VITE_GITLAB_PROJECT_PATH;

  const { data: labelsData, loading: labelsLoading, error: labelsError } = useQuery(GET_PROJECT_LABELS, {
    variables: { projectPath },
  });

  const [mergeRequests, setMergeRequests] = useState<MergeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const client = useApolloClient();

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = filters.labels.map((label) =>
        client.query({
          query: GET_MERGE_REQUESTS,
          variables: {
            labels: [label],
            startDate: filters.startDate,
            endDate: filters.endDate,
            projectPath,
          },
        })
      );
      const results = await Promise.all(promises);
      const allMergeRequests = results.flatMap(
        (result) => result.data.project.mergeRequests.nodes
      );
      const uniqueMergeRequests = Array.from(
        new Map(allMergeRequests.map((mr) => [mr.id, mr])).values()
      );
      setMergeRequests(uniqueMergeRequests);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const projectLabels: ProjectLabel[] = labelsData?.project.labels.nodes || [];

  return (
    <Layout className="min-h-screen">
      {/* <Header className="flex items-center bg-white shadow">
        <GitMergeIcon className="mr-2" />
        <Title level={3} className="m-0">GitLab MR Dashboard</Title>
      </Header> */}
      <MRFilters
          selectedLabels={filters.labels}
          onFilterChange={handleFilterChange}
          onFetchData={handleFetchData}
          projectLabels={projectLabels}
          isLoadingLabels={labelsLoading}
        />
      <Content className="px-8">
        {labelsError && (
          <Alert
            message="Error"
            description={`Failed to load project labels: ${labelsError.message}`}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* <MRFilters
          selectedLabels={filters.labels}
          onFilterChange={handleFilterChange}
          onFetchData={handleFetchData}
          projectLabels={projectLabels}
          isLoadingLabels={labelsLoading}
        /> */}

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
        ) : mergeRequests.length > 0 ? (
          <>
            {/* <ViewToggle view={view} onChange={setView} /> */}
            {view === 'card' ? (
              mergeRequests.map((mr: MergeRequest) => (
                <MRCard key={mr.id} mergeRequest={mr} />
              ))
            ) : (
              <MRTable mergeRequests={mergeRequests} />
            )}
          </>
        ) : null}
      </Content>
    </Layout>
  );
}

export default App;