import styled from 'styled-components'

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.lg}`};
`

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export default function Home() {
  return (
    <Page>
      <Heading>Home Page</Heading>
      Content goes here. This is the home page of the application.
    </Page>
  )
}
