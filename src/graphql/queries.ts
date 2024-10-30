import { gql } from '@apollo/client';

export const GET_MERGE_REQUESTS = gql`
  query GetMergeRequests($labels: [String!], $after: String, $projectPath: ID!) {
    project(fullPath: $projectPath) {
      mergeRequests(
        first: 20
        after: $after
        labels: $labels
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
          state
          createdAt
          labels {
            nodes {
              id
              title
              color
            }
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
          discussions {
            nodes {
              id
              notes {
                nodes {
                  id
                  body
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