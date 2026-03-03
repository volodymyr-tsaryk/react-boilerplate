import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ROUTES } from '@/routes/routes'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`

const Code = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`

const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  &:hover {
    text-decoration: underline;
  }
`

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <Container>
      <Code>404</Code>
      <p>{t('common.notFound')}</p>
      <HomeLink to={ROUTES.HOME}>{t('common.goHome')}</HomeLink>
    </Container>
  )
}
