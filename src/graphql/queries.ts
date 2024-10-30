import { gql } from '@apollo/client';

export const GET_PROJECT_LABELS = gql`
  query GetProjectLabels($projectPath: ID!) {
    project(fullPath: $projectPath) {
      labels {
        nodes {
          id
          title
          color
          description
        }
      }
    }
  }
`;

export const GET_MERGE_REQUESTS = gql`
  query GetMergeRequests($labels: [String!], $after: String, $projectPath: ID!, $startDate: Time, $endDate: Time) {
    project(fullPath: $projectPath) {
      mergeRequests(
        first: 20
        after: $after
        labels: $labels
        createdAfter: $startDate
        createdBefore: $endDate
        sort: CREATED_DESC
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          description
          webUrl
          state
          createdAt
          mergedAt
          sourceBranch
          targetBranch
          draft
          labels {
            nodes {
              id
              title
              color
            }
          }
          author {
            name
            avatarUrl
          }
          assignees {
            nodes {
              id
              name
              avatarUrl
            }
          }
          reviewers {
            nodes {
              id
              name
              avatarUrl
            }
          }
          approvedBy {
            nodes {
              id
              name
              avatarUrl
            }
          }
          discussions {
            nodes {
              id
              notes {
                nodes {
                  id
                  body
                  resolvable
                  author {
                    name
                    avatarUrl
                  }
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  }
`;