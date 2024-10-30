export interface MergeRequest {
  id: string;
  title: string;
  description: string;
  webUrl: string;
  state: 'opened' | 'merged' | 'closed';
  createdAt: string;
  mergedAt: string;
  sourceBranch: string;
  targetBranch: string;
  draft: boolean;
  labels: {
    nodes: Array<{
      id: string;
      title: string;
      color: string;
    }>;
  };
  author: {
    name: string;
    avatarUrl: string;
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
  approvedBy: {
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
          resolvable: boolean;
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

export interface ProjectLabel {
  id: string;
  title: string;
  color: string;
  description: string | null;
}