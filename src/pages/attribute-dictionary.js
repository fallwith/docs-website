import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { graphql } from 'gatsby';
import {
  ContributingGuidelines,
  Layout,
} from '@newrelic/gatsby-theme-newrelic';
import SEO from '../components/seo';
import DataDictionaryFilter from '../components/DataDictionaryFilter';
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';

const AttributeDictionary = ({ data, pageContext, location, navigate }) => {
  const { allDataDictionaryEvent } = data;
  const events = allDataDictionaryEvent.edges.map((edge) => edge.node);

  return (
    <>
      <SEO title="New Relic data dictionary" />
      <div
        css={css`
          display: grid;
          grid-template-areas:
            'page-title page-title'
            'content page-tools';
          grid-template-columns: minmax(0, 1fr) 320px;
          grid-column-gap: 2rem;
        `}
      >
        <PageTitle>New Relic data dictionary</PageTitle>
        <Layout.Content>
          {events.map((event) => (
            <div
              key={event.name}
              css={css`
                &:not(:last-child) {
                  margin-bottom: 2rem;
                }
              `}
            >
              <h2>{event.name}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: event.definition.html }}
              />
              <Table>
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {event.childrenDataDictionaryAttribute.map((attribute) => (
                    <tr key={attribute.name}>
                      <td
                        css={css`
                          width: 1px;
                        `}
                      >
                        {attribute.name}
                      </td>
                      <td
                        css={css`
                          p:last-child {
                            margin-bottom: 0;
                          }
                        `}
                        dangerouslySetInnerHTML={{
                          __html: attribute.definition.html,
                        }}
                      />
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}
        </Layout.Content>
        <Layout.PageTools>
          <ContributingGuidelines
            fileRelativePath={pageContext.fileRelativePath}
          />
          <DataDictionaryFilter
            events={events}
            location={location}
            navigate={navigate}
          />
        </Layout.PageTools>
      </div>
    </>
  );
};

AttributeDictionary.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};

export const pageQuery = graphql`
  query {
    allDataDictionaryEvent(sort: { fields: [name] }) {
      edges {
        node {
          name
          definition {
            html
          }
          childrenDataDictionaryAttribute {
            name
            definition {
              html
            }
          }
          ...DataDictionaryFilter_events
        }
      }
    }
  }
`;

export default AttributeDictionary;
