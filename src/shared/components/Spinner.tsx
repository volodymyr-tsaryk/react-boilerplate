import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const SpinnerRing = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${spin} 0.6s linear infinite;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

interface Props {
  size?: number
  centered?: boolean
}

export function Spinner({ size = 32, centered = true }: Props) {
  const ring = <SpinnerRing $size={size} aria-label="Loading" role="status" />
  return centered ? <Wrapper>{ring}</Wrapper> : ring
}
