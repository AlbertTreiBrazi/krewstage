import PublicLayout from '../../components/PublicLayout'

export const metadata = {
  title: 'Privacy Policy — KrewStage',
  description: 'KrewStage Privacy Policy. GDPR compliant. We never sell your data.',
}

export default function Layout({ children }) {
  return <PublicLayout>{children}</PublicLayout>
}
