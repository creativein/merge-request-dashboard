export interface MergeRequest {
  id: string;
  title: string;
  description: string;
  state: 'opened' | 'merged' | 'closed';
  createdAt: string;
  labels: {
    nodes: Array<{
      id: string;
      title: string;
      color: string;
    }>;
  };
  assignees: {
    nodes: Array<{
      id: string;
      name: string;
      avatarUrl: string;
    }>;
  };
  reviewers: {
    nodes: Array<{
      id: string;
      name: string;
      avatarUrl: string;
    }>;
  };
  discussions: {
    nodes: Array<{
      id: string;
      notes: {
        nodes: Array<{
          id: string;
          body: string;
          author: {
            name: string;
            avatarUrl: string;
          };
          createdAt: string;
        }>;
      };
    }>;
  };
}

export interface FilterParams {
  labels: string[];
  startDate: string | null;
  endDate: string | null;
}